const polaroids = [
  ["Jessie Buckley and Paul Mescal", "Hamnet", 2],
  ["Rose Byrne", "If I Had Legs I’d Kick You", 1],
  ["Teyana Taylor", "One Battle After Another", 4],
  ["Stellan Skarsgård", "Sentimental Value", 1],
  ["Owen Cooper", "Adolescence", 1],
  ["Noah Wyle", "The Pitt", 2],
  ["Amy Poehler", "Good Hang With Amy Poehler", 1],
  ["Wagner Moura", "The Secret Agent", 1],
  ["Rhea Seehorn", "Pluribus", 2],
  ["Paul Thomas Anderson", "One Battle After Another", 1],
  ["Chase Infiniti", "One Battle After Another", 4],
  ["Ashley Walter", "Adolescence", 1],
  ["Seth Rogen", "The Studio", 2],
  ["Peter Huyck", "The Studio", 1],
  ["Evan Goldberg and Chase Sui Wonders", "The Studio", 2],
  ["Stephen Graham", "Adolescence", 1],
  ["Joe Alwyn", "Hamnet", 1],
]; // ГЛАВНЫЙ МАССИВ

const basicLink = "https://shoneal.github.io/vulture/images/polaroids/"; // Главная ссылка
const paragraph = document.querySelector(".body .paragraph");

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark")
    document.body.classList.add("dark-theme"); // Смена темы

  const updateHeader = () => {
    const isSmallScreen = window.innerWidth <= 1179;
    const isScrolled = window.scrollY > 0;
    document
      .querySelector(".page-header")
      .classList.toggle("page-sticky-header", isSmallScreen || isScrolled);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader);
  window.addEventListener("resize", updateHeader);
  // Липкий header

  document.querySelector(".page-header .logo").addEventListener("click", () => {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  }); // Скролл наверх страницы
});

const formatName = (name) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/gi, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-"); // Функция для преобразования имени в URL‑формат

polaroids.forEach(([name, title, count]) => {
  const div = document.createElement("div");
  div.className = count === 1 ? "nym-image" : "nym-image-collection";

  const container = document.createElement("div");
  container.className =
    count === 1 ? "image-container" : "image-collection-container";

  for (let i = 1; i <= count; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    const img = document.createElement("img");

    const suffix = i > 1 ? `-${i}` : "";
    img.src = `${basicLink}mobile/${formatName(name)}${suffix}.webp`;

    wrapper.appendChild(img);
    container.appendChild(wrapper);
  }

  div.appendChild(container);

  const caption = document.createElement("div");
  caption.className = "nym-image-figcaption";
  caption.innerHTML = `${name}, <em>${title}</em>`;
  div.appendChild(caption);

  paragraph.parentElement.insertBefore(div, paragraph.nextSibling);
});
