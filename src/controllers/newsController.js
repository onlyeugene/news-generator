const { fetchNews } = require('../services/newsService');
const { summarizeArticle } = require('../services/summaryService');

const getNewsFeed = async (req, res, next) => {
  try {
    const articles = await fetchNews();
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

const getNewsSummary = async (req, res, next) => {
  try {
    const { title, description, keywords, articleIndex } = req.body;

    // If articleIndex is provided, fetch a specific article from NewsData.io
    if (articleIndex !== undefined) {
      const articles = await fetchNews();
      if (articleIndex < 0 || articleIndex >= articles.length) {
        return res.status(400).json({ error: 'Invalid article index' });
      }
      const article = articles[articleIndex];
      const summary = await summarizeArticle({
        title: article.title,
        description: article.description,
        keywords: article.keywords || extractKeywords(article.description),
      });
      return res.json({ summary });
    }

    // Otherwise, use provided title, description, or keywords
    if (!title && !description && (!keywords || !keywords.length)) {
      return res.status(400).json({ error: 'At least one of title, description, or keywords is required' });
    }

    const summary = await summarizeArticle({ title, description, keywords });
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNewsFeed, getNewsSummary };