const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const User = require('./models/User');
// const bcrypt = require('bcrypt');

// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if user already exists
//         const existingUser  = await User.findOne({ email });
//         if (existingUser ) {
//             return res.status(400).json({ message: 'User  already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const user = new User({ email, password: hashedPassword });
//         await user.save();

//         res.status(201).json({ message: 'User  registered successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });


// src/controllers/authController.js
const { registerUser } = require('../services/authService');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
