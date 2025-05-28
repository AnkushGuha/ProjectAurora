// Select DOM elements
const genreSelect = document.getElementById('genreSelect');
const playButton = document.getElementById('playButton');
const uploadSection = document.getElementById('uploadSection');
const uploadArea = document.getElementById('uploadArea');
const musicFileInput = document.getElementById('musicFileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadedFilesContainer = document.getElementById('uploadedFiles');
const filesList = document.getElementById('filesList');
const uploadProgress = document.getElementById('uploadProgress');
const progressFillUpload = document.getElementById('progressFillUpload');
const uploadStatus = document.getElementById('uploadStatus');

const currentGenreSpan = document.getElementById('currentGenre');
const genreDescriptionText = document.getElementById('genreDescriptionText');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const albumArt = document.getElementById('albumArt');

const prevBtn = document.getElementById('prevBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');

const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeElem = document.getElementById('currentTime');
const totalTimeElem = document.getElementById('totalTime');

const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');

// Predefined genres info
const genres = {
  pop: {
    name: 'Pop Vibes',
    description: 'Feel the energetic beats and catchy tunes of Pop music.',
    audioElement: document.getElementById('popMusic'),
    emoji: '🎤',
    artist: 'Various Artists',
  },
  rock: {
    name: 'Rock Anthem',
    description: 'Powerful guitars and drums that electrify the soul.',
    audioElement: document.getElementById('rockMusic'),
    emoji: '🎸',
    artist: 'Various Artists',
  },
  country: {
    name: 'Country Roads',
    description: 'Warm and heartfelt stories from the countryside.',
    audioElement: document.getElementById('countryMusic'),
    emoji: '🤠',
    artist: 'Various Artists',
  },
  jazz: {
    name: 'Jazz Nights',
    description: 'Smooth and sophisticated jazz tunes for relaxed nights.',
    audioElement: document.getElementById('jazzMusic'),
    emoji: '🎷',
    artist: 'Various Artists',
  },
  electronic: {
    name: 'Electronic Pulse',
    description: 'Pulsating beats and futuristic sounds of electronic music.',
    audioElement: document.getElementById('electronicMusic'),
    emoji: '🎧',
    artist: 'Various Artists',
  },
};

let currentGenre = '';
let isPlaying = false;
let currentTrackIndex = 0;
let customTracks = []; // Array of {file, url, name, artist (optional)}

let audio = null; // currently playing audio element or Audio instance

// Helper: Format seconds to mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Update genre description and UI
function updateGenreInfo(genreKey) {
  if (genreKey === 'custom') {
    genreDescriptionText.textContent =
      'Play your uploaded custom music tracks here.';
    albumArt.textContent = '🎵';
    trackTitle.textContent = 'Select a custom track to start';
    trackArtist.textContent = 'You';
    currentGenreSpan.textContent = 'Custom Music';
    uploadSection.style.display = 'block';
  } else if (genres[genreKey]) {
    const genre = genres[genreKey];
    genreDescriptionText.textContent = genre.description;
    albumArt.textContent = genre.emoji;
    trackTitle.textContent = genre.name;
    trackArtist.textContent = genre.artist;
    currentGenreSpan.textContent = genre.name;
    uploadSection.style.display = 'none';
  } else {
    genreDescriptionText.textContent = 'Select a genre to see its description';
    albumArt.textContent = '🌅';
    trackTitle.textContent = 'Select a genre to start';
    trackArtist.textContent = 'Aurora AI';
    currentGenreSpan.textContent = '-';
    uploadSection.style.display = 'none';
  }
}

// Stop currently playing audio and cleanup
function stopAudio() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.removeEventListener('timeupdate', onTimeUpdate);
    audio.removeEventListener('ended', onTrackEnded);
    audio = null;
  }
  isPlaying = false;
  playPauseBtn.textContent = '▶️';
  progressFill.style.width = '0%';
  currentTimeElem.textContent = '0:00';
  totalTimeElem.textContent = '0:00';
}

// Load and play audio for a genre or custom track
function loadAndPlayAudio(genreKey, trackIndex = 0) {
  stopAudio();

  if (genreKey === 'custom') {
    if (customTracks.length === 0) {
      alert('No custom tracks uploaded yet.');
      return;
    }
    if (trackIndex < 0 || trackIndex >= customTracks.length) {
      trackIndex = 0;
    }
    currentTrackIndex = trackIndex;
    const track = customTracks[trackIndex];

    audio = new Audio(track.url);
    trackTitle.textContent = track.name;
    trackArtist.textContent = 'You';
    albumArt.textContent = '🎵';

    audio.volume = volumeSlider.value / 100;
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onTrackEnded);

    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
    currentGenre = 'custom';
    currentGenreSpan.textContent = 'Custom Music';
    uploadSection.style.display = 'block';
  } else if (genres[genreKey]) {
    currentGenre = genreKey;
    const genre = genres[genreKey];
    audio = genre.audioElement;
    audio.volume = volumeSlider.value / 100;
    audio.currentTime = 0;
    audio.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
    trackTitle.textContent = genre.name;
    trackArtist.textContent = genre.artist;
    albumArt.textContent = genre.emoji;
    currentGenreSpan.textContent = genre.name;
    uploadSection.style.display = 'none';

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onTrackEnded);
  } else {
    alert('Select a valid genre first.');
  }
}

