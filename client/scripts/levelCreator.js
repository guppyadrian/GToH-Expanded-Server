'use strict';
function StartLevelCreator() {
  clearInterval(GAME);
  world = [];
  creatorBlocks = [];
  creatorHistory = [];
  deletingBlock = false;
  point1 = [];
  blockType = 'block';
  cursorImg = cliDir + 'textures/block.png';
  worldParticle = [];
  worldText = [];
  IsBuilding = true;
  Grid = true;
  spawnPos = [150,60];
  ignoreWarning = false;
  if (localStorage.getItem('level backup') !== null) {
    const r = prompt('backup found! want to load it? (y/n)');
    if (r === 'y') {
      creatorBlocks = JSON.parse(localStorage.getItem('level backup'));
      RefreshCreator();
    } else if (r === 'n') {
      localStorage.removeItem('level backup');
    }
  }
  setTimeout(() => {
    camX = 0;
    camY = 0;
    setSong("levelcreator")
  }, 100);
  CREATE = setInterval(lvlCreateTick, 25);
}
var deletingBlock = false;
var saveButton = new Block('decor', 10, myCanvas.height - 150, [], 'levelCreator/save.png');
saveButton.width = 75;
saveButton.height = 75;
var playTestButton = new Block('decor', 10, myCanvas.height - 75, [], 'levelCreator/playtest.png');
playTestButton.width = 75;
playTestButton.height = 75;
var undoButton = new Block('decor', 75, myCanvas.height - 75, [], 'levelCreator/undo.png');
undoButton.width = 75;
undoButton.height = 75;
var deleteButton = new Block('decor', 75, myCanvas.height - 150, [], 'levelCreator/delete.png');
deleteButton.width = 75;
deleteButton.height = 75;
var leaveButton = new Block('decor', myCanvas.width - 75, myCanvas.height - 150, [], 'levelCreator/leave.png');
leaveButton.width = 75;
leaveButton.height = 75;
var loadButton = new Block('decor', myCanvas.width - 75, myCanvas.height - 75, [], 'levelCreator/load.png');
loadButton.width = 75;
loadButton.height = 75;
var gridButton = new Block('decor', myCanvas.width - 140, myCanvas.height - 150, [], 'levelCreator/grid.png');
gridButton.width = 75;
gridButton.height = 75;
var helpButton = new Block('decor', myCanvas.width - 140, myCanvas.height - 150, [], 'levelCreator/help.png');
helpButton.width = 75;
helpButton.height = 75;
var settingButton = new Block('decor', myCanvas.width - 205, myCanvas.height - 150, [], 'levelCreator/settings.png');
settingButton.width = 75;
settingButton.height = 75;
addImage(saveButton.img);
addImage(undoButton.img);
addImage(playTestButton.img);
addImage(deleteButton.img);
addImage(leaveButton.img);
addImage(loadButton.img);
addImage(gridButton.img);
addImage(helpButton.img);
addImage(settingButton.img);
var blockTypeButtons = [
  ['block','block'],
  ['smallcursor', 'small'],
  ['blueblock', 'blue'],
  ['orangeblock', 'orange'],
  ['bounceUp', 'bounce'],
  ['mudblock', 'mud'],
  ['nojumpblock', 'rjump'],
  ['metalblock', 'njump'],
  ['iceblock', 'ice'],
  ['keys/key0', 'key', {tags: [0]}],
  ['doors/door0', 'door', {tags: [0]}],
  ['skullblock', 'die'],
  ['yellowblock', 'win'],
  ['portalgreen', 'tp', {tags: [0, 0]}],
  ['rgravblock', 'greverse'],
  ['vines', 'vine'],
  ['textblock', 'text', {tags: ["test", 30]}],
  ['water', 'water'],
  ['lgravblock', 'lgravblock'],
  ['speedpad', 'speedpad'],
  ['rightconveyor', 'rightconveyor']
];
var sideBarOptions = {
  lgravblock: [
    ['lgravblock', 'lgravblock'],
    ['hgravblock', 'hgravblock'],
    ['vlgravblock', 'vlgravblock'],
   // ['vhgravblock', 'vhgravblock'],
    ['normalgravblock', 'normalgravblock']
   ],
  orange: [
   ['orangeblock', 'orange'],
   ['purpleblock', 'purple']
  ],
  blue: [
    ['blueblock', 'blue'],
    ['redblock', 'red']
  ],
  key: [
    ['keys/key0', 'key', {tags: [0]}],
    ['keys/key1', 'key', {tags: [1]}],
    ['keys/key2', 'key', {tags: [2]}],
    ['keys/key3', 'key', {tags: [3]}],
    ['keys/key4', 'key', {tags: [4]}],
    ['keys/key5', 'key', {tags: [5]}],
    ['keys/key6', 'key', {tags: [6]}],
    ['keys/key7', 'key', {tags: [7]}],
    ['keys/key8', 'key', {tags: [8]}],
    ['keys/key9', 'key', {tags: [9]}]
  ],
  speedpad: [
    ['speedpad', 'speedpad'],
    ['slowpad', 'slowpad'],
    ['normalpad', 'normalpad']
  ],
  rightconveyor: [
    ['rightconveyor', 'rightconveyor'],
    ['leftconveyor', 'leftconveyor'],
    ['rightconveyor2', 'rightconveyor2'],
    ['leftconveyor2', 'leftconveyor2']
  ],
  door: [
    ['doors/door0', 'door', {tags: [0]}],
    ['doors/door1', 'door', {tags: [1]}],
    ['doors/door2', 'door', {tags: [2]}],
    ['doors/door3', 'door', {tags: [3]}],
    ['doors/door4', 'door', {tags: [4]}],
    ['doors/door5', 'door', {tags: [5]}],
    ['doors/door6', 'door', {tags: [6]}],
    ['doors/door7', 'door', {tags: [7]}],
    ['doors/door8', 'door', {tags: [8]}],
    ['doors/door9', 'door', {tags: [9]}]
  ],
  settings: [
    ['errorblock', null, {type: 'coor'}]
  ],
  bounce: [
    ['bounceUp', 'bounce'],
    ['bounceDown', 'dbounce'],
    ['bounceRight', 'rbounce'],
    ['bounceLeft', 'lbounce']
  ],
  tp: [
    ['levelCreator/coorimg', null, {type: 'coor'}]
  ],
  greverse: [
    ['rgravblock', 'greverse'],
    ['ngravblock', 'gnormal']
  ],
  block: [
    ['block', 'block'],
    ['grassblock', 'fullgrass'],
    ['dirtblock2', 'dirtblock']
  ],
  vine: [
    ['vines', 'vine'],
    ['bblank', 'blank2'],
    ['flower', 'flower'],
    ['sparkle', 'sparkle']
  ],
  text: [
    ['errorblock', null, {type: 'text'}],
    ['errorblock', null, {type: 'fontSize'}]
  ]
};
var lastX = 0;
var lastY = 0;
function RefreshCreator() {
  world = [];
  for (const i of creatorBlocks) {
    CreateBlocks(...i);
  }
}
function creatorGrid(x, y) {
  lastX = x;
  lastY = y;
  const canRect = myCanvas.getBoundingClientRect();
  if ((Grid || mouseDown) && blockType !== "delete") {//grid enabled?
    const tpoint = [(point1[0] === undefined) ? 0 : point1[0], (point1[1] === undefined) ? 0 : point1[1]];
    if (blockType === 'small') {
      placeX = Math.floor(((x - canRect.left) / camZ - (tpoint[0] % 5) + camX) / 5) * 5;
      placeY = Math.floor(((y - canRect.top) / camZ - (tpoint[1] % 5) + camY) / 5) * 5;
    } else {
    placeX = Math.floor(((x - canRect.left) / camZ - (tpoint[0] % 30) + camX) / 30) * 30;
    placeY = Math.floor(((y - canRect.top) / camZ - (tpoint[1] % 30) + camY) / 30) * 30;
    }
    
  } else {
    placeX = Math.floor((x - canRect.left) / camZ + camX);
    placeY = Math.floor((y - canRect.top) / camZ + camY);
  }

  if (mouseDown && !Grid) {
    if (blockType === 'small') {
      placeX += point1[0] % 5;
      placeY += point1[1] % 5;
    } else {
      placeX += point1[0] % 30;
      placeY += point1[1] % 30;
    }
  }
  
  if (blockType === 'delete') {
    deletingBlock = false;
    for (let i = creatorBlocks.length - 1; i >= 0; i--) {
      const cb = creatorBlocks[i];
      let blockWidth = 30;
      if (cb[2] === 'small')
        blockWidth = 5;
      if (colliding(cb[0] - 1, cb[1] - 1, cb[3] * blockWidth + 1, cb[4] * blockWidth + 1, placeX, placeY, 0, 0)) {
        deletingBlock = i;
        break;
      }
    }
  }
}
function creatorUndo() {
  if (creatorHistory[creatorHistory.length - 1][0] === 'create') {
    creatorBlocks.splice(creatorBlocks.length - 1, 1);
    RefreshCreator();
    creatorHistory.splice(creatorHistory.length - 1, 1);
  } else if (creatorHistory[creatorHistory.length - 1][0] === 'delete') {
    creatorBlocks.push(creatorHistory[creatorHistory.length - 1][1]);
    CreateBlocks(...creatorBlocks[creatorBlocks.length - 1]);
    creatorHistory.splice(creatorHistory.length - 1, 1);
  }
}
myCanvas.addEventListener('mousemove', MyEvent => {
  if (!IsBuilding) return;
  const x = MyEvent.clientX;
  const y = MyEvent.clientY;
  creatorGrid(x, y);
});
myCanvas.addEventListener('mousedown', MyEvent => {
  if (!IsBuilding) return;
  const x = MyEvent.clientX;
  const y = MyEvent.clientY;
  creatorGrid(x, y);
  const mc = {x: x, y: y, width: 0, height: 0};
  if (!mouseDown) {
    if (x > myCanvas.width - 150) {
      if (rootBlockType in sideBarOptions) {
        for (const b in sideBarOptions[rootBlockType]) {
          if (fcoll({x: (myCanvas.width - 145) + 55 * (b % 2), y:5 + 55 * Math.floor(b / 2), width: 50, height: 50}, mc)) {
            if (rootBlockType === 'settings') {
              const result = prompt('Type spawn position in format: "x,y"')
              const results = result.split(',');
              if (results.length === 2) {
                if (typeof JSON.parse(results[0]) === 'number' && typeof JSON.parse(results[1]) === 'number') {
                  spawnPos = [JSON.parse(results[0]), JSON.parse(results[1])];
                }
              }
            } else if (sideBarOptions[rootBlockType][b][2] !== undefined && sideBarOptions[rootBlockType][b][2].type === 'coor') {
              var p = prompt('type coordinates (format: "x,y")');
              if (p !== null && p !== '') {
                blockNbt = {tags: p.split(',')};
                for (const i in blockNbt.tags) {
                  blockNbt.tags[i] = JSON.parse(blockNbt.tags[i]);
                }
                     
              }
            } else if (sideBarOptions[rootBlockType][b][2] !== undefined && sideBarOptions[rootBlockType][b][2].type === 'text') {
              var p = prompt('type text');
              if (p !== null && p !== '') {
                blockNbt.tags[0] = p;
              }
            } else if (sideBarOptions[rootBlockType][b][2] !== undefined && sideBarOptions[rootBlockType][b][2].type === 'fontSize') {
              var p = prompt('type font size (default is 30)');
              if (p !== null && p !== '' && parseInt(p) !== NaN) {
                blockNbt.tags[1] = parseInt(p);
              }
            } else {
              cursorImg = cliDir + 'textures/' + sideBarOptions[rootBlockType][b][0] + '.png';
              blockNbt = (sideBarOptions[rootBlockType][b][2] === undefined) ? {} : sideBarOptions[rootBlockType][b][2];
              addImage(cursorImg);
              blockType = sideBarOptions[rootBlockType][b][1];
            }
          }
        }
      }
    } 
    if (y < myCanvas.height - 150 && x < myCanvas.width - 150) {
      if (blockType === 'delete') {
        if (deletingBlock !== false) {
          creatorHistory.push(['delete',creatorBlocks.splice(deletingBlock, 1)[0]]);
          deletingBlock = false;

          RefreshCreator();
        }
      } else if (blockType !== 'settings') {
        point1 = [placeX, placeY];
      }
    } else if (fcoll(saveButton, mc)) {
      const result = prompt('Are you sure you want to copy to clipboard? (y/n). Type s for localSave.');
      if (result === 'y') {
        navigator.clipboard.writeText(JSON.stringify(creatorBlocks)).then(function() {
          AddChat('Copied to Clipboard!');
          }, function(err) {
          AddChat('ERROR: Could not copy. >' + err);
          let tab = window.open('about:blank', '_blank');
          tab.document.write(JSON.stringify(creatorBlocks).replace("'", ''));
          tab.document.close();
          });
      } else if (result === 's') {
        localStorage.setItem('level backup', JSON.stringify(creatorBlocks));
      }
    } else if (fcoll(playTestButton, mc)) {
      togglePlayTest();
    } else if (fcoll(deleteButton, mc)) {
      blockType = 'delete';
      cursorImg = cliDir + `textures/blank.png`;
      addImage(cursorImg);
    } else if (fcoll(gridButton, mc)) {
      Grid = !Grid;
    } else if (fcoll(helpButton, mc)) {
      window.open(cliDir + 'textures/helpimg.png', '_blank');
    } else if (fcoll(loadButton, mc)) {
      const lvl = prompt('enter level code');
      if (lvl !== null && lvl !== 'null' && lvl !== '') {
        creatorBlocks = JSON.parse(lvl);
        RefreshCreator();
      }
    } else if (fcoll(undoButton, mc) && creatorHistory.length > 0) {
      creatorUndo();
    } else if (fcoll(settingButton, mc)) {
      rootBlockType = 'settings';
    } else if (fcoll(leaveButton, mc)) {
      clearInterval(CREATE);
      clearInterval(GAME);
      IsBuilding = false;
      PlayTest = false;
      GAME = setInterval(GameTick, 25);
      CreateWorld(-2);
    } else {
      for (const b in blockTypeButtons) {
        if (fcoll({x: 160 + 55 * Math.floor(b / 2), y:myCanvas.height - 125 + 60 * (b % 2), width: 50, height: 50}, mc)) {
          blockType = blockTypeButtons[b][1];
          rootBlockType = blockType;
          cursorImg = cliDir + 'textures/' + blockTypeButtons[b][0] + '.png';
          addImage(cursorImg);
          blockNbt = (blockTypeButtons[b][2] === undefined) ? {} : blockTypeButtons[b][2];
        }
      }
    }
  }
  mouseDown = true;
});
myCanvas.addEventListener('mouseup', MyEvent => {
  if (!IsBuilding) return;
  mouseDown = false;
  if (point1.length !== 0 && blockType !== 'delete' && blockType !== 'settings') {
    let createWidth;
    let createHeight;
    if (blockType === 'small') {
      createWidth = Math.abs(placeX - point1[0]) / 5 + 1;
      createHeight = Math.abs(placeY - point1[1]) / 5 + 1;
    } else {
      createWidth = Math.abs(placeX - point1[0]) / 30 + 1;
      createHeight = Math.abs(placeY - point1[1]) / 30 + 1;
    }
    let inx = point1[0];
    let iny = point1[1];
    if (placeX - point1[0] < 0) {
      inx = placeX;
    }
    if (placeY - point1[1] < 0) {
      iny = placeY;
    }
    var extraTags = [];
    if ('tags' in blockNbt) {
      extraTags = [...blockNbt.tags];
    }
    if (extraTags.length === 0)
      creatorBlocks.push([inx, iny, blockType, createWidth, createHeight]);
    else
      creatorBlocks.push([inx, iny, blockType, createWidth, createHeight, extraTags]);
    CreateBlocks(...creatorBlocks[creatorBlocks.length - 1]);
    creatorHistory.push(['create']);
    localStorage.setItem('level backup', JSON.stringify(creatorBlocks));
    if (world.length > 5000 && !ignoreWarning) {
      alert('You have over 5000 blocks, This may lag some systems');
      ignoreWarning = true;
    }
  }
  point1 = [];
});

