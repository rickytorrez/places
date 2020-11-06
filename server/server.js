const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

// => /api/places
app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
  // headersSent -> check if the response has already been sent
  if (res.headersSent) {
    // return next and forward the error since we already sent the response
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred!" });
});

app.listen(5000);
