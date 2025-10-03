import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb, ChevronRight, Zap, Clock } from "lucide-react";
import { RecommendationDetail } from "../services/analysisEngine";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface RecommendationPanelProps {
  recommendations?: RecommendationDetail[];
}

export default function RecommendationPanel({ 
  recommendations = []
}: RecommendationPanelProps) {
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'critical': 'bg-red-100 text-red-700 border-red-300',
      'high': 'bg-orange-100 text-orange-700 border-orange-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'code-quality': '🔍',
      'documentation': '📚',
      'structure': '🏗️',
      'collaboration': '🤝',
      'deployment': '🚀'
    };
    return icons[category] || '💡';
  };

  const getEffortBadge = (effort: string) => {
    const styles: Record<string, string> = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-red-100 text-red-700'
    };
    return styles[effort] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h3 className="font-semibold text-slate-900">Personalized Recommendations</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        {recommendations.length} actionable steps to improve your repository score
      </p>
      
      {recommendations.length > 0 ? (
        <>
          <Accordion type="single" collapsible className="space-y-3">
            {recommendations.slice(0, 8).map((rec, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className={`border-2 rounded-lg ${getPriorityColor(rec.priority)}`}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-start gap-3 text-left flex-1">
                    <span className="text-xl flex-shrink-0">{getCategoryIcon(rec.category)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">{rec.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs opacity-90">{rec.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold flex-shrink-0">
                      <Zap className="w-4 h-4" />
                      +{rec.scoreImpact}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-4 text-xs">
                      <Badge className={getEffortBadge(rec.estimatedEffort)}>
                        <Clock className="w-3 h-3 mr-1" />
                        {rec.estimatedEffort} effort
                      </Badge>
                      <span className="text-slate-600">Category: {rec.category}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-2">Action Steps:</p>
                      <ol className="space-y-2">
                        {rec.actionSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-2 text-sm text-slate-700">
                            <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <p className="text-sm text-slate-700">
              <strong className="text-purple-900">Total Potential Impact:</strong> Implementing all recommendations could increase your score by up to{' '}
              <strong className="text-purple-900">
                {recommendations.reduce((sum, rec) => sum + rec.scoreImpact, 0)} points
              </strong>
              {' '}and significantly boost your employability.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No recommendations available</p>
        </div>
      )}
    </Card>
  );
}