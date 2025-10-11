import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { AnalysisResult } from '../services/analysisEngine';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    size: 'LETTER',
  },

  // Cover Page Styles
  coverPage: {
    padding: 60,
    backgroundColor: '#1e293b',
    minHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverHeader: {
    marginBottom: 40,
  },
  coverLogo: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 2,
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#94a3b8',
  },
  coverMain: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 60,
  },
  repoNameLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  repoName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '8px solid rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 20,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontWeight: 'bold',
  },
  coverStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 40,
    paddingVertical: 30,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  coverStat: {
    alignItems: 'center',
  },
  coverStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  coverStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coverFooter: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  coverDate: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },

  // Content Page Styles
  contentPage: {
    padding: 30,
    paddingBottom: 40,
  },

  // Header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '2px solid #e2e8f0',
  },
  pageHeaderTitle: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  pageHeaderRepo: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
  },

  // Section Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    marginTop: 0,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 15,
  },

  // Metrics Section
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    border: '1px solid #e2e8f0',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  metricBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Technology Stack
  techContainer: {
    marginBottom: 0,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techBadge: {
    backgroundColor: '#1e293b',
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Insights Section
  insightsContainer: {
    marginTop: 0,
    marginBottom: 16,
  },
  insightsList: {
    gap: 6,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    padding: 6,
    borderRadius: 6,
    border: '1px solid #dcfce7',
  },
  insightBullet: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  insightBulletText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  insightText: {
    fontSize: 10,
    color: '#166534',
    lineHeight: 1.5,
    flex: 1,
  },

  // Career Box
  careerBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
  },
  careerLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  careerLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'upperfirst',
    color: 'white',
    marginBottom: 8,
  },
  careerDescription: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 1.6,
  },

  // Recommendations
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    border: '1px solid #e2e8f0',
    borderLeftWidth: 4,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  recTitleContainer: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  recPriority: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  recDescription: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.6,
    marginTop: 5,
    marginBottom: 10,
  },
  recMetaRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
    paddingTop: 12,
    borderTop: '1px solid #f1f5f9',
  },
  recMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recMetaLabel: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recMetaValue: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold',
  },

  // Priority Colors
  priorityCritical: {
    borderLeftColor: '#dc2626',
  },
  priorityHigh: {
    borderLeftColor: '#f59e0b',
  },
  priorityMedium: {
    borderLeftColor: '#3b82f6',
  },
  priorityLow: {
    borderLeftColor: '#10b981',
  },

  // Skill Gaps
  skillCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    border: '1px solid #e2e8f0',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  skillPriorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillReason: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  skillImpact: {
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },

  // Weaknesses
  weaknessList: {
    gap: 10,
  },
  weaknessItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 6,
    border: '1px solid #fecaca',
  },
  weaknessBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  weaknessBulletText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  weaknessText: {
    fontSize: 11,
    color: '#991b1b',
    lineHeight: 1.5,
    flex: 1,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  footerPage: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: 30,
    color: '#64748b',
    fontSize: 11,
    fontStyle: 'italic',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
  },
});

