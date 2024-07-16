'use strict';
class Text {
  constructor(text = '', x = 0, y = 0, size = 20, gui = false, override = false, left = false) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.text = text;
    this.size = size;
    this.gui = gui;
    this.override = override;
    this.left = left;
  }

}

class Particle {
  constructor(x = 0, y = 0, xAccel = 0, yAccel = 0, gravity = false, life = 25, friction = 0.2, size = 10) {
    this.opacity = 0.5;
    this.x = x;
    this.y = y;
    this.life = life;
    this.xAccel = xAccel;
    this.yAccel = yAccel;
    this.gravity = gravity;
    this.size = size;
    this.img = cliDir + 'textures/skins/player.png';
    this.opde = this.opacity / this.life;
    this.friction = friction;
  }
  updateSprite() {
    this.life--;
    this.opacity -= this.opde;
    this.x += this.xAccel;
    this.y += this.yAccel;
    if (this.gravity)
      this.yAccel += 0.25;
    this.xAccel -= Math.sign(this.xAccel) * this.friction;
  }
}

class Block {
  constructor(type = 'block', x = 0, y = 0, extraTags = [], oImg = null) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.type = type;
    this.tags = extraTags;
    this.img = '';
    this.opacity = 1;
    this.size = 30;

    switch (this.type) {
      case 'njump':
        this.img = cliDir + 'textures/metalblock.png';
        break;
      case 'fullgrass':
      case 'grass':
      case 'dirt':
      this.img = cliDir + 'textures/grassblock.png';
        break;
      case 'block':
        if (this.img === '')
        this.img = cliDir + 'textures/block.png';
        break;
      case 'vine':
        this.img = cliDir + 'textures/vines.png';
        this.tags.push('nc');
        break;
      case 'rose':
       this.img = cliDir + 'textures/Rose.png';
        break;
      case 'sparkle':
       this.img = cliDir + 'textures/sparkle.png';
        break;
      case 'pee':
        this.img = cliDir + 'textures/pee.png';
        break;
      case 'dirtblock':
        this.img = cliDir + 'textures/dirtblock2.png';
         break;
      case 'blank2':
        this.img = cliDir + 'textures/bblank.png';
        break;
      case 'textblock':
        this.img = cliDir + 'textures/text.png';
        break;
      case 'lgravblock':
        this.img = cliDir + 'textures/lgravblock.png';
        break;
      case 'hgravblock':
        this.img = cliDir + 'textures/hgravblock.png';
        break;
      case 'normalgravblock':
        this.img = cliDir + 'textures/normalgravblock.png';
        break;
      case 'vlgravblock':
        this.img = cliDir + 'textures/vlgravblock.png';
        break;
      case 'vhgravblock':
        this.img = cliDir + 'textures/vhgravblock.png';
        break;
      case 'speedpad':
        this.img = cliDir + 'textures/speedpad.png';
        break;
      case 'slowpad':
        this.img = cliDir + 'textures/slowpad.png';
        break;
      case 'normalpad':
        this.img = cliDir + 'textures/normalpad.png';
        break;
      case 'rightconveyor':
        this.img = cliDir + 'textures/rightconveyor.png';
        break;
      case 'leftconveyor':
        this.img = cliDir + 'textures/leftconveyor.png';
        break;
      case 'rightconveyor2':
        this.img = cliDir + 'textures/rightconveyor2.png';
        break;
      case 'leftconveyor2':
        this.img = cliDir + 'textures/leftconveyor2.png';
        break;
      //case 'lowgravblock':
       // this.img = cliDir + 'textures/lowgrav.png';
      //  break;
      case 'red':
        this.img = cliDir + 'textures/redblock.png';
        break;
      case 'blue':
        this.img = cliDir + 'textures/blueblock.png';
        break;
      case 'win':
        this.img = cliDir + 'textures/yellowblock.png';
        break;
      case 'rjump':
        this.img = cliDir + 'textures/nojumpblock.png';
        break;
      case 'greverse':
        this.img = cliDir + 'textures/rgravblock.png';
        break;
      case 'gnormal':
        this.img = cliDir + 'textures/ngravblock.png';
        break;
      case 'portal':
        if (this.tags[0] > 0 && levelsComplete[this.tags[0]] > 0) {
          this.img = cliDir + 'textures/portalgreen.png';
        } else
        this.img = cliDir + 'textures/portalred.png';
        if ('levels' in lvlData[this.tags[0]]) {
          let fullComplete = true;
          for (const l of lvlData[this.tags[0]].levels) {
            if (!(levelsComplete[l] > 0)) {
              fullComplete = false;
              break;
            }
          }
          if (fullComplete)
            this.img = cliDir + 'textures/portalyellow.png';
        }
        if (lvlData[this.tags[0]] === undefined) break;
        worldText.push(new Text(lvlData[this.tags[0]].about.name, this.x + 15, this.y - 20, 8));
        worldText.push(new Text(lvlData[this.tags[0]].about.diff, this.x + 15, this.y + 5, 16));
        if (lvlData[this.tags[0]].about.create !== '')
          worldText.push(new Text('By ' + lvlData[this.tags[0]].about.create, this.x + 15, this.y - 35, 8));
        if (levelsComplete[this.tags[0]] !== false && levelsComplete[this.tags[0]] !== null && levelsComplete[this.tags[0]] !== undefined)
          worldText.push(new Text(`Best Time: ${levelsComplete[this.tags[0]]}`, this.x + 15, this.y + 60, 8));
        if (this.tags[0] <= 0) break;
        /* NO WORLD RECORD
        if ((worldRecords[this.tags[0]] === undefined || worldRecords[this.tags[0]] === null)) {
          worldText.push(new Text(`WR: None!`, this.x + 15, this.y + 55, 8));
        } else {
          worldText.push(new Text(`WR <${worldRecords[this.tags[0]][1]}>: ${worldRecords[this.tags[0]][0]}`, this.x + 15, this.y + 55, 7));
        }
        */
        break;
      case 'orange':
        this.img = cliDir + 'textures/orangeblock.png';
        break;
      case 'bounce':
        this.img = cliDir + 'textures/bounceUp.png';
        break;
      case 'dbounce':
        this.img = cliDir + 'textures/bounceDown.png';
        break;
      case 'lbounce':
        this.img = cliDir + 'textures/bounceLeft.png';
        break;
      case 'rbounce':
        this.img = cliDir + 'textures/bounceRight.png';
        break;
      case 'door':
        if (levelFormat === 1) {
          if (oImg === null)
            oImg = `textures/doors/door0.png`;
          this.img = cliDir + oImg;
        }
        else
          this.img = cliDir + `textures/doors/door${this.tags[0]}.png`;
        break;
      case 'key':
        if (levelFormat === 1) {
          if (oImg === null)
            oImg = `textures/keys/key0.png`;
          this.img = cliDir + oImg;
        }
        else
          this.img = cliDir + `textures/keys/key${this.tags[0]}.png`;
        break;
      case 'anim':
        this.img = cliDir + `textures/animations/${oImg}`;
        break;
      case 'decor':
        this.img = cliDir + `textures/${oImg}`;
        break;
      case 'small':
        this.img = cliDir + `textures/block.png`
        this.width = 5;
        this.height = 5;
        this.size = 5;
        break;
      case 'ice':
        this.img = cliDir + `textures/iceblock.png`;
        break;
      case 'water':
        this.img = cliDir + 'textures/water.png';
        break;
      case 'die':
        this.img = cliDir + `textures/skullblock.png`;
        break;
      case 'purple':
        this.img = cliDir + `textures/purpleblock.png`;
        break;
      case 'flower':
        this.img = cliDir + 'textures/flower.png';
        break;
      case 'mud':
        this.img = cliDir + `textures/mudblock.png`;
        break;
      case 'tp':
        this.img = cliDir + `textures/portalgreen.png`;
        break;
      case 'stars0':
        this.img = cliDir + `textures/0star.png`;
        break;
      case 'stars1':
        this.img = cliDir + `textures/1star.png`;
        break;
      case 'stars2':
        this.img = cliDir + `textures/2star.png`;
        break;
      case 'stars3':
        this.img = cliDir + `textures/3star.png`;
        break;
      case 'stars4':
        this.img = cliDir + `textures/4star.png`;
        break;
      default:
        this.img = cliDir + `textures/errorblock.png`;
        break;
    }
  }

  updateSprite(redActive) {
    if (['red', 'blue', 'orange', 'purple', 'door'].indexOf(this.type) === -1) return;
    this.opacity = 0.3;
    switch (this.type) {
      case 'red':
        if (redActive)
          this.opacity = 1;
        break;
      case 'blue':
        if (!redActive)
          this.opacity = 1;
        break;
      case 'orange':
        if (Ticker % 80 >= 40)
          this.opacity = 1;
        break;
      case 'purple':
        if (Ticker % 80 < 40)
          this.opacity = 1;
        break;
      case 'door':
        if (levelFormat === 1) {
          if (!perLevel.includes(this.tags[0].slice(4)))
            this.opacity = 1;
        } else {
          if (!perLevel.includes(this.tags[0]))
            this.opacity = 1;
        }

        break;
    }
  }

}

