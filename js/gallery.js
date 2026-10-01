/* Gallery filtering and lightbox. */
(function () {
  const figs = [...document.querySelectorAll("#gallery figure")];
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lb-img");
  const cap = document.getElementById("lb-cap");
  let idx = 0, lastFocus = null;

  document.getElementById("gallery-filter").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    b.parentElement.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    figs.forEach((f) => { f.hidden = b.dataset.filter !== "all" && f.dataset.cat !== b.dataset.filter; });
  });

  const visible = () => figs.filter((f) => !f.hidden);
  function show(i) {
    const list = visible();
    idx = (i + list.length) % list.length;
    const f = list[idx], src = f.querySelector("img");
    img.src = src.src; img.alt = src.alt;
    cap.textContent = f.querySelector("figcaption").firstChild.textContent;
  }
  function open(f) {
    lastFocus = document.activeElement;
    show(visible().indexOf(f));
    lb.classList.add("open");
    lb.querySelector(".lb-close").focus();
  }
  function close() { lb.classList.remove("open"); if (lastFocus) lastFocus.focus(); }

  figs.forEach((f) => {
    f.tabIndex = 0;
    f.setAttribute("role", "button");
    f.addEventListener("click", () => open(f));
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(f); } });
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();
