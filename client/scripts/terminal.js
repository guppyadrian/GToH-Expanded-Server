function process_command(command = null) {

  if (command === null)
    command = prompt("What command would you like to execute?");
    if (command === null || command === "") return;
    var command = command.split(" ");
  switch (command[0].toLowerCase()) {
    case "help":
      if (command.length === 2) {
        switch (command[1]) {
          case 'teleport':
            alert("Can teleport you to other players. If admin you can teleport other players to you. <source> is a username(s) that will be teleported. <destination> is a player that sources will be teleported to. Use @s for yourself, @r for a random person, @a for all players, or type in a username (case sensative!) ex: 'teleport @s guppytest', 'teleport guppytest guppy'");
            break;
          case 'gravity':
            alert("will toggle gravity on and off, allowing you to fly. ex: 'gravity'");
            break;
          case 'noclip':
            alert("lets you clip through all blocks while retaining the blocks effect, like bouncing, portals, or keys. ex: 'noclip'");
            break;
          case 'truenoclip':
            alert("lets you clip through all blocks without their effects. You cannot travel through portals or collect keys. ex: 'truenoclip'");
            break;
          case 'level':
            alert("Teleports you to the level id or level code from the old game's level editor. ex: 'level 10'");
            break;
          case 'speed':
            alert("Sets your max speed with no effect on acceleration. ex: 'speed 10'");
            break;
          case 'god':
            alert("Toggles truenoclip, gravity, and sets speed to 8. Typing command again will toggle effects other than speed. ex: 'god'");
            break;
          case 'evaluate':
            alert("Sends a second prompt asking for the code to be parsed and ran. Not recommended to mess with. ex: 'evaluate' then 'console.log(\"Hello World!\")'");
            break;
          case 'kick':
            alert("Kicks the said player. Admin only command. ex: 'kick guppytest'");
            break;
          case 'admin':
            alert("As an admin, you can use /tp to teleport other players, /kick, and /ban. Use /help <command> for info on these commands.");
            break;
          case 'replay':
            alert("Replays the recent beaten level. (May be buggy)");
            break;
        }
      } else if (command.length === 1) {
        alert("teleport <source> <destination>, god, speed <amount>, noclip, truenoclip, gravity, level <lvlID/Code>, evaluate <code>, kick <player>.\nType help <command> for more info on that specific command.");
      }
      break;
    case "sudo":
      if (prompt("Enter admin password:") != "Bubble Guppy Adrian!") {
        alert("You FAILED!");
      } else {
        process_command(true);

      }
      break;
    case "tele":
    case "tp":
    case "teleport":
      cheatsEnabled = true;
      if (command.length > 4 || command.length < 2) break;
        if (command[1].charAt(0) === '@') {
          switch(command[1].charAt(1)) {
            case 'a':
              socket.emit('server command', command);
              break;
            case 's':
              if (command[2].charAt(0) === '@') {
                
                if (command[2].charAt(1) === 'r') {
                  const names = Object.keys(OtherPlayers);
                  const inf = OtherPlayers[names[Math.floor(Math.random() * names.length)]];
                  if (inf.location !== WorldId) {
                    CreateWorld(inf.location);
                    cheatsEnabled = true;
                  }
                  Player.x = inf.x;
                  Player.y = inf.y;
                } 
                
              } else if (getPlayerIdByName(command[2]) in OtherPlayers) {
                  const inf = OtherPlayers[getPlayerIdByName(command[2])];
                  if (inf.location !== WorldId) {
                    CreateWorld(inf.location);
                    cheatsEnabled = true;
                  }
                  Player.x = inf.x;
                  Player.y = inf.y;
                }
              break;
            case 'r':
              socket.emit('server command', command);
              break;
          }
        } else {
          socket.emit('server command', command);
        }
      
      break;
    case "gravity":
    case "grav":
    case "fly":
      cheatsEnabled = true;
      if (command.length === 1) {
        Player.gravityDisabled = !Player.gravityDisabled;
      } else {
        alert('Incorrect amount of arguments');
      }
      break;
    case "truenc":
    case "truenoclip":
    case "tnoclip":
    case "tnc":
      cheatsEnabled = true;
      if (command.length === 1) {
        Player.disableTouch = !Player.disableTouch;
      } else alert('Incorrect amount of arguments');
      break;
    case "noclip":
    case "nc":
      cheatsEnabled = true;
      if (command.length === 1) {
        Player.noClip = !Player.noClip;
      } else {
        alert('Incorrect amount of arguments');
      }
      break;

      if (Number.isInteger(parseInt(command[1]))) {
        CreateWorld(parseInt(command[1]));
      } else
        CreateWorld(JSON.parse(command[1]), false);

      break;
    case "speed":
      cheatsEnabled = true;
      if (command.length !== 2) {
        alert('Incorrect amount of arguments');
        break;
      }
      if (!Number.isInteger(parseInt(command[1]))) {
        alert('Argument is not a number');
        break;
      }
      Player.speed = parseInt(command[1]);
      break;
    case "god":
      cheatsEnabled = true;
      if (command.length !== 1) {
        alert('Incorrect amount of arguments');
        break;
      }
      if (Player.speed === 5)
        process_command("speed 8");
      else
        process_command("speed 5");
      process_command("fly");
      process_command("tnc");
      break;
    case "eval":
    case "evaluate":
      //cheatsEnabled = true;
      eval(prompt('command?'));
      break;
    case 'kick':
      if (command.length !== 2) {
        alert('Incorrect amount of arguments');
        break;
      }
      socket.emit('kick player', command[1]);
      break;
    case 'ban':
      if (command.length === 2)
        socket.emit('server command', command);
      break;
    case 'unban':
      if (command.length === 2)
        socket.emit('server command', command);
      break;
    case 'replay':
      if (command[1] !== undefined) {
        if (command[1] === 'save') {
          navigator.clipboard.writeText(JSON.stringify(ReplayKeys)).then(function() {
          AddChat('Copied to Clipboard!');
          }, function(err) {
          AddChat('ERROR: Could not copy. >' + err);
          let tab = window.open('about:blank', '_blank');
          tab.document.write('[' + ReplayKeys + ']');
          tab.document.close();
          });
          return;
        } else
        ReplayKeys = JSON.parse(command[1]);
      }
      cheatsEnabled = true;
      Replaying = !Replaying;
      if (Replaying)
        CreateWorld(ReplayKeys[0]);
      break;
    case 'tasmode':
    case 'tsm':
      cheatsEnabled = true;
      TasMode = true;
      clearInterval(GAME);
      addEventListener('keydown', keyHandle);
      break;
    case 'lvl':
    case 'level':
      if (command.length !== 2) return;
      CreateWorld(command[1]);
    case 'setskin':
      socket.emit('server command', command);
      break;
  }
}
function keyHandle(MyEvent) {
  if (MyEvent.key === 'z') {
    if (ReplayKeys.length < 2) return;
    ReplayKeys.splice(ReplayKeys.length - 1, 1);
    ReplayPos.splice(ReplayPos.length - 1, 1);
    const r = Object.assign(Object.create(Object.getPrototypeOf(ReplayPos[ReplayPos.length - 1][0])), ReplayPos[ReplayPos.length - 1][0]);
    Player = r;
    const ii = ReplayKeys[ReplayKeys.length - 1];
    const i = ii.toString(2);
    redActive = (i[i.length-5] === '1') ? 3 : 1;
    perLevel = ReplayPos[ReplayPos.length - 1][1];
    Ticker--;
    Timer--;
    for (const blk of world) {
      blk.updateSprite(Math.floor(redActive / 2));
      if (blk.type === 'music') continue;
      if (blk.type === 'anim') {
        AddDrawQueue('anim', blk);
      } else {
        AddDrawQueue('block', blk);
      }
    }
    AddDrawQueue('plyr', Player);
    DrawFrame();

    
  } else if (MyEvent.key === 'x'){
    GameTick();
  }
}
