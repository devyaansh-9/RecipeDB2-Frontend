const fs = require('fs');

const cuisines = [
  { name: "All Cuisines", data: "", img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80", desc: "Browse entire catalog" },
  { name: "Italian", data: "Italian", img: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&q=80", desc: "Herbs & cheese" },
  { name: "Mexican", data: "Mexican", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80", desc: "Fiery & vibrant" },
  { name: "French", data: "French", img: "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&q=80", desc: "Classic & elegant" },
  { name: "Japanese", data: "Japanese", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80", desc: "Umami & delicate" },
  { name: "Chinese", data: "Chinese", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80", desc: "Wok & dim sum" },
  { name: "Indian", data: "Indian Subcontinent", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80", desc: "Spiced & rich" },
  { name: "Thai", data: "Thai", img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80", desc: "Sweet, sour & spicy" },
  { name: "Middle Eastern", data: "Middle Eastern", img: "https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=800&q=80", desc: "Aromatic & savory" },
  { name: "Greek", data: "Greek", img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80", desc: "Fresh & Mediterranean" },
  { name: "Spanish", data: "Spanish and Portuguese", img: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&q=80", desc: "Tapas & paella" },
  { name: "Korean", data: "Korean", img: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80", desc: "Fermented & bold" },
  { name: "African", data: "Rest Africa", img: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80", desc: "Hearty & earthy" },
  { name: "Caribbean", data: "Caribbean", img: "https://images.unsplash.com/photo-1620580415391-7667232230a1?w=800&q=80", desc: "Tropical & spicy" },
  { name: "South American", data: "South American", img: "https://images.unsplash.com/photo-1601314002592-b8734bca6604?w=800&q=80", desc: "Grilled meats & corn" },
  { name: "UK & Irish", data: "UK", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", desc: "Pub classics & roasts" },
  { name: "Scandinavian", data: "Scandinavian", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80", desc: "Cured fish & dill" },
  { name: "Eastern European", data: "Eastern European", img: "https://images.unsplash.com/photo-1565251610996-0ab2fbd850a1?w=800&q=80", desc: "Dumplings & stews" },
  { name: "American", data: "US", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80", desc: "Burgers & BBQ" }
];

let html = '<div class="cuisine-marquee-track" id="cuisine-marquee-track">\n';
cuisines.forEach((c, idx) => {
  const activeClass = idx === 0 ? ' active' : '';
  html += `
              <div class="carousel-card${activeClass}" data-cuisine="${c.data}">
                <div class="carousel-card-img" style="background-image: url('${c.img}')"></div>
                <div class="carousel-card-info"><h4>${c.name}</h4><p>${c.desc}</p></div>
              </div>`;
});
html += '\n            </div>';

let indexHtml = fs.readFileSync('dist/index.html', 'utf8');
indexHtml = indexHtml.replace(/<div class="cuisine-marquee-track" id="cuisine-marquee-track">[\s\S]*?<\/div>\s*<\/div>\s*<script>/, html + '\n          </div>\n          <script>');

const beautifulCss = `/* Cuisine marquee slider visual alignment */
    #explorer-pane .carousel-section {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 0 3rem 0 !important;
    }

    /* Dramatic sizing and styling for the carousel cards */
    .carousel-card {
      min-width: 240px !important;
      width: 240px !important;
      height: 160px !important;
      border-radius: 20px !important;
      padding: 1.5rem !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
      border: 1px solid rgba(255,255,255,0.05) !important;
    }
    .carousel-card-info h4 {
      font-size: 1.4rem !important;
      font-weight: 900 !important;
      text-shadow: 0 2px 8px rgba(0,0,0,0.9) !important;
      letter-spacing: -0.02em !important;
      margin-bottom: 0.3rem !important;
    }
    .carousel-card-info p {
      font-size: 0.85rem !important;
      color: rgba(255,255,255,0.8) !important;
      text-shadow: 0 1px 4px rgba(0,0,0,0.9) !important;
    }
    .carousel-card:hover {
      transform: translateY(-8px) scale(1.03) !important;
      box-shadow: 0 20px 40px rgba(255, 255, 255, 0.1) !important;
      border-color: rgba(255,255,255,0.3) !important;
    }
    .carousel-card::after {
      background: linear-gradient(to top, rgba(0,0,0,0.95) 5%, rgba(0,0,0,0.4) 50%, transparent 80%) !important;
    }
    
    /* Use white/light accent instead of green for active marquee card */
    .carousel-card.active {`;

indexHtml = indexHtml.replace(/\/\* Cuisine marquee slider visual alignment \*\/[\s\S]*?\.carousel-card\.active \{/, beautifulCss);

fs.writeFileSync('dist/index.html', indexHtml);

let jsCode = fs.readFileSync('dist/assets/index-B6lYJ60e.js', 'utf8');

const eventListenerCode = `
    const allCards = document.querySelectorAll(".carousel-card");
    allCards.forEach(card => {
      card.addEventListener("click", () => {
        allCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        
        const cuisine = card.getAttribute("data-cuisine") || "";
        const searchInput = document.getElementById("search-input");
        const categorySelect = document.getElementById("category-select");
        
        if (searchInput) searchInput.value = "";
        if (categorySelect) categorySelect.value = "all";
        
        if (!cuisine) {
          y.engine = "live";
          I();
        } else {
          y.engine = "live";
          const queryInput = document.getElementById("search-input");
          if (queryInput) queryInput.value = cuisine;
          I();
        }
      });
    });
`;

if (!jsCode.includes('allCards.forEach(card => {')) {
  jsCode = jsCode.replace('S();', 'S();' + eventListenerCode);
  fs.writeFileSync('dist/assets/index-B6lYJ60e.js', jsCode);
}
console.log("Success!");
