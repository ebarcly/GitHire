import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { AnalysisResult } from '../../services/analysisEngine';
import { styles } from './styles';
import { getPriorityColor, getPriorityBgColor } from './helpers';

interface SkillGapsPageProps {
  analysis: AnalysisResult;
}

const SkillGapsPage: React.FC<SkillGapsPageProps> = ({ analysis }) => (
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
);

export default SkillGapsPage;
