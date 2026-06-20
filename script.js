let articles = [];
let currentIndex = 0;

function getTitle(article) {
  return article.heading || article.headline || article.title || 'Untitled News';
}

function getDescription(article) {
  return article.description || article.content || article.body || 'No description available.';
}

function getDateValue(article) {
  return article.datetime || article.dateTime || article.date || article.created_at || '';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function safeImageUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? url : '';
  } catch {
    return '';
  }
}

function sortByNewest(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(getDateValue(a)).getTime() || 0;
    const dateB = new Date(getDateValue(b)).getTime() || 0;
    return dateB - dateA;
  });
}

function renderArticle() {
  const container = document.getElementById('article-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!container) return;

  if (!articles.length) {
    container.innerHTML = `
      <section class="empty-state">
        <h3>No published news yet</h3>
        <p>Approved submissions will appear here in newest-first order.</p>
      </section>
    `;
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const article = articles[currentIndex];
  const imageUrl = safeImageUrl(article.image || article.imageUrl || article.image_url);
  const metaParts = [
    formatDate(getDateValue(article)),
    article.category,
    article.author
  ].filter(Boolean);

  container.innerHTML = `
    <div class="edition-bar">
      <span>Published News</span>
      <span>${currentIndex + 1} of ${articles.length}</span>
    </div>
    <article class="news-article">
      <h3 class="article-heading"></h3>
      <div class="article-meta"></div>
      ${imageUrl ? '<img class="article-image" alt="News image" />' : ''}
      <div class="article-description"></div>
    </article>
  `;

  container.querySelector('.article-heading').textContent = getTitle(article);
  container.querySelector('.article-meta').textContent = metaParts.join(' | ');
  container.querySelector('.article-description').textContent = getDescription(article);

  const imageElement = container.querySelector('.article-image');
  if (imageElement) {
    imageElement.src = imageUrl;
  }

  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = currentIndex === articles.length - 1;
}

async function loadNews() {
  try {
    const response = await fetch('data/news.json', { cache: 'no-store' });
    const rawArticles = await response.json();
    articles = sortByNewest(Array.isArray(rawArticles) ? rawArticles : []);
    renderArticle();
  } catch (error) {
    const container = document.getElementById('article-container');
    if (container) {
      container.innerHTML = `
        <section class="empty-state">
          <h3>Unable to load news</h3>
          <p>Please refresh the page after a moment.</p>
        </section>
      `;
    }
    console.error('Failed to load news:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        renderArticle();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < articles.length - 1) {
        currentIndex += 1;
        renderArticle();
      }
    });
  }

  loadNews();
});
