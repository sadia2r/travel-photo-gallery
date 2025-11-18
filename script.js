fetch("photos.json")
  .then((res) => res.json())
  .then((data) => renderGallery(data));

const gallery = document.getElementById("gallery");
const filters = document.querySelectorAll(".filter");

// Render images
function renderGallery(items) {
  gallery.innerHTML = "";
  items.forEach((photo) => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");
    item.dataset.category = photo.category;

    item.innerHTML = `
      <img src="${photo.image}" alt="${photo.title}">
      <div class="caption">
        <h3>${photo.title}</h3>
        <p>${photo.location}</p>
      </div>
    `;

    item.onclick = () => openLightbox(photo);
    gallery.appendChild(item);
  });
}

// Filters
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    const items = document.querySelectorAll(".gallery-item");
    items.forEach((item) => {
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Lightbox
function openLightbox(photo) {
  document.getElementById("lightbox-img").src = photo.image;
  document.getElementById("lightbox-title").textContent = photo.title;
  document.getElementById("lightbox-location").textContent = photo.location;
  document.getElementById("lightbox").classList.remove("hidden");
}

document.getElementById("lightbox-close").onclick = () => {
  document.getElementById("lightbox").classList.add("hidden");
};
