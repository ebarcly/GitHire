import { styles } from './styles';

export const getScoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export const getScoreLabel = (score: number) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Work';
};

export const getPriorityStyle = (priority: string) => {
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

export const getPriorityColor = (priority: string) => {
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

export const getPriorityBgColor = (priority: string) => {
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
