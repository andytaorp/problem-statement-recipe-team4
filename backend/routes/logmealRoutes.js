const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
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

    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: "image.jpg",
      contentType: "image/jpeg", // Change based on image type
    });

    const response = await fetch("https://api.logmeal.es/v2/recognition/dish", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LOGMEAL_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;