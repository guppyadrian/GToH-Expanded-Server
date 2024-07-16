const dialogueEnter = [
' '
];
const dialogueBought = [
  " "
];
const dialogueLeave = [
' '
];

function OpenDialogue(txt = null) {
  var txt = txt;
  if (txt === null) {
    txt = dialogueEnter[Math.floor(Math.random() * dialogueEnter.length)];
    if (Math.random() < 0.01) txt = 'Ẳ̵̡̫͎͍̞͎A̴̧̡̟͔̦̳͍͚̯͍̓͆͝Â̷̗̲̻̇́̋́̈́͝͝(̸̯̺̌̄̃̍̿͑̄̓͗̅̒́͘)̶̨̘̤͓̞̪̲̂̾̽̊̀̀̎̉̎̐͘̕͝ͅ/̷̧̛̦̞̯̄́̑̀̂̀̉̈́͋̈\̷̰̳̼̻̽̓͋͆̏͐̏͛̾̌̆̕/̴̻͎͇̺̭͆͌̂̔̂́̅̈́͑̂͘͘͘͝6̸̨̨͖̹͇̙͎̯̏͆ ̷̧̢̟̣̤̥̫̜̮͎̀͑̈̎̅͐̽̀̄̾͐͒̑͝U̷̢͖̖̟͙̙̖͈̟̱͙̽̊͋̆͜ŝ̷̢̨̛̛̹͈̼̖̜͙͔͇̯̿̽̾̌͋̏̂̈́̕';
  }
  if (!dialogueOpen) {
    dialogueOpen = true;
    world.push(new Dialogue(txt, ((Math.random() < 0.9) ? "dialogue.png" : "dialogueChad.png")));
  } else if (dialogueQueue < 5){
    dialogueQueue.push(txt);
  }
}

function ShopEnter() {
  const txt = dialogueEnter[Math.floor(Math.random() * dialogueEnter.length)];

    OpenDialogue(txt);
}

function ShopLeave() {
  const txt = dialogueLeave[Math.floor(Math.random() * dialogueLeave.length)];

  OpenDialogue(txt);
}
function AddChat(msg) {
  chatQueue.push([msg, 0]);
}

