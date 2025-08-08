const express = require('express');
const router = express.Router();
const { getNewsFeed, getNewsSummary } = require('../controllers/newsController');

/**
 * @swagger
 * /api/news/feed:
 *   get:
 *     summary: Get news feed
 *     description: Fetch latest news headlines from NewsData.io
 *     responses:
 *       200:
 *         description: Successfully retrieved news feed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   keywords:
 *                     type: array
 *                     items:
 *                       type: string
 *                   pubDate:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/feed', getNewsFeed);         // Get news feed

/**
 * @swagger
 * /api/news/summarize:
 *   post:
 *     summary: Summarize an article
 *     description: Generate a summary of an article using either provided text or a specific article index from the news feed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the article to summarize
 *               description:
 *                 type: string
 *                 description: The description or main content of the article
 *               keywords:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Keywords associated with the article
 *               articleIndex:
 *                 type: integer
 *                 description: Index of the article from the news feed to summarize
 *             required:
 *               - articleIndex
 *             oneOf:
 *               - required: [title]
 *               - required: [description]
 *               - required: [keywords]
 *               - required: [articleIndex]
 *     responses:
 *       200:
 *         description: Successfully summarized article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *       400:
 *         description: Bad request (missing required fields or invalid article index)
 *       500:
 *         description: Server error
 */
router.post('/summarize', getNewsSummary); // Summarize an article

module.exports = router;