// Play/Pause toggle
function togglePlayPause() {
  if (!audio) {
    alert('Select a genre and play music first.');
    return;
  }

  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = '▶️';
  } else {
    audio.play();
    playPauseBtn.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
}

// On time update: update progress bar and times
function onTimeUpdate() {
  if (!audio) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = progressPercent + '%';

  currentTimeElem.textContent = formatTime(audio.currentTime);
  totalTimeElem.textContent = formatTime(audio.duration);
}

// On progress bar click: seek audio
function onProgressBarClick(e) {
  if (!audio) return;
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
}

// On track ended: auto-play next track if custom, else stop
function onTrackEnded() {
  if (currentGenre === 'custom') {
    if (currentTrackIndex + 1 < customTracks.length) {
      currentTrackIndex++;
      loadAndPlayAudio('custom', currentTrackIndex);
    } else {
      stopAudio();
    }
  } else {
    stopAudio();
  }
}

// Volume change
function onVolumeChange() {
  if (audio) {
    audio.volume = volumeSlider.value / 100;
  }
  volumeValue.textContent = volumeSlider.value + '%';
}

// Genre select change
genreSelect.addEventListener('change', (e) => {
  const selected = e.target.value;
  currentGenre = selected;
  updateGenreInfo(selected);
  stopAudio();
});

// Play button click
playButton.addEventListener('click', () => {
  if (!currentGenre) {
    alert('Please select a genre first.');
    return;
  }
  if (!isPlaying) {
    loadAndPlayAudio(currentGenre, currentTrackIndex);
  } else {
    togglePlayPause();
  }
});

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
  togglePlayPause();
});

// Prev button (only works for custom tracks)
prevBtn.addEventListener('click', () => {
  if (currentGenre === 'custom' && customTracks.length > 0) {
    currentTrackIndex = (currentTrackIndex - 1 + customTracks.length) % customTracks.length;
    loadAndPlayAudio('custom', currentTrackIndex);
  }
});

// Next button (only works for custom tracks)
nextBtn.addEventListener('click', () => {
  if (currentGenre === 'custom' && customTracks.length > 0) {
    currentTrackIndex = (currentTrackIndex + 1) % customTracks.length;
    loadAndPlayAudio('custom', currentTrackIndex);
  }
});

// Progress bar click
progressBar.addEventListener('click', onProgressBarClick);

// Volume slider
volumeSlider.addEventListener('input', onVolumeChange);

// Upload area drag & drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = '#00bfff33';
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = 'transparent';
  const files = e.dataTransfer.files;
  handleFiles(files);
});

// Browse button click triggers file input
browseBtn.addEventListener('click', () => {
  musicFileInput.click();
});

// File input change
musicFileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  handleFiles(files);
});

// Handle uploaded files
function handleFiles(files) {
  if (files.length === 0) return;
  uploadProgress.style.display = 'block';
  progressFillUpload.style.width = '0%';
  uploadStatus.textContent = 'Uploading...';

  // Simulate upload progress (no real server upload)
  let uploaded = 0;
  const total = files.length;

  // We'll just add the files to the customTracks array and create object URLs
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('audio/')) {
      alert(`File "${file.name}" is not an audio file.`);
      continue;
    }
    const url = URL.createObjectURL(file);
    customTracks.push({
      file,
      url,
      name: file.name,
    });
  }

  // Update UI after "upload"
  setTimeout(() => {
    uploadProgress.style.display = 'none';
    updateUploadedFilesList();
  }, 700);

  // Update progress bar animation
  const progressInterval = setInterval(() => {
    uploaded += 0.05;
    if (uploaded >= total) {
      uploaded = total;
      clearInterval(progressInterval);
    }
    const percent = (uploaded / total) * 100;
    progressFillUpload.style.width = percent + '%';
  }, 50);
}

// Update uploaded files list UI
function updateUploadedFilesList() {
  if (customTracks.length === 0) {
    uploadedFilesContainer.style.display = 'none';
    return;
  }
  uploadedFilesContainer.style.display = 'block';
  filesList.innerHTML = '';
  customTracks.forEach((track, index) => {
    const div = document.createElement('div');
    div.textContent = track.name;
    div.title = track.name;
    div.addEventListener('click', () => {
      currentTrackIndex = index;
      loadAndPlayAudio('custom', index);
    });
    filesList.appendChild(div);
  });
}

// Initial UI update
updateGenreInfo('');
volumeValue.textContent = volumeSlider.value + '%';
