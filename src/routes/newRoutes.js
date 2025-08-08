const express = require('express');
const router = express.Router();
const { getNewsFeed, getNewsSummary, register } = require('../controllers/newsController');


/**
 * @swagger
 * /api/news/feed:
 *   get:
 *     summary: Get news feed
 *     description: Fetch latest news headlines
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
 *                   content:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/feed', getNewsFeed);         // Get news feed

/**
 * @swagger
 * /api/news/summarize:
 *   post:
 *     summary: Summarize an article
 *     description: Generate a summary of the provided article text
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleText:
 *                 type: string
 *             required:
 *               - articleText
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
 *         description: Bad request (missing articleText)
 *       500:
 *         description: Server error
 */
router.post('/summarize', getNewsSummary); // Summarize an article

/**
 * @swagger
 * /api/news/register:
 *   post:
 *     summary: Register email
 *     description: Register the email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleText:
 *                 type: string
 *             required:
 *               - email
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
 *         description: Bad request (missing email)
 *       500:
 *         description: Server error
 */
router.post('/register', register ); // Register email

// router.post('/register', register);

module.exports = router;


