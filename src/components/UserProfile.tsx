import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { progressTrackingService, AnalysisResult } from '../services/progressTrackingService'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Github, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  GitBranch,
  BarChart3,
  History,
  AlertCircle,
  Loader2,
  RefreshCw,
  Home,
  Radar,
  Activity,
  Code
} from 'lucide-react'
import { format } from 'date-fns'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar
} from 'recharts'

interface Repository {
  repository_url: string
  repository_name: string
  latest_analysis: AnalysisResult
}

interface ProgressData {
  date: string
  averageScore: number
  codeQuality: number
  documentation: number
  structure: number
}

interface SkillData {
  skill: string
  score: number
  fullMark: 100
}

interface TechData {
  technology: string
  count: number
  percentage: number
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff', '#ff0000']

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [userOwnRepos, setUserOwnRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [repoHistory, setRepoHistory] = useState<AnalysisResult[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [skillData, setSkillData] = useState<SkillData[]>([])
  const [techData, setTechData] = useState<TechData[]>([])
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserRepositories()
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    if (!user) return
    
    setLoadingAnalytics(true)
    try {
      const githubUsername = user.user_metadata?.user_name
      
      // load progress over time
      const progress = await progressTrackingService.getProgressOverTime(user.id, githubUsername)
      setProgressData(progress)
      
      // Load skill averages
      const skills = await progressTrackingService.getSkillAverages(user.id, githubUsername)
      setSkillData([
        { skill: 'Code Quality', score: skills.codeQuality, fullMark: 100 },
        { skill: 'Documentation', score: skills.documentation, fullMark: 100 },
        { skill: 'Structure', score: skills.structure, fullMark: 100 }
      ])
      
      // load technology usage
      const tech = await progressTrackingService.getTechnologyUsage(user.id, githubUsername)
      setTechData(tech)
      
      // load user's own repositories
      const ownRepos = await progressTrackingService.getUserOwnRepositories(user.id, githubUsername)
      setUserOwnRepos(ownRepos)
      
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const loadUserRepositories = async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Loading repositories for user:', user.id)
      const repos = await progressTrackingService.getUniqueRepositories(user.id)
      console.log('Loaded repositories:', repos)
      setRepositories(repos)
    } catch (error) {
      console.error('Error loading repositories:', error)
      setError('Failed to load your repositories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadRepositoryHistory = async (repositoryUrl: string) => {
    if (!user) return
    
    setLoadingHistory(true)
    try {
      console.log('Loading history for repository:', repositoryUrl)
      const history = await progressTrackingService.getRepositoryHistory(user.id, repositoryUrl)
      console.log('Loaded history:', history)
      setRepoHistory(history)
      setSelectedRepo(repositoryUrl)
    } catch (error) {
      console.error('Error loading repository history:', error)
      setError('Failed to load repository history. Please try again.')
    } finally {
      setLoadingHistory(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (improvement < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return null
  }

  const calculateImprovement = (current: number, previous: number) => {
    return current - previous
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in Required</h3>
            <p className="text-gray-600 mb-4">Please sign in with GitHub to view your profile and track your progress.</p>
            <Button onClick={() => window.location.href = '/'}>
              <Github className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                <Github className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.user_metadata?.full_name || user?.email}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Github className="w-4 h-4" />
                {user?.user_metadata?.user_name || 'GitHub User'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => window.location.href = '/home'}>
              <Home className="w-4 h-4 mr-2" />
              Analyze Repository
            </Button>
            <Button variant="outline" onClick={() => { loadUserRepositories(); loadAnalytics(); }} disabled={loading || loadingAnalytics}>
              <RefreshCw className={`w-4 h-4 mr-2 ${(loading || loadingAnalytics) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Your Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userOwnRepos.length}</div>
              <p className="text-xs text-gray-500">Owned by you</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userOwnRepos.length > 0 
                  ? Math.round(userOwnRepos.reduce((sum, repo) => sum + repo.latest_analysis.overall_score, 0) / userOwnRepos.length)
                  : 0
                }
              </div>
              <p className="text-xs text-gray-500">Your repositories</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userOwnRepos.length > 0 
                  ? Math.max(...userOwnRepos.map(repo => repo.latest_analysis.overall_score))
                  : 0
                }
              </div>
              <p className="text-xs text-gray-500">Personal best</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Analyzed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repositories.length}
              </div>
              <p className="text-xs text-gray-500">All repositories</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repositories">My Repositories</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
            <TabsTrigger value="all">All Analyzed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loadingAnalytics ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-purple-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            ) : userOwnRepos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No personal repositories analyzed yet</h3>
                  <p className="text-gray-600 mb-4">Analyze your own repositories to see progress tracking and skill insights.</p>
                  <Button onClick={() => window.location.href = '/home'}>
                    <Home className="w-4 h-4 mr-2" />
                    Analyze Your Repository
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Over Time Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progress Over Time
                    </CardTitle>
                    <CardDescription>Your average repository scores by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {progressData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={progressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="averageScore" stroke="#8884d8" strokeWidth={3} name="Overall Score" />
                          <Line type="monotone" dataKey="codeQuality" stroke="#82ca9d" strokeWidth={2} name="Code Quality" />
                          <Line type="monotone" dataKey="documentation" stroke="#ffc658" strokeWidth={2} name="Documentation" />
                          <Line type="monotone" dataKey="structure" stroke="#ff7300" strokeWidth={2} name="Structure" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Not enough data for progress tracking. Analyze more repositories over time.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Skill Radar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Radar className="w-5 h-5" />
                      Skill Overview
                    </CardTitle>
                    <CardDescription>Your average scores across key areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={skillData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <RechartsRadar
                          name="Score"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Technology Heatmap */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Technology Stack
                    </CardTitle>
                    <CardDescription>Most used technologies in your repositories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {techData && techData.length > 0 ? (
                      <div className="space-y-3">
                        {techData.slice(0, 8).map((tech, index) => {
                          // safety check to ensure tech is a valid object with required properties
                          if (!tech || typeof tech !== 'object' || !tech.technology || typeof tech.technology !== 'string') {
                            return null
                          }
                          
                          return (
                            <div key={`${tech.technology}-${index}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm font-medium">{tech.technology}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${Math.min(tech.percentage || 0, 100)}%`,
                                      backgroundColor: COLORS[index % COLORS.length]
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">{tech.percentage || 0}%</span>
                              </div>
                            </div>
                          )
                        }).filter(Boolean)}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No technology data available yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="repositories" className="space-y-6">
            {userOwnRepos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No personal repositories analyzed yet</h3>
                  <p className="text-gray-600 mb-4">Analyze your own repositories to track your progress over time.</p>
                  <Button onClick={() => window.location.href = '/home'}>
                    <Home className="w-4 h-4 mr-2" />
                    Analyze Repository
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userOwnRepos.map((repo) => (
                  <Card key={repo.repository_url} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{repo.repository_name}</CardTitle>
                        <Badge variant="secondary" className={getScoreColor(repo.latest_analysis.overall_score)}>
                          {repo.latest_analysis.overall_score}/100
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last analyzed {format(new Date(repo.latest_analysis.created_at!), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Code Quality</span>
                          <span className={getScoreColor(repo.latest_analysis.code_quality_score)}>
                            {repo.latest_analysis.code_quality_score}/100
                          </span>
                        </div>
                        <Progress value={repo.latest_analysis.code_quality_score} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Documentation</span>
                          <span className={getScoreColor(repo.latest_analysis.documentation_score)}>
                            {repo.latest_analysis.documentation_score}/100
                          </span>
                        </div>
                        <Progress value={repo.latest_analysis.documentation_score} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Structure</span>
                          <span className={getScoreColor(repo.latest_analysis.structure_score)}>
                            {repo.latest_analysis.structure_score}/100
                          </span>
                        </div>
                        <Progress value={repo.latest_analysis.structure_score} className="h-2" />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => loadRepositoryHistory(repo.repository_url)}
                          disabled={loadingHistory}
                        >
                          {loadingHistory ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <History className="w-4 h-4 mr-2" />
                          )}
                          View History
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => window.open(repo.repository_url, '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View Repo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {selectedRepo && repoHistory.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">
                    Analysis History for {repoHistory[0]?.repository_name}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {repoHistory.map((analysis, index) => {
                    const previousAnalysis = index < repoHistory.length - 1 ? repoHistory[index + 1] : null
                    const overallImprovement = previousAnalysis ? calculateImprovement(analysis.overall_score, previousAnalysis.overall_score) : 0
                    
                    return (
                      <Card key={analysis.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Analysis #{repoHistory.length - index}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={getScoreColor(analysis.overall_score)}>
                                {analysis.overall_score}/100
                              </Badge>
                              {previousAnalysis && getImprovementIcon(overallImprovement)}
                              {previousAnalysis && overallImprovement !== 0 && (
                                <span className={`text-sm ${overallImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {overallImprovement > 0 ? '+' : ''}{overallImprovement}
                                </span>
                              )}
                            </div>
                          </div>
                          <CardDescription>
                            {format(new Date(analysis.created_at!), 'MMM d, yyyy \'at\' h:mm a')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Code Quality</div>
                              <div className={`text-lg font-semibold ${getScoreColor(analysis.code_quality_score)}`}>
                                {analysis.code_quality_score}
                              </div>
                              {previousAnalysis && (
                                <div className={`text-xs ${calculateImprovement(analysis.code_quality_score, previousAnalysis.code_quality_score) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {calculateImprovement(analysis.code_quality_score, previousAnalysis.code_quality_score) > 0 ? '+' : ''}
                                  {calculateImprovement(analysis.code_quality_score, previousAnalysis.code_quality_score)}
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Documentation</div>
                              <div className={`text-lg font-semibold ${getScoreColor(analysis.documentation_score)}`}>
                                {analysis.documentation_score}
                              </div>
                              {previousAnalysis && (
                                <div className={`text-xs ${calculateImprovement(analysis.documentation_score, previousAnalysis.documentation_score) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {calculateImprovement(analysis.documentation_score, previousAnalysis.documentation_score) > 0 ? '+' : ''}
                                  {calculateImprovement(analysis.documentation_score, previousAnalysis.documentation_score)}
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Structure</div>
                              <div className={`text-lg font-semibold ${getScoreColor(analysis.structure_score)}`}>
                                {analysis.structure_score}
                              </div>
                              {previousAnalysis && (
                                <div className={`text-xs ${calculateImprovement(analysis.structure_score, previousAnalysis.structure_score) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {calculateImprovement(analysis.structure_score, previousAnalysis.structure_score) > 0 ? '+' : ''}
                                  {calculateImprovement(analysis.structure_score, previousAnalysis.structure_score)}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No history selected</h3>
                  <p className="text-gray-600">Select a repository from the "My Repositories" tab to view its analysis history.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {repositories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No repositories analyzed yet</h3>
                  <p className="text-gray-600 mb-4">Start by analyzing your first repository.</p>
                  <Button onClick={() => window.location.href = '/home'}>
                    <Home className="w-4 h-4 mr-2" />
                    Analyze Repository
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {repositories.map((repo) => (
                  <Card key={repo.repository_url} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{repo.repository_name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getScoreColor(repo.latest_analysis.overall_score)}>
                            {repo.latest_analysis.overall_score}/100
                          </Badge>
                          {user?.user_metadata?.user_name && repo.repository_url.toLowerCase().includes(`github.com/${user.user_metadata.user_name.toLowerCase()}/`) && (
                            <Badge variant="outline" className="text-xs">
                              Your Repo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last analyzed {format(new Date(repo.latest_analysis.created_at!), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Code Quality</span>
                          <span className={getScoreColor(repo.latest_analysis.code_quality_score)}>
                            {repo.latest_analysis.code_quality_score}/100
                          </span>
                        </div>
                        <Progress value={repo.latest_analysis.code_quality_score} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Documentation</span>
                          <span className={getScoreColor(repo.latest_analysis.documentation_score)}>
                            {repo.latest_analysis.documentation_score}/100
                          </span>
                        </div>
                        <Progress value={repo.latest_analysis.documentation_score} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Structure</span>
                          <span className={getScoreColor(repo.latest_analysis.structure_score)}>
                            {repo.latest_analysis.structure_score}/100
                          </span>
                        </div>
                        <Progress value={repo.latest_analysis.structure_score} className="h-2" />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => loadRepositoryHistory(repo.repository_url)}
                          disabled={loadingHistory}
                        >
                          {loadingHistory ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <History className="w-4 h-4 mr-2" />
                          )}
                          View History
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => window.open(repo.repository_url, '_blank')}
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View Repo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
