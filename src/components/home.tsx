import { useState } from "react";
import ScoreCard from "./ScoreCard";
import VisualizationPanel from "./VisualizationPanel";
import RecommendationPanel from "./RecommendationPanel";
import InsightsPanel from "./InsightsPanel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Github, Download, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { githubService } from "../services/githubService";
import { analysisEngine, AnalysisResult } from "../services/analysisEngine";
import { reportGenerator } from "../services/reportGenerator";

function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Fetch repository data from GitHub
      const repoData = await githubService.fetchRepoData(repoUrl);
      
      // Analyze the repository
      const analysis = analysisEngine.analyze(repoData);
      
      setAnalysisData(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
      setAnalysisData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = () => {
    if (!analysisData) return;
    reportGenerator.generatePDF(analysisData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing && repoUrl.trim()) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Github className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">GitHub Repo Analyzer</h1>
          </div>
          <p className="text-slate-600">Analyze your repositories and get actionable insights to boost your employability</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isAnalyzing}
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !repoUrl.trim()}
              className="px-8"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>
          
          {/* Example URLs */}
          <div className="mt-4 text-sm text-slate-500">
            <p className="mb-1">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRepoUrl('https://github.com/facebook/react')}
                className="text-blue-600 hover:underline"
                disabled={isAnalyzing}
              >
                facebook/react
              </button>
              <span>•</span>
              <button
                onClick={() => setRepoUrl('https://github.com/vercel/next.js')}
                className="text-blue-600 hover:underline"
                disabled={isAnalyzing}
              >
                vercel/next.js
              </button>
              <span>•</span>
              <button
                onClick={() => setRepoUrl('https://github.com/microsoft/vscode')}
                className="text-blue-600 hover:underline"
                disabled={isAnalyzing}
              >
                microsoft/vscode
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {analysisData && (
          <div className="space-y-6">
            {/* Repository Info */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{analysisData.repoInfo.name}</h2>
                  {analysisData.repoInfo.description && (
                    <p className="text-slate-600 mt-1">{analysisData.repoInfo.description}</p>
                  )}
                </div>
                <div className="flex gap-4 text-sm text-slate-600">
                  <div className="text-center">
                    <div className="font-semibold text-slate-900">{analysisData.repoInfo.stars}</div>
                    <div>Stars</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-900">{analysisData.repoInfo.forks}</div>
                    <div>Forks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Overview */}
            <ScoreCard 
              score={analysisData.score}
              metrics={analysisData.metrics}
            />

            {/* Career Insights */}
            <InsightsPanel insights={analysisData.insights} />

            {/* Visualizations and Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VisualizationPanel 
                technologies={analysisData.technologies}
                skillGaps={analysisData.skillGaps}
              />
              <RecommendationPanel 
                recommendations={analysisData.recommendations}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setRepoUrl("");
                  setAnalysisData(null);
                  setError(null);
                }}
              >
                Analyze Another Repository
              </Button>
              <Button 
                onClick={handleGenerateReport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;