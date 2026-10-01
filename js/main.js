/* Shared header, footer and site-config bindings for every page. */
(function () {
  const S = window.SUNSTONE;
  const addr = S.address;
  const fullAddress = `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress);

  const pages = [
    ["index.html", "Home"],
    ["about.html", "About"],
    ["reservations.html", "Reservations"],
    ["calendar.html", "Calendar"],
    ["map.html", "Facility Map"],
    ["gallery.html", "Gallery"],
    ["features.html", "Features"],
  ];
  const current = location.pathname.split("/").pop() || "index.html";

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="nav-wrap">
        <a class="brand" href="index.html" aria-label="${S.name} home">
          <img src="images/logo.svg" alt="" width="44" height="44">
          <span><strong>Sunstone</strong> Sports Arena</span>
        </a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">
          <span class="sr-only">Menu</span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <nav id="site-nav">
          <ul>
            ${pages.map(([href, label]) =>
              `<li><a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("")}
          </ul>
          <a class="btn btn-sm" href="reservations.html#book">Book a Field</a>
        </nav>
      </div>`;
    const toggle = header.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid container">
        <div>
          <a class="brand" href="index.html"><img src="images/logo.svg" alt="" width="40" height="40"><span><strong>Sunstone</strong> Sports Arena</span></a>
          <p>${S.tagline}. Turf wickets, floodlit evenings and desert sunsets.</p>
        </div>
        <div>
          <h4>Visit</h4>
          <address><a href="${mapsUrl}" target="_blank" rel="noopener">${addr.street}<br>${addr.city}, ${addr.state} ${addr.zip}</a></address>
        </div>
        <div>
          <h4>Contact</h4>
          <p><a href="tel:${S.phone.replace(/[^\d+]/g, "")}">${S.phone}</a><br><a href="mailto:${S.email}">${S.email}</a></p>
        </div>
        <div>
          <h4>Hours</h4>
          <p>${S.hours.map(([d, h]) => `${d}: ${h}`).join("<br>")}</p>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} ${S.name}. All rights reserved.</div>`;
  }

  // Bind simple values: <span data-site="address"></span>
  const bindings = {
    name: S.name,
    address: fullAddress,
    street: addr.street,
    cityline: `${addr.city}, ${addr.state} ${addr.zip}`,
    phone: S.phone,
    email: S.email,
  };
  document.querySelectorAll("[data-site]").forEach((el) => {
    const v = bindings[el.dataset.site];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll("[data-site-href]").forEach((el) => {
    const k = el.dataset.siteHref;
    if (k === "maps") el.href = mapsUrl;
    if (k === "phone") el.href = "tel:" + S.phone.replace(/[^\d+]/g, "");
    if (k === "email") el.href = "mailto:" + S.email;
  });
  document.querySelectorAll("[data-site='hours']").forEach((el) => {
    el.innerHTML = S.hours.map(([d, h]) => `<div><dt>${d}</dt><dd>${h}</dd></div>`).join("");
  });
  const mapFrame = document.querySelector("[data-site-mapframe]");
  if (mapFrame) mapFrame.src = "https://maps.google.com/maps?output=embed&q=" + encodeURIComponent(fullAddress);

  // Fade-in on scroll
  const io = "IntersectionObserver" in window && new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
})();
