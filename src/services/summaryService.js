const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeArticle(articleText) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    if (typeof articleText !== 'string' || !articleText.trim()) {
      throw new Error('Article text must be a non-empty string');
    }

    console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY.slice(0, 4) + '...'); // Debug: Log first 4 chars

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize this article in 2-3 sentences, avoiding technical jargon and focusing on the main points: ${articleText}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    const summary = result.response.text();
    return summary;
  } catch (error) {
    console.error('Gemini API error:', error.message, error.stack);
    throw new Error(`Failed to summarize article: ${error.message}`);
  }
}

module.exports = { summarizeArticle };