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
  ["Ashley Walters", "Adolescence", 1],
  ["Seth Rogen", "The Studio", 2],
  ["Peter Huyck", "The Studio", 1],
  ["Evan Goldberg and Chase Sui Wonders", "The Studio", 2],
  ["Stephen Graham", "Adolescence", 1],
  ["Joe Alwyn", "Hamnet", 1],
]; // ГЛАВНЫЙ МАССИВ

const basicLink = "https://shoneal.github.io/vulture/images/polaroids/"; // Главная ссылка
const header = document.querySelector(".page-header");
const paragraph = document.querySelector(".body .paragraph");
const stage = document.querySelector(".image-zoom-stage");
const overlay = stage.querySelector(".image-zoom-overlay");
const container = stage.querySelector(".image-zoom-container");
const containerImage = container.querySelector(".image-zoom-image");

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

  header.querySelector(".logo").addEventListener("click", () => {
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

const setupImageWithContainer = (img) => {
  const onLoadOrError = () => {
    img.style.opacity = "1";
  };

  if (img.complete) {
    onLoadOrError();
  } else {
    img.addEventListener("load", onLoadOrError, { once: true });
    img.addEventListener("error", onLoadOrError, { once: true });
  }
}; // Функция для настройки прозрачности изображения

polaroids.reverse().forEach(([name, title, count]) => {
  const div = document.createElement("div");
  div.className = `nym-image${count === 1 ? " nym-image-collection" : ""}`;

  const container = document.createElement("div");
  container.className =
    count === 1 ? "image-container" : "image-collection-container";

  for (let i = 1; i <= count; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    const img = document.createElement("img");

    const suffix = i > 1 ? `-${i}` : "";
    const mobileUrl = `${basicLink}mobile/${formatName(name)}${suffix}.webp`;
    const desktopUrl = `${basicLink}desktop/${formatName(name)}${suffix}.webp`;
    img.style.opacity = "0";
    img.src = desktopUrl;
    img.srcset = `${mobileUrl} 768w, ${desktopUrl} 2600w`;
    img.sizes = "100vw";
    setupImageWithContainer(img);

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

function handleImageClick(e) {
  const wrapper = e.target.closest(".image-wrapper");
  const img = wrapper.querySelector("img");

  const { top, left, width, height } = wrapper.getBoundingClientRect();
  Object.assign(container.style, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    transform: "scale(1) translate(0,0)",
  });
  containerImage.src = img.src;

  img.style.opacity = "0";
  overlay.classList.add("forward");
  container.classList.add("forward");
  header.style.transform = "translateY(-196px)";

  const scale =
    window.innerWidth > 1180
      ? (window.innerHeight * 0.95) / height
      : (window.innerWidth * 0.95) / width;

  const stageRect = overlay.getBoundingClientRect();
  const tx = (stageRect.left + stageRect.width / 2 - left - width / 2) / scale;
  const ty = (stageRect.top + stageRect.height / 2 - top - height / 2) / scale;

  container.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`;
} // Функция для обработки клика по изображению
function reset() {
  overlay.classList.remove("forward");
  container.style.transform = "scale(1) translate(0,0)";
  header.style.transform = "";

  setTimeout(() => {
    container.classList.remove("forward");
    containerImage.src = "";
    const activeImg = document.querySelector(
      '.image-wrapper img[style*="opacity: 0"]',
    );
    if (activeImg) activeImg.style.opacity = "1";
  }, 300);
} // Функция для сброса состояния увеличенного изображения
document
  .querySelectorAll(".image-wrapper")
  .forEach((el) => el.addEventListener("click", handleImageClick));
stage.addEventListener("click", reset);
window.addEventListener("scroll", reset);
