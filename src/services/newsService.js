const axios = require('axios');
const config = require('../config/config');

async function fetchNews() {
  try {
    const response = await axios.get('https://newsdata.io/api/1/latest', {
      params: {
        apikey: process.env.NEWSDATA_API_KEY, // Use a clear variable name
        language: 'en', // Match your previous language setting
        country: 'us',
        // size: 20, // Match your previous pageSize
      },
    });
    return response.data.results; // Access the correct field for articles
  } catch (error) {
    console.error('NewsData.io Error:', error.response ? error.response.data : error.message);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}

module.exports = { fetchNews };