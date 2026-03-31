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
    let autoSlide = null;

    const getHeroScrollAmount = () => {
      const slide = heroSlider.querySelector(".hero-slide");
      return slide ? slide.getBoundingClientRect().width + 10 : heroSlider.clientWidth;
    };

    const nextHeroSlide = () => {
      const amount = getHeroScrollAmount();
      const maxScrollLeft = heroSlider.scrollWidth - heroSlider.clientWidth;

      if (heroSlider.scrollLeft >= maxScrollLeft - 5) {
        heroSlider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        heroSlider.scrollBy({ left: amount, behavior: "smooth" });
      }
    };

    const prevHeroSlide = () => {
      const amount = getHeroScrollAmount();
      const maxScrollLeft = heroSlider.scrollWidth - heroSlider.clientWidth;

      if (heroSlider.scrollLeft <= 5) {
        heroSlider.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      } else {
        heroSlider.scrollBy({ left: -amount, behavior: "smooth" });
      }
    };

    function startAutoSlide() {
      stopAutoSlide();
      autoSlide = setInterval(nextHeroSlide, 3500);
    }

    function stopAutoSlide() {
      if (autoSlide) {
        clearInterval(autoSlide);
        autoSlide = null;
      }
    }

    heroPrev.addEventListener("click", () => {
      prevHeroSlide();
      startAutoSlide();
    });

    heroNext.addEventListener("click", () => {
      nextHeroSlide();
      startAutoSlide();
    });

    heroSlider.addEventListener("mouseenter", stopAutoSlide);
    heroSlider.addEventListener("mouseleave", startAutoSlide);
    heroSlider.addEventListener("touchstart", stopAutoSlide, { passive: true });
    heroSlider.addEventListener("touchend", startAutoSlide);

    startAutoSlide();
  }

  // =========================
  // SLIDER TROMBINOSCOPE
  // =========================
  const teamSlider = document.getElementById("teamSlider");
  const prevBtnSlider = document.querySelector(".slider-btn-prev");
  const nextBtnSlider = document.querySelector(".slider-btn-next");

  if (teamSlider && prevBtnSlider && nextBtnSlider) {
    const getScrollAmount = () => {
      const card = teamSlider.querySelector(".person-card");
      return card ? card.getBoundingClientRect().width + 18 : 300;
    };

    prevBtnSlider.addEventListener("click", () => {
      teamSlider.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth"
      });
    });

    nextBtnSlider.addEventListener("click", () => {
      teamSlider.scrollBy({
        left: getScrollAmount(),
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

  function showImage(index) {
    currentIndex = index;
    const el = images[index];
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

  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prevImage();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nextImage();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  });
});