import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Github, BarChart3, Target, Zap, ArrowRight, CheckCircle, TrendingUp, User } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, signInWithGitHub } = useAuth();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/home');
    } else {
      try {
        await signInWithGitHub();
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Github className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RepoAnalyzer</span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button onClick={() => navigate('/home')}>
                Analyze
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={signInWithGitHub}>
              <Github className="w-4 h-4 mr-2" />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
              <Github className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Transform Your GitHub Profile Into a
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Hiring Magnet</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Get instant, actionable insights on your repositories. Track your progress over time and boost your employability score with data-driven recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6"
              onClick={handleGetStarted}
            >
              {user ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              ) : (
                <>
                  <Github className="mr-2 w-5 h-5" />
                  Sign in with GitHub
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-slate-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">10K+</div>
              <div className="text-sm text-slate-600">Repos Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.9/5</div>
              <div className="text-sm text-slate-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Everything You Need to Stand Out
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Scoring</h3>
            <p className="text-slate-600">
              Get a comprehensive score based on code quality, documentation, and project structure.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Skill Gap Analysis</h3>
            <p className="text-slate-600">
              Identify missing skills that employers are looking for in your target role.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Instant Insights</h3>
            <p className="text-slate-600">
              Receive actionable recommendations in seconds, not hours of manual review.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Track Progress</h3>
            <p className="text-slate-600">
              Sign in with GitHub to save your analyses and track improvement over time.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Three Simple Steps to Success
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sign in with GitHub</h3>
              <p className="text-slate-600">
                Connect your GitHub account to enable progress tracking and personalized insights.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyze Your Repositories</h3>
              <p className="text-slate-600">
                Our AI analyzes your code, documentation, structure, and compares it against industry standards.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Track Your Progress</h3>
              <p className="text-slate-600">
                Implement recommendations, re-analyze your repos, and watch your scores improve over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Join Thousands of Developers Boosting Their Careers
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span>Progress tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span>Instant results</span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-slate-100 text-lg px-8 py-6"
            onClick={handleGetStarted}
          >
            {user ? (
              <>
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            ) : (
              <>
                <Github className="mr-2 w-5 h-5" />
                Get Started with GitHub
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-slate-600">
        <p>© 2025 GitHub Repo Analyzer. Built with ❤️ for developers.</p>
      </div>
    </div>
  );
}
