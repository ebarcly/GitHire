export interface TechnologyDetail {
  name: string;
  category: 'language' | 'framework' | 'database' | 'devops' | 'cloud' | 'tool';
  proficiency: 'detected' | 'inferred';
  marketDemand: 'high' | 'medium' | 'low';
  relatedSkills: string[];
}

export interface SkillGapDetail {
  skill: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  learningResources: string[];
  estimatedImpact: number; // Score improvement potential
}

export interface RecommendationDetail {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category:
    | 'code-quality'
    | 'documentation'
    | 'structure'
    | 'collaboration'
    | 'deployment';
  estimatedEffort: 'low' | 'medium' | 'high';
  scoreImpact: number;
  actionSteps: string[];
}

export interface AnalysisResult {
  score: number;
  metrics: {
    codeQuality: number;
    documentation: number;
    projectStructure: number;
  };
  technologies: TechnologyDetail[];
  skillGaps: SkillGapDetail[];
  recommendations: RecommendationDetail[];
  repoInfo: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    lastUpdated: string;
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    marketAlignment: string;
    careerLevel: 'junior' | 'mid' | 'senior';
  };
}

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

import technologiesData from '../data/technologies.json';
import { SCORES, WEIGHTS } from '../constants/analysisEngine.constants';

interface TechnologyInfo {
  demand: 'high' | 'medium' | 'low';
  category: 'language' | 'framework' | 'database' | 'devops' | 'cloud' | 'tool';
  related: string[];
}

interface TechnologiesDatabase {
  languages: Record<string, TechnologyInfo>;
  frameworks: Record<string, TechnologyInfo>;
  databases: Record<string, TechnologyInfo>;
  devops: Record<string, TechnologyInfo>;
  cloud: Record<string, TechnologyInfo>;
  tools: Record<string, TechnologyInfo>;
}

export class AnalysisEngine {
  private readonly techDatabase: TechnologiesDatabase =
    technologiesData as TechnologiesDatabase;

  analyze(repoData: RepoData): AnalysisResult {
    const codeQuality = this.calculateCodeQuality(repoData);
    const documentation = this.calculateDocumentation(repoData);
    const projectStructure = this.calculateProjectStructure(repoData);

    // Overall score calculation with weighted importance:
    // Code Quality (40%): Most critical factor - directly impacts code reliability and maintainability
    // Documentation (30%): Essential for collaboration and project understanding
    // Project Structure (30%): Important for scalability and professional development practices
    const overallScore = Math.round(
      codeQuality * WEIGHTS.CODE_QUALITY +
        documentation * WEIGHTS.DOCUMENTATION +
        projectStructure * WEIGHTS.PROJECT_STRUCTURE
    );

    const technologies = this.extractTechnologiesDetailed(repoData);
    const skillGaps = this.identifySkillGapsDetailed(repoData, technologies);
    const recommendations = this.generateDetailedRecommendations(
      repoData,
      codeQuality,
      documentation,
      projectStructure,
      technologies,
      skillGaps
    );
    const insights = this.generateInsights(
      repoData,
      overallScore,
      technologies,
      skillGaps
    );

    return {
      score: overallScore,
      metrics: {
        codeQuality,
        documentation,
        projectStructure,
      },
      technologies,
      skillGaps,
      recommendations,
      repoInfo: {
        name: repoData.name,
        description: repoData.description,
        stars: repoData.stars,
        forks: repoData.forks,
        lastUpdated: repoData.lastUpdated,
      },
      insights,
    };
  }

