export const fetchGitHubIssues = async (args, context) => {
  const {
    language = '',
    difficulty = 'good first issue',
    taskType = '',
    page = 1,
    perPage = 10,
  } = args;

  const labels = [difficulty, taskType].filter(Boolean).map(l => `label:"${l}"`).join(' ');
  const languagePart = language ? `language:${language}` : '';

  const query = `is:issue is:open ${labels} ${languagePart}`.trim();
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&page=${page}&per_page=${perPage}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const data = await response.json();

  if (!Array.isArray(data.items)) {
    console.error('GitHub API error:', data);
    throw new Error(data.message || 'Failed to fetch issues from GitHub');
  }

  const validIssues = data.items.filter(issue => !issue.pull_request);
  return {
    issues: validIssues.map(issue => ({
      githubIssueId: issue.id.toString(),
      title: issue.title,
      description: issue.body || 'No description provided',
      repository: issue.repository_url.split('/').slice(-2).join('/'),
      url: issue.html_url,
      labels: issue.labels || [],
    })),
    hasMore: validIssues.length === perPage,
    page,
  };
};
