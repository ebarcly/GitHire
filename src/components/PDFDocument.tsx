import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { AnalysisResult } from '../services/analysisEngine';
import CoverPage from './pdf/CoverPage';
import MetricsAndTechnologyPage from './pdf/MetricsAndTechnologyPage';
import RecommendationsPage from './pdf/RecommendationsPage';
import SkillGapsPage from './pdf/SkillGapsPage';
import { styles } from './pdf/styles';

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

  return (
    <Document>
      <CoverPage analysis={analysis} />
      <MetricsAndTechnologyPage analysis={analysis} />
      <RecommendationsPage analysis={analysis} />
      <SkillGapsPage analysis={analysis} />
    </Document>
  );
};

export default PDFDocument;