  private calculateCodeQuality(repoData: RepoData): number {
    let score = SCORES.CODE_QUALITY.BASE; // Base score: assumes average code quality without additional evidence

    // Testing is critical for code quality - 15 points for having any tests
    // This is the highest single factor as testing directly impacts code reliability
    if (repoData.hasTests) score += SCORES.CODE_QUALITY.TESTS;

    // CI/CD shows professional development practices - 15 points
    // Indicates automated quality checks and deployment processes
    if (repoData.hasCi) score += SCORES.CODE_QUALITY.CI;

    // License shows project maturity and legal awareness - 5 points
    // Small but important for professional open source work
    if (repoData.hasLicense) score += SCORES.CODE_QUALITY.LICENSE;

    // Active development history - 5 points for moderate activity (50+ commits)
    // Shows sustained development effort and project evolution
    if (repoData.commits > 50) score += SCORES.CODE_QUALITY.COMMIT;

    // Very active development - additional 5 points for 150+ commits
    // Indicates significant project scope and developer dedication
    if (repoData.commits > 150) score += SCORES.CODE_QUALITY.VERY_ACTIVE_COMMIT;

    // Collaborative development - 5 points for multiple contributors
    // Shows ability to work in teams and code review practices
    if (repoData.contributors > 1) score += SCORES.CODE_QUALITY.CONTRIBUTORS;

    // Strong collaboration - additional 5 points for 5+ contributors
    // Indicates mature project with community involvement
    if (repoData.contributors > 5)
      score += SCORES.CODE_QUALITY.STRONG_COLLABORATION;

    // Low issue count indicates good maintenance - 5 points for <15 open issues
    // Shows active bug fixing and project health
    if (repoData.openIssues < 15) score += SCORES.CODE_QUALITY.LOW_ISSUE_COUNT;

    return Math.min(100, score);
  }

  private calculateDocumentation(repoData: RepoData): number {
    let score = SCORES.DOCUMENTATION.BASE; // Base score: minimal documentation expected for any project

    // README is essential for project understanding - 35 points
    // This is the highest factor as README is the first thing users see
    if (repoData.hasReadme) score += SCORES.DOCUMENTATION.README;

    // Additional documentation shows thoroughness - 20 points
    // Indicates comprehensive project documentation beyond basic README
    if (repoData.hasDocumentation) score += SCORES.DOCUMENTATION.ADDITIONAL_DOC;

    // Meaningful description shows project clarity - 5 points for >20 chars
    // Short descriptions (≤20 chars) are often generic or placeholder text
    if (repoData.description && repoData.description.length > 20)
      score += SCORES.DOCUMENTATION.MEANINGFUL_DESCRIPTION;

    // License documentation is important for legal clarity - 10 points
    // Shows understanding of open source licensing and project governance
    if (repoData.hasLicense) score += SCORES.DOCUMENTATION.LICENSE_DOC;

    return Math.min(100, score);
  }

  private calculateProjectStructure(repoData: RepoData): number {
    let score = SCORES.PROJECT_STRUCTURE.BASE; // Base score: assumes basic project organization

    // Configuration files show project setup awareness - 10 points
    // Indicates proper project configuration and environment management
    const hasConfig = repoData.fileStructure.some(
      (f) =>
        f.includes('config') ||
        f.endsWith('.yml') ||
        (f.endsWith('.json') && f !== 'package.json')
    );
    if (hasConfig) score += SCORES.PROJECT_STRUCTURE.CONFIG;

    // Source directory organization - 15 points for standard src/lib/app structure
    // Shows understanding of code organization and separation of concerns
    const hasSrcDir = repoData.fileStructure.some(
      (f) => f === 'src' || f === 'lib' || f === 'app'
    );
    if (hasSrcDir) score += SCORES.PROJECT_STRUCTURE.SRC_DIR;

    // Package management shows dependency awareness - 20 points
    // Critical for modern development and indicates proper project setup
    const hasPackageManager = repoData.fileStructure.some(
      (f) =>
        f === 'package.json' ||
        f === 'requirements.txt' ||
        f === 'go.mod' ||
        f === 'cargo.toml' ||
        f === 'pom.xml'
    );
    if (hasPackageManager) score += SCORES.PROJECT_STRUCTURE.PACKAGE_MANAGER;

    // Git ignore file shows version control best practices - 10 points
    // Indicates awareness of what should and shouldn't be tracked
    const hasGitignore = repoData.fileStructure.some((f) => f === '.gitignore');
    if (hasGitignore) score += SCORES.PROJECT_STRUCTURE.GITIGNORE;

    // Multi-language projects show technical versatility - 10 points for >2 languages
    // Indicates ability to work with diverse technology stacks
    if (Object.keys(repoData.languages).length > 2)
      score += SCORES.PROJECT_STRUCTURE.MULTI_LANG;

    return Math.min(100, score);
  }

