// DOM Elements
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");




let index = 0; 
let isShuffle = false; 

// Song list
const songsList = [
  {
    name: "Numb",
    link: "numb.mp3",
    artist: "Linkin Park",
    image: "numb.jpg",
  },
  {
    name: "In the End",
    link: "end.mp3",
    artist: "Linkin Park",
    image: "intheend.jpg",
  },
  {
    name: "Crawling",
    link: "crawl.mp3",
    artist: "Linkin Park",
    image: "crawling.jpg",
  },
  {
    name: "What I've Done",
    link: "what.mp3",
    artist: "Linkin Park",
    image: "whativedone.jpg",
  },
  {
    name: "Breaking the Habit",
    link: "breaking.mp3",
    artist: "Linkin Park",
    image: "breakingthehabit.jpg",
  },
];

// Function to set a song based on index
const setSong = (index) => {
  const { name, link, artist, image } = songsList[index];

  audio.src = link;
  songName.textContent = name;
  songArtist.textContent = artist;
  songImage.src = image;

  // Update max duration when metadata is loaded
  audio.onloadedmetadata = () => {
    maxDuration.textContent = formatTime(audio.duration);
  };
};

// Play audio
const playAudio = () => {
  audio.play();
  playButton.classList.add("hide");
  pauseButton.classList.remove("hide");
};

// Pause audio
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// Format time in mm:ss format
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

// Update progress bar and time display
const updateProgress = () => {
  const { currentTime, duration } = audio;
  const progressPercent = (currentTime / duration) * 100;

  currentProgress.style.width = `${progressPercent}%`;
  currentTimeRef.textContent = formatTime(currentTime);
};

// Event listeners

// Play button click
playButton.addEventListener("click", playAudio);

// Pause button click
pauseButton.addEventListener("click", pauseAudio);

// Next button click
nextButton.addEventListener("click", () => {
  index = isShuffle ? getRandomIndex() : (index + 1) % songsList.length;
  setSong(index);
  playAudio();
});

// Previous button click
prevButton.addEventListener("click", () => {
  index = index > 0 ? index - 1 : songsList.length - 1;
  setSong(index);
  playAudio();
});

// Repeat button click
repeatButton.addEventListener("click", () => {
  audio.loop = !audio.loop;
  repeatButton.classList.toggle("active");
});

// Shuffle button click
shuffleButton.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle("active");
});

// Progress bar click/touch event
progressBar.addEventListener("click", (event) => {
  const { offsetX } = event;
  const progressPercent = (offsetX / progressBar.clientWidth) * 100;
  audio.currentTime = (progressPercent / 100) * audio.duration;
  updateProgress();
  playAudio();
});

// Update time and progress
audio.addEventListener("timeupdate", updateProgress);

// Initial setup
window.onload = () => {
  setSong(index);
  updateProgress();
};

// Helper function to get a random index for shuffle mode
const getRandomIndex = () => {
  let randomIndex = Math.floor(Math.random() * songsList.length);
  while (randomIndex === index) {
    randomIndex = Math.floor(Math.random() * songsList.length);
  }
  return randomIndex;
};

// Initialize playlist
const initializePlaylist = () => {
  songsList.forEach((song, i) => {
    const playlistItem = document.createElement("li");
    playlistItem.classList.add("playlistSong");
    playlistItem.innerHTML = `
      <div class="playlist-image-container">
        <img src="${song.image}" />
      </div>
      <div class="playlist-song-details">
        <span id="playlist-song-name">${song.name}</span>
        <span id="playlist-song-artist-album">${song.artist}</span>
      </div>
    `;
    playlistItem.addEventListener("click", () => {
      index = i;
      setSong(index);
      playAudio();
    });
    playlistSongs.appendChild(playlistItem);
  });
};

// Display playlist
playlistButton.addEventListener("click", () => {
  playlistContainer.classList.toggle("hide");
});

// Hide playlist
closeButton.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

// Initialize playlist on window load
window.onload = () => {
  setSong(index);
  initializePlaylist();
};
