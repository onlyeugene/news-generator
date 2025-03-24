const express = require('express');
const newsRoutes = require('./src/routes/newRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
require('dotenv').config();
const app = express();
const swaggerDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "News Summary",
      version: "1.0.0",
      description: "A basic news summary application" 
    },
    servers: [
      {url: "http://localhost:3000/api/news"}
    ]
  },
  apis: ["./src/routes/newRoutes.js"]
}

const specs = swaggerDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Routes
app.use('/api/news', newsRoutes);

// Error handling
app.use(errorHandler);

// Documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});