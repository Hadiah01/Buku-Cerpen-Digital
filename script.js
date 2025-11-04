const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");
const flipSound = document.getElementById("flipSound");
const bgMusic = document.getElementById("bgMusic");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const pageSearch = document.getElementById("pageSearch");
const pageInput = document.getElementById("pageInput");
const goPage = document.getElementById("goPage");

let current = 0;
let startX = 0;
let endX = 0;
let musicStarted = false;

// === fungsi lama ===
function showPage(index) {
  pages.forEach((page, i) => {
    page.style.zIndex = pages.length - i;
    if (i < index) page.classList.add("flipped");
    else page.classList.remove("flipped");
  });
  if (index === pages.length - 1) fadeOutMusic();
  else fadeInMusic();
}
function playFlipSound() {
  flipSound.currentTime = 0;
  flipSound.play().catch(()=>{});
}
book.addEventListener("touchstart", e => startX = e.touches[0].clientX);
book.addEventListener("touchend", e => { endX = e.changedTouches[0].clientX; handleSwipe(); });
function handleSwipe() {
  const diff = endX - startX;
  if (Math.abs(diff) > 50) {
    if (diff < 0 && current < pages.length - 1) { current++; playFlipSound(); }
    else if (diff > 0 && current > 0) { current--; playFlipSound(); }
    showPage(current);
  }
}
function fadeOutMusic() {
  if (!musicStarted) return;
  let vol = bgMusic.volume;
  const fade = setInterval(() => {
    if (vol > 0.01) { vol -= 0.02; bgMusic.volume = vol; }
    else { bgMusic.volume = 0; clearInterval(fade); }
  }, 100);
}
function fadeInMusic() {
  if (!musicStarted) return;
  let vol = bgMusic.volume;
  const raise = setInterval(() => {
    if (vol < 0.4) { vol += 0.02; bgMusic.volume = vol; }
    else { bgMusic.volume = 0.4; clearInterval(raise); }
  }, 100);
}
bgMusic.volume = 0.4;
showPage(current);

// === musik aktif saat tap 2x ===
let lastTap = 0;
document.addEventListener("touchend", () => {
  const now = Date.now();
  if (now - lastTap < 300 && !musicStarted) {
    bgMusic.play().then(() => {
      musicStarted = true;
      bgMusic.volume = 0.4;
    });
  }
  lastTap = now;
});

// === Panduan ===
helpBtn.addEventListener("click", () => {
  helpPopup.classList.add("active");
});
closeHelp.addEventListener("click", () => {
  helpPopup.classList.remove("active");
});

// === Pencarian Halaman ===
goPage.addEventListener("click", () => {
  const num = parseInt(pageInput.value);
  if (!isNaN(num) && num >= 0 && num <= pages.length - 0) {
    current = num - 0;
    showPage(current);
    playFlipSound();
  }
});