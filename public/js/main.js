document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MENU MOBILE
  // =========================
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // =========================
  // SLIDER HERO ACCUEIL
  // =========================
  const heroSlider = document.getElementById("heroSlider");
  const heroPrev = document.querySelector(".hero-slider-btn-prev");
  const heroNext = document.querySelector(".hero-slider-btn-next");

  if (heroSlider && heroPrev && heroNext) {
    const getHeroStep = () => {
      const slide = heroSlider.querySelector(".hero-slide");
      if (!slide) return heroSlider.clientWidth;

      const sliderStyle = window.getComputedStyle(heroSlider);
      const gap = parseFloat(sliderStyle.gap || "12") || 12;

      return slide.getBoundingClientRect().width + gap;
    };

    heroPrev.addEventListener("click", (e) => {
      e.preventDefault();
      heroSlider.scrollBy({
        left: -getHeroStep(),
        behavior: "smooth"
      });
    });

    heroNext.addEventListener("click", (e) => {
      e.preventDefault();
      heroSlider.scrollBy({
        left: getHeroStep(),
        behavior: "smooth"
      });
    });
  }

  // =========================
  // SLIDER TROMBINOSCOPE
  // =========================
  const teamSlider = document.getElementById("teamSlider");
  const prevBtnSlider = document.querySelector(".slider-btn-prev");
  const nextBtnSlider = document.querySelector(".slider-btn-next");

  if (teamSlider && prevBtnSlider && nextBtnSlider) {
    const getTeamStep = () => {
      const card = teamSlider.querySelector(".person-card");
      if (!card) return 300;

      const sliderStyle = window.getComputedStyle(teamSlider);
      const gap = parseFloat(sliderStyle.gap || "18") || 18;

      return card.getBoundingClientRect().width + gap;
    };

    prevBtnSlider.addEventListener("click", (e) => {
      e.preventDefault();
      teamSlider.scrollBy({
        left: -getTeamStep(),
        behavior: "smooth"
      });
    });

    nextBtnSlider.addEventListener("click", (e) => {
      e.preventDefault();
      teamSlider.scrollBy({
        left: getTeamStep(),
        behavior: "smooth"
      });
    });
  }

  // =========================
  // LIGHTBOX / ZOOM
  // =========================
  const images = [...document.querySelectorAll(".zoomable")];
  if (!images.length) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";

  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <button class="lightbox_nav lightbox_prev" type="button" aria-label="Photo précédente">&#10094;</button>
    <button class="lightbox_nav lightbox_next" type="button" aria-label="Photo suivante">&#10095;</button>
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
  const panel = lightbox.querySelector(".lightbox__panel");

  function showImage(index) {
    currentIndex = index;
    const el = images[currentIndex];

    img.src = el.currentSrc || el.src;
    img.alt = el.alt || "";
    caption.textContent = el.dataset.caption || el.alt || "";

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
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showImage(index);
    });
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  });

  backdrop.addEventListener("click", closeLightbox);

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    prevImage();
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nextImage();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  });

  // Swipe mobile
  panel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  panel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;

    if (Math.abs(delta) < 40) return;

    if (delta < 0) {
      nextImage();
    } else {
      prevImage();
    }
  }, { passive: true });