/**
 * Global Media news portal script
 *
 * This script fetches news articles from `data/news.json`, builds the category
 * filter, and renders the news list. It also handles search and filter
 * interactions. The data file is kept separate so that a GitHub Action can
 * update it automatically when new articles are approved.
 */
async function loadNews() {
  try {
    const response = await fetch('data/news.json');
    const articles = await response.json();

    // Populate category filter with unique categories
    const categories = new Set();
    articles.forEach((article) => {
      if (article.category) {
        categories.add(article.category.trim());
      }
    });

    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach((cat) => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    // Render all articles initially
    displayArticles(articles);

    // Attach search and filter handlers
    document.getElementById('searchInput').addEventListener('input', () => {
      filterArticles(articles);
    });
    categoryFilter.addEventListener('change', () => {
      filterArticles(articles);
    });

    // Update footer year
    document.getElementById('year').textContent = new Date().getFullYear();
  } catch (err) {
    console.error('Failed to load news:', err);
  }
}

/**
 * Display the given list of articles in the #newsContainer.
 * @param {Array} articles - list of article objects
 */
function displayArticles(articles) {
  const container = document.getElementById('newsContainer');
  container.innerHTML = '';
  if (!articles.length) {
    container.innerHTML = '<p>No articles found.</p>';
    return;
  }
  articles.forEach((article) => {
    const div = document.createElement('div');
    div.className = 'article';

    const headline = document.createElement('h3');
    headline.textContent = article.headline;
    div.appendChild(headline);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const dateStr = article.date ? new Date(article.date).toLocaleDateString() : '';
    meta.textContent = `${dateStr}${article.author ? ' | ' + article.author : ''}${article.category ? ' | ' + article.category : ''}`;
    div.appendChild(meta);

    const content = document.createElement('p');
    content.textContent = article.content;
    div.appendChild(content);

    container.appendChild(div);
  });
}

/**
 * Filter articles based on the search input and category selection.
 * @param {Array} allArticles - master list of all articles
 */
function filterArticles(allArticles) {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filtered = allArticles.filter((article) => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesQuery =
      article.headline.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      (article.author && article.author.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });
  displayArticles(filtered);
}

// Load articles when the DOM is ready
window.addEventListener('DOMContentLoaded', loadNews);
