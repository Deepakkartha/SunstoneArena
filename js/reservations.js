/* Field reservation: pricing tables, packages and booking form with live estimate. */
(function () {
  const S = window.SUNSTONE;
  const $ = (id) => document.getElementById(id);
  const money = (n) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const STORE_KEY = "sunstone-bookings";

  // ---- Pricing tables
  $("price-rows").innerHTML = S.fields.map((f) => `
    <tr><td><strong>${f.name}</strong></td><td>${f.desc}</td>
    <td class="price">${money(f.offPeak)}<small>per ${f.unit}</small></td>
    <td class="price">${money(f.peak)}<small>per ${f.unit}</small></td></tr>`).join("");
  $("addon-rows").innerHTML = S.addOns.map((a) =>
    `<tr><td>${a.name}</td><td class="price">${money(a.price)} <small style="display:inline">${a.unit}</small></td></tr>`).join("");
  $("packages").innerHTML = S.packages.map((p, i) => `
    <div class="card package reveal in${i === 1 ? " featured" : ""}">
      <h3>${p.name}</h3>
      <div class="price-big">${money(p.price)}</div>
      <ul class="checklist" style="margin-top:12px">${p.items.map((x) => `<li>${x}</li>`).join("")}</ul>
      <a class="btn" style="margin-top:auto; align-self:flex-start" href="#book" data-package="${p.name}">Enquire</a>
    </div>`).join("");
  document.querySelectorAll("[data-package]").forEach((a) =>
    a.addEventListener("click", () => { $("notes").value = `Interested in the ${a.dataset.package}.`; }));

  // ---- Form setup
  const subOptions = {
    ground: Array.from({ length: 10 }, (_, i) => `Ground ${i + 1}`),
    net: Array.from({ length: 6 }, (_, i) => `Lane ${i + 1}`),
    conference: ["Conference Room 1", "Conference Room 2"],
  };
  const facility = $("facility"), ground = $("ground"), date = $("date"), start = $("start"), hours = $("hours");
  facility.innerHTML = S.fields.map((f) => `<option value="${f.id}">${f.name}</option>`).join("");
  const hourLabel = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? "AM" : "PM"}`;
  for (let h = 6; h <= 20; h++) start.add(new Option(hourLabel(h), h));
  start.value = 9;
  $("addon-checks").innerHTML = S.addOns.map((a) =>
    `<label><input type="checkbox" value="${a.id}"> ${a.name} <span class="note">(${money(a.price)} ${a.unit})</span></label>`).join("");

  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = toISO(new Date());
  date.min = todayISO;
  date.value = todayISO;
  const params = new URLSearchParams(location.search);
  if (params.get("date") && params.get("date") >= todayISO) date.value = params.get("date");

  function refreshSub() {
    const opts = subOptions[facility.value];
    ground.innerHTML = opts ? opts.map((o) => `<option>${o}</option>`).join("") : "<option>—</option>";
    ground.disabled = !opts;
  }
  function refreshHours() {
    const prev = +hours.value || 2;
    const max = 22 - +start.value; // close at 10 PM at the latest
    hours.innerHTML = "";
    for (let h = 1; h <= Math.min(max, 12); h++) hours.add(new Option(`${h} hr${h > 1 ? "s" : ""}`, h));
    hours.value = Math.min(prev, max);
  }

  function quote() {
    const f = S.fields.find((x) => x.id === facility.value);
    const d = new Date(date.value + "T00:00:00");
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const s = +start.value, n = +hours.value;
    let peakH = 0;
    for (let h = s; h < s + n; h++) if (weekend || h >= 16) peakH++;
    const offH = n - peakH;
    const lines = [];
    if (offH) lines.push([`${offH} off-peak hr × ${money(f.offPeak)}`, offH * f.offPeak]);
    if (peakH) lines.push([`${peakH} peak hr × ${money(f.peak)}`, peakH * f.peak]);
    document.querySelectorAll("#addon-checks input:checked").forEach((c) => {
      const a = S.addOns.find((x) => x.id === c.value);
      const amt = a.unit === "flat" ? a.price : a.price * n;
      lines.push([a.name + (a.unit === "flat" ? "" : ` × ${n} hr`), amt]);
    });
    const total = lines.reduce((t, l) => t + l[1], 0);
    $("quote-lines").innerHTML = lines.map(([l, a]) => `<div class="line"><span>${l}</span><strong>${money(a)}</strong></div>`).join("");
    $("quote-total").textContent = money(total);
    $("quote-deposit").textContent = money(Math.ceil(total * 0.25));
    return { facility: f, total, peakH, offH };
  }

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
  }

  facility.addEventListener("change", () => { refreshSub(); quote(); });
  start.addEventListener("change", () => { refreshHours(); quote(); });
  [date, hours, ground].forEach((el) => el.addEventListener("change", quote));
  $("addon-checks").addEventListener("change", quote);
  refreshSub();
  if (params.get("ground")) ground.value = "Ground " + params.get("ground");
  refreshHours(); quote();

  // ---- Submit
  $("booking-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("form-msg");
    const name = $("name").value.trim(), email = $("email").value.trim();
    const problems = [];
    if (!name) problems.push("your name");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problems.push("a valid email");
    if (!date.value || date.value < todayISO) problems.push("a date from today onward");
    if (problems.length) {
      msg.className = "alert error";
      msg.textContent = "Please add " + problems.join(", ") + ".";
      return;
    }
    const q = quote();
    const s = +start.value, n = +hours.value;
    const sub = ground.disabled ? "" : ground.value;
    const booking = {
      date: date.value, start: s, hours: n, facility: q.facility.id,
      title: `${sub || q.facility.name} — ${name}${$("team").value ? " (" + $("team").value.trim() + ")" : ""}`,
      time: `${hourLabel(s)} – ${hourLabel(s + n)}`,
    };

    const clash = loadBookings().find((b) => b.date === booking.date && b.facility === booking.facility &&
      (b.title.split(" — ")[0] === booking.title.split(" — ")[0]) && s < b.start + b.hours && b.start < s + n);
    if (clash) {
      msg.className = "alert error";
      msg.textContent = `You already have a request for this slot (${clash.time}). Pick another time or ${subOptions[booking.facility] ? "ground/lane" : "facility"}.`;
      return;
    }
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...loadBookings(), booking])); } catch { /* storage unavailable */ }

    const addons = [...document.querySelectorAll("#addon-checks input:checked")].map((c) => S.addOns.find((a) => a.id === c.value).name);
    const body = [
      `Booking request — ${S.name}`, "",
      `Facility: ${q.facility.name}${sub ? " / " + sub : ""}`,
      `Date: ${date.value}`, `Time: ${booking.time} (${n} hr)`,
      `Add-ons: ${addons.join(", ") || "none"}`, `Estimate: ${money(q.total)}`, "",
      `Name: ${name}`, `Team: ${$("team").value}`, `Email: ${email}`, `Phone: ${$("phone").value}`, "",
      `Notes: ${$("notes").value}`,
    ].join("\n");
    const mailto = `mailto:${S.email}?subject=${encodeURIComponent("Booking request: " + q.facility.name + " " + date.value)}&body=${encodeURIComponent(body)}`;

    msg.className = "alert";
    msg.innerHTML = `Thanks, <span></span>! Your request for <strong></strong> on ${date.value} (${booking.time}) is noted and now shows on the <a href="calendar.html?date=${date.value}">calendar</a> as pending. ` +
      `<a href="${mailto}">Email it to our bookings team</a> to confirm.`;
    msg.querySelector("span").textContent = name;
    msg.querySelector("strong").textContent = q.facility.name + (sub ? " / " + sub : "");
    window.location.href = mailto;
  });
})();
