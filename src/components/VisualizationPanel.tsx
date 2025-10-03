import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Code2, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { TechnologyDetail, SkillGapDetail } from "../services/analysisEngine";

interface VisualizationPanelProps {
  technologies?: TechnologyDetail[];
  skillGaps?: SkillGapDetail[];
}

export default function VisualizationPanel({ 
  technologies = [],
  skillGaps = []
}: VisualizationPanelProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'language': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'framework': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'database': 'bg-green-100 text-green-700 hover:bg-green-200',
      'devops': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'cloud': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
      'tool': 'bg-pink-100 text-pink-700 hover:bg-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getDemandIcon = (demand: string) => {
    if (demand === 'high') return '🔥';
    if (demand === 'medium') return '⭐';
    return '💡';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'critical': 'bg-red-100 text-red-700 border-red-300',
      'high': 'bg-orange-100 text-orange-700 border-orange-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="p-6 bg-white">
      <Tabs defaultValue="tech" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tech">Technologies</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tech" className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Technology Stack</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            {technologies.length} technologies detected in your repository
          </p>
          
          {technologies.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {technologies.slice(0, 8).map((tech, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{tech.name}</span>
                        <span className="text-sm">{getDemandIcon(tech.marketDemand)}</span>
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(tech.category)}`}>
                          {tech.category}
                        </Badge>
                      </div>
                      {tech.relatedSkills.length > 0 && (
                        <div className="text-xs text-slate-500">
                          Related: {tech.relatedSkills.slice(0, 3).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {tech.proficiency === 'detected' ? '✓ Detected' : '~ Inferred'}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Market Demand Analysis</p>
                    <p className="text-sm text-blue-800">
                      {technologies.filter(t => t.marketDemand === 'high').length} high-demand technologies detected. 
                      Your stack aligns well with current industry trends.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No technologies detected</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="gaps" className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-slate-900">Skill Gaps</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Skills that could significantly boost your employability
          </p>
          
          {skillGaps.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {skillGaps.slice(0, 6).map((gap, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${getPriorityColor(gap.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{gap.skill}</span>
                          <Badge variant="outline" className="text-xs">
                            {gap.priority}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{gap.reason}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Zap className="w-4 h-4" />
                        +{gap.estimatedImpact}
                      </div>
                    </div>
                    {gap.learningResources.length > 0 && (
                      <div className="text-xs opacity-75">
                        📚 Learn: {gap.learningResources.slice(0, 3).join(' • ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-900">
                  <strong>Potential Impact:</strong> Addressing these gaps could increase your score by up to{' '}
                  <strong>{skillGaps.reduce((sum, gap) => sum + gap.estimatedImpact, 0)} points</strong>.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No significant skill gaps identified</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}