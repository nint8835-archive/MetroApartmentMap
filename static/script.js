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
  const map = L.map("leafletContainer", {
    center: [47.5615, -52.7126],
    zoom: 13
  });
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  $.ajax({
    url: "/apartments",
    success: apartments => {
      apartments.forEach(apartment => {
        const location = apartment.attributes.location;
        L.marker([location.latitude, location.longitude])
          .bindPopup(generatePopup(apartment))
          .addTo(map);
      });
    }
  });
});
