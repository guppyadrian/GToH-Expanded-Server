'use strict';
console.log("loading index...")
//do player cool
var Player = new Character(playerImg);
//CreateWorld(-2);
world.push(new Block(-30, 60, 'portal', [-2]));


function SetupGame() {
  if (warning) {
    const txt = 'Coding is happening, game breaking glitches may occur.';
    const txt2 = 'If the game is broken please don\'t keep page open, it floods the console with errors';
    AddChat(txt);
    AddChat(txt2);
  }
  var introChatQueue = [];
  introChatQueue.push('Welcome to GToH Expanded!');
  if (Username == "") {
    introChatQueue.push('rogersd did this so you could experience GToH to its fullest!')
    introChatQueue.push('Let us know if you enjoy! Have fun!')
  }
  function finishIntroChat() {
    AddChat(introChatQueue.splice(0, 1)[0]);
    setTimeout(() => {
      if (introChatQueue.length > 0)
        finishIntroChat();
    }, 4000);
  }
  finishIntroChat();
  
  //if ()
}

//separated for lvl creator
function ChatTick() {
  //draw & handle chat
  for (var i = chatQueue.length - 1; i >= 0; i--) {
    //handle deletion time
    chatQueue[i][1] = chatQueue[i][1] + 1;
    if (chatQueue[i][1] > 320) {
      chatLogs.push(chatQueue.splice(i, 1)[0]);
      continue;
    }
    //actually draw it
    AddDrawQueue('text', new Text(chatQueue[i][0], 0, myCanvas.height - (chatQueue.length - i) * 20 * camZ, 11, true, false, true));
  }
  if (pressTab) {
    for (var i = chatLogs.length - 1; i >= 0; i--) {
      AddDrawQueue("text", new Text(chatLogs[i][0], 0, myCanvas.height - (chatQueue.length + chatLogs.length - i) * 20 * camZ, 11, true, false, true));
    }
  }
}

//runs 40 times a second
function GameTick() {
  //counters
  if (LobbyWorld !== WorldId)
    Timer++;
  Ticker++;

  //resizing window
  myCanvas.style.width = '100%';
  myCanvas.style.height = '100%';
  myCanvas.height = window.innerHeight;
  myCanvas.width = window.innerWidth;
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  camZ = myCanvas.width / 700;

  //if won level go back to lobby
  if (LevelWon) {
    LevelWon = false;
    if (PlayTest) {
      togglePlayTest();
    } else if (WorldId !== -2) {
      const i = Timer / 40;
      //if (levelsComplete[WorldId] > i || levelsComplete[WorldId] === undefined || levelsComplete[WorldId] === null) {
        if (!cheatsEnabled) {
          updateStars(i, TimesSwapped)
          if (levelsComplete[WorldId] > i || levelsComplete[WorldId] === undefined || levelsComplete[WorldId] === null || levelsComplete[WorldId] === false) {
            levelsComplete[WorldId] = i;
            localStorage.setItem("levels", JSON.stringify(levelsComplete));
          }
          if (swapsComplete[WorldId] == undefined || swapsComplete[WorldId] > TimesSwapped) {
            swapsComplete[WorldId] = TimesSwapped;
            localStorage.setItem("swaps", JSON.stringify(swapsComplete));
          }
          //socket.emit('new pb', WorldId, i, ReplayKeys); REMOVED BECAUSE SOCKET IS BROKEN IN SINGLEPLAYER
          AddChat(`Time: ${Timer / 40}`);
        } else {
          AddChat('Cheats enabled. Wake up. Wake up. Wake up.');
        }
      //}
      CreateWorld(LobbyWorld);
    }
  }
  if (Replaying) {
    if (Ticker >= ReplayKeys.length) {
      Replaying = false;
    } else {
      const ii = ReplayKeys[Ticker];
      const i = ii.toString(2);
      const il = i.length - 1;
      redActive = (i[il-4] === '1') ? 3 : 1;
      Player.pressRight = i[il-3] === '1';
      Player.pressDown = i[il-2] === '1';
      Player.pressLeft = i[il-1] === '1';
      Player.pressUp = i[il] === '1';
    }
  } else if (LobbyWorld !== WorldId) {
  ReplayKeys.push(Player.pressUp + Player.pressLeft*2 + Player.pressDown*4 + Player.pressRight*8 + (redActive>1)*16);
  }
  //player physics
  Player.tick();

  if (LobbyWorld !== WorldId)
    ReplayPos.push([Object.assign(Object.create(Object.getPrototypeOf(Player)), Player), [...perLevel]]);
  
  //camera easing
  const ww = (myCanvas.width / 2) / (camZ + shakeZ);
  const hh = (myCanvas.height / 2) / (camZ + shakeZ);
  if (true) { //ease camera
    camX -= Math.round((camX - (Player.x - ww)) / 10);
    camY -= Math.round((camY - (Player.y - hh)) / 10);
    camX = Math.round(camX * myCanvas.width) / myCanvas.width;
    camY = Math.round(camY * myCanvas.height) / myCanvas.height;
  } else {
    camX = Player.x - ww;
    camY = Player.y - hh;
  }
  
  //updating & drawing blocks
  for (const blk of world) {
    blk.updateSprite(Math.floor(redActive / 2));
    if (blk.type === 'music') continue;
    if (blk.type === 'anim') {
      AddDrawQueue('anim', blk);
    } else {
      AddDrawQueue('block', blk);
    }
    
  }

  //now with particles
  for (const blk of worldParticle) {
    drawQueue.push({ x: blk.x, y: blk.y, img: blk.img, opacity: blk.opacity, size: blk.size });
    blk.updateSprite();
    if (blk.life === 0)
      worldParticle.splice(worldParticle.indexOf(blk), 1);
  }

  //draw text
  for (const txt of worldText) {
    AddDrawQueue('text', txt);
  }

  //music transitioning
  startMusic()

  //draw other players
  for (const p in OtherPlayers) {
    const plyr = OtherPlayers[p];
    if (plyr.location !== WorldId) continue;
    plyr.tick();
    AddDrawQueue('plyr', plyr);
  }

  //draw yourself
  AddDrawQueue('plyr', Player);

  //draw your username
  if (Username !== '') {
    AddDrawQueue('text', new Text(Username, Player.x + 15, Player.y - 5, 12));
  } else {
    AddDrawQueue('text', new Text('Guest', Player.x + 15, Player.y - 5, 12))
  }
  //draw handler
  if (TasMode)
    DrawFrame(2);
  else
    DrawFrame();

  if (PlayTest) {
    lvlCreateGui();
  }
  ChatTick();
  DrawFrame(false, false);
}

