console.log("Starting up...");
console.log("Note: There are no moderation or chat features available");

import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { get } from 'node:http';
import * as Configuration from './config.js';
import * as repl from 'node:repl';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url)) + "\\client";

console.log("Config Options:");
console.log("Chat enabled: " + Configuration.chatEnabled);
console.log("Shorten Text: " + Configuration.shortenTextEnabled);
console.log("Names enabled: " + Configuration.namesEnabled);
console.log("");

/* Arbitrary Values */
const _port = 80;
const ServerVersion = 2;
const MinimumClientVersion = 2;

var playerList = {}

let chatlog = [];

function getChatlog(amount = 200) {
  for (let i = Math.max(chatlog.length - amount, 0); i < chatlog.length; i++) {
    if (chatlog[i] === undefined) continue;
    const date = new Date(chatlog[i][2]);

    function convTwo(num) {
      return (num.toString().length === 1 ? "0" : "") + num;
    }

    const dateMonth = convTwo(date.getMonth());
    const dateDay = convTwo(date.getDate());
    const dateHours = convTwo(date.getHours());
    const dateMinutes = convTwo(date.getMinutes());
    const dateSeconds = convTwo(date.getSeconds());
    const dateString = dateMonth + "/" + dateDay + ", "+ dateHours + ":" + dateMinutes + ":" + dateSeconds;
    console.log(dateString + "     " + chatlog[i][0] + ": " + chatlog[i][1]);
  }
}

function getPlayerList() {
  const names = [];
  for (const playerID in playerList) {
    names.push(playerList[playerID].name);
  }
  return names.join(", ");
}

function getPlayersAmount() {
  return Object.keys(playerList).length;
}

class OnlinePlayer {
  constructor(id) {
    this.id = id;
    this.world = -6969;
    this.pos = {x: 0, y: 0};
    this.name = "nameless";
    this.skin = "player";
    this.rank = 0;
  }
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});
app.use('/client', express.static(__dirname));

io.on("connection", preConnection);

function preConnection(socket) {
  socket.on("socket initialized", () => {
    socket.emit("version check", ServerVersion);
    socket.on("version check", (clientVersion, serverOld) => {
      if (clientVersion < MinimumClientVersion) {
        console.log(`Version mismatch! Server requires client version ${MinimumClientVersion} or higher, but got ${clientVersion}. Update client or downgrade server!`);
        socket.emit("old version");
        return;
      }
      if (serverOld !== false) {
        console.log(`Version mismatch! Client requires server version ${serverOld} or higher, but got ${ServerVersion}. Update server or downgrade client!`);
        return;
      }
      socketConnection(socket);
    });
  });
}

function socketConnection(socket) {
  // Connect code goes here

  var player = new OnlinePlayer(socket.id);
  playerList[socket.id] = player

  socket.on("disconnect", () => {
    // Disconnect code goes here

    delete playerList[socket.id];
  });

  socket.on("send player", plyr => {
    player.pos = {x: plyr[0], y: plyr[1]};
    player.world = plyr[2];
    player.skin = plyr[4];
    //player.rank = plyr[5];
    if (Configuration.namesEnabled) {
      if (player.name !== plyr[3] && player.name === "nameless")
        io.emit("chat", plyr[3] + " Has Joined.");
      player.name = plyr[3];
    } else {
      player.name = player.id.substring(0, 4);
    }
    
  });

  socket.on("chat", msg => {
    if (!Configuration.chatEnabled) {
      socket.emit("chat", "chat is disabled for this server.");
      return;
    }
    const plyrName = Configuration.shortenTextEnabled ? player.name.substring(0, 15) : player.name;
    const finMsg = Configuration.shortenTextEnabled ? msg.substring(0, 100) : msg;
    chatlog.push([plyrName, finMsg, Date.now()]);
    io.emit("chat", plyrName + ": " + finMsg);
  });
}

function convertPlayer(player) {
  const plyrName = Configuration.shortenTextEnabled ? player.name.substring(0, 15) : player.name;
  return [player.pos.x, player.pos.y, player.world, plyrName, player.skin, player.id];
}

function sendPlayers() {
  var plyrs = []
  for (const player in playerList) {
    plyrs.push(convertPlayer(playerList[player]));
  }
  io.emit("player update", plyrs);
}

server.listen(_port, () => {
  console.log("Server is online!");
});


setInterval(sendPlayers, 25);

get({'host': 'api.ipify.org', 'port': _port, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
    console.log("Players can join with: " + ip + ":" + _port);
    console.log(`Make sure you are port forwarding on port ${_port}!`);
    console.log("");
  });
});

const replServer = repl.start();

replServer.context.shout = msg => {
  io.emit("chat", "Shout from server: " + msg);
}

replServer.context.getChatlog = getChatlog;
replServer.context.players = getPlayersAmount;
replServer.context.playerList = getPlayerList;
replServer.context.chatlog = chatlog;