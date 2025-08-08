// Load environment variables
require('dotenv').config();

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const swaggerDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const nodemailer = require('nodemailer');


// Custom modules
const newsRoutes = require('./src/routes/newRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const User = require('./src/models/user'); // Adjust path as needed

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "News Summary",
      version: "1.0.0",
      description: "A basic news summary application"
    },
    servers: [
      { url: "http://localhost:3000/api/news" }
    ]
  },
  apis: ["./src/routes/newRoutes.js"]
};

const specs = swaggerDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/news', newsRoutes);

// User registration route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Swagger documentation route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

//nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

