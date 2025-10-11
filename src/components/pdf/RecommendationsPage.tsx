import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { AnalysisResult } from '../../services/analysisEngine';
import { styles } from './styles';
import { getPriorityStyle, getPriorityColor } from './helpers';

interface RecommendationsPageProps {
  analysis: AnalysisResult;
}

const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ analysis }) => (
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
);

export default RecommendationsPage;
