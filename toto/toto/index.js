const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./app/authentication/routes"); // Import your auth routes
const dmr = require("./app/dmr/routes"); // Import your auth routes
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8081;
const cors = require("cors");

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/login", authRoutes);
app.use("/api/sensor_data/", dmr);


