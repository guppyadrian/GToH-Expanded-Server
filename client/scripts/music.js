
function setSong(song) {

  
  
  if (prevSong !== song) {
    songList[prevSong].pause();
    songList[prevSong].currentTime = 0;
  }
  if (song !== curSong) {
    prevSong = curSong;
    if (prevSong === 'shop') {
      ShopLeave();
    }
  }
  curSong = song;

  
  
}
