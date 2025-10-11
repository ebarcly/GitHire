import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { AnalysisResult } from '../../services/analysisEngine';
import { styles } from './styles';
import { getScoreLabel } from './helpers';

interface CoverPageProps {
  analysis: AnalysisResult;
}

const CoverPage: React.FC<CoverPageProps> = ({ analysis }) => (
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
              {new Date(analysis.repoInfo.lastUpdated).toLocaleDateString('en',
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
);

export default CoverPage;
