function showMessage() {
  alert("Thank you! The Co Work Capital team will contact you soon.");
}

document.addEventListener("DOMContentLoaded", () => {
  createScrollProgress();
  prepareMotionReveal();
  prepare3DTilt();
  prepareHeroParallax();
  prepareMagneticButtons();
});

function createScrollProgress() {
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  document.body.appendChild(bar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / height) * 100;
    bar.style.width = progress + "%";
  });
}

function prepareMotionReveal() {
  const items = document.querySelectorAll(
    ".hero-content, .section h2, .section p, .card, .price-card, .service-card, .contact"
  );

  items.forEach((item) => {
    item.classList.add("motion-reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 80);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function prepare3DTilt() {
  const tiltItems = document.querySelectorAll(".card, .price-card, .service-card");

  tiltItems.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 18;
      const rotateX = ((y / rect.height) - 0.5) * -18;

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);

      card.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.02)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    });
  });
}

function prepareHeroParallax() {
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");

  if (!hero || !heroContent) return;

  hero.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    heroContent.style.transform = `
      rotateX(${-y / 2}deg)
      rotateY(${x / 2}deg)
      translateZ(30px)
    `;
  });

  hero.addEventListener("mouseleave", () => {
    heroContent.style.transform = "rotateX(0) rotateY(0) translateZ(0)";
  });
}

function prepareMagneticButtons() {
  const buttons = document.querySelectorAll("button, .btn");

  buttons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.04)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0) scale(1)";
    });
  });
}