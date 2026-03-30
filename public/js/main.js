document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  const images = [...document.querySelectorAll(".zoomable")];
  if (!images.length) return;

  let currentIndex = 0;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";

  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <button class="lightbox__nav lightbox__prev" type="button" aria-label="Photo précédente">&#10094;</button>
    <button class="lightbox__nav lightbox__next" type="button" aria-label="Photo suivante">&#10095;</button>
    <div class="lightbox__panel">
      <button class="lightbox__close" type="button" aria-label="Fermer">✕</button>
      <img class="lightbox__img" alt="">
      <p class="lightbox__caption"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  const img = lightbox.querySelector(".lightbox__img");
  const caption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__prev");
  const nextBtn = lightbox.querySelector(".lightbox__next");
  const backdrop = lightbox.querySelector(".lightbox__backdrop");

  function showImage(index) {
    currentIndex = index;
    const el = images[index];
    img.src = el.getAttribute("src");
    img.alt = el.alt || "";
    caption.textContent = el.dataset.caption || "";
    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  images.forEach((el, index) => {
    el.addEventListener("click", () => showImage(index));
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prevImage();
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nextImage();
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  backdrop.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  });
});