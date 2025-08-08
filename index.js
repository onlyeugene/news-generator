const express = require('express');
const path = require('path');
const newsRoutes = require('./src/routes/newRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
require('dotenv').config();
const swaggerDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');

const app = express();

// Determine server URL based on environment
const serverUrl = process.env.NODE_ENV === 'production'
  ? process.env.SERVER_URL || 'https://https://news-generator-zkw4.onrender.com'
  : 'http://localhost:8050';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'News Summary',
      version: '1.0.0',
      description: 'A basic news summary application',
    },
    servers: [
      { url: `${serverUrl}/api/news` },
    ],
  },
  apis: ['./src/routes/newRoutes.js'],
};

const specs = swaggerDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(cors());

// Routes
app.use('/api/news', newsRoutes);

// Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});