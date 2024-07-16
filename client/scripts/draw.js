'use strict';


function addImage(img) {
  if (img in images) return;
  images[img] = new Image();
  images[img].src = img;
}

addImage(playerImg);
addImage(cliDir + 'textures/dialogue/dialogue.png');

function AddDrawQueue(type, obj) {
  switch(type) {
    case 'text':
      drawTextQueue.push({
        x: obj.x,
        y: obj.y,
        text: obj.text,
        size: obj.size,
        gui: obj.gui,
        top: obj.override, 
        alignl: obj.left
      });
      break;
    case 'block':
      drawQueue.push({
        x: obj.x,
        y: obj.y,
        img: obj.img,
        opacity: obj.opacity,
        anim: false,
        gui: obj.tags.includes('gui'),
        size: obj.size
      });
      break;
    case 'anim':
      drawQueue.push({
        x: obj.x,
        y: obj.y,
        img: obj.img,
        opacity: obj.opacity,
        anim: true,
        size: obj.size,
        animP: obj.getProperties(),
        gui: obj.tags.includes('gui')
      });
      break;
    case 'plyr':
      drawQueue.push({
        x: obj.x,
        y: obj.y,
        img: obj.img
      });
      break;
  }
}

function DrawFrame(debug = true, clear = true) {
  if (clear)
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  shakeX = Math.floor(shakeX * -8.5) / 10;
  shakeY = Math.floor(shakeY * -8.5) / 10;
  //socket.emit('console', `${shakeX} ${shakeY}`)
  if (camZ < 0.2)
    camZ = 0.2;
  
  ctx.imageSmoothingEnabled = false;
  var guiQueue = [];
  var topDrawQueue = [];
  for (const dq of drawQueue) {
    var camXI = camX;
    var camYI = camY;
    if (!(dq.img in images)) {
      images[dq.img] = new Image();
      images[dq.img].src = dq.img;
    }
    if (dq.gui) {
      guiQueue.push(dq);
      continue;
    }
    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;
    const sc = ((dq.size === undefined) ? 30 : dq.size) / 30;
    

    

    if (dq.anim) {
      ctx.drawImage(
        images[dq.img],
        dq.animP[0],
        dq.animP[1],
        dq.animP[2],
        dq.animP[3],
        Math.floor((dq.x - camXI - shakeX) * camZ),
        Math.floor((dq.y - camYI - shakeY) * camZ),
        Math.ceil(dq.animP[2] * camZ * dq.size),
        Math.ceil(dq.animP[3] * camZ * dq.size)
      );
    } else {
      const is = images[dq.img];
      try {
      ctx.drawImage(is, Math.floor((dq.x - camXI - shakeX) * (camZ + shakeZ)), Math.floor((dq.y - camYI - shakeY) * (camZ + shakeZ)), Math.ceil(is.width * camZ * sc), Math.ceil(is.height * camZ * sc));
      }
      catch(err) {
        //console.log(`image link: ${dq.img}, image: ${is}, pos: (${(dq.x - camXI - shakeX) * camZ}, ${Math.floor((dq.y - camYI - shakeY) * camZ)})`);
        console.log(dq)
      }
    }
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = 'black';
  for (const dq of drawTextQueue) {
    if (dq.top) {
      topDrawQueue.push(dq);
      continue;
    }
    if (dq.alignl) 
    ctx.textAlign = 'left';
  else
    ctx.textAlign = 'center';
    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;

    if (dq.gui) {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      if (dq.text.substring(0, 7) === '[ADMIN]') {
        ctx.fillStyle = 'red';
        ctx.fillText(dq.text.substring(0, dq.text.indexOf('>') + 1), dq.x, dq.y);
        ctx.fillStyle = 'black';
        ctx.fillText(dq.text.substring(dq.text.indexOf('>') + 2), dq.x + ctx.measureText(dq.text.substring(0, dq.text.indexOf('>') + 1)).width, dq.y)
      } else {
        ctx.fillText(dq.text, dq.x, dq.y);
      }
    } else {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, (dq.x - camX - shakeX) * camZ, (dq.y - camY - shakeY) * camZ);
    }

    //ctx.globalAlpha = 1;
  }
  for (const dq of guiQueue) {

    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;
    const sc = ((dq.size === undefined) ? 30 : dq.size) / 30;
    
    const is = images[dq.img];
      try {
      ctx.drawImage(is, (dq.x - shakeX) * (camZ + shakeZ), (dq.y - shakeY) * (camZ + shakeZ), is.width * camZ * sc, is.height * camZ * sc);
      }
      catch(err) {
        console.log(`image link: ${dq.img}, image: ${is}`);
      }
  }
  
  for (const dq of topDrawQueue) {
    if (dq.alignl)
  ctx.textAlign = 'left';
  else 
  ctx.textAlign = 'center';
    ctx.globalAlpha = (dq.opacity === undefined) ? 1 : dq.opacity;

    if (dq.gui) {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, dq.x * camZ, dq.y * camZ);
    } else {
      ctx.font = `${dq.size * camZ}px MinecraftRegular`;
      ctx.fillText(dq.text, (dq.x - camX - shakeX) * camZ, (dq.y - camY - shakeY) * camZ);
    }
  }
  drawQueue = [];
  drawTextQueue = [];
  ctx.font = '12px MinecraftRegular';
  ctx.textAlign = 'left';
  if (debug !== false) {
    ctx.fillText(`Timer: ${Timer / 40}  Ping: ${Ping}`, 0, 20);
    ctx.fillText(`X: ${Player.x} Y: ${Player.y}`, 0, 33);
    if (debug === 2) {
      ctx.fillText(`xA: ${Player.xAccel} yA: ${Player.yAccel} cj: ${Player.canJump} wj: ${Player.wallJump}`, 0, 46);
} else {
      ctx.fillText(`v${GAMEVERSION.join(".")}`, 23, 46); 
    }
  } 
  if (pressTab) {
    const names = Object.keys(OtherPlayers);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'grey';
    ctx.fillRect(400 * camZ, 0, 300 * camZ, 15 * camZ * (names.length + 1));
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'black';
    ctx.font = `${10 * camZ}px MinecraftRegular`;
    for (const i in names) {
      const l = (lvlData[OtherPlayers[names[i]].location].about.name === '') ? lvlData[OtherPlayers[names[i]].location].about.diff : lvlData[OtherPlayers[names[i]].location].about.name;
      ctx.fillText(`${OtherPlayers[names[i]].user} in ${l}`, 400 * camZ, 20 * camZ + 15 * camZ * i);
    }
    const o = (lvlData[WorldId].about.name === '') ? lvlData[WorldId].about.diff : lvlData[WorldId].about.name;
    ctx.fillText(`${Username} in ${o}`, 400 * camZ, 20 * camZ + 15 * camZ * names.length);
  }
  
}
