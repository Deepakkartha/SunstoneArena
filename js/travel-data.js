/*
 * Stay & Explore data: hotels near Casa Grande (I-8 / I-10 junction, between Phoenix and Tucson)
 * and sightseeing / tour vendors.
 *
 * Ratings were gathered from public review sites in October 2026 and change over time.
 * Each rating names its source. Sunstone has no affiliation with any listed business.
 * `miles` = approximate driving distance from central Casa Grande.
 */
(function () {
const g = (q) => "https://www.google.com/search?q=" + encodeURIComponent(q);

window.SUNSTONE_TRAVEL = {
  asOf: "October 2026",

  budget: [
    { name: "Best Western Plus Casa Grande Inn & Suites", area: "Casa Grande", miles: 3, rating: 4.7, scale: 5, source: "Tripadvisor", note: "#1 of 12 hotels in Casa Grande; studio to 2-bed suites with kitchens, free hot breakfast",
      url: "https://www.tripadvisor.com/Hotel_Review-g31182-d23289371-Reviews-Best_Western_Plus_Casa_Grande_Inn_Suites-Casa_Grande_Arizona.html" },
    { name: "Fairfield by Marriott Inn & Suites Casa Grande", area: "Casa Grande", miles: 3, rating: 9.4, scale: 10, source: "Expedia", note: "Rated Exceptional by Expedia guests",
      url: "https://www.expedia.com/Casa-Grande-Hotels-Fairfield-By-Marriott-Inn-Suites-Casa-Grande.h123425457.Hotel-Information" },
    { name: "Holiday Inn Express & Suites Casa Grande", area: "Casa Grande", miles: 3, rating: 4.2, scale: 5, source: "Tripadvisor", note: "136 reviews; free breakfast",
      url: "https://www.booking.com/hotel/us/holiday-inn-express-suites-casa-grande.html" },
    { name: "Comfort Inn & Suites Casa Grande", area: "Casa Grande", miles: 3, rating: 8.2, scale: 10, source: "guest reviews", note: "1,385 reviews",
      url: g("Comfort Inn & Suites Casa Grande AZ") },
    { name: "Radisson Hotel Casa Grande", area: "Casa Grande", miles: 2, rating: 3.9, scale: 5, source: "Tripadvisor", note: "411 reviews; #1 Best Value of Casa Grande 3-star hotels; free breakfast",
      url: g("Radisson Hotel Casa Grande AZ") },
    { name: "Baymont by Wyndham Casa Grande", area: "Casa Grande", miles: 3, rating: 3.7, scale: 5, source: "Tripadvisor", note: "265 reviews (8.0/10 on 1,129 reviews elsewhere); free breakfast",
      url: g("Baymont by Wyndham Casa Grande AZ") },
    { name: "Francisco Grande Hotel & Golf Resort", area: "Casa Grande", miles: 5, rating: 3.7, scale: 5, source: "Tripadvisor", note: "158 reviews; golf course on site",
      url: "https://www.tripadvisor.com/Hotel_Review-g31182-d73253-Reviews-Francisco_Grande_Hotel_Golf_Resort-Casa_Grande_Arizona.html" },
    { name: "Quality Inn Casa Grande I-10", area: "Casa Grande (I-10)", miles: 6, rating: 3.7, scale: 5, source: "Tripadvisor", note: "500 reviews; right off I-10",
      url: "https://www.hotelscombined.com/Hotel/Quality_Inn_Casa_Grande.htm" },
    { name: "Super 8 by Wyndham Casa Grande", area: "Casa Grande", miles: 3, rating: 7.2, scale: 10, source: "Expedia", note: "900 reviews",
      url: g("Super 8 by Wyndham Casa Grande AZ") },
    { name: "Motel 6 Eloy – Casa Grande", area: "Eloy (I-10 exit 200)", miles: 14, rating: 3.6, scale: 5, source: "Tripadvisor", note: "Direct I-10 access; 7.2/10 on Expedia (1,007 reviews)",
      url: "https://www.motel6.com/property/motel-eloy-az-arizona-us-294371/" },
  ],

  resorts: [
    { name: "Hacienda del Sol Guest Ranch Resort", area: "Tucson (Catalina Foothills)", miles: 70, rating: 4.6, scale: 5, source: "Tripadvisor", note: "1,811 reviews; historic guest ranch",
      url: g("Hacienda del Sol Guest Ranch Resort Tucson") },
    { name: "Loews Ventana Canyon Resort", area: "Tucson (Catalina Foothills)", miles: 72, rating: 4.4, scale: 5, source: "Tripadvisor", note: "4,085 reviews; golf and canyon waterfall trail",
      url: "https://www.tripadvisor.com/Hotel_Review-g60950-d74515-Reviews-Loews_Ventana_Canyon_Resort-Tucson_Arizona.html" },
    { name: "The Westin La Paloma Resort & Spa", area: "Tucson (Catalina Foothills)", miles: 68, rating: 4.3, scale: 5, source: "Tripadvisor", note: "4,138 reviews",
      url: g("Westin La Paloma Resort & Spa Tucson") },
    { name: "JW Marriott Tucson Starr Pass Resort & Spa", area: "Tucson (Tucson Mountains)", miles: 66, rating: 4.3, scale: 5, source: "Tripadvisor", note: "2,842 reviews",
      url: g("JW Marriott Tucson Starr Pass Resort & Spa") },
    { name: "Harrah's Ak-Chin Hotel & Casino", area: "Maricopa", miles: 25, rating: 4.3, scale: 5, source: "Tripadvisor", note: "8,258 reviews; #1 hotel in Maricopa; closest resort to the arena",
      url: "https://www.tripadvisor.com/Hotel_Review-g31276-d217205-Reviews-Harrah_s_Ak_Chin_Hotel_And_Casino-Maricopa_Arizona.html" },
    { name: "The Ritz-Carlton, Dove Mountain", area: "Marana", miles: 52, rating: 4.0, scale: 5, source: "Tripadvisor", note: "Forbes Five-Star resort & spa; 9.4/10 on Booking.com",
      url: "https://www.ritzcarlton.com/en/hotels/tusrz-the-ritz-carlton-dove-mountain/overview/" },
    { name: "Sheraton Grand at Wild Horse Pass", area: "Chandler (Gila River)", miles: 35, rating: 4.0, scale: 5, source: "Tripadvisor", note: "AAA Four-Diamond; 8.9/10 on 5,000+ reviews; two golf courses, spa",
      url: "https://www.tripadvisor.com/Hotel_Review-g14863980-d258645-Reviews-Sheraton_Grand_at_Wild_Horse_Pass-Gila_River_Indian_Community_Arizona.html" },
    { name: "Gila River Resorts & Casinos – Wild Horse Pass", area: "Chandler (Gila River)", miles: 35, rating: 4.0, scale: 5, source: "Tripadvisor", note: "AAA Four-Diamond; 9.4 guest rating elsewhere",
      url: "https://www.tripadvisor.com/Hotel_Review-g31190-d1516130-Reviews-Gila_River_Resorts_Casinos_Wild_Horse_Pass-Chandler_Arizona.html" },
    { name: "Casino del Sol Resort", area: "Tucson (southwest)", miles: 60, rating: 4.0, scale: 5, source: "Tripadvisor", note: "AAA Four-Diamond; 8.9/10 on Booking.com (579 reviews)",
      url: "https://www.casinodelsol.com/hotel" },
    { name: "Omni Tucson National Resort & Spa", area: "Tucson (northwest)", miles: 58, rating: 4.0, scale: 5, source: "Tripadvisor", note: "1,908 reviews; championship golf",
      url: g("Omni Tucson National Resort & Spa") },
  ],

  vendors: [
    { name: "Sonoran Excursions", base: "Casa Grande", type: ["Day trips", "Multi-day", "Groups"], desc: "Local operator running day trips and 3–5 day tours by limo, van or bus — handy for visiting teams.",
      url: g("Sonoran Excursions Casa Grande AZ tours") },
    { name: "Rob's Red Jeep Rambles", base: "Casa Grande area", type: ["Desert / off-road", "Half day"], desc: "Four-hour jeep trips into the Sonoran Desert National Monument along the Table Top Wilderness.",
      url: g("Rob's Red Jeep Rambles Arizona") },
    { name: "Across Arizona Tours", base: "Phoenix", type: ["Day trips", "Two-day", "Groups"], desc: "Guided van tours across Arizona — Grand Canyon, Sedona and more — plus custom group tours.",
      url: "https://www.acrossarizonatours.com/" },
    { name: "Arizona Scenic Tours", base: "Phoenix", type: ["Day trips"], desc: "Single-day guided sightseeing tours from the Phoenix area.",
      url: "https://arizonascenictours.com/arizona-day-tours/" },
    { name: "Western Destinations", base: "Phoenix", type: ["Day trips", "Guided"], desc: "Highly rated Phoenix-based guided tours with knowledgeable local guides.",
      url: g("Western Destinations tours Phoenix") },
    { name: "More local tour companies", base: "Casa Grande", type: ["Directory"], desc: "Browse and compare other tour companies near Casa Grande, with reviews.",
      url: "https://www.yelp.com/search?find_desc=tour+companies&find_loc=Casa+Grande,+AZ" },
  ],

  sights: [
    { name: "Casa Grande Ruins National Monument", where: "Coolidge", miles: 20, desc: "700-year-old Ancestral Sonoran Desert People 'Great House'." },
    { name: "Picacho Peak State Park", where: "Picacho (I-10)", miles: 25, desc: "Iconic peak with spring wildflowers and a famous cable-assisted hike." },
    { name: "Sonoran Desert National Monument", where: "West of Casa Grande", miles: 30, desc: "Saguaro forests, desert trails and dark night skies." },
    { name: "Skydive Arizona", where: "Eloy", miles: 15, desc: "One of the world's largest skydiving centres — tandem jumps for first-timers." },
    { name: "Saguaro National Park", where: "Tucson", miles: 60, desc: "Giant saguaro cacti on both sides of Tucson; scenic loop drives." },
    { name: "Arizona-Sonora Desert Museum", where: "Tucson", miles: 70, desc: "Zoo, botanical garden and natural history museum in one." },
    { name: "Biosphere 2", where: "Oracle", miles: 75, desc: "University of Arizona's giant earth-science research facility." },
    { name: "Downtown Phoenix & Desert Botanical Garden", where: "Phoenix", miles: 50, desc: "Museums, dining and 50,000+ desert plants." },
  ],
};
})();
