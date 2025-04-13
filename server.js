
// Load environment variables

require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

// Serves index.html when visiting /
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); 

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model for Dishes and custom field
const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ingredients: [String],
  preparationSteps: [String],
  cookingTime: Number,
  origin: String,
  spiceLevel: String, 
});

const Dish = mongoose.model("Dish", dishSchema);

// Routes
// GET all dishes
app.get("/api/dishes", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dishes" });
  }
});

// GET a single dish by name
app.get("/api/dishes/:name", async (req, res) => {
  try {
    const dish = await Dish.findOne({ name: req.params.name });
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dish" });
  }
});

// POST - Add a new dish
app.post("/api/dishes", async (req, res) => {
  try {
    const existingDish = await Dish.findOne({ name: req.body.name });
    if (existingDish) return res.status(409).json({ message: "Dish already exists" });

    const newDish = new Dish(req.body);
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ message: "Error adding dish" });
  }
});

// PUT - Update a dish by ID
app.put("/api/dishes/:id", async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) return res.status(404).json({ message: "Dish not found" });
    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: "Error updating dish" });
  }
});

// DELETE - Remove a dish by ID
app.delete("/api/dishes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedDish = await Dish.findByIdAndDelete(id);
    if (!deletedDish) return res.status(404).json({ message: "Dish not found" });

    res.json({ message: "Dish deleted successfully", dish: deletedDish });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ message: "Error deleting dish" });
  }
});
// add dishes to the menu
async function seedDatabase() {
    await Dish.deleteMany({}); 
    const sampleDishes = [
      {
        name: "Spaghetti Carbonara",
        ingredients: ["Spaghetti", "Eggs", "Parmesan", "Bacon", "Black Pepper"],
        preparationSteps: ["Cook pasta", "Mix eggs and cheese", "Fry bacon", "Combine all ingredients"],
        cookingTime: 20,
        origin: "Italy",
        spiceLevel: "Low",
      },
      {
        name: "Sushi",
        ingredients: ["Rice", "Nori", "Fish", "Soy Sauce", "Wasabi"],
        preparationSteps: ["Prepare rice", "Slice fish", "Roll sushi", "Serve with soy sauce"],
        cookingTime: 40,
        origin: "Japan",
        spiceLevel: "Medium",
      },
      {
        name: "Tacos",
        ingredients: ["Tortillas", "Beef", "Lettuce", "Tomato", "Cheese"],
        preparationSteps: ["Cook beef", "Prepare toppings", "Assemble tacos"],
        cookingTime: 30,
        origin: "Mexico",
        spiceLevel: "High",
      },
      {
        name: "Pad Thai",
        ingredients: ["Rice noodles", "Eggs", "Shrimp", "Peanuts", "Lime"],
        preparationSteps: ["Cook noodles", "Stir-fry ingredients", "Mix sauce", "Serve with peanuts"],
        cookingTime: 25,
        origin: "Thailand",
        spiceLevel: "Medium",
      },
      {
        name: "Moms’s Special Stew", // Personal Dish
        ingredients: ["Beef", "Carrots", "Potatoes", "Tomato Paste", "Garlic"],
        preparationSteps: ["Brown beef", "Add vegetables", "Simmer", "Serve hot"],
        cookingTime: 90,
        origin: "Family Recipe",
        spiceLevel: "Medium",
      },
    ];
    await Dish.insertMany(sampleDishes);
    console.log("✅ Sample dishes added to database!");
  }
  seedDatabase();
  


// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
