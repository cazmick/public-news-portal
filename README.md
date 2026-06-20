# Global Media

Global Media is a lightweight, static, and community‑driven news portal designed for GitHub Pages. The goal of this project is to provide a simple, public platform where anyone can submit news articles while the site owner retains full publishing control.

## Features

- **Public news submissions** – Visitors can submit news articles using a GitHub Issue form. Submissions include headline, category, author and full content.
- **Owner‑approved publishing** – A GitHub Actions workflow listens for issues labelled `approved`. When the owner approves a submission by applying the `approved` label, the workflow runs a script to add the article to `data/news.json` and commits it back to the repository.
- **Search and category filter** – The frontend written in plain HTML, CSS and JavaScript allows readers to search articles and filter by category.
- **Simple data storage** – All posts are stored in a JSON file (`data/news.json`) which is loaded by the site at runtime. No database or backend server is required.
- **Customisable** – Adjust the categories in the issue template or change the styling by editing `style.css`. Extend functionality by modifying the JavaScript (`script.js`) or the publish script (`scripts/publish.js`).

## Getting started

1. Fork or clone this repository and enable GitHub Pages on the `main` branch via the repository’s Settings.
2. Create two labels in your repository: `news-submission` and `approved`.
3. Visitors can submit news articles by opening a new issue using the “Submit news” form on the site. Review submissions and apply the `approved` label when you’re ready to publish.
4. The `publish-news` GitHub Actions workflow runs automatically when a submission is approved, updating `data/news.json` with the new article.

## Contributing

Contributions are welcome! Feel free to open an issue or pull request to improve the portal, enhance the workflow or add new features.
