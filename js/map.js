/* Interactive facility map, drawn from the master-plan site layout (units = yards, 760 × 414). */
(function () {
  const $ = (id) => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const CATS = { all: "All", grounds: "Grounds", practice: "Practice", buildings: "Buildings & plaza", access: "Access & parking", utilities: "Utilities" };

  const groundInfo = (n) => ({
    cat: "grounds", title: `Ground ${n}`,
    desc: `65 yd straight × 70 yd square boundary, hybrid Bermuda outfield with a lighter-mown 30-yard circle. Two natural clay pitches and one astro pitch (east side), wheeled sight screens at both ends, and home & away dugouts with bleachers.${n >= 6 ? " Grounds 6 and 7 are overlooked by the clubhouse terrace." : ""}`,
    link: [`reservations.html?ground=${n}#book`, `Book Ground ${n}`],
  });
  const AREAS = {
    nets: { cat: "practice", title: "Covered Practice Nets", desc: "Six lanes back-to-back under a shade roof — each 60 × 12 ft and 12 ft high with astro carpet, LED lights for evening sessions and open run-ups at both ends.", link: ["features.html#nets", "Net details"] },
    clubhouse: { cat: "buildings", title: "Clubhouse", desc: "About 16,000 sq ft desert-modern clubhouse: dining and kitchen, shaded viewing terrace with misters, media room, two conference rooms, two team locker rooms with showers, and restrooms.", link: ["features.html#clubhouse", "Clubhouse details"] },
    storage: { cat: "buildings", title: "Team Storage", desc: "Two air-conditioned, shelved 40 ft containers beside the clubhouse for club kit, covers and rollers.", link: null },
    basin: { cat: "utilities", title: "Storm Basin", desc: "Every field, roof, road and parking surface drains here. Drywells empty it within 36 hours, with an overflow spillway for the biggest monsoon storms.", link: null },
    parking: { cat: "access", title: "Parking — 250 cars", desc: "About 2 acres of parking with accessible stalls closest to the clubhouse, shaded canopies and LED lighting.", link: null },
    plaza: { cat: "buildings", title: "Presentation Plaza", desc: "Open plaza with seating and a small raised stage with power — used for trophy presentations, opening ceremonies and community days.", link: ["reservations.html#book", "Hire the plaza"] },
    road: { cat: "access", title: "Access Road & Entrance", desc: "Entry from the south past the illuminated Sunstone monument sign; the inner road runs east–west along the facilities strip.", link: null },
    sign: { cat: "access", title: "Entrance Sign", desc: "Illuminated monument sign on a stone base at the main entrance.", link: null },
    landscape: { cat: "utilities", title: "Desert Landscape", desc: "Native desert landscaping, reserved for future expansion.", link: null },
    paths: { cat: "access", title: "Concrete Cart Paths", desc: "8 ft concrete paths in the 15-yard gaps between every ground — sized for golf carts and wheelchair access.", link: null },
  };

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  const svg = el("svg", { viewBox: "-6 -6 772 426", role: "img", "aria-label": "Sunstone Sports Arena site map" });
  el("rect", { x: 0, y: 0, width: 760, height: 414, fill: "#FAEEDA", stroke: "#BA7517" }, svg);
  el("rect", { x: 0, y: 318, width: 760, height: 96, fill: "#F4E4C8" }, svg);

  const hot = (id, info, parent) => {
    const g = el("g", { class: "hot", tabindex: 0, role: "button", "aria-label": info.title, "data-id": id, "data-cat": info.cat }, parent || svg);
    AREAS[id] = info;
    return g;
  };

  // paths (behind grounds)
  const paths = hot("paths", AREAS.paths);
  [[0, 156, 760, 6], [0, 318, 760, 6], [144.5, 0, 6, 318], [299.5, 0, 6, 318], [454.5, 0, 6, 318], [609.5, 0, 6, 318]]
    .forEach(([x, y, w, h]) => el("rect", { x, y, width: w, height: h, fill: "#fff", stroke: "#B4B2A9", "stroke-width": .5 }, paths));

  // grounds
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 5; col++) {
      const n = row * 5 + col + 1;
      const cx = 72.5 + col * 155, cy = row ? 240 : 78;
      const g = hot("g" + n, groundInfo(n));
      el("ellipse", { cx, cy, rx: 70, ry: 65, fill: "#3B6D11", stroke: "#fff", "stroke-width": 1.2 }, g);
      el("ellipse", { cx, cy, rx: 30, ry: 28, fill: "#4c8217", opacity: .8 }, g);
      [["#FAC775", -6], ["#FAC775", -2], ["#1D9E75", 2]].forEach(([c, dx]) =>
        el("rect", { x: cx + dx, y: cy - 15, width: 4, height: 30, fill: c, stroke: "#BA7517", "stroke-width": .3 }, g));
      el("rect", { x: cx - 7, y: cy - 63, width: 14, height: 3, fill: "#fff", stroke: "#444", "stroke-width": .5 }, g);
      el("rect", { x: cx - 7, y: cy + 60, width: 14, height: 3, fill: "#fff", stroke: "#444", "stroke-width": .5 }, g);
      el("rect", { x: cx - 68, y: cy + 46, width: 10, height: 3, fill: "#185FA5" }, g);
      el("rect", { x: cx - 68, y: cy + 51, width: 10, height: 3, fill: "#993C1D" }, g);
      const t = el("text", { x: cx, y: cy + 32, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: "#fff", "font-family": "Nunito Sans, sans-serif" }, g);
      t.textContent = "Ground " + n;
    }
  }

  // facilities strip
  const road = hot("road", AREAS.road);
  el("rect", { x: 50, y: 328, width: 710, height: 12, fill: "#B4B2A9" }, road);
  el("rect", { x: 216, y: 340, width: 10, height: 74, fill: "#B4B2A9" }, road);

  const nets = hot("nets", AREAS.nets);
  el("rect", { x: 10, y: 345, width: 30, height: 48, fill: "#E8E6E1" }, nets);
  el("rect", { x: 14, y: 349, width: 22, height: 40, fill: "#F1EFE8", stroke: "#888780", "stroke-width": .8 }, nets);
  [17, 24, 31].forEach((x) => { el("rect", { x, y: 352, width: 2, height: 16, fill: "#1D9E75" }, nets); el("rect", { x, y: 370, width: 2, height: 16, fill: "#1D9E75" }, nets); });

  const club = hot("clubhouse", AREAS.clubhouse);
  el("rect", { x: 70, y: 350, width: 60, height: 30, rx: 2, fill: "#D85A30" }, club);
  const ct = el("text", { x: 100, y: 368, "text-anchor": "middle", "font-size": 7, "font-weight": 800, fill: "#fff", "font-family": "Nunito Sans, sans-serif" }, club);
  ct.textContent = "CLUBHOUSE";

  const store = hot("storage", AREAS.storage);
  el("rect", { x: 72, y: 384, width: 14, height: 4, fill: "#5F5E5A" }, store);
  el("rect", { x: 90, y: 384, width: 14, height: 4, fill: "#5F5E5A" }, store);

  const basin = hot("basin", AREAS.basin);
  el("rect", { x: 140, y: 348, width: 66, height: 34, rx: 4, fill: "#B5D4F4", stroke: "#185FA5" }, basin);

  const park = hot("parking", AREAS.parking);
  el("rect", { x: 236, y: 346, width: 150, height: 62, fill: "#D3D1C7", stroke: "#888780", "stroke-width": .8 }, park);
  for (let x = 240; x < 384; x += 6) { el("line", { x1: x, y1: 346, x2: x, y2: 362, stroke: "#888780", "stroke-width": .6 }, park); el("line", { x1: x, y1: 392, x2: x, y2: 408, stroke: "#888780", "stroke-width": .6 }, park); }
  const pt = el("text", { x: 311, y: 381, "text-anchor": "middle", "font-size": 9, "font-weight": 800, fill: "#2C2C2A", "font-family": "Nunito Sans, sans-serif" }, park);
  pt.textContent = "P · 250 cars";

  const plaza = hot("plaza", AREAS.plaza);
  el("rect", { x: 400, y: 346, width: 160, height: 62, fill: "#EFE3CF", stroke: "#BA7517", "stroke-width": .8 }, plaza);
  el("rect", { x: 410, y: 362, width: 60, height: 12, fill: "#8C5A3C" }, plaza);
  el("rect", { x: 434, y: 352, width: 12, height: 10, fill: "#EF9F27" }, plaza);
  for (let x = 485; x < 552; x += 9) for (let y = 356; y < 400; y += 10) el("rect", { x, y, width: 6, height: 4, fill: "#C98F63" }, plaza);
  const plt = el("text", { x: 440, y: 396, "text-anchor": "middle", "font-size": 9, "font-weight": 800, fill: "#4A1B0C", "font-family": "Nunito Sans, sans-serif" }, plaza);
  plt.textContent = "Plaza & stage";

  const sign = hot("sign", AREAS.sign);
  el("rect", { x: 206, y: 404, width: 30, height: 6, rx: 1, fill: "#4A1B0C", stroke: "#EF9F27", "stroke-width": .8 }, sign);

  const land = hot("landscape", AREAS.landscape);
  el("rect", { x: 572, y: 346, width: 180, height: 62, fill: "#EADCBD" }, land);
  [[590, 360], [620, 390], [655, 365], [690, 395], [725, 362], [740, 392]].forEach(([cx, cy]) => el("circle", { cx, cy, r: 4, fill: "#6E8B4A" }, land));

  // north arrow
  el("path", { d: "M744 352 l8 18 h-16z", fill: "#2C2C2A" }, svg);
  const nt = el("text", { x: 744, y: 382, "text-anchor": "middle", "font-size": 10, "font-weight": 800, fill: "#2C2C2A" }, svg);
  nt.textContent = "N";

  $("site-map").appendChild(svg);

  // interaction
  let current = null;
  function select(id) {
    const info = AREAS[id];
    if (current) current.classList.remove("active");
    current = svg.querySelector(`[data-id="${id}"]`);
    current.classList.add("active");
    $("info-tag").textContent = CATS[info.cat];
    $("info-title").textContent = info.title;
    $("info-desc").textContent = info.desc;
    $("info-link").innerHTML = info.link ? `<a class="btn btn-sm" href="${info.link[0]}">${info.link[1]}</a>` : "";
  }
  svg.addEventListener("click", (e) => { const g = e.target.closest(".hot"); if (g) select(g.dataset.id); });
  svg.addEventListener("keydown", (e) => {
    const g = e.target.closest(".hot");
    if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(g.dataset.id); }
  });

  $("map-filters").innerHTML = Object.entries(CATS).map(([k, v], i) =>
    `<button type="button" data-cat="${k}" class="${i === 0 ? "on" : ""}">${v}</button>`).join("");
  $("map-filters").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("map-filters").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    svg.querySelectorAll(".hot").forEach((g) => {
      g.style.opacity = b.dataset.cat === "all" || g.dataset.cat === b.dataset.cat ? 1 : .25;
    });
  });

  // deep link: map.html#ground-3 or #clubhouse
  const hash = location.hash.slice(1).replace("ground-", "g");
  if (AREAS[hash]) select(hash);
})();