function togglePlayTest() {
  PlayTest = !PlayTest;
  if (PlayTest) {
    clearInterval(CREATE);
    CreateWorld({
      "format": 2,
      "spawn": spawnPos,
      "data": creatorBlocks
    }, false);
    GAME = setInterval(GameTick, 25);
  } else {
    clearInterval(GAME);
    CREATE = setInterval(lvlCreateTick, 25);
  }
}

function lvlCreateGui() {
  creatorGrid(lastX, lastY);
  if (point1 != []) {
    let blockWidth = 30;
    if (blockType === 'small') {
      blockWidth = 5;
    }
    let offsetX;
    let offsetY;
    let startOffX = 0;
    let startOffY = 0;
    if (placeX - point1[0] >= 0) {
      offsetX = blockWidth;
    } else {
      offsetX = -blockWidth;
      startOffX = blockWidth;
    }
    if (placeY - point1[1] >= 0) {
      offsetY = blockWidth;
    } else {
      offsetY = -blockWidth;
      startOffY = blockWidth;
    }
    ctx.strokeRect((point1[0] - camX + startOffX) * camZ, (point1[1] - camY + startOffY) * camZ, (placeX - point1[0] + offsetX) * camZ, (placeY - point1[1] + offsetY) * camZ);
  }

  if (blockType === 'tp') {
    AddDrawQueue(new Block(blockNbt.tags[0], blockNbt.tags[0], 'decor', 1, 1, []))
  }
  
  if (blockType === 'delete' && deletingBlock !== false) {
    const c = creatorBlocks[deletingBlock];
    let blockWidth = 30;
    if (c[2] === 'small')
      blockWidth = 5;
    ctx.strokeRect((c[0] - camX) * camZ, (c[1] - camY) * camZ, c[3] * blockWidth * camZ, c[4] * blockWidth * camZ);
  }
  ctx.globalAlpha = 0.5;
  ctx.drawImage(images[cursorImg], (placeX - camX) * camZ, (placeY - camY) * camZ, 30 * camZ, 30 * camZ);
  ctx.globalAlpha = 1;
  
  ctx.strokeRect((0 - camX) * camZ, 0, 0, myCanvas.width);
  ctx.strokeRect((600 - camX) * camZ, 0, 0, myCanvas.width);
  ctx.strokeRect(0, (270 - camY) * camZ, myCanvas.width, 0)
  ctx.fillStyle = 'silver';
  ctx.fillRect(0, myCanvas.height - 150, myCanvas.width, 150);
  ctx.fillRect(myCanvas.width - 150, 0, 150, myCanvas.height);
  saveButton.y = myCanvas.height - 140;
  deleteButton.y = myCanvas.height - 140;
  playTestButton.y = myCanvas.height - 75;
  undoButton.y = myCanvas.height - 75;
  leaveButton.y = myCanvas.height - 140;
  leaveButton.x = myCanvas.width - 75;
  loadButton.x = myCanvas.width - 75;
  loadButton.y = myCanvas.height - 75;
  gridButton.x = myCanvas.width - 140;
  gridButton.y = myCanvas.height - 140;
  helpButton.x = myCanvas.width - 140;
  helpButton.y = myCanvas.height - 75;
  settingButton.y = myCanvas.height - 140;
  settingButton.x = myCanvas.width - 205;
  ctx.drawImage(images[saveButton.img], saveButton.x, saveButton.y);
  ctx.drawImage(images[playTestButton.img], playTestButton.x, playTestButton.y);
  ctx.drawImage(images[undoButton.img], undoButton.x, undoButton.y);
  ctx.drawImage(images[deleteButton.img], deleteButton.x, deleteButton.y);
  ctx.drawImage(images[leaveButton.img], leaveButton.x, leaveButton.y);
  ctx.drawImage(images[loadButton.img], loadButton.x, loadButton.y);
  ctx.drawImage(images[gridButton.img], gridButton.x, gridButton.y);
  ctx.drawImage(images[helpButton.img], helpButton.x, helpButton.y);
  ctx.drawImage(images[settingButton.img], settingButton.x, settingButton.y);
  let i = 0;
  for (const b of blockTypeButtons) {
    const blink = cliDir + 'textures/' + b[0] + '.png';
    addImage(blink);
    ctx.drawImage(images[blink], 160 + Math.floor(i / 2) * 55, myCanvas.height - 125 + (i % 2) * 60, 50, 50);
    i++;
  }
  if (rootBlockType in sideBarOptions) {
    let o = 0;
    for (const i of sideBarOptions[rootBlockType]) {
      const ilink = cliDir + 'textures/' + i[0] + '.png';
      addImage(ilink);
      ctx.drawImage(images[ilink], myCanvas.width - 145 + 55 * (o % 2), 5 + 55 * Math.floor(o / 2), 50, 50);
      o++;
    }
  }
}

function lvlCreateTick() {
  myCanvas.style.width = '100%';
  myCanvas.style.height = '100%';
  myCanvas.height = window.innerHeight;
  myCanvas.width = window.innerWidth;
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  camZ = myCanvas.width / 700;
  
  startMusic()

  for (const blk of world) {
    AddDrawQueue('block', blk);
  }
  for (const blk of worldText) {
    AddDrawQueue('text', blk);
  }
  AddDrawQueue('plyr', {x: spawnPos[0], y: spawnPos[1], img: playerImg})
  DrawFrame(false);

  ctx.fillText(`PlaceX: ${placeX}, placeY: ${placeY}`, 100, 25);
  lvlCreateGui();

    ChatTick();
    DrawFrame(false, false);

  if (rightDown)
    camX += 10;
  if (leftDown)
    camX -= 10;
  if (upDown)
    camY -= 10;
  if (downDown)
    camY += 10;
}
