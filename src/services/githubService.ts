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

  private checkForTestFiles(fileNames: string[]): boolean {
    const testPatterns = [
      'test',
      'spec',
      '__tests__',
      'jest.config.js',
      'jest.config.ts',
      'jest.config.json',
      'pytest.ini',
      'pyproject.toml',
      'tox.ini',
      'mocha.opts',
      'karma.conf.js',
      'vitest.config.js',
      'vitest.config.ts',
      'cypress.config.js',
      'playwright.config.js',
      'playwright.config.ts',
    ];

    return fileNames.some((name) =>
      testPatterns.some((pattern) => name.includes(pattern) || name === pattern)
    );
  }

  private checkForCiFiles(fileNames: string[]): boolean {
    const ciPatterns = [
      '.github',
      '.gitlab-ci.yml',
      '.travis.yml',
      'jenkinsfile',
      'Jenkinsfile',
      '.circleci',
      'azure-pipelines.yml',
      'appveyor.yml',
      '.appveyor.yml',
      'bitbucket-pipelines.yml',
      'buildkite.yml',
      'drone.yml',
      '.drone.yml',
      'wercker.yml',
      'cloudbuild.yaml',
      'cloudbuild.yml',
      'codebuild.yml',
      'codebuild.yaml',
    ];

    return fileNames.some((name) => ciPatterns.includes(name));
  }

  private checkForDocumentationFiles(fileNames: string[]): boolean {
    const docPatterns = [
      'docs',
      'documentation',
      'doc',
      'wiki',
      'guide',
      'guides',
      'manual',
      'tutorial',
      'tutorials',
      'api-docs',
      'apidocs',
      'api',
      'reference',
      'changelog',
      'changelog.md',
      'changelog.txt',
      'history.md',
      'history.txt',
      'contributing',
      'contributing.md',
      'contributing.txt',
      'code_of_conduct',
      'code_of_conduct.md',
      'code_of_conduct.txt',
      'security',
      'security.md',
      'security.txt',
    ];

    return fileNames.some((name) =>
      docPatterns.some((pattern) => name.includes(pattern) || name === pattern)
    );
  }

  private checkForReadmeFiles(fileNames: string[]): boolean {
    const readmePatterns = [
      'readme',
      'readme.md',
      'readme.txt',
      'readme.rst',
      'readme.markdown',
      'readme.mdown',
      'readme.mkdn',
      'readme.mkd',
      'readme.mkdown',
      'readme.mdc',
    ];

    return fileNames.some((name) =>
      readmePatterns.some((pattern) =>
        name.toLowerCase().startsWith(pattern.toLowerCase())
      )
    );
  }

  private checkForLicenseFiles(fileNames: string[]): boolean {
    const licensePatterns = [
      'license',
      'licence',
      'copying',
      'copying.txt',
      'license.txt',
      'licence.txt',
      'license.md',
      'licence.md',
      'unlicense',
      'unlicense.txt',
      'unlicense.md',
    ];

    return fileNames.some((name) =>
      licensePatterns.some((pattern) =>
        name.toLowerCase().includes(pattern.toLowerCase())
      )
    );
  }

  private parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/,
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
      const repoResponse = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}`
      );
      if (!repoResponse.ok) {
        throw new Error('Repository not found or is private');
      }
      const repoData = await repoResponse.json();

      // Fetch languages
      const languagesResponse = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/languages`
      );
      const languages = languagesResponse.ok
        ? await languagesResponse.json()
        : {};

      // Fetch contents to check for important files
      const contentsResponse = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/contents`
      );
      const contents = contentsResponse.ok ? await contentsResponse.json() : [];

      const fileNames = Array.isArray(contents)
        ? contents.map((f: any) => f.name.toLowerCase())
        : [];

      // Check for README using helper method
      const hasReadme = this.checkForReadmeFiles(fileNames);

      // Check for LICENSE using helper method
      const hasLicense =
        this.checkForLicenseFiles(fileNames) || !!repoData.license;

      // Check for tests using helper method
      const hasTests = this.checkForTestFiles(fileNames);

      // Check for CI/CD using helper method
      const hasCi = this.checkForCiFiles(fileNames);

      // Check for documentation using helper method
      const hasDocumentation = this.checkForDocumentationFiles(fileNames);

      // Fetch commits count
      const commitsResponse = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=1`
      );
      const commitsLink = commitsResponse.headers.get('Link');
      const commits = commitsLink ? this.extractCommitCount(commitsLink) : 0;

      // Fetch contributors count
      const contributorsResponse = await fetch(
        `${this.baseUrl}/repos/${owner}/${repo}/contributors?per_page=1`
      );
      const contributorsLink = contributorsResponse.headers.get('Link');
      const contributors = contributorsLink
        ? this.extractContributorCount(contributorsLink)
        : 1;

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
        lastUpdated: repoData.updated_at,
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
