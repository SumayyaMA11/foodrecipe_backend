const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    timeToCook: { type: String, required: true },
    steps: { type: [String], required: true },  // Changed steps to an array of strings
}, { timestamps: true }); // Adds createdAt & updatedAt fields

module.exports = mongoose.model('Recipe', RecipeSchema);
