let apartments = [];
let layerGroup = null;
let map = null;
let icons = [];
const iconIndexes = {
  0: 0,
  1: 1,
  1.5: 2,
  2: 3
};

function getFilterValuesByName(name) {
  return $(`input[name="${name}"]`)
    .filter(":checked")
    .map((index, input) => input.value)
    .toArray();
}

function regeneratePins() {
  const filters = [
    "furnished",
    "yard",
    "balcony",
    "petsallowed",
    "hydro",
    "heat",
    "water",
    "cabletv",
    "internet",
    "landline",
    "numberbedrooms",
    "numberparkingspots"
  ];
  let filteredApartments = apartments;
  filters.forEach(
    key =>
      (filteredApartments = filteredApartments.filter(apartment =>
        getFilterValuesByName(key).includes(
          (apartment.attributes[key] || 0).toString()
        )
      ))
  );
  if (layerGroup) {
    layerGroup.clearLayers();
  }
  layerGroup = L.layerGroup().addTo(map);
  filteredApartments.forEach(apartment => {
    const location = apartment.attributes.location;
    L.marker([location.latitude, location.longitude], {
      icon: icons[iconIndexes[apartment.attributes.numberbedrooms || 0]]
    })
      .bindPopup(generatePopup(apartment))
      .addTo(layerGroup);
  });
}

function generatePopup({ attributes, title, description, url }) {
  const billsIncluded = [];
  ["Hydro", "Heat", "Water", "Cable TV", "Internet", "Landline"].forEach(
    bill => {
      if (attributes[bill.toLowerCase().replace(" ", "")] == 1) {
        billsIncluded.push(bill);
      }
    }
  );
  return `
  <b>${title}</b><br>
  ${description}<br>
  <br>
  <b>Bedrooms:</b> ${attributes.numberbedrooms}<br>
  <b>Bathrooms:</b> ${attributes.numberbathrooms / 10}<br>
  <b>Parking spots:</b> ${attributes.numberparkingspots}<br>
  <b>Space:</b> ${attributes.areainfeet || 0} sqft<br>
  <b>Furnished:</b> ${attributes.furnished ? "Yes" : "No"}<br>
  <b>Yard:</b> ${attributes.yard ? "Yes" : "No"}<br>
  <b>Balcony:</b> ${attributes.balcony ? "Yes" : "No"}<br>
  <b>Pets allowed:</b> ${attributes.petsallowed ? "Yes" : "No"}<br>
  <b>Smoking allowed:</b> ${
    ["No", "Yes", "Outdoors only"][attributes.smokingpermitted]
  }<br>
  <b>Bills included:</b> ${billsIncluded.join(", ")}<br>
  <b>Price:</b> \$${attributes.price}/month<br>
  <br>
  <a href="${url}">${url}</a>
  `;
}

$(() => {
  const iconUrls = [
    "https://rawcdn.githack.com/pointhi/leaflet-color-markers/575461f7806e2d147a82fbc159aba5e659fbeb4e/img/marker-icon-2x-blue.png",
    "https://rawcdn.githack.com/pointhi/leaflet-color-markers/575461f7806e2d147a82fbc159aba5e659fbeb4e/img/marker-icon-2x-violet.png",
    "https://rawcdn.githack.com/pointhi/leaflet-color-markers/575461f7806e2d147a82fbc159aba5e659fbeb4e/img/marker-icon-2x-green.png",
    "https://rawcdn.githack.com/pointhi/leaflet-color-markers/575461f7806e2d147a82fbc159aba5e659fbeb4e/img/marker-icon-2x-red.png"
  ];
  iconUrls.forEach(url =>
    icons.push(
      new L.Icon({
        iconUrl: url,
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    )
  );

  const filters = [
    { title: "Furnished", name: "furnished" },
    { title: "Yard", name: "yard" },
    { title: "Balcony", name: "balcony" },
    { title: "Pets allowed", name: "petsallowed" },
    { title: "Hydro included", name: "hydro" },
    { title: "Heat included", name: "heat" },
    { title: "Water included", name: "water" },
    { title: "Cable TV included", name: "cabletv" },
    { title: "Internet included", name: "internet" },
    { title: "Landline included", name: "landline" }
  ];
  filters.forEach(filter => {
    const domElement = $(document.createElement("div"));
    domElement.html(`
    <div class="filter-group">
      ${filter.title}:
      <div class="filter">
        <input
          type="checkbox"
          name="${filter.name}"
          id="${filter.name}-yes"
          value="1"
          checked
        />
        <label for="${filter.name}-yes">Yes</label>
      </div>
      <div class="filter">
        <input 
          type="checkbox"
          name="${filter.name}"
          id="${filter.name}-no"
          value="0"
          checked
        />
        <label for="${filter.name}-no">No</label>
      </div>
    </div>
    `);
    $(".apartment-filters").append(domElement);
  });
  const numericFilters = [
    { title: "Bedrooms", name: "numberbedrooms", values: [0, 1, 1.5, 2] },
    { title: "Parking spots", name: "numberparkingspots", values: [0, 1, 2, 3] }
  ];
  numericFilters.forEach(filter => {
    const parentDomElement = $(document.createElement("div"));
    const domElement = $("<div>", {
      class: "filter-group",
      html: filter.title + ":"
    });
    parentDomElement.append(domElement);
    filter.values.forEach(value => {
      domElement.append(
        $("<div>", {
          class: "filter",
          html: `
          <input
            type="checkbox"
            name="${filter.name}"
            id="${filter.name}-${value}"
            value="${value}"
            checked
          />
          <label for="${filter.name}-${value}">${value}</label>
          `
        })
      );
    });
    $(".apartment-filters").append(parentDomElement);
  });
  $("input").on("click", regeneratePins);
  map = L.map("leafletContainer", {
    center: [47.5615, -52.7126],
    zoom: 13
  });
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.control
    .reachability({
      apiKey: "5b3ce3597851110001cf62482ad8bf205457497daaf12a3b94a255a0"
    })
    .addTo(map);

  $.ajax({
    url: "/apartments",
    success: apartmentResp => {
      apartments = apartmentResp;
      regeneratePins();
    }
  });
});
