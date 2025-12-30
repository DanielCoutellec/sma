document.addEventListener("DOMContentLoaded", () => {
  // année dans le footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // menu mobile
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }

  // scroll fluide boutons data-scroll
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetSelector = btn.getAttribute("data-scroll");
      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // faux envoi formulaire contact
  const contactForm = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  if (contactForm && feedback) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      feedback.textContent =
        "Merci, votre message a bien été pris en compte (simulation).";
      contactForm.reset();
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }
});