interface PDFDocumentProps {
  analysis: AnalysisResult;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ analysis }) => {
  if (!analysis || !analysis.repoInfo || !analysis.metrics) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ padding: 50 }}>
            <Text style={styles.sectionTitle}>Error</Text>
            <Text>Invalid analysis data provided</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return styles.priorityCritical;
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return '#fee2e2';
      case 'high':
        return '#fef3c7';
      case 'medium':
        return '#dbeafe';
      case 'low':
        return '#d1fae5';
      default:
        return '#f1f5f9';
    }
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.coverPage}>
          <View style={styles.coverHeader}>
            <Text style={styles.coverLogo}>GITHUB ANALYZER</Text>
            <Text style={styles.coverTitle}>Repository Analysis</Text>
            <Text style={styles.coverSubtitle}>
              Professional Code Quality Report
            </Text>
          </View>

          <View style={styles.coverMain}>
            <Text style={styles.repoNameLabel}>Repository</Text>
            <Text style={styles.repoName}>{analysis.repoInfo.name}</Text>

            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{analysis.score}</Text>
              </View>
              <Text style={styles.scoreLabel}>
                {getScoreLabel(analysis.score)}
              </Text>
            </View>

            <View style={styles.coverStatsRow}>
              <View style={styles.coverStat}>
                <Text style={styles.coverStatValue}>
                  {analysis.repoInfo.stars.toLocaleString()}
                </Text>
                <Text style={styles.coverStatLabel}>Stars</Text>
              </View>
              <View style={styles.coverStat}>
                <Text style={styles.coverStatValue}>
                  {analysis.repoInfo.forks.toLocaleString()}
                </Text>
                <Text style={styles.coverStatLabel}>Forks</Text>
              </View>
              <View style={styles.coverStat}>
                <Text style={styles.coverStatValue}>
                  {new Date(analysis.repoInfo.lastUpdated).toLocaleDateString(
                    'en',
                    { month: 'short', day: 'numeric' }
                  )}
                </Text>
                <Text style={styles.coverStatLabel}>Updated</Text>
              </View>
            </View>
          </View>

          <View style={styles.coverFooter}>
            <Text style={styles.coverDate}>
              Generated on{' '}
              {new Date().toLocaleDateString('en', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </Page>

      {/* Page 1 - Metrics & Technology */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.pageHeader}>
            <View style={{ flex: 1 }}>
              {' '}
              {/* Added flex: 1 to allow text to take available space */}
              <Text style={styles.pageHeaderTitle}>Analysis Report</Text>
              <Text style={styles.pageHeaderRepo}>
                {analysis.repoInfo.name}
              </Text>
            </View>
            <Text style={styles.footerPage}>Page 1 of 3</Text>
          </View>

          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Code Quality</Text>
                <Text style={styles.metricValue}>
                  {analysis.metrics.codeQuality}
                </Text>
              </View>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricBarFill,
                    {
                      width: `${analysis.metrics.codeQuality}%`,
                      backgroundColor: getScoreColor(
                        analysis.metrics.codeQuality
                      ),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Doc.</Text>
                <Text style={styles.metricValue}>
                  {analysis.metrics.documentation}
                </Text>
              </View>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricBarFill,
                    {
                      width: `${analysis.metrics.documentation}%`,
                      backgroundColor: getScoreColor(
                        analysis.metrics.documentation
                      ),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Structure</Text>
                <Text style={styles.metricValue}>
                  {analysis.metrics.projectStructure}
                </Text>
              </View>
              <View style={styles.metricBar}>
                <View
                  style={[
                    styles.metricBarFill,
                    {
                      width: `${analysis.metrics.projectStructure}%`,
                      backgroundColor: getScoreColor(
                        analysis.metrics.projectStructure
                      ),
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <View style={styles.techContainer}>
            <View style={styles.techGrid}>
              {(analysis.technologies || []).map((tech, index) => (
                <Text key={index} style={styles.techBadge}>
                  {typeof tech === 'string' ? tech : tech.name}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.insightsContainer}>
            <Text style={styles.sectionTitle}>Key Strengths</Text>
            <View style={styles.insightsList}>
              {(analysis.insights?.strengths || [])
                .slice(0, 4)
                .map((strength, index) => (
                  <View key={index} style={styles.insightItem}>
                    <View style={styles.insightBullet}>
                      <Text style={styles.insightBulletText}>✓</Text>
                    </View>
                    <Text style={styles.insightText}>{strength}</Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={styles.careerBox}>
            <Text style={styles.careerLabel}>Career Level</Text>
            <Text style={styles.careerLevel}>
              {analysis.insights?.careerLevel || 'Not Assessed'}
            </Text>
            <Text style={styles.careerDescription}>
              {analysis.insights?.marketAlignment ||
                'Complete more analyses for personalized career insights'}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            GitHub Repository Analyzer © 2025
          </Text>
          <Text style={styles.footerPage}>1 / 3</Text>
        </View>
      </Page>

      {/* Page 2 - Recommendations */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageHeaderTitle}>Analysis Report</Text>
              <Text style={styles.pageHeaderRepo}>
                {analysis.repoInfo.name}
              </Text>
            </View>
            <Text style={styles.footerPage}>Page 2 of 3</Text>
          </View>

          <Text style={styles.sectionTitle}>Recommendations</Text>
          {(analysis.recommendations || []).map((rec, index) => (
            <View
              key={index}
              style={[
                styles.recommendationCard,
                getPriorityStyle(rec.priority),
              ]}
            >
              <View style={styles.recHeader}>
                <View style={styles.recNumber}>
                  <Text style={styles.recNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.recTitleContainer}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text
                    style={[
                      styles.recPriority,
                      { color: getPriorityColor(rec.priority) },
                    ]}
                  >
                    {(rec.priority || 'medium').toUpperCase()} PRIORITY
                  </Text>
                </View>
              </View>
              <Text style={styles.recDescription}>{rec.description}</Text>
              <View style={styles.recMetaRow}>
                <View style={styles.recMetaItem}>
                  <Text style={styles.recMetaLabel}>Impact</Text>
                  <Text style={styles.recMetaValue}>
                    +{rec.scoreImpact || 0} points
                  </Text>
                </View>
                <View style={styles.recMetaItem}>
                  <Text style={styles.recMetaLabel}>Effort</Text>
                  <Text style={styles.recMetaValue}>
                    {rec.estimatedEffort || 'TBD'}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {(analysis.recommendations || []).length === 0 && (
            <Text style={styles.emptyState}>
              No recommendations - excellent work!
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            GitHub Repository Analyzer © 2025
          </Text>
          <Text style={styles.footerPage}>2 / 3</Text>
        </View>
      </Page>

      {/* Page 3 - Skill Gaps & Improvements */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.contentPage}>
          <View style={styles.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageHeaderTitle}>Analysis Report</Text>
              <Text style={styles.pageHeaderRepo}>
                {analysis.repoInfo.name}
              </Text>
            </View>
            <Text style={styles.footerPage}>Page 3 of 3</Text>
          </View>

          <Text style={styles.sectionTitle}>Skill Gap Analysis</Text>
          {(analysis.skillGaps || []).map((gap, index) => (
            <View key={index} style={styles.skillCard}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{gap.skill}</Text>
                <View
                  style={[
                    styles.skillPriorityBadge,
                    {
                      backgroundColor: getPriorityBgColor(gap.priority),
                      color: getPriorityColor(gap.priority),
                    },
                  ]}
                >
                  <Text style={{ color: getPriorityColor(gap.priority) }}>
                    {(gap.priority || 'medium').toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.skillReason}>{gap.reason}</Text>
              <Text style={styles.skillImpact}>
                Potential Impact: +{gap.estimatedImpact || 0} points
              </Text>
            </View>
          ))}

          {(analysis.skillGaps || []).length === 0 && (
            <Text style={styles.emptyState}>No skill gaps identified!</Text>
          )}

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Areas for Improvement</Text>
          <View style={styles.weaknessList}>
            {(analysis.insights?.weaknesses || []).map((weakness, index) => (
              <View key={index} style={styles.weaknessItem}>
                <View style={styles.weaknessBullet}>
                  <Text style={styles.weaknessBulletText}>!</Text>
                </View>
                <Text style={styles.weaknessText}>{weakness}</Text>
              </View>
            ))}
          </View>

          {(analysis.insights?.weaknesses || []).length === 0 && (
            <Text style={styles.emptyState}>
              No weaknesses found - keep it up!
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            GitHub Repository Analyzer © 2025
          </Text>
          <Text style={styles.footerPage}>3 / 3</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