function updateStars(time, swaps = 100) {
  if (!("timeConditions" in lvlData[WorldId])) return
  const conds = lvlData[WorldId].timeConditions
  if (AllStars[WorldId] == undefined) {
    AllStars[WorldId] = new LevelStars(WorldId, conds, 1);
  }
  AllStars[WorldId].updateStars(time, swaps)
}



//funny stuff
CreateWorld(-2);
Player.tick();
DrawFrame();
CreateWorld(-2);

function startMusic() {
  if (curSong in songList) { //if song is added
    if (songList[curSong].volume < 0.1) {
      songList[curSong].volume += 0.01;
      if (songList[curSong].paused)
      songList[curSong].play();
    }
    if (songList[prevSong].volume >= 0.01) {
      songList[prevSong].volume -= 0.01;
    } else if (!(songList[prevSong].paused)) {
      songList[prevSong].pause();
    }
  } else { //if song not added add the song
    songList[curSong] = new Audio(cliDir + 'music/' + curSong + '.mp3');
    songList[curSong].loop = true;
    songList[curSong].volume = 0;
    songList[curSong].play();
  }
}


//key detection
window.addEventListener('keydown', (EventKey) => {
  EventKey.preventDefault();
  switch (EventKey.key) {
    case 't':
      const msg = prompt("message?");
      if (msg === 'null' || msg === null || msg === '') break;
      if (msg.charAt(0) === '/') {
        process_command(msg.substring(1));
      } else
      socket.emit('chat', msg);
      break;
  }
  if (IsBuilding && !PlayTest) {
    switch (EventKey.key) {
      case 'ArrowRight':
      case 'd':
        rightDown = true;
        break;
      case 'ArrowLeft':
      case 'a':
        leftDown = true;
        break;
      case 'ArrowUp':
      case 'w':
        upDown = true;
        break;
      case 'ArrowDown':
      case 's':
        downDown = true;
        break;
    }
    return;
  }
  switch (EventKey.key) {
    case 'ArrowRight':
    case 'd':
      Player.pressRight = true;
      break;
    case 'ArrowLeft':
    case 'a':
      Player.pressLeft = true;
      break;
    case 'ArrowUp':
    case 'w':
      Player.pressUp = true;
      break;
    case 'ArrowDown':
    case 's':
      Player.pressDown = true;
      break;
    case ' ':
      if (redActive === 1) {
        redActive = 2;
        TimesSwapped++;
      }
      if (redActive === 3) {
        redActive = 0;
        TimesSwapped++;
      }
      break;
    case 'r':
      if (PlayTest) break;
      if (LobbyWorld === WorldId)
        CreateWorld(RecentTower);
      else
        CreateWorld(LobbyWorld);
      break;
    case '/':
      
      const msgg = prompt("message?", "/");
      if (msgg === 'null' || msgg === null || msgg === '') break;
      if (msgg.charAt(0) === '/') {
        process_command(msgg.substring(1));
      } else
      socket.emit('chat', msgg);
      
      ChatOpen = true;
      break;
    case 'Tab':
      pressTab = true;
      break;
  }
});
window.addEventListener('keyup', (EventKey) => {
  if (IsBuilding) {
    switch (EventKey.key) {
      case 'r':
        togglePlayTest();
        break;
      case 'z':
        creatorUndo();
        break;
      case 'g':
        Grid = !Grid;
        break;
    }
  }
  if (IsBuilding && !PlayTest) {
    switch (EventKey.key) {
      case 'ArrowRight':
      case 'd':
        rightDown = false;
        break;
      case 'ArrowLeft':
      case 'a':
        leftDown = false;
        break;
      case 'ArrowUp':
      case 'w':
        upDown = false;
        break;
      case 'ArrowDown':
      case 's':
        downDown = false;
        break;
    }
    return;
  }
  switch (EventKey.key) {
    case 'ArrowRight':
    case 'd':
      Player.pressRight = false;
      break;
    case 'ArrowLeft':
    case 'a':
      Player.pressLeft = false;
      break;
    case 'ArrowUp':
    case 'w':
      Player.pressUp = false;
      break;
    case 'ArrowDown':
    case 's':
      Player.pressDown = false;
      break;
    case ' ':
      if (redActive === 0)
        redActive = 1;
      if (redActive === 2)
        redActive = 3;
      break;
    case 'p':
      socket.emit('feedback', prompt('ENTER FEEDBACK'));
      break;
    case 'c':
      alert('deprecated, use /<command> in chat instead');
      break;
    case 'l':
      Login();
      break;
    case 'Tab':
      pressTab = false;
  }
});

