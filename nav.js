// js/nav.js — hamburger menu open/close, shared by every page.
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("nav-menu");
  const scrim = document.getElementById("nav-scrim");
  if (!btn || !menu || !scrim) return;

  function toggle() {
    const isOpen = menu.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    scrim.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  function close() {
    menu.classList.remove("open");
    btn.classList.remove("open");
    scrim.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", toggle);
  scrim.addEventListener("click", close);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
});
