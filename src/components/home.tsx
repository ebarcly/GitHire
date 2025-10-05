import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { progressTrackingService } from "../services/progressTrackingService";
import ScoreCard from "./ScoreCard";
import VisualizationPanel from "./VisualizationPanel";
import RecommendationPanel from "./RecommendationPanel";
import InsightsPanel from "./InsightsPanel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Github, Download, AlertCircle, Loader2, User, LogOut, History } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { githubService } from "../services/githubService";
import { analysisEngine, AnalysisResult } from "../services/analysisEngine";
import { reportGenerator } from "../services/reportGenerator";

function Home() {
  const navigate = useNavigate();
  const { user, signInWithGitHub, signOut } = useAuth();
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

      // Save analysis if user is authenticated
      if (user && analysis) {
        setIsSaving(true);
        try {
          await progressTrackingService.saveAnalysis({
            user_id: user.id,
            repository_url: repoUrl,
            repository_name: analysis.repoInfo.name,
            overall_score: analysis.score.overall,
            code_quality_score: analysis.score.codeQuality,
            documentation_score: analysis.score.documentation,
            structure_score: analysis.score.structure,
            recommendations: analysis.recommendations.map(r => r.title),
            analysis_data: {
              repoInfo: analysis.repoInfo,
              metrics: analysis.metrics,
              technologies: analysis.technologies,
              skillGaps: analysis.skillGaps,
              insights: analysis.insights
            }
          });
        } catch (saveError) {
          console.error('Error saving analysis:', saveError);
          // Don't show error to user as analysis still worked
        } finally {
          setIsSaving(false);
        }
      }
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

  const handleSignIn = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Github className="w-8 h-8 text-slate-700" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">GitHub Repo Analyzer</h1>
                <p className="text-slate-600">Analyze your repositories and get actionable insights to boost your employability</p>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => navigate('/profile')}>
                    <History className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{user.user_metadata?.full_name || user.email}</div>
                      <div className="text-slate-500">@{user.user_metadata?.user_name}</div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={signOut}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button variant="outline" onClick={handleSignIn}>
                  <Github className="w-4 h-4 mr-2" />
                  Sign in to Track Progress
                </Button>
              )}
            </div>
          </div>

          {/* Progress Tracking Notice */}
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Github className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Track Your Progress Over Time</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Sign in with GitHub to save your analyses and see how your repositories improve over time. 
                    Compare scores from different analysis dates and track your development journey.
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                    onClick={handleSignIn}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Sign in with GitHub
                  </Button>
                </div>
              </div>
            </div>
          )}
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
          
          {/* Saving indicator */}
          {isSaving && (
            <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving analysis to your profile...
            </div>
          )}
          
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
                  {user && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <Github className="w-4 h-4" />
                      Analysis saved to your profile
                    </div>
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
              {user && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  View All Analyses
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
