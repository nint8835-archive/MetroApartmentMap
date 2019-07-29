const apartments = require("./apartments.json");

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
    console.log("Server listening on port 3000");
  });
});
