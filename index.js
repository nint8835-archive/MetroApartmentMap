const kijiji = require("kijiji-scraper");
const express = require("express");

const LOCATION = kijiji.locations.NEWFOUNDLAND.ST_JOHNS;
const CATEGORY = kijiji.categories.REAL_ESTATE.APARTMENTS_AND_CONDOS_FOR_RENT;

const NUMBER_OF_BEDROOMS = [0, 1, 1.5];
const NUMBER_OF_PARKING_SPOTS = [1, 2, 3];

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
      minResults: 200
    }
  );
  return ads.map(apartment => ({
    ...apartment,
    description: apartment.description.split("\n\n").join("<br>")
  }));
}

getApartments().then(apartments => {
  const app = express();
  app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "static/" });
  });

  app.get("/apartments", (req, res) => {
    res.json(apartments);
  });

  app.use("/static", express.static("static"));
  app.use("/node_modules", express.static("node_modules"));

  app.listen(3000, () => {
    console.log("Server listening");
  });
});
