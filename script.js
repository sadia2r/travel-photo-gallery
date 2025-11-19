let photos = [];
let activeFilter = "all";

const gallery = document.getElementById("gallery");
const filters = document.querySelectorAll(".filter");

// Lightbox vars
let currentIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxClose = document.getElementById("lightbox-close");
const backdrop = document.querySelector(".lightbox-backdrop");

// Swipe vars
let startX = 0;
let endX = 0;

// Fetch photos.json
fetch("photos.json")
  .then((res) => res.json())
  .then((data) => {
    photos = data;
    renderGallery(photos);
  });

// ----------------------------
// Render Gallery
// ----------------------------
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach((photo) => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");

    item.innerHTML = `
      <img src="${photo.image}" alt="${photo.title}">
      <div class="caption">${photo.title}</div>
    `;

    gallery.appendChild(item);

    // CLICK TO OPEN LIGHTBOX
    item.addEventListener("click", () => {
      openLightbox(photo);
    });

    // Blur-up Lazy Loading
    const img = item.querySelector("img");
    img.onload = () => img.classList.add("loaded");

    setTimeout(() => item.classList.add("loaded"), 10);
  });
}

// ----------------------------
// Filters
// ----------------------------
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");

    activeFilter = btn.dataset.filter;

    if (activeFilter === "all") {
      renderGallery(photos);
    } else {
      const filtered = photos.filter((p) => p.tags.includes(activeFilter));
      renderGallery(filtered);
    }
  });
});

// ----------------------------
// Lightbox Functions
// ----------------------------
function openLightbox(photo) {
  lightboxImg.src = photo.image;
  lightboxTitle.textContent = photo.title;
  lightbox.classList.remove("hidden");

  currentIndex = photos.indexOf(photo);
}

function closeLightbox() {
  lightbox.classList.add("hidden");
}

lightboxClose.addEventListener("click", closeLightbox);
backdrop.addEventListener("click", closeLightbox);

// ----------------------------
// Keyboard Navigation
// ----------------------------
document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("hidden")) return;

  if (e.key === "ArrowRight") showNext();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "Escape") closeLightbox();
});

// ----------------------------
// Lightbox Navigation Functions
// ----------------------------
function showNext() {
  currentIndex = (currentIndex + 1) % photos.length;
  openLightbox(photos[currentIndex]);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  openLightbox(photos[currentIndex]);
}

// ----------------------------
// Swipe Support
// ----------------------------
lightboxImg.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightboxImg.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const diff = endX - startX;

  if (Math.abs(diff) > 50) {
    if (diff < 0) {
      showNext(); // swipe left → next
    } else {
      showPrev(); // swipe right → previous
    }
  }
}

// ----------------------------
// Arrow Buttons (Left/Right)
// ----------------------------
const leftArrow = document.createElement("button");
leftArrow.classList.add("lightbox-arrow", "left-arrow");
leftArrow.innerHTML = "&#10094;";
leftArrow.onclick = showPrev;

const rightArrow = document.createElement("button");
rightArrow.classList.add("lightbox-arrow", "right-arrow");
rightArrow.innerHTML = "&#10095;";
rightArrow.onclick = showNext;

document.querySelector(".lightbox-content").appendChild(leftArrow);
document.querySelector(".lightbox-content").appendChild(rightArrow);
