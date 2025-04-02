const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  preparationSteps: { type: [String], required: true },
  cookingTime: { type: String, required: true },
  origin: { type: String, required: true },
  spiceLevel: { type: String, default: 'Medium' },
  servings: { type: Number, default: 4 },
  difficulty: { type: String, default: 'Medium' }
});

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;