//The mess of the login system
var logAttempt = null;

if (localStorage.getItem('login') !== null) {
  autoLogin(localStorage.getItem('login'));
}
function autoLogin(stuff) {
  Username = stuff
  console.log("Username saved")
}

function old_autoLogin(stuff) {
  logAttempt = stuff[0];
  login = stuff;
  socket.emit('check register', stuff, true);
}

function Login() {
  var loginText = prompt("Enter your username");
  if (loginText == null || loginText == "" || loginText == undefined) return
  // Check for valid chars
  for (let i = 0; i < loginText; i++) {
    const alphabetThing = 'abcdefghijklmnopqrstuvwxyz1234567890-_.';
    if (!alphabetThing.includes(loginText[i].toLowerCase())) {
      alert("invalid characters");
      return;
    }
  }

  Username = loginText;
  localStorage.setItem('login', Username);
}

function old_Login(){
  var login_text = prompt("Please enter login, in format username,password, or type 'r' to register.");
  if (login_text === 'r') {
    sign_up();
    return;
  }
  if (['a', '', 'null'].indexOf(login_text) > 0){return;}
  login = login_text.split(",");
  if (login.length !== 2 || login.includes("")){alert("Too little or too many arguments!"); return;}
  logAttempt = login[0];
  socket.emit('check register',login,true);
}
function sign_up(){
  var signup_text = prompt("Please enter your new login, in format 'username,password'");
  var signup = signup_text.split(',');
  if (['a', '', 'null'].indexOf(signup_text) > 0){return;}
  if (signup.length != 2 || signup[1] == "" || signup[0] == ""){alert("Too little or too many arguments!"); return;}
  if (signup[0].length > 15) {alert("too long username"); return;}
  if (signup[0].includes(' ')) {alert("cannot have spaces"); return;}
  for (let i = 0; i < signup[0].length; i++) {
    const alphabetThing = 'abcdefghijklmnopqrstuvwxyz1234567890-_.';
    if (!alphabetThing.includes(signup[0][i].toLowerCase())) {
      alert("invalid characters");
      return;
    }
  }
  socket.emit('check register', signup, false); 
}

socket.on('true login', (rer, logging)=>{
  if (logging) {
    if (rer == true) {
      AddChat('Successfully signed in!')
      Username = logAttempt;
      localStorage.setItem('login', JSON.stringify(login));
      return;
    } else {
      alert("Either the username or password is incorrect.");
      return;
    }
  } else if (rer == true) {
    alert("This login is already taken.");

    return;
  } else {
    alert("new account created");
  }
});

/*
X = 150
CAM = -250
WIDTH = 500

CAM needs to be -100

add 75 first iteration

CAM -= (CAM - (X - 250)) / 2
*/