  private extractTechnologiesDetailed(repoData: RepoData): TechnologyDetail[] {
    const technologies: TechnologyDetail[] = [];
    const fileNames = repoData.fileStructure.join(' ').toLowerCase();
    const allTechDb = {
      ...this.techDatabase.languages,
      ...this.techDatabase.frameworks,
      ...this.techDatabase.databases,
      ...this.techDatabase.devops,
      ...this.techDatabase.cloud,
      ...this.techDatabase.tools,
    };

    // Primary language
    if (repoData.language && allTechDb[repoData.language]) {
      const tech = allTechDb[repoData.language];
      technologies.push({
        name: repoData.language,
        category: tech.category,
        proficiency: 'detected',
        marketDemand: tech.demand,
        relatedSkills: tech.related,
      });
    }

    // Other languages from GitHub API
    Object.keys(repoData.languages).forEach((lang) => {
      if (allTechDb[lang] && !technologies.find((t) => t.name === lang)) {
        const tech = allTechDb[lang];
        technologies.push({
          name: lang,
          category: tech.category,
          proficiency: 'detected',
          marketDemand: tech.demand,
          relatedSkills: tech.related,
        });
      }
    });

    // Detect frameworks and tools from package.json
    if (fileNames.includes('package.json')) {
      const jsFrameworks = [
        'React',
        'Next.js',
        'Vue',
        'Angular',
        'Express',
        'NestJS',
      ];
      jsFrameworks.forEach((fw) => {
        if (
          fileNames.includes(fw.toLowerCase()) &&
          !technologies.find((t) => t.name === fw)
        ) {
          const tech = allTechDb[fw];
          if (tech) {
            technologies.push({
              name: fw,
              category: tech.category,
              proficiency: 'inferred',
              marketDemand: tech.demand,
              relatedSkills: tech.related,
            });
          }
        }
      });

      // Always add Node.js if package.json exists
      if (!technologies.find((t) => t.name === 'Node.js')) {
        technologies.push({
          name: 'Node.js',
          category: 'framework',
          proficiency: 'inferred',
          marketDemand: 'high',
          relatedSkills: ['JavaScript', 'Express', 'npm'],
        });
      }
    }

    // Python frameworks
    if (
      fileNames.includes('requirements.txt') ||
      fileNames.includes('pipfile')
    ) {
      const pyFrameworks = ['Django', 'FastAPI', 'Flask'];
      pyFrameworks.forEach((fw) => {
        if (
          fileNames.includes(fw.toLowerCase()) &&
          !technologies.find((t) => t.name === fw)
        ) {
          const tech = allTechDb[fw];
          if (tech) {
            technologies.push({
              name: fw,
              category: tech.category,
              proficiency: 'inferred',
              marketDemand: tech.demand,
              relatedSkills: tech.related,
            });
          }
        }
      });
    }

    // DevOps tools
    if (fileNames.includes('docker')) {
      technologies.push({
        name: 'Docker',
        category: 'devops',
        proficiency: 'detected',
        marketDemand: 'high',
        relatedSkills: ['Containerization', 'Kubernetes'],
      });
    }

    if (fileNames.includes('kubernetes') || fileNames.includes('k8s')) {
      technologies.push({
        name: 'Kubernetes',
        category: 'devops',
        proficiency: 'detected',
        marketDemand: 'high',
        relatedSkills: ['Docker', 'Orchestration', 'Cloud'],
      });
    }

    // CI/CD
    if (repoData.hasCi) {
      if (fileNames.includes('.github')) {
        technologies.push({
          name: 'GitHub Actions',
          category: 'devops',
          proficiency: 'detected',
          marketDemand: 'high',
          relatedSkills: ['CI/CD', 'Automation', 'YAML'],
        });
      }
    }

    // Testing frameworks
    if (repoData.hasTests) {
      if (fileNames.includes('jest') || fileNames.includes('package.json')) {
        technologies.push({
          name: 'Jest',
          category: 'tool',
          proficiency: 'inferred',
          marketDemand: 'high',
          relatedSkills: ['Testing', 'JavaScript', 'TDD'],
        });
      }
      if (
        fileNames.includes('pytest') ||
        fileNames.includes('requirements.txt')
      ) {
        technologies.push({
          name: 'Pytest',
          category: 'tool',
          proficiency: 'inferred',
          marketDemand: 'high',
          relatedSkills: ['Testing', 'Python', 'TDD'],
        });
      }
    }

    // Databases
    const databases = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'];
    databases.forEach((db) => {
      if (fileNames.includes(db.toLowerCase())) {
        const tech = allTechDb[db];
        if (tech && !technologies.find((t) => t.name === db)) {
          technologies.push({
            name: db,
            category: 'database',
            proficiency: 'inferred',
            marketDemand: tech.demand,
            relatedSkills: tech.related,
          });
        }
      }
    });

    return technologies.slice(0, 15);
  }

