// server.js - Main Backend Entry
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const logmealRoutes = require("./routes/logmealRoutes");


dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

// Use the LogMeal route
app.use("/api/logmeal", logmealRoutes);

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(PORT, () => {
      console.log("Connected to DB & listening on port", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
