import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { AnalysisResult } from '../../services/analysisEngine';
import { styles } from './styles';
import { getScoreColor } from './helpers';

interface MetricsAndTechnologyPageProps {
  analysis: AnalysisResult;
}

const MetricsAndTechnologyPage: React.FC<MetricsAndTechnologyPageProps> = ({ analysis }) => (
  <Page size="LETTER" style={styles.page}>
    <View style={styles.contentPage}>
      <View style={styles.pageHeader}>
        <View style={{ flex: 1 }}>
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
              {tech.name}
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
);

export default MetricsAndTechnologyPage;
