import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
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