class Dialogue extends Block {
  constructor(text, charImg = null) {
    super('decor', 100, myCanvas.height / camZ, ['gui','nc'], 'dialogue/' + ((charImg === null) ? "dialogue.png" : charImg));
    this.disText = new Text(text, this.x, this.y, 12, true, true, true);
    
    this.accel = 16;
    this.dialogueTick = 0;
  }

  updateSprite() {
    if (this.dialogueTick < 18) {
      this.y -= this.accel;
      this.accel--;
    } else if (this.dialogueTick < 20) {
      this.y -= this.accel;
      this.accel++;
    }
    if (this.dialogueTick > 130) {
        world.splice(world.indexOf(this), 1);
        if (dialogueQueue.length > 0) {
          world.push(new Dialogue(dialogueQueue.shift(), ((Math.random() < 0.7) ? "dialogue.png" : "dialogueChad.png")));

        } else dialogueOpen = false;
    } else if (this.dialogueTick > 100) {
      this.y += this.accel;
      this.accel++;
    }

    this.disText.x = this.x + 110;
    this.disText.y = this.y + 30;
    const txt = this.disText;
    AddDrawQueue('text', txt);
    
    this.dialogueTick++;
  }
}

class AnimatedBlock extends Block {
  constructor(x = 0, y = 0, img, sheet, size = 1, tags = []) {
    super('anim', x, y, tags, img);
    this.animW = [sheet.init[0], sheet.init[1]];
    this.animL = sheet.init[2];
    this.sheet = sheet;
    this.curAnim = 'idle';
    this.animTick = 0;
    this.animFrame = this.sheet[this.curAnim][0];
    this.size = size;
  }

  getProperties() {
    return [
      this.animFrame % this.animL * this.animW[0],
      Math.floor(this.animFrame / this.animL) * this.animW[1],
      this.animW[0],
      this.animW[1]
    ];
  }

  setAnimation(anim) {
    this.curAnim = anim;
    this.animTick = 0;
    this.animFrame = this.sheet[this.curAnim][0];
  }

  playAnimation(anim, times) {
    
  }

  updateSprite() {
    const ca = this.sheet[this.curAnim];
    this.animTick++;
    if (this.animTick > this.sheet.init[3]) {
      this.animTick = 0;
      this.animFrame++;
      if (this.animFrame >= ca[1] + ca[0]) this.animFrame = ca[0];
    }
  }
}

const t = {
  init:[32, 32, 5, 3], //0: x width, 1: y width, 2: x length
  idle:[0, 7], //0: start pos, 1: anim length, 2: ticks for next frame
  sleep:[7, 6],
  happy:[13, 5],
  dance:[18, 8],
  gaming:[26, 4]
};
