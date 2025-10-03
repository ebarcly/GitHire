import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, AlertCircle, Target, Award } from "lucide-react";

interface InsightsPanelProps {
  insights?: {
    strengths: string[];
    weaknesses: string[];
    marketAlignment: string;
    careerLevel: 'junior' | 'mid' | 'senior';
  };
}

export default function InsightsPanel({ 
  insights = {
    strengths: [],
    weaknesses: [],
    marketAlignment: '',
    careerLevel: 'junior'
  }
}: InsightsPanelProps) {
  const getCareerLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'junior': 'bg-blue-100 text-blue-700',
      'mid': 'bg-purple-100 text-purple-700',
      'senior': 'bg-green-100 text-green-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getCareerLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'junior': 'Junior Developer',
      'mid': 'Mid-Level Developer',
      'senior': 'Senior Developer'
    };
    return labels[level] || 'Developer';
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-slate-900">Career Insights</h3>
        </div>
        <Badge className={`${getCareerLevelColor(insights.careerLevel)} flex items-center gap-1`}>
          <Award className="w-3 h-3" />
          {getCareerLevelLabel(insights.careerLevel)}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Market Alignment */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Market Alignment</p>
              <p className="text-sm text-blue-800">{insights.marketAlignment}</p>
            </div>
          </div>
        </div>

        {/* Strengths */}
        {insights.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h4 className="font-semibold text-slate-900 text-sm">Key Strengths</h4>
            </div>
            <div className="space-y-2">
              {insights.strengths.map((strength, index) => (
                <div 
                  key={index}
                  className="flex gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <p className="text-sm text-slate-700">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {insights.weaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <h4 className="font-semibold text-slate-900 text-sm">Areas for Improvement</h4>
            </div>
            <div className="space-y-2">
              {insights.weaknesses.map((weakness, index) => (
                <div 
                  key={index}
                  className="flex gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Advice */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <p className="text-sm text-slate-700">
            <strong className="text-purple-900">Career Tip:</strong>{' '}
            {insights.careerLevel === 'senior' 
              ? 'Your profile demonstrates senior-level capabilities. Focus on leadership, architecture, and mentoring to advance further.'
              : insights.careerLevel === 'mid'
              ? 'You\'re on track for mid-level positions. Deepen your expertise and take on more complex projects to reach senior level.'
              : 'Build a strong foundation by addressing critical gaps and expanding your technology stack to advance to mid-level.'}
          </p>
        </div>
      </div>
    </Card>
  );
}
