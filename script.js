console.log("Made by Maniesh");

let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/songs/${folder}`);
  let response = await a.text();

  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (
      element.href.endsWith(".m4a") ||
      element.href.endsWith(".mp3") ||
      element.href.endsWith(".mp4")
    ) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
 

  // Show all the songs in the library
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 

     <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replace(/%20/g, " ").replace(/%2C/g, ",")}</div>
                    <div>Maniesh </div>
                </div>
                <div class="playnow"><span>Play Now</span><img class="invert "  src="img/play.svg" alt=""></div>
            
    
    
    
     </li>`;
  }
  // play the first song
  // var audio = new Audio(songs[0])
  // console.log(songs[0])
  // audio.play()

  // Attach an event listner to each song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00: 00";
};

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  // Ensure two-digit format
  minutes = String(minutes).padStart(2, "0");
  secs = String(secs).padStart(2, "0");

  return `${minutes}:${secs}`;
}

// Example usage
// console.log(formatTime(12));   // Output: 00:12
// console.log(formatTime(75));   // Output: 01:15
// console.log(formatTime(600));  // Output: 10:00
async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")&& !e.href.includes(".htaccess")) {
      // console.log(e.href);
      let folder = e.href.split("/").slice(-1)[0];
      // get the meta data of each folder
      // console.log(folder)
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();

      let cardContainer = document.querySelector(".cardContainer");

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `
       <div data-folder='${folder}' class="card">
              <div  class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="64"
                  height="64"
                  color="#000000"
                  fill="none"
                >
                  <!-- Circle with Green Fill and Border -->
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="#1fdf64"
                  />

                  <!-- Play Button Shape -->
                  <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <!-- <img src="img/logo.svg" class="invert" alt=""> -->
              <img
                
                src="/songs/${folder}/cover.jpeg"
                alt="Glory"
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>
      
      
      `;
    }
  }
  // load the library playlist when the card is clicked

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click",async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      // console.log(songs)
      playMusic(songs[0])
    });
  });
}
async function main() {
  // get the list of all sonngs
  await getSongs("songs/ncs");
  // currentSong.src = songs[0]
  playMusic(songs[0], true);
  // console.log(songs)

  // Display all the albums on the page
  displayAlbums();

  //Atach an event listner to play previous and next

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });
  // Time update event

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  //  add an event listner to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // add an event listner for  hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  // add an event listner to previous and next
  previous.addEventListener("click", () => {
    // console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    // console.log("next clicked")
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  // add an event to volume

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log(e.target.value)
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // add event listener to mute the track

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    // console.log(e.target)
    if (e.target.src.includes("img/volume.svg")) {
      e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
      currentSong.volume = 0;
      // change the seekbar progress
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      currentSong.volume = 0.1;
      e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}
main();