  private identifySkillGapsDetailed(
    repoData: RepoData,
    technologies: TechnologyDetail[]
  ): SkillGapDetail[] {
    const gaps: SkillGapDetail[] = [];
    const techNames = technologies.map((t) => t.name);

    // Critical gaps
    if (!repoData.hasTests) {
      gaps.push({
        skill: 'Automated Testing',
        priority: 'critical',
        reason:
          'Testing is essential for code quality and is expected by 95% of employers',
        learningResources: [
          'Jest Documentation',
          'Testing Library',
          'Test-Driven Development',
        ],
        estimatedImpact: 15,
      });
    }

    if (!repoData.hasCi) {
      gaps.push({
        skill: 'CI/CD Pipeline',
        priority: 'critical',
        reason:
          'Continuous Integration is a standard practice in modern development teams',
        learningResources: ['GitHub Actions', 'GitLab CI', 'Jenkins'],
        estimatedImpact: 15,
      });
    }

    // High priority gaps
    if (!techNames.includes('Docker')) {
      gaps.push({
        skill: 'Docker & Containerization',
        priority: 'high',
        reason:
          'Containerization is used by 80% of companies for deployment and development',
        learningResources: [
          'Docker Documentation',
          'Docker Compose',
          'Container Best Practices',
        ],
        estimatedImpact: 10,
      });
    }

    if (!techNames.includes('TypeScript') && techNames.includes('JavaScript')) {
      gaps.push({
        skill: 'TypeScript',
        priority: 'high',
        reason:
          'TypeScript is increasingly preferred over JavaScript for large-scale applications',
        learningResources: [
          'TypeScript Handbook',
          'Type Safety',
          'Advanced Types',
        ],
        estimatedImpact: 10,
      });
    }

    if (!repoData.hasDocumentation) {
      gaps.push({
        skill: 'Technical Documentation',
        priority: 'high',
        reason:
          'Good documentation demonstrates communication skills and project maturity',
        learningResources: [
          'Documentation Best Practices',
          'API Documentation',
          'README Templates',
        ],
        estimatedImpact: 10,
      });
    }

    // Medium priority gaps
    const hasDatabase = technologies.some((t) => t.category === 'database');
    if (!hasDatabase) {
      gaps.push({
        skill: 'Database Management',
        priority: 'medium',
        reason: 'Most applications require database knowledge (SQL or NoSQL)',
        learningResources: ['PostgreSQL', 'MongoDB', 'Database Design'],
        estimatedImpact: 10,
      });
    }

    if (!techNames.includes('Kubernetes') && techNames.includes('Docker')) {
      gaps.push({
        skill: 'Kubernetes',
        priority: 'medium',
        reason: 'Container orchestration is valuable for scalable applications',
        learningResources: ['Kubernetes Basics', 'K8s Deployment', 'Helm'],
        estimatedImpact: 5,
      });
    }

    const hasCloudTech = technologies.some((t) => t.category === 'cloud');
    if (!hasCloudTech) {
      gaps.push({
        skill: 'Cloud Platform (AWS/Azure/GCP)',
        priority: 'medium',
        reason: 'Cloud experience is required by most modern tech companies',
        learningResources: [
          'AWS Fundamentals',
          'Azure Basics',
          'Cloud Architecture',
        ],
        estimatedImpact: 10,
      });
    }

    // Low priority but valuable
    if (repoData.commits < 20) {
      gaps.push({
        skill: 'Git Best Practices',
        priority: 'low',
        reason:
          'Consistent commit history shows professional development habits',
        learningResources: [
          'Git Workflow',
          'Commit Messages',
          'Branching Strategies',
        ],
        estimatedImpact: 5,
      });
    }

    if (!repoData.hasLicense) {
      gaps.push({
        skill: 'Open Source Licensing',
        priority: 'low',
        reason:
          'Understanding licenses is important for professional open source work',
        learningResources: ['MIT License', 'Apache 2.0', 'License Selection'],
        estimatedImpact: 3,
      });
    }

    return gaps.slice(0, 10);
  }

