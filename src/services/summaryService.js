const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple keyword extraction function
function extractKeywords(text) {
  if (!text) return [];
  // Basic keyword extraction: split by spaces, filter common words, take top 5
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5);
}

async function summarizeArticle({ title, description, keywords }) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    // Validate input: at least one of title, description, or keywords must be provided
    if (!title && !description && (!keywords || !keywords.length)) {
      throw new Error('At least one of title, description, or keywords must be provided');
    }

    // Construct input text based on available fields
    let inputText = '';
    if (title) inputText += `Title: ${title}\n`;
    if (description) inputText += `Description: ${description}\n`;
    if (keywords && keywords.length) inputText += `Keywords: ${keywords.join(', ')}`;

    // If only keywords are provided, use them directly
    if (!title && !description && keywords && keywords.length) {
      inputText = `Keywords: ${keywords.join(', ')}`;
    }

    // console.log('Summarizing input:', inputText); // Debug: Log input text

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize the main points of this news item in 2-3 sentences, avoiding technical jargon, based on the following information: ${inputText}`;

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
    console.error('Gemini API error:', error.message);
    throw new Error(`Failed to summarize article: ${error.message}`);
  }
}

module.exports = { summarizeArticle };