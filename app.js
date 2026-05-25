const listings = [
  {
    id: 1,
    title: "310 Otis Rd",
    location: "Pelion, SC 29123",
    type: "Single Family",
    price: 260000,
    beds: 3,
    baths: 2,
    sqft: 2582,
    days: 1,
    zillowUrl: "https://www.zillow.com/homes/310-Otis-Rd,-Pelion,-SC-29123_rb/",
    image: "https://ap.rdcpix.com/c2e5781d2f3917d1024bb15a3c3b0af8l-m3977290012od-w640_h480.jpg",
    description: "A 4.05-acre Pelion property with generous square footage, a quiet country setting, and room to spread out."
  },
  {
    id: 2,
    title: "448 Whispering Winds Dr",
    location: "Lexington, SC 29072",
    type: "Single Family",
    price: 255000,
    beds: 3,
    baths: 2,
    sqft: 1256,
    days: 14,
    zillowUrl: "https://www.zillow.com/homedetails/448-Whispering-Winds-Dr-Lexington-SC-29072/50898076_zpid/",
    image: "https://ap.rdcpix.com/081104d80bd48630d731d0cb7a4c8ca2l-m2060242450od-w640_h480.jpg",
    description: "Move-in-ready Lexington home with one-level living, thoughtful updates, an eat-in kitchen, and a large fenced backyard."
  },
  {
    id: 3,
    title: "1035 Moore Gate Ct",
    location: "Lexington, SC 29073",
    type: "Single Family",
    price: 444900,
    beds: 4,
    baths: 3,
    sqft: 2567,
    days: 16,
    zillowUrl: "https://www.zillow.com/homedetails/1035-Moore-Gate-Ct-Lexington-SC-29073/299697933_zpid/",
    image: "https://ap.rdcpix.com/f3f3d57ec8dc8af53a8a7be094e76b7dl-m377753995od-w640_h480.jpg",
    description: "Beautifully maintained Lexington home built in 2019 with spacious living areas, a functional layout, and screened porch."
  },
  {
    id: 4,
    title: "4065 Venetian Rd",
    location: "West Columbia, SC 29170",
    type: "Ranch",
    price: 440000,
    beds: 3,
    baths: 3,
    sqft: 3752,
    days: 22,
    zillowUrl: "https://www.zillow.com/homedetails/4065-Venetian-Rd-West-Columbia-SC-29170/11231214_zpid/",
    image: "https://ap.rdcpix.com/f4040a7f922f34b15d60ba9197105a2dl-m2246340630od-w640_h480.jpg",
    description: "Sprawling West Columbia ranch with soaring ceilings, sunroom, office, covered patio, pool, and detached workshop."
  },
  {
    id: 5,
    title: "2201 Sharpes Hill Rd",
    location: "Gaston, SC 29053",
    type: "Manufactured",
    price: 149900,
    beds: 3,
    baths: 2,
    sqft: 1000,
    days: 120,
    zillowUrl: "https://www.zillow.com/homedetails/2201-Sharpes-Hill-Rd-Gaston-SC-29053/11245468_zpid/",
    image: "https://ssl.cdn-redfin.com/photo/179/mbpaddedwide/360/genMid.625360_1.jpg",
    description: "Peaceful Gaston setting on 2.21 acres with a cared-for mobile home, brick addition, fireplace, and open outdoor space."
  },
  {
    id: 6,
    title: "215 Parkstream Cir",
    location: "West Columbia, SC 29170",
    type: "Ranch",
    price: 239000,
    beds: 3,
    baths: 2,
    sqft: 1300,
    days: 57,
    zillowUrl: "https://www.zillow.com/homedetails/215-Parkstream-Cir-West-Columbia-SC-29170/11216929_zpid/",
    image: "https://photos.zillowstatic.com/fp/1f8148896465084147fadda290acdf92-cc_ft_960.jpg",
    description: "All-brick West Columbia ranch with hardwood floors, screened porch, landscaped yard, attached garage, and detached carport."
  },
  {
    id: 7,
    title: "2609 Riverland Dr",
    location: "Cayce, SC 29033",
    type: "Riverfront",
    price: 689000,
    beds: 4,
    baths: 4,
    sqft: 3205,
    days: 31,
    zillowUrl: "https://www.zillow.com/homedetails/2609-Riverland-Dr-Cayce-SC-29033/11225102_zpid/",
    image: "https://ap.rdcpix.com/e6ab76335e1720dd64006a7e47bb1571l-m1096806327od-w640_h480.jpg",
    description: "Cayce riverfront property on 1.73 acres with updated interiors, flexible lower level, workshop, and Congaree River setting."
  }
];

const state = {
  search: "",
  price: "all",
  type: "all",
  sort: "featured",
  view: "listings",
  saved: new Set()
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const grid = document.querySelector("#listingGrid");
const resultCount = document.querySelector("#resultCount");
const heroCount = document.querySelector("#heroCount");
const portfolioValue = document.querySelector("#portfolioValue");
const cityList = document.querySelector("#cityList");
const savedCount = document.querySelector("#savedCount");
const dialog = document.querySelector("#listingDialog");

function formatShortPrice(value) {
  return currency.format(value);
}

function matchesPrice(listing) {
  if (state.price === "under250") return listing.price < 250000;
  if (state.price === "250to500") return listing.price >= 250000 && listing.price <= 500000;
  if (state.price === "over500") return listing.price > 500000;
  return true;
}

function getVisibleListings() {
  const query = state.search.trim().toLowerCase();
  const filtered = listings.filter((listing) => {
    if (state.view === "saved" && !state.saved.has(listing.id)) return false;
    const searchable = `${listing.title} ${listing.location} ${listing.type} ${listing.description}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesType = state.type === "all" || listing.type === state.type;
    return matchesQuery && matchesType && matchesPrice(listing);
  });

  return filtered.sort((a, b) => {
    if (state.sort === "price") return b.price - a.price;
    if (state.sort === "new") return a.days - b.days;
    return a.id - b.id;
  });
}

function renderListings() {
  const visibleListings = getVisibleListings();
  grid.innerHTML = "";

  if (!visibleListings.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <p class="eyebrow">No matching listings</p>
        <h2>Refine the portfolio filters</h2>
        <p>Try another city, property type, or price range.</p>
      </div>
    `;
  }

  visibleListings.forEach((listing) => {
    const card = document.createElement("article");
    card.className = "listing-card";
    card.innerHTML = `
      <div class="listing-image">
        <img src="${listing.image}" alt="${listing.title}" loading="eager" />
        <div class="badge-row">
          <span class="badge">${listing.type}</span>
          <button class="save-button ${state.saved.has(listing.id) ? "saved" : ""}" type="button" aria-label="Save ${listing.title}" data-save="${listing.id}">
            ${state.saved.has(listing.id) ? "Saved" : "Save"}
          </button>
        </div>
      </div>
      <div class="listing-copy">
        <div class="price-row">
          <strong>${formatShortPrice(listing.price)}</strong>
          <span>${listing.days} days listed</span>
        </div>
        <h3>${listing.title}</h3>
        <p>${listing.location}</p>
        <div class="detail-row">
          <span>${listing.beds} beds</span>
          <span>${listing.baths} baths</span>
          <span>${listing.sqft.toLocaleString()} sq ft</span>
        </div>
        <div class="card-actions">
          <button class="gold-button" type="button" data-detail="${listing.id}">View Listing</button>
          <a class="ghost-button link-button" href="${listing.zillowUrl}" target="_blank" rel="noreferrer">Zillow</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  resultCount.textContent = `Showing ${visibleListings.length} listing${visibleListings.length === 1 ? "" : "s"}`;
  heroCount.textContent = visibleListings.length;
  portfolioValue.textContent = formatShortPrice(visibleListings.reduce((sum, listing) => sum + listing.price, 0));
  savedCount.textContent = state.saved.size;
  renderCities(visibleListings);
}

function renderCities(visibleListings) {
  const cityCounts = visibleListings.reduce((accumulator, listing) => {
    const city = listing.location.split(",")[0];
    accumulator.set(city, (accumulator.get(city) || 0) + 1);
    return accumulator;
  }, new Map());

  cityList.innerHTML = "";
  [...cityCounts.entries()].slice(0, 5).forEach(([city, count]) => {
    const item = document.createElement("li");
    item.textContent = `${city} - ${count}`;
    cityList.appendChild(item);
  });
}

function openDetails(id) {
  const listing = listings.find((item) => item.id === id);
  if (!listing) return;

  document.querySelector("#dialogImage").src = listing.image;
  document.querySelector("#dialogImage").alt = listing.title;
  document.querySelector("#dialogType").textContent = listing.type;
  document.querySelector("#dialogTitle").textContent = listing.title;
  document.querySelector("#dialogLocation").textContent = listing.location;
  document.querySelector("#dialogPrice").textContent = currency.format(listing.price);
  document.querySelector("#dialogDescription").textContent = listing.description;
  document.querySelector("#dialogDetails").innerHTML = `
    <span>${listing.beds} bedrooms</span>
    <span>${listing.baths} baths</span>
    <span>${listing.sqft.toLocaleString()} sq ft</span>
    <span>${listing.days} days listed</span>
  `;
  document.querySelector("#dialogZillowLink").href = listing.zillowUrl;

  dialog.showModal();
}

function toggleSave(id) {
  if (state.saved.has(id)) {
    state.saved.delete(id);
  } else {
    state.saved.add(id);
  }
  renderListings();
}

document.querySelector("#searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderListings();
});

document.querySelector("#priceFilter").addEventListener("change", (event) => {
  state.price = event.target.value;
  renderListings();
});

document.querySelector("#typeFilter").addEventListener("change", (event) => {
  state.type = event.target.value;
  renderListings();
});

document.querySelectorAll("[data-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-sort]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.sort = button.dataset.sort;
    renderListings();
  });
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.view = button.dataset.view;

    if (button.dataset.view === "saved") {
      state.search = "";
      document.querySelector("#searchInput").value = "";
    }

    if (button.dataset.view === "market") {
      state.sort = "price";
      document.querySelectorAll("[data-sort]").forEach((item) => item.classList.toggle("active", item.dataset.sort === "price"));
    }

    if (button.dataset.view === "listings") {
      state.search = "";
      document.querySelector("#searchInput").value = "";
    }

    renderListings();
  });
});

document.querySelector("#openConcierge").addEventListener("click", () => {
  const firstListing = getVisibleListings()[0] || listings[0];
  openDetails(firstListing.id);
});

grid.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail]");
  const saveButton = event.target.closest("[data-save]");

  if (detailButton) openDetails(Number(detailButton.dataset.detail));
  if (saveButton) toggleSave(Number(saveButton.dataset.save));
});

document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());

renderListings();