  private generateDetailedRecommendations(
    repoData: RepoData,
    codeQuality: number,
    documentation: number,
    projectStructure: number,
    technologies: TechnologyDetail[],
    skillGaps: SkillGapDetail[]
  ): RecommendationDetail[] {
    const recommendations: RecommendationDetail[] = [];

    // Critical recommendations
    if (!repoData.hasTests) {
      recommendations.push({
        title: 'Implement Comprehensive Testing Suite',
        description:
          'Add unit tests, integration tests, and achieve at least 70% code coverage',
        priority: 'critical',
        category: 'code-quality',
        estimatedEffort: 'high',
        scoreImpact: 15,
        actionSteps: [
          'Choose a testing framework (Jest for JS, Pytest for Python)',
          'Write unit tests for core functions and components',
          'Add integration tests for critical user flows',
          'Set up code coverage reporting',
          'Aim for 70%+ coverage before considering complete',
        ],
      });
    }

    if (!repoData.hasCi) {
      recommendations.push({
        title: 'Set Up CI/CD Pipeline',
        description:
          'Automate testing, linting, and deployment with GitHub Actions or similar',
        priority: 'critical',
        category: 'deployment',
        estimatedEffort: 'medium',
        scoreImpact: 12,
        actionSteps: [
          'Create .github/workflows/ci.yml file',
          'Configure automated testing on pull requests',
          'Add linting and code quality checks',
          'Set up automated deployment to staging',
          'Add status badges to README',
        ],
      });
    }

    // High priority recommendations
    if (!repoData.hasReadme) {
      recommendations.push({
        title: 'Create Comprehensive README',
        description:
          'Write a professional README with setup instructions, features, and examples',
        priority: 'high',
        category: 'documentation',
        estimatedEffort: 'low',
        scoreImpact: 15,
        actionSteps: [
          'Add project title and description',
          'Include installation and setup instructions',
          'Document key features with examples',
          'Add screenshots or demo GIFs',
          'Include contribution guidelines and license',
        ],
      });
    } else if (documentation < 70) {
      recommendations.push({
        title: 'Enhance Documentation',
        description:
          'Add API documentation, architecture diagrams, and contribution guidelines',
        priority: 'high',
        category: 'documentation',
        estimatedEffort: 'medium',
        scoreImpact: 10,
        actionSteps: [
          'Create docs/ folder with detailed documentation',
          'Add API reference documentation',
          'Include architecture diagrams',
          'Write CONTRIBUTING.md for contributors',
          'Add code examples and tutorials',
        ],
      });
    }

    if (projectStructure < 70) {
      recommendations.push({
        title: 'Improve Project Structure',
        description:
          'Organize code with clear separation of concerns and standard conventions',
        priority: 'high',
        category: 'structure',
        estimatedEffort: 'medium',
        scoreImpact: 12,
        actionSteps: [
          'Create src/ directory for source code',
          'Separate tests into tests/ or __tests__/',
          'Add config/ for configuration files',
          'Create docs/ for documentation',
          'Follow framework-specific best practices',
        ],
      });
    }

    // Medium priority recommendations
    if (repoData.commits < 50) {
      recommendations.push({
        title: 'Increase Development Activity',
        description:
          'Make regular, meaningful commits to show active development',
        priority: 'medium',
        category: 'collaboration',
        estimatedEffort: 'low',
        scoreImpact: 5,
        actionSteps: [
          'Commit changes regularly (daily or weekly)',
          'Write clear, descriptive commit messages',
          'Follow conventional commit format',
          'Break large changes into smaller commits',
          'Show consistent development over time',
        ],
      });
    }

    if (!repoData.hasLicense) {
      recommendations.push({
        title: 'Add Open Source License',
        description:
          'Choose and add an appropriate license (MIT, Apache 2.0, GPL)',
        priority: 'medium',
        category: 'documentation',
        estimatedEffort: 'low',
        scoreImpact: 5,
        actionSteps: [
          'Choose appropriate license for your project',
          'Add LICENSE file to repository root',
          'Include license badge in README',
          'Update package.json or setup.py with license info',
        ],
      });
    }

    if (repoData.contributors === 1) {
      recommendations.push({
        title: 'Encourage Community Contributions',
        description:
          'Make your project contribution-friendly to attract collaborators',
        priority: 'medium',
        category: 'collaboration',
        estimatedEffort: 'low',
        scoreImpact: 7,
        actionSteps: [
          'Add CONTRIBUTING.md with contribution guidelines',
          'Create issue templates for bugs and features',
          'Label issues as "good first issue" for newcomers',
          'Respond promptly to issues and pull requests',
          'Add CODE_OF_CONDUCT.md',
        ],
      });
    }

    if (repoData.stars < 10) {
      recommendations.push({
        title: 'Increase Project Visibility',
        description:
          'Promote your project to gain recognition and demonstrate impact',
        priority: 'low',
        category: 'collaboration',
        estimatedEffort: 'medium',
        scoreImpact: 5,
        actionSteps: [
          'Share on Twitter, LinkedIn, and Reddit',
          'Write a blog post about your project',
          'Submit to awesome lists and directories',
          'Present at local meetups or conferences',
          'Create demo videos or tutorials',
        ],
      });
    }

    // Technology-specific recommendations
    const hasDocker = technologies.some((t) => t.name === 'Docker');
    if (!hasDocker && technologies.length > 0) {
      recommendations.push({
        title: 'Add Docker Support',
        description: 'Containerize your application for consistent deployment',
        priority: 'medium',
        category: 'deployment',
        estimatedEffort: 'medium',
        scoreImpact: 10,
        actionSteps: [
          'Create Dockerfile for your application',
          'Add docker-compose.yml for multi-service setup',
          'Document Docker usage in README',
          'Test container builds in CI pipeline',
          'Consider multi-stage builds for optimization',
        ],
      });
    }

    return recommendations.slice(0, 12);
  }

