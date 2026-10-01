/*
 * Sunstone Sports Arena — site-wide settings.
 * Edit the values here and every page updates (address, contact, prices, events).
 *
 * PLACEHOLDERS: the master plan does not include a street address, phone, email,
 * opening hours or rental prices. The values marked TODO below are examples only —
 * replace them with the real details before publishing.
 */
window.SUNSTONE = {
  name: "Sunstone Sports Arena",
  tagline: "Cricket under the Arizona sun",
  address: {
    street: "1234 W Sunstone Way", // TODO: real street address
    city: "Phoenix",               // TODO
    state: "AZ",
    zip: "85001",                  // TODO
  },
  phone: "(602) 555-0142",                 // TODO
  email: "bookings@sunstonearena.com",     // TODO
  hours: [                                 // TODO
    ["Mon – Fri", "6:00 AM – 9:00 PM"],
    ["Sat – Sun", "5:30 AM – 9:00 PM"],
  ],

  // Reservation pricing (USD). Peak = weekdays after 4 PM and all weekend.  TODO: confirm prices
  fields: [
    { id: "ground", name: "Cricket Ground (Grounds 1–10)", unit: "hour", offPeak: 95, peak: 130,
      desc: "65 × 70 yd boundary, 2 natural clay pitches + 1 astro pitch, wheeled sight screens, home & away dugouts with bleachers." },
    { id: "net", name: "Covered Practice Net (per lane)", unit: "hour", offPeak: 25, peak: 35,
      desc: "Shaded, LED-lit lane — 60 × 12 × 12 ft, astro carpet on a stone base, open bowler run-ups." },
    { id: "nets-all", name: "Full Net Complex (all 6 lanes)", unit: "hour", offPeak: 130, peak: 180,
      desc: "All six covered lanes for squad sessions, camps and trials." },
    { id: "conference", name: "Clubhouse Conference Room", unit: "hour", offPeak: 45, peak: 60,
      desc: "Two rooms for team meetings, coaching video sessions and sponsor events." },
    { id: "plaza", name: "Presentation Plaza & Stage", unit: "hour", offPeak: 75, peak: 100,
      desc: "Open plaza with a small raised stage and power — trophy ceremonies and community events." },
  ],
  addOns: [
    { id: "umpire", name: "Certified umpire", price: 40, unit: "per hour" },
    { id: "scorer", name: "Scorer", price: 25, unit: "per hour" },
    { id: "machine", name: "Bowling machine (nets)", price: 20, unit: "per hour" },
    { id: "media", name: "Media room + broadcast feed", price: 60, unit: "per hour" },
    { id: "terrace", name: "Viewing terrace hire", price: 150, unit: "flat" },
  ],
  packages: [
    { name: "T20 Match Day", price: 449, items: ["One ground for 4 hours", "2 umpires + scorer", "Both dugouts & sight screens", "Locker rooms & showers"] },
    { name: "Tournament Weekend", price: 3900, items: ["4 grounds, Sat + Sun", "Presentation plaza & stage", "Media room for streaming", "Conference room for officials"] },
    { name: "Club Season Pass", price: 2400, items: ["12 weekly practice sessions", "2 covered net lanes per session", "Priority ground booking", "10% off add-ons"] },
  ],

  // Calendar events (sample programme — TODO: replace with the real schedule).
  // Dates are YYYY-MM-DD. type: tournament | academy | community | maintenance
  events: [
    { date: "2026-10-03", title: "Grounds 1–5 open for the season", type: "community", time: "6:00 AM" },
    { date: "2026-10-05", title: "Ryegrass overseeding — Grounds 6–10 closed", type: "maintenance", time: "All week" },
    { date: "2026-10-10", title: "Junior Academy Trials (U13 / U16)", type: "academy", time: "7:00 AM" },
    { date: "2026-10-17", title: "Desert Cup T20 — Opening Weekend", type: "tournament", time: "8:00 AM" },
    { date: "2026-10-18", title: "Desert Cup T20 — Group Stage", type: "tournament", time: "8:00 AM" },
    { date: "2026-10-25", title: "Family Cricket Day on the Plaza", type: "community", time: "10:00 AM" },
    { date: "2026-11-01", title: "Women's Cricket Clinic — Practice Nets", type: "academy", time: "9:00 AM" },
    { date: "2026-11-07", title: "Desert Cup T20 — Final & Presentation", type: "tournament", time: "1:00 PM" },
    { date: "2026-11-14", title: "Saguaro Super Sixes", type: "tournament", time: "8:00 AM" },
    { date: "2026-11-21", title: "Corporate Cricket League — Week 1", type: "community", time: "8:00 AM" },
    { date: "2026-11-26", title: "Thanksgiving Charity Match", type: "community", time: "9:00 AM" },
    { date: "2026-12-05", title: "Winter Academy Camp begins", type: "academy", time: "8:00 AM" },
    { date: "2026-12-12", title: "Arizona Inter-Club Championship", type: "tournament", time: "8:00 AM" },
    { date: "2026-12-15", title: "Pitch renovation — Ground 3", type: "maintenance", time: "All day" },
    { date: "2026-12-31", title: "New Year's Eve Sixes", type: "community", time: "10:00 AM" },
  ],
};
