const fs = require('fs');

function parseIssueBody(body) {
  const lines = body.split('\n');
  const result = {};
  let currentKey = null;
  lines.forEach(line => {
    if (line.startsWith('### ')) {
      currentKey = line.substring(4).trim().toLowerCase();
      result[currentKey] = '';
    } else if (currentKey) {
      result[currentKey] += (result[currentKey] ? '\n' : '') + line.trim();
    }
  });
  return {
    title: result['headline'] || '',
    category: result['category'] || '',
    author: result['author'] || '',
    content: result['content'] || ''
  };
}

function run() {
  // Read GitHub event payload from environment variable
  const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const issue = payload.issue;

  // Parse issue body into structured news
  const { title, category, author, content } = parseIssueBody(issue.body);

  // Path to the news JSON file
  const newsPath = 'data/news.json';
  const newsData = JSON.parse(fs.readFileSync(newsPath, 'utf8'));

  // Use issue creation time as date
  const timestamp = new Date(issue.created_at).toISOString();

  // Add new post at the beginning of the array
  newsData.unshift({ title, category, author, content, date: timestamp });

  // Write updated news data back to file
  fs.writeFileSync(newsPath, JSON.stringify(newsData, null, 2));
}

run();
