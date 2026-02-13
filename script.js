// Chattanooga Adventures – entrance animations
document.addEventListener("DOMContentLoaded", function () {
  const hero = document.querySelector(".hero");
  const title = document.querySelector(".hero__title");
  const subtitle = document.querySelector(".hero__subtitle");
  const comingSoon = document.querySelector(".hero__coming-soon");

  if (!hero) return;

  // Staggered word-style reveal: split title into words and animate each
  if (title) {
    const text = title.textContent;
    const words = text.split(/\s+/);
    title.innerHTML = words
      .map(
        (word, i) =>
          `<span class="hero__word" style="animation-delay: ${0.15 * i}s">${word}</span>`
      )
      .join(" ");
  }
});
