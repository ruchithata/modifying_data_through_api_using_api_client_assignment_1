const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Add this line to load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MongoDB Atlas URI (replace with your own URI)
const connectionString = process.env.DB_URL; // Use the environment variable

// Connect to MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Define the schema for the menu item
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
});

// Create the model for the menu item
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// POST route to create a new menu item
app.post('/menu', async (req, res) => {
  const { name, description, price } = req.body;

  // Basic validation
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required.' });
  }

  try {
    // Create new menu item
    const newItem = new MenuItem({ name, description, price });
    await newItem.save();

    res.status(201).json({
      message: 'Menu item created successfully!',
      item: newItem,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET route to fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    // Fetch all menu items
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching menu items. Please try again later.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
