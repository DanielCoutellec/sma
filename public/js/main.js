document.addEventListener("DOMContentLoaded", () => {
  // ===== MENU MOBILE =====
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mainNav.classList.remove("open"));
    });
  }

  // ===== LIGHTBOX (toutes les images) =====
  const selector = ".site-main img, .site-header img, .site-footer img";
  const imgs = Array.from(document.querySelectorAll(selector));

  // On évite les petites icônes si tu veux (ex: logo) -> commente/décommente
  // const imgs = Array.from(document.querySelectorAll(".site-main img"));

  // crée la lightbox une seule fois
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <div class="lightbox__backdrop" data-close="1"></div>
    <figure class="lightbox__panel" role="dialog" aria-modal="true">
      <button class="lightbox__close" type="button" aria-label="Fermer" data-close="1">✕</button>
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector(".lightbox__img");
  const lbCap = lb.querySelector(".lightbox__caption");

  function openLightbox(imgEl) {
    lbImg.src = imgEl.currentSrc || imgEl.src;
    lbImg.alt = imgEl.alt || "Image";
    lbCap.textContent = imgEl.alt || "";
    lb.classList.add("open");
    document.documentElement.classList.add("no-scroll");
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.documentElement.classList.remove("no-scroll");
    lbImg.src = ""; // libère
  }

  // bind images
  imgs.forEach((img) => {
    // ignore si pas de src
    if (!img.getAttribute("src")) return;

    img.classList.add("zoomable");
    img.style.cursor = "zoom-in";

    img.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(img);
    });
  });

  // close handlers
  lb.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-close") === "1") closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox();
  });

  // ===== SIMULATION FORMULAIRE CONTACT =====
  const contactForm = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  if (contactForm && feedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      feedback.textContent = "Merci, votre message a bien été pris en compte (simulation).";
      contactForm.reset();
    });
  }
});
