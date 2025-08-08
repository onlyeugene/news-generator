async function loadNews() {
  try {
    const feed = document.getElementById('news-feed');
    feed.innerHTML = '<p class="text-gray-600">Loading news...</p>'; // Loading state


    // Assuming process.env.WEB_URL is not directly accessible in JavaScript
    // Using a fallback URL for demonstration purposes
    const url = 'https://news-generator-zkw4.onrender.com/api/news/feed';
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }
    const articles = await response.json();
    
    feed.innerHTML = ''; // Clear loading state
    if (!articles || articles.length === 0) {
      feed.innerHTML = '<p class="text-gray-600">No news articles available.</p>';
      return;
    }

    articles.forEach((article, index) => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer';
      div.innerHTML = `
        <h2 class="text-xl font-semibold text-gray-800">${article.title || 'No title'}</h2>
        <p class="text-gray-600 mt-2">${article.description || 'No description available'}</p>
        ${article.keywords ? `<p class="text-sm text-gray-500 mt-2">Keywords: ${article.keywords.join(', ')}</p>` : ''}
      `;
      // div.onclick = () => getSummary({ title: article.title, description: article.description, keywords: article.keywords, articleIndex: index });
      feed.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading news:', error.message);
    document.getElementById('news-feed').innerHTML = `<p class="text-red-600">Failed to load news: ${error.message}. Please try again.</p>`;
  }
}

async function getSummary({ title, description, keywords, articleIndex }) {
  try {
    const summaryOutput = document.getElementById('summary-output');
    const summaryText = document.getElementById('summary-text');
    summaryOutput.innerHTML = '<p class="text-gray-600">Generating summary...</p>'; // Loading state
    summaryOutput.classList.remove('hidden');
    // Assuming process.env.WEB_URL is not directly accessible in JavaScript
    // Using a fallback URL for demonstration purposes
    const url = 'https://news-generator-zkw4.onrender.com/api/news/summarize';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, keywords, articleIndex }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to summarize: ${response.status} ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }
    const { summary } = await response.json();
    
    if (summaryText) {
      summaryText.textContent = summary || 'No summary available';
    }
    summaryOutput.innerHTML = `
      <h3 class="text-lg font-semibold text-gray-700">Summary</h3>
      <p class="text-gray-600">${summary || 'No summary available'}</p>
    `;
    
    // Populate textarea with input for reference
    document.getElementById('article-input').value = description || title || keywords?.join(', ') || '';
  } catch (error) {
    console.error('Error summarizing article:', error.message);
    document.getElementById('summary-output').innerHTML = `<p class="text-red-600">Failed to generate summary: ${error.message}. Please try again.</p>`;
    document.getElementById('summary-output').classList.remove('hidden');
  }
}

// Event listeners
document.getElementById('get-news-btn').addEventListener('click', () => {
  document.getElementById('news-feed').innerHTML = '<p class="text-gray-600">Loading news...</p>';
  loadNews();
});
document.getElementById('summarize-btn').addEventListener('click', () => {
  const articleText = document.getElementById('article-input').value;
  if (articleText) {
    getSummary({ description: articleText });
  } else {
    document.getElementById('summary-output').innerHTML = '<p class="text-red-600">Please enter article text or select an article.</p>';
    document.getElementById('summary-output').classList.remove('hidden');
  }
});

// Load news on page load
// loadNews(); // Commented out to only load news on button click