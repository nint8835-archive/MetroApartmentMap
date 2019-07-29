function generatePopup(apartment) {
  const billsIncluded = [];
  ["Hydro", "Heat", "Water", "Cable TV", "Internet", "Landline"].forEach(
    bill => {
      if (apartment.attributes[bill.toLowerCase().replace(" ", "")] == 1) {
        billsIncluded.push(bill);
      }
    }
  );
  return `
  <b>${apartment.title}</b><br>
  ${apartment.description.replace("\\n", "<br>")}<br>
  <br>
  <b>Bedrooms:</b> ${apartment.attributes.numberbedrooms}<br>
  <b>Bathrooms:</b> ${apartment.attributes.numberbathrooms / 10}<br>
  <b>Parking spots:</b> ${apartment.attributes.numberparkingspots}<br>
  <b>Space:</b> ${apartment.attributes.areainfeet || 0} sqft<br>
  <b>Furnished:</b> ${apartment.attributes.furnished ? "Yes" : "No"}<br>
  <b>Yard:</b> ${apartment.attributes.yard ? "Yes" : "No"}<br>
  <b>Balcony:</b> ${apartment.attributes.balcony ? "Yes" : "No"}<br>
  <b>Pets allowed:</b> ${apartment.attributes.petsallowed ? "Yes" : "No"}<br>
  <b>Smoking allowed:</b> ${
    ["No", "Yes", "Outdoors only"][apartment.attributes.smokingpermitted]
  }<br>
  <b>Bills included:</b> ${billsIncluded.join(", ")}<br>
  <b>Price:</b> \$${apartment.attributes.price}/month<br>
  <br>
  <a href="${apartment.url}">${apartment.url}</a>
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
