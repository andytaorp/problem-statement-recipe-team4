const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/detect", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log("Using LogMeal API Key:", process.env.LOGMEAL_API_KEY);

    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    // Step 1: Detect food items using LogMeal API
    const response = await fetch("https://api.logmeal.es/v2/image/recognition/complete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LOGMEAL_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("LogMeal API Response:", data);

    if (!response.ok || !data.imageId) {
      return res.status(400).json({ error: "Food recognition failed or no imageId returned" });
    }

    // Step 2: Fetch nutritional information using the imageId
    const nutritionResponse = await fetch("https://api.logmeal.es/v2/recipe/nutritionalInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LOGMEAL_API_KEY}`,
      },
      body: JSON.stringify({ imageId: data.imageId }),
    });

    const nutritionData = await nutritionResponse.json();
    console.log("LogMeal Nutrition Response:", nutritionData);

    if (!nutritionResponse.ok) {
      return res.status(400).json({ error: "Failed to retrieve nutritional information" });
    }

    // Combine food recognition and nutritional info
    res.json({
      recognition: data,
      nutrition: nutritionData,
    });

  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;
