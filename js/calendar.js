/* Month calendar of events from site-config.js plus booking requests saved in this browser. */
(function () {
  const S = window.SUNSTONE;
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const TYPES = { tournament: "Tournaments", academy: "Academy", community: "Community", maintenance: "Maintenance", booking: "My requests" };

  let bookings = [];
  try { bookings = (JSON.parse(localStorage.getItem("sunstone-bookings")) || []).map((b) => ({ ...b, type: "booking", title: b.title + " (pending)" })); } catch { /* no storage */ }
  const all = [...S.events, ...bookings];
  const active = new Set(Object.keys(TYPES));

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const params = new URLSearchParams(location.search);
  let selected = params.get("date") ? new Date(params.get("date") + "T00:00:00") : today;
  if (isNaN(selected)) selected = today;
  let view = new Date(selected.getFullYear(), selected.getMonth(), 1);

  const eventsOn = (key) => all.filter((e) => e.date === key && active.has(e.type));

  $("type-filters").innerHTML = Object.entries(TYPES).map(([k, v]) =>
    `<button type="button" class="on" data-type="${k}" aria-pressed="true">${v}</button>`).join("");
  $("type-filters").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const on = b.classList.toggle("on");
    b.setAttribute("aria-pressed", on);
    on ? active.add(b.dataset.type) : active.delete(b.dataset.type);
    render(); showDay(selected); upcoming();
  });

  function render() {
    $("cal-title").textContent = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const grid = $("cal-grid");
    grid.innerHTML = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="cal-dow">${d}</div>`).join("");
    const first = new Date(view);
    first.setDate(1 - first.getDay());
    for (let i = 0; i < 42; i++) {
      const d = new Date(first); d.setDate(first.getDate() + i);
      if (i >= 35 && d.getMonth() !== view.getMonth()) break;
      const key = iso(d);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day" + (d.getMonth() !== view.getMonth() ? " other" : "") +
        (key === iso(today) ? " today" : "") + (key === iso(selected) ? " selected" : "");
      const evs = eventsOn(key);
      btn.setAttribute("aria-label", d.toDateString() + (evs.length ? `, ${evs.length} event${evs.length > 1 ? "s" : ""}` : ""));
      btn.innerHTML = `<span class="d">${d.getDate()}</span>`;
      evs.forEach((ev) => {
        const s = document.createElement("span");
        s.className = "ev " + ev.type; s.textContent = ev.title; s.title = ev.title;
        btn.appendChild(s);
      });
      btn.addEventListener("click", () => { selected = d; render(); showDay(d); });
      grid.appendChild(btn);
    }
  }

  function li(ev) {
    const d = new Date(ev.date + "T00:00:00");
    const el = document.createElement("li");
    el.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue(
      { tournament: "--clay", academy: "--sky", community: "--sage", booking: "--turq" }[ev.type] || "--muted");
    el.innerHTML = `<div class="date">${d.getDate()}<small>${d.toLocaleDateString("en-US", { month: "short" })}</small></div>
      <div><strong></strong><br><small class="note"></small></div>`;
    el.querySelector("strong").textContent = ev.title;
    el.querySelector("small.note").textContent = `${ev.time} · ${TYPES[ev.type]}`;
    return el;
  }

  function showDay(d) {
    const key = iso(d);
    $("day-title").textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const ul = $("day-events"); ul.innerHTML = "";
    const evs = eventsOn(key);
    evs.forEach((e) => ul.appendChild(li(e)));
    if (!evs.length) ul.innerHTML = "<li>No scheduled events — grounds and nets are open for booking.</li>";
    const book = $("day-book");
    book.style.display = d < today ? "none" : "";
    book.href = `reservations.html?date=${key}#book`;
  }

  function upcoming() {
    const ul = $("upcoming-list"); ul.innerHTML = "";
    all.filter((e) => active.has(e.type) && new Date(e.date + "T00:00:00") >= today)
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8).forEach((e) => ul.appendChild(li(e)));
    if (!ul.children.length) ul.innerHTML = "<li>No upcoming events for the selected filters.</li>";
  }

  $("prev").addEventListener("click", () => { view.setMonth(view.getMonth() - 1); render(); });
  $("next").addEventListener("click", () => { view.setMonth(view.getMonth() + 1); render(); });
  $("today").addEventListener("click", () => { selected = today; view = new Date(today.getFullYear(), today.getMonth(), 1); render(); showDay(today); });

  render(); showDay(selected); upcoming();
})();
