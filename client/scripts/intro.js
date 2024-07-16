"use strict";
var tempInterval, mainBeat = 400, mainInc = 0, skipIntro = false; 
ctx.fillText("debug text", -500, 500);
skipIntro && (mainInc = 3, mainBeat = 100), document.body.style.width = "100%", document.body.style.height = "100%", myCanvas.height = window.innerHeight, myCanvas.width = window.innerWidth, ctx.textAlign = "center", ctx.font = "15px MinecraftRegular";
{ 
  let t = new Image; 
  t.onload = (() => { 
    let e = t.width / myCanvas.width; 
    t.height / e > myCanvas.height - 45 && (e = t.height / (myCanvas.height - 45)), ctx.imageSmoothingEnabled = !1, ctx.lineWidth = 5, ctx.strokeRect((myCanvas.width - t.width / e) / 2, 0, t.width / e, t.height / e), ctx.drawImage(t, (myCanvas.width - t.width / e) / 2, 0, t.width / e, t.height / e), ctx.lineWidth = 1 
  }), t.src = cliDir + "textures/updates/0.5.0-expanded2.png" 
} 
function cool() { 
  setTimeout(() => { 
    switch (cool(), ++mainInc) { 
      case 1: 
        ctx.fillText("Music by Retrobop", myCanvas.width / 2, 300); 
        break; 
      case 2: 
        ctx.fillText("Expanded by RogerSD", myCanvas.width / 2, 500); 
        break; 
      case 3: 
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height), tempInterval = setInterval(introPhysics, 25); 
        break; 
      case 4: 
        setTimeout(() => {clearInterval(tempInterval), SetupGame(), GAME = setInterval(GameTick, 25), console.log("finished intro")}, 460)
    } 
  }, 4 * mainBeat) 
} 
ctx.fillStyle = "aliceblue", ctx.fillRect(0, 0, myCanvas.width, myCanvas.height), ctx.fillStyle = "black", /*ctx.fillText("(Press any key to continue...)", myCanvas.width / 2, myCanvas.height - 30), ctx.fillText("(This screen is for preloading.)", myCanvas.width / 2, myCanvas.height - 15),*/ ctx.font = "50px MinecraftRegular";
var IntroLogo = [myCanvas.width / 2, myCanvas.height - 100, -15], gtohICON = new Image;
gtohICON.src = cliDir + "textures/gtohICON.png";
var gtohGravity = -20, gtohRotation = 40, gtohSize = 128, gtohAccel = 1;
function introPhysics() { 
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
  ctx.translate(IntroLogo[0] + 32, IntroLogo[1] + 32)
  ctx.rotate(IntroLogo[2] * Math.PI / 180)
  ctx.drawImage(gtohICON, gtohSize / -2, gtohSize / -2, gtohSize, gtohSize)
  ctx.resetTransform()
  IntroLogo[1] += gtohGravity
  IntroLogo[2] += gtohRotation
  IntroLogo[1] > myCanvas.height / 3 && gtohGravity > 0 ? gtohGravity -= .5 : gtohGravity += .5, (gtohRotation -= .5) < 10 && (gtohAccel *= 1.3), gtohSize += gtohAccel - 1
} 
ctx.imageSmoothingEnabled = false
songList.main.onplay = (() => {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height)
  if ((Username == "guppy" || skipIntro) && mainInc == 0) {
    mainInc = 999;
    GAME = setInterval(GameTick, 25);
    return;
  } 
  ctx.fillText("Made by Guppy", myCanvas.width / 2, 100);
  songList.main.currentTime = 0;
  setTimeout(cool, 500)
});
