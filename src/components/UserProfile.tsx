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
  Star,
  BarChart3,
  History,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'

interface Repository {
  repository_url: string
  repository_name: string
  latest_analysis: AnalysisResult
}

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [repoHistory, setRepoHistory] = useState<AnalysisResult[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserRepositories()
    }
  }, [user])

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
            <Button variant="outline" onClick={loadUserRepositories} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repositories.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repositories.length > 0 
                  ? Math.round(repositories.reduce((sum, repo) => sum + repo.latest_analysis.overall_score, 0) / repositories.length)
                  : 0
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Best Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {repositories.length > 0 
                  ? Math.max(...repositories.map(repo => repo.latest_analysis.overall_score))
                  : 0
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repositories.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="repositories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="repositories">My Repositories</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
          </TabsList>

          <TabsContent value="repositories" className="space-y-6">
            {repositories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No repositories analyzed yet</h3>
                  <p className="text-gray-600 mb-4">Start by analyzing your first repository to track your progress over time.</p>
                  <Button onClick={() => window.location.href = '/home'}>
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
        </Tabs>
      </div>
    </div>
  )
}
