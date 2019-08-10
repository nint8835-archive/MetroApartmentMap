const kijiji = require("kijiji-scraper");
const fs = require("fs");

const LOCATION = kijiji.locations.NEWFOUNDLAND.ST_JOHNS;
const CATEGORY = kijiji.categories.REAL_ESTATE.FOR_RENT.LONG_TERM_RENTALS;

const NUMBER_OF_BEDROOMS = [0, 1, 1.5, 2];
const NUMBER_OF_PARKING_SPOTS = [0, 1, 2, 3];

async function getApartments() {
  const ads = await kijiji.search(
    {
      locationId: LOCATION,
      categoryId: CATEGORY,
      "attributeMap[numberbedrooms_s]": NUMBER_OF_BEDROOMS,
      "attributeMap[numberparkingspots_s]": NUMBER_OF_PARKING_SPOTS,
      adType: "OFFER"
    },
    {
      minResults: 500
    }
  );
  return ads.map(apartment => ({
    ...apartment,
    description: apartment.description.split("\n\n").join("<br>")
  }));
}

getApartments().then(apartments => {
  fs.writeFile("apartments.json", JSON.stringify(apartments), "utf8", () => {});
});