  private generateInsights(
    repoData: RepoData,
    score: number,
    technologies: TechnologyDetail[],
    skillGaps: SkillGapDetail[]
  ): {
    strengths: string[];
    weaknesses: string[];
    marketAlignment: string;
    careerLevel: 'junior' | 'mid' | 'senior';
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Identify strengths
    if (repoData.hasTests)
      strengths.push('Strong testing practices demonstrate code quality focus');
    if (repoData.hasCi)
      strengths.push('CI/CD implementation shows DevOps awareness');
    if (repoData.commits > 100)
      strengths.push('Consistent development activity indicates dedication');
    if (repoData.contributors > 5)
      strengths.push('Collaborative project shows teamwork skills');
    if (repoData.hasDocumentation)
      strengths.push(
        'Comprehensive documentation demonstrates professionalism'
      );
    if (technologies.length > 5)
      strengths.push('Diverse technology stack shows versatility');

    const highDemandTech = technologies.filter(
      (t) => t.marketDemand === 'high'
    );
    if (highDemandTech.length > 3) {
      strengths.push(
        `Strong alignment with in-demand technologies (${highDemandTech
          .map((t) => t.name)
          .join(', ')})`
      );
    }

    // Identify weaknesses
    if (!repoData.hasTests)
      weaknesses.push(
        'Lack of testing may raise concerns about code reliability'
      );
    if (!repoData.hasCi)
      weaknesses.push('Missing CI/CD suggests limited DevOps experience');
    if (repoData.commits < 20)
      weaknesses.push('Low commit count may indicate limited project scope');
    if (!repoData.hasDocumentation)
      weaknesses.push('Insufficient documentation could hinder collaboration');
    if (technologies.length < 3)
      weaknesses.push(
        'Limited technology diversity may restrict job opportunities'
      );

    const criticalGaps = skillGaps.filter((g) => g.priority === 'critical');
    if (criticalGaps.length > 0) {
      weaknesses.push(
        `Critical skill gaps: ${criticalGaps.map((g) => g.skill).join(', ')}`
      );
    }

    // Market alignment
    let marketAlignment = '';
    const highDemandCount = technologies.filter(
      (t) => t.marketDemand === 'high'
    ).length;
    if (highDemandCount >= 4) {
      marketAlignment =
        'Excellent - Your tech stack strongly aligns with current market demands';
    } else if (highDemandCount >= 2) {
      marketAlignment =
        'Good - Your skills match many employer requirements, with room for growth';
    } else {
      marketAlignment =
        'Developing - Consider adding more in-demand technologies to your portfolio';
    }

    // Career level assessment
    let careerLevel: 'junior' | 'mid' | 'senior' = 'junior';
    if (
      score >= 80 &&
      repoData.hasTests &&
      repoData.hasCi &&
      technologies.length >= 5
    ) {
      careerLevel = 'senior';
    } else if (
      score >= 65 &&
      (repoData.hasTests || repoData.hasCi) &&
      technologies.length >= 3
    ) {
      careerLevel = 'mid';
    }

    return {
      strengths: strengths.slice(0, 5),
      weaknesses: weaknesses.slice(0, 5),
      marketAlignment,
      careerLevel,
    };
  }
}

export const analysisEngine = new AnalysisEngine();
