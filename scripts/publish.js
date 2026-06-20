const fs = require('fs');

function parseIssueBody(body) {
  const lines = body.split('\n');
  const result = {};
  let currentKey = null;

  lines.forEach((line) => {
    if (line.startsWith('### ')) {
      currentKey = line.substring(4).trim().toLowerCase();
      result[currentKey] = '';
    } else if (currentKey) {
      result[currentKey] += `${result[currentKey] ? '\n' : ''}${line.trim()}`;
    }
  });

  return {
    heading: result.headline || '',
    image: result['image url'] || '',
    category: result.category || '',
    author: result.author || '',
    description: result['news description'] || result.content || '',
  };
}

function run() {
  const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const issue = payload.issue;
  const parsedNews = parseIssueBody(issue.body || '');
  const newsPath = 'data/news.json';
  const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));

  newsData.unshift({
    id: issue.number,
    heading: parsedNews.heading,
    image: parsedNews.image,
    category: parsedNews.category,
    author: parsedNews.author,
    description: parsedNews.description,
    date: new Date().toISOString(),
    submittedAt: issue.created_at,
    submittedVia: issue.html_url,
  });

  newsData.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  fs.writeFileSync(newsPath, JSON.stringify(newsData, null, 2));
}

run();
