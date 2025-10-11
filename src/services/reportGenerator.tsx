import React from 'react';
import { AnalysisResult } from './analysisEngine';
import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../components/PDFDocument';

export class ReportGenerator {
  async generatePDF(analysis: AnalysisResult): Promise<void> {
    try {
      // Generate PDF using react-pdf/renderer
      const MyDocument = () => React.createElement(PDFDocument, { analysis });
      const blob = await pdf(React.createElement(MyDocument)).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${analysis.repoInfo.name}-analysis-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text report if PDF generation fails
      this.generateTextReport(analysis);
    }
  }

  private generateTextReport(analysis: AnalysisResult): void {
    // Fallback text report generation
    const reportContent = this.generateReportContent(analysis);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysis.repoInfo.name}-analysis-report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generateReportContent(analysis: AnalysisResult): string {
    const date = new Date().toLocaleDateString();

    return `
================================================================================
                    GITHUB REPOSITORY ANALYSIS REPORT
================================================================================

Generated: ${date}
Repository: ${analysis.repoInfo.name}
Description: ${analysis.repoInfo.description || 'No description'}

================================================================================
                           OVERALL SCORE: ${analysis.score}/100
================================================================================

Score Breakdown:
${this.getScoreLabel(analysis.score)}

Stars: ${analysis.repoInfo.stars}
Forks: ${analysis.repoInfo.forks}
Last Updated: ${new Date(analysis.repoInfo.lastUpdated).toLocaleDateString()}

================================================================================
                              DETAILED METRICS
================================================================================

Code Quality: ${analysis.metrics.codeQuality}/100
${this.getProgressBar(analysis.metrics.codeQuality)}
${this.getMetricAssessment(analysis.metrics.codeQuality)}

Documentation: ${analysis.metrics.documentation}/100
${this.getProgressBar(analysis.metrics.documentation)}
${this.getMetricAssessment(analysis.metrics.documentation)}

Project Structure: ${analysis.metrics.projectStructure}/100
${this.getProgressBar(analysis.metrics.projectStructure)}
${this.getMetricAssessment(analysis.metrics.projectStructure)}

================================================================================
                           TECHNOLOGY STACK
================================================================================

Detected Technologies:
${analysis.technologies
  .map((tech, i) => `${i + 1}. ${tech.name} (${tech.category})`)
  .join('\n')}

Market Alignment: Your technology stack aligns well with current industry demands.

================================================================================
                            SKILL GAPS
================================================================================

Areas for Improvement:
${analysis.skillGaps
  .map(
    (gap, i) =>
      `${i + 1}. ${gap.skill} - ${gap.reason} (${gap.priority} priority)`
  )
  .join('\n')}

These skills are commonly expected by employers and would strengthen your profile.

================================================================================
                      PERSONALIZED RECOMMENDATIONS
================================================================================

${analysis.recommendations
  .map(
    (rec, i) =>
      `${i + 1}. ${rec.title} (${rec.priority} priority)\n   ${
        rec.description
      }\n   Impact: +${rec.scoreImpact} points | Effort: ${rec.estimatedEffort}`
  )
  .join('\n\n')}

================================================================================
                              NEXT STEPS
================================================================================

1. Prioritize the recommendations based on your career goals
2. Implement changes incrementally and track your progress
3. Re-analyze your repository after making improvements
4. Share this report with mentors or potential employers

================================================================================
                    Generated by GitHub Repo Analyzer
                  https://github-repo-analyzer.example.com
================================================================================
`;
  }

  private getScoreLabel(score: number): string {
    if (score >= 90)
      return '🌟 EXCELLENT - Highly competitive for top positions';
    if (score >= 80) return '✅ VERY GOOD - Strong candidate profile';
    if (score >= 70)
      return '👍 GOOD - Solid foundation with room for improvement';
    if (score >= 60) return '⚠️  FAIR - Needs significant improvements';
    return '❌ NEEDS WORK - Major improvements required';
  }

  private getProgressBar(value: number): string {
    const filled = Math.round(value / 5);
    const empty = 20 - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }

  private getMetricAssessment(value: number): string {
    if (value >= 80) return 'Status: Excellent';
    if (value >= 60) return 'Status: Good';
    return 'Status: Needs Improvement';
  }

  generateJSON(analysis: AnalysisResult): void {
    try {
      const jsonContent = JSON.stringify(analysis, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${analysis.repoInfo.name}-analysis.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating JSON report:', error);
      throw new Error('Failed to generate JSON report');
    }
  }
}

export const reportGenerator = new ReportGenerator();
