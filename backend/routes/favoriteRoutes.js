import express from "express";
import Favorite from "../models/Favorite.js";

const router = express.Router();

/* ============================
   ✅ ADD MOVIE TO FAVORITES
============================ */
router.post("/", async (req, res) => {
  try {
    const { movieId, title, poster, rating, likedBy } = req.body;

    // Validate required fields
    if (!movieId || !title || !likedBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if already exists
    const existing = await Favorite.findOne({ movieId, likedBy });
    if (existing) {
      return res.status(200).json({ message: "Already in favorites" });
    }

    // Save new favorite
    const favorite = new Favorite({ movieId, title, poster, rating, likedBy });
    await favorite.save();

    console.log(`✅ Added favorite for ${likedBy}: ${title}`);
    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (err) {
    console.error("❌ Error adding favorite:", err);
    res.status(500).json({ error: err.message || "Failed to add favorite" });
  }
});

/* ============================
   ✅ GET FAVORITES BY USER
============================ */
router.get("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    console.log("📥 Fetching favorites for user:", user);

    // Find all favorites for the given user
    const favorites = await Favorite.find({ likedBy: user });

    console.log("📦 Favorites found:", favorites?.length);
    res.json(Array.isArray(favorites) ? favorites : []);
  } catch (err) {
    console.error("❌ Error fetching favorites:", err);
    res.status(500).json({ error: err.message || "Failed to fetch favorites" });
  }
});

/* ============================
   ✅ REMOVE FAVORITE
============================ */
router.delete("/:movieId/:user", async (req, res) => {
  try {
    const { movieId, user } = req.params;
    console.log(`🗑 Removing favorite ${movieId} for ${user}`);

    const deleted = await Favorite.findOneAndDelete({ movieId, likedBy: user });

    if (!deleted) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    console.log("✅ Removed favorite:", deleted.title);
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("❌ Error removing favorite:", err);
    res.status(500).json({ error: err.message || "Failed to remove favorite" });
  }
});

export default router;
