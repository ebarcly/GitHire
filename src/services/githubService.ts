interface RepoData {
  name: string;
  description: string;
  language: string;
  languages: Record<string, number>;
  stars: number;
  forks: number;
  openIssues: number;
  hasReadme: boolean;
  hasLicense: boolean;
  hasTests: boolean;
  hasCi: boolean;
  hasDocumentation: boolean;
  fileStructure: string[];
  commits: number;
  contributors: number;
  lastUpdated: string;
}

export class GitHubService {
  private baseUrl = 'https://api.github.com';

  private parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2].replace('.git', '') };
      }
    }
    return null;
  }

  async fetchRepoData(repoUrl: string): Promise<RepoData> {
    const parsed = this.parseRepoUrl(repoUrl);
    if (!parsed) {
      throw new Error('Invalid GitHub repository URL');
    }

    const { owner, repo } = parsed;

    try {
      // Fetch main repo data
      const repoResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`);
      if (!repoResponse.ok) {
        throw new Error('Repository not found or is private');
      }
      const repoData = await repoResponse.json();

      // Fetch languages
      const languagesResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/languages`);
      const languages = languagesResponse.ok ? await languagesResponse.json() : {};

      // Fetch contents to check for important files
      const contentsResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents`);
      const contents = contentsResponse.ok ? await contentsResponse.json() : [];
      
      const fileNames = Array.isArray(contents) ? contents.map((f: any) => f.name.toLowerCase()) : [];
      
      // Check for README
      const hasReadme = fileNames.some(name => name.startsWith('readme'));
      
      // Check for LICENSE
      const hasLicense = fileNames.some(name => name.includes('license')) || !!repoData.license;
      
      // Check for tests
      const hasTests = fileNames.some(name => 
        name.includes('test') || name.includes('spec') || name === '__tests__'
      );
      
      // Check for CI/CD
      const hasCi = fileNames.some(name => 
        name === '.github' || name === '.gitlab-ci.yml' || 
        name === '.travis.yml' || name === 'jenkinsfile'
      );
      
      // Check for documentation
      const hasDocumentation = fileNames.some(name => 
        name === 'docs' || name === 'documentation' || name.includes('doc')
      );

      // Fetch commits count
      const commitsResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=1`);
      const commitsLink = commitsResponse.headers.get('Link');
      const commits = commitsLink ? this.extractCommitCount(commitsLink) : 0;

      // Fetch contributors count
      const contributorsResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contributors?per_page=1`);
      const contributorsLink = contributorsResponse.headers.get('Link');
      const contributors = contributorsLink ? this.extractContributorCount(contributorsLink) : 1;

      return {
        name: repoData.name,
        description: repoData.description || '',
        language: repoData.language || 'Unknown',
        languages,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        openIssues: repoData.open_issues_count,
        hasReadme,
        hasLicense,
        hasTests,
        hasCi,
        hasDocumentation,
        fileStructure: fileNames,
        commits,
        contributors,
        lastUpdated: repoData.updated_at
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch repository data');
    }
  }

  private extractCommitCount(linkHeader: string): number {
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  }

  private extractContributorCount(linkHeader: string): number {
    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  }
}

export const githubService = new GitHubService();
