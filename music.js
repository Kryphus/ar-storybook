// ========================================
// Shared Music Controller
// Syncs playback position across pages via localStorage
// ========================================

const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.4;
let isPlaying = false;

function startMusic() {
  // Resume from saved position if available
  const savedTime = localStorage.getItem('bgm-time');
  if (savedTime && Math.abs(bgMusic.currentTime - parseFloat(savedTime)) > 1) {
    bgMusic.currentTime = parseFloat(savedTime);
  }
  bgMusic.play();
  musicToggle.classList.add('playing');
  isPlaying = true;
  localStorage.setItem('bgm-playing', 'true');
}

function stopMusic() {
  bgMusic.pause();
  musicToggle.classList.remove('playing');
  isPlaying = false;
  localStorage.setItem('bgm-playing', 'false');
}

// Continuously save playback position
bgMusic.addEventListener('timeupdate', () => {
  localStorage.setItem('bgm-time', bgMusic.currentTime);
});

// Save position before leaving the page
window.addEventListener('beforeunload', () => {
  localStorage.setItem('bgm-time', bgMusic.currentTime);
  localStorage.setItem('bgm-playing', isPlaying ? 'true' : 'false');
});

// On load: check if music was playing on the previous page
const wasPlaying = localStorage.getItem('bgm-playing');

if (wasPlaying === 'true') {
  // Music was playing — resume from saved position
  const savedTime = localStorage.getItem('bgm-time');
  if (savedTime) {
    bgMusic.currentTime = parseFloat(savedTime);
  }
  bgMusic.play().then(() => {
    musicToggle.classList.add('playing');
    isPlaying = true;
  }).catch(() => {
    // Autoplay blocked — play on first interaction
    function playOnInteraction() {
      startMusic();
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
    }
    document.addEventListener('click', playOnInteraction, { once: false });
    document.addEventListener('touchstart', playOnInteraction, { once: false });
  });
} else if (wasPlaying === null) {
  // First visit ever — try autoplay, fallback to first interaction
  bgMusic.play().then(() => {
    musicToggle.classList.add('playing');
    isPlaying = true;
    localStorage.setItem('bgm-playing', 'true');
  }).catch(() => {
    function playOnInteraction() {
      startMusic();
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('touchstart', playOnInteraction);
    }
    document.addEventListener('click', playOnInteraction, { once: false });
    document.addEventListener('touchstart', playOnInteraction, { once: false });
  });
}
// If wasPlaying === 'false', user explicitly paused — respect that

// Toggle button
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (isPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
});
