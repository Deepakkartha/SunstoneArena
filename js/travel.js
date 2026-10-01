/* Stay & Explore: hotel rankings, tour vendors, nearby sights and trip-request form. */
(function () {
  const T = window.SUNSTONE_TRAVEL, S = window.SUNSTONE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const score5 = (h) => (h.scale === 10 ? h.rating / 2 : h.rating);

  // ---- Hotels
  let tab = "budget";
  function renderHotels() {
    const by = $("hotel-sort").value;
    const list = [...T[tab]].sort((a, b) => by === "miles" ? a.miles - b.miles : score5(b) - score5(a) || a.miles - b.miles);
    $("hotel-list").innerHTML = list.map((h, i) => `
      <li class="hotel card">
        <div class="rank">${i + 1}</div>
        <div class="hotel-body">
          <h3>${esc(h.name)}</h3>
          <p class="meta"><span class="tag">${esc(h.area)}</span> <span>≈ ${h.miles} mi from the arena</span></p>
          <p>${esc(h.note)}</p>
        </div>
        <div class="hotel-side">
          <div class="score" aria-label="Rated ${h.rating} out of ${h.scale} on ${esc(h.source)}"><b>${h.rating}</b><span>/ ${h.scale}</span></div>
          <small>${esc(h.source)}</small>
          <a class="btn btn-sm" href="${esc(h.url)}" target="_blank" rel="noopener">View &amp; book ↗</a>
        </div>
      </li>`).join("");
    $("hotel-note").textContent = `Ratings from public review sites as of ${T.asOf}. Scores out of 10 are halved to rank them alongside 5-point ratings; ties go to the closer hotel. Ratings and prices change — check before booking. Sunstone is not affiliated with any listed business.`;
  }
  $("hotel-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    tab = b.dataset.tab;
    $("hotel-tabs").querySelectorAll("button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
    renderHotels();
  });
  $("hotel-sort").addEventListener("change", renderHotels);
  renderHotels();

  // ---- Vendors
  const types = ["All", ...new Set(T.vendors.flatMap((v) => v.type))];
  $("vendor-filters").innerHTML = types.map((t, i) => `<button type="button" class="${i ? "" : "on"}" data-type="${esc(t)}">${esc(t)}</button>`).join("");
  function renderVendors(type) {
    $("vendor-list").innerHTML = T.vendors.filter((v) => type === "All" || v.type.includes(type)).map((v) => `
      <div class="card vendor">
        <span class="tag">${esc(v.base)}</span>
        <h3 style="margin-top:10px">${esc(v.name)}</h3>
        <p>${esc(v.desc)}</p>
        <p class="note">${v.type.map(esc).join(" · ")}</p>
        <a class="btn btn-sm" href="${esc(v.url)}" target="_blank" rel="noopener">${v.type.includes("Directory") ? "Browse" : "Book with vendor"} ↗</a>
      </div>`).join("");
  }
  $("vendor-filters").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("vendor-filters").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    renderVendors(b.dataset.type);
  });
  renderVendors("All");

  // ---- Sights
  $("sight-list").innerHTML = [...T.sights].sort((a, b) => a.miles - b.miles).map((s) => `
    <div class="card"><span class="tag">≈ ${s.miles} mi · ${esc(s.where)}</span><h3 style="margin-top:10px">${esc(s.name)}</h3><p>${esc(s.desc)}</p></div>`).join("");

  // ---- Trip request
  $("trip-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("trip-msg");
    const name = $("t-name").value.trim(), email = $("t-email").value.trim();
    const arrive = $("t-arrive").value, depart = $("t-depart").value;
    const problems = [];
    if (!name) problems.push("your name");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problems.push("a valid email");
    if (arrive && depart && depart < arrive) problems.push("a departure after arrival");
    if (problems.length) { msg.className = "alert error"; msg.textContent = "Please add " + problems.join(", ") + "."; return; }
    const interests = [...document.querySelectorAll("#t-interests input:checked")].map((c) => c.value);
    const body = [
      `Trip planning request — ${S.name}`, "",
      `Dates: ${arrive || "?"} to ${depart || "?"}`, `Group size: ${$("t-size").value}`,
      `Accommodation: ${$("t-stay").value}`, `Interested in: ${interests.join(", ") || "—"}`, "",
      `Name: ${name}`, `Email: ${email}`, "", `Notes: ${$("t-notes").value}`,
    ].join("\n");
    const mailto = `mailto:${S.email}?subject=${encodeURIComponent("Trip planning request — " + name)}&body=${encodeURIComponent(body)}`;
    msg.className = "alert";
    msg.innerHTML = `Thanks! Your email app should open with the request ready to send. If it doesn't, <a href="${mailto}">click here</a>.`;
    window.location.href = mailto;
  });
})();
