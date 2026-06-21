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
              </div>\n`;
});
// Duplicate for infinite marquee scrolling
cuisines.forEach((c, idx) => {
  html += `
              <div class="carousel-card" data-cuisine="${c.data}">
                <div class="carousel-card-img" style="background-image: url('${c.img}')"></div>
                <div class="carousel-card-info"><h4>${c.name}</h4><p>${c.desc}</p></div>
              </div>\n`;
});
html += '            </div>';

fs.writeFileSync('C:/Users/amanp/OneDrive/Desktop/RecipeDB_2/marquee.html', html);
console.log("HTML generated!");
