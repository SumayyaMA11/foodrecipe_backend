const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json());

// Check database connection
mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("DB successfully connected..."),
).catch((err) => console.log(err));

// Home page API
app.get('/', (req, res) => {
    res.send("<h1>Welcome to HTML</h1>");
});

// Registration API
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.json({ message: "User Registered..." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials..." });
        }
        res.json({ message: "Login Successful", username: user.username });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Recipe APIs

// Create Recipe
app.post('/recipes', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { name, ingredients, timeToCook, steps } = req.body;
        
        // Validate required fields
        if (!name || !ingredients || !timeToCook || !steps) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const recipe = new Recipe({ name, ingredients, timeToCook, steps });
        await recipe.save();
        res.json({ message: "Recipe created successfully", recipe });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


// Get all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.json(recipe);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update Recipe
app.put('/recipes/:id', async (req, res) => {
    const { name, ingredients, timeToCook, steps } = req.body;
    try {
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { name, ingredients, timeToCook, steps },
            { new: true }
        );
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.json({ message: "Recipe updated successfully", recipe });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete Recipe
app.delete('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
