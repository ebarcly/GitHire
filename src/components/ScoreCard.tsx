import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface ScoreCardProps {
  score?: number;
  metrics?: {
    codeQuality: number;
    documentation: number;
    projectStructure: number;
  };
}

export default function ScoreCard({ 
  score = 75, 
  metrics = { codeQuality: 80, documentation: 70, projectStructure: 75 } 
}: ScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    return "Needs Improvement";
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Repository Score</h2>
          <p className="text-slate-600">Overall hiring readiness assessment</p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="text-sm text-slate-500 mt-1">{getScoreLabel(score)}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Code Quality */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${getScoreColor(metrics.codeQuality)}`} />
              <span className="font-medium text-slate-700">Code Quality</span>
            </div>
            <span className={`font-semibold ${getScoreColor(metrics.codeQuality)}`}>
              {metrics.codeQuality}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${getProgressColor(metrics.codeQuality)} transition-all duration-500`}
              style={{ width: `${metrics.codeQuality}%` }}
            />
          </div>
        </div>

        {/* Documentation */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${getScoreColor(metrics.documentation)}`} />
              <span className="font-medium text-slate-700">Documentation</span>
            </div>
            <span className={`font-semibold ${getScoreColor(metrics.documentation)}`}>
              {metrics.documentation}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${getProgressColor(metrics.documentation)} transition-all duration-500`}
              style={{ width: `${metrics.documentation}%` }}
            />
          </div>
        </div>

        {/* Project Structure */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${getScoreColor(metrics.projectStructure)}`} />
              <span className="font-medium text-slate-700">Project Structure</span>
            </div>
            <span className={`font-semibold ${getScoreColor(metrics.projectStructure)}`}>
              {metrics.projectStructure}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`absolute h-full ${getProgressColor(metrics.projectStructure)} transition-all duration-500`}
              style={{ width: `${metrics.projectStructure}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}