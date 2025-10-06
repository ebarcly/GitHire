import { supabase } from '../lib/supabase'

export interface AnalysisResult {
  id?: string
  user_id: string
  repository_url: string
  repository_name: string
  overall_score: number
  code_quality_score: number
  documentation_score: number
  structure_score: number
  recommendations: string[]
  analysis_data: any
  created_at?: string
}

export interface ProgressComparison {
  current: AnalysisResult
  previous: AnalysisResult | null
  improvement: {
    overall_score: number
    code_quality_score: number
    documentation_score: number
    structure_score: number
  }
}

export class ProgressTrackingService {
  async saveAnalysis(analysis: Omit<AnalysisResult, 'id' | 'created_at'>): Promise<AnalysisResult> {
    console.log('Saving analysis:', analysis)
    
    const { data, error } = await supabase
      .from('analyses')
      .insert([analysis])
      .select()
      .single()

    if (error) {
      console.error('Error saving analysis:', error)
      throw new Error(`Failed to save analysis: ${error.message}`)
    }
    
    console.log('Analysis saved successfully:', data)
    return data
  }

  async getUserAnalyses(userId: string): Promise<AnalysisResult[]> {
    console.log('Getting user analyses for user:', userId)
    
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting user analyses:', error)
      throw new Error(`Failed to get user analyses: ${error.message}`)
    }
    
    console.log('User analyses retrieved:', data?.length || 0, 'records')
    return data || []
  }

  async getRepositoryHistory(userId: string, repositoryUrl: string): Promise<AnalysisResult[]> {
    console.log('Getting repository history for:', { userId, repositoryUrl })
    
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .eq('repository_url', repositoryUrl)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting repository history:', error)
      throw new Error(`Failed to get repository history: ${error.message}`)
    }
    
    console.log('Repository history retrieved:', data?.length || 0, 'records')
    return data || []
  }

  async getProgressComparison(userId: string, repositoryUrl: string): Promise<ProgressComparison | null> {
    const history = await this.getRepositoryHistory(userId, repositoryUrl)
    
    if (history.length === 0) return null

    const current = history[0]
    const previous = history.length > 1 ? history[1] : null

    const improvement = {
      overall_score: previous ? current.overall_score - previous.overall_score : 0,
      code_quality_score: previous ? current.code_quality_score - previous.code_quality_score : 0,
      documentation_score: previous ? current.documentation_score - previous.documentation_score : 0,
      structure_score: previous ? current.structure_score - previous.structure_score : 0,
    }

    return {
      current,
      previous,
      improvement
    }
  }

  async getUniqueRepositories(userId: string): Promise<{ repository_url: string; repository_name: string; latest_analysis: AnalysisResult }[]> {
    console.log('Getting unique repositories for user:', userId)
    
    // check if the user exists and has any data
    const { data: userData, error: userError } = await supabase.auth.getUser()
    console.log('Current user from auth:', userData?.user?.id)
    
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting unique repositories:', error)
      throw new Error(`Failed to get repositories: ${error.message}`)
    }

    console.log('Raw analyses data:', data)

    if (!data || data.length === 0) {
      console.log('No analyses found for user')
      return []
    }

    const uniqueRepos = new Map<string, AnalysisResult>()
    
    data.forEach(analysis => {
      if (!uniqueRepos.has(analysis.repository_url)) {
        uniqueRepos.set(analysis.repository_url, analysis)
      }
    })

    const result = Array.from(uniqueRepos.values()).map(analysis => ({
      repository_url: analysis.repository_url,
      repository_name: analysis.repository_name,
      latest_analysis: analysis
    }))

    console.log('Unique repositories found:', result.length)
    return result
  }

  async getUserOwnRepositories(userId: string, githubUsername?: string): Promise<{ repository_url: string; repository_name: string; latest_analysis: AnalysisResult }[]> {
    console.log('Getting user own repositories for:', { userId, githubUsername })
    
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting user own repositories:', error)
      throw new Error(`Failed to get repositories: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return []
    }

    // filter to only include user's own repositories if GitHub username is provided
    const filteredData = githubUsername 
      ? data.filter(analysis => 
          analysis.repository_url.toLowerCase().includes(`github.com/${githubUsername.toLowerCase()}/`)
        )
      : data

    const uniqueRepos = new Map<string, AnalysisResult>()
    
    filteredData.forEach(analysis => {
      if (!uniqueRepos.has(analysis.repository_url)) {
        uniqueRepos.set(analysis.repository_url, analysis)
      }
    })

    return Array.from(uniqueRepos.values()).map(analysis => ({
      repository_url: analysis.repository_url,
      repository_name: analysis.repository_name,
      latest_analysis: analysis
    }))
  }

  // get progress over time for user's own repositories
  async getProgressOverTime(userId: string, githubUsername?: string): Promise<{ date: string; averageScore: number; codeQuality: number; documentation: number; structure: number }[]> {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Failed to get progress data: ${error.message}`)
    if (!data || data.length === 0) return []

    // filter to only user's own repositories if GitHub username provided
    const filteredData = githubUsername 
      ? data.filter(analysis => 
          analysis.repository_url.toLowerCase().includes(`github.com/${githubUsername.toLowerCase()}/`)
        )
      : data

    // group by month and calculate averages
    const monthlyData = new Map<string, { scores: number[], codeQuality: number[], documentation: number[], structure: number[] }>()
    
    filteredData.forEach(analysis => {
      const date = new Date(analysis.created_at!)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { scores: [], codeQuality: [], documentation: [], structure: [] })
      }
      
      const monthData = monthlyData.get(monthKey)!
      monthData.scores.push(analysis.overall_score)
      monthData.codeQuality.push(analysis.code_quality_score)
      monthData.documentation.push(analysis.documentation_score)
      monthData.structure.push(analysis.structure_score)
    })

    return Array.from(monthlyData.entries()).map(([date, data]) => ({
      date,
      averageScore: Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length),
      codeQuality: Math.round(data.codeQuality.reduce((sum, score) => sum + score, 0) / data.codeQuality.length),
      documentation: Math.round(data.documentation.reduce((sum, score) => sum + score, 0) / data.documentation.length),
      structure: Math.round(data.structure.reduce((sum, score) => sum + score, 0) / data.structure.length)
    }))
  }

  // get skill averages across all user's repositories
  async getSkillAverages(userId: string, githubUsername?: string): Promise<{ codeQuality: number; documentation: number; structure: number }> {
    const repos = await this.getUserOwnRepositories(userId, githubUsername)
    
    if (repos.length === 0) {
      return { codeQuality: 0, documentation: 0, structure: 0 }
    }

    const totals = repos.reduce((acc, repo) => ({
      codeQuality: acc.codeQuality + repo.latest_analysis.code_quality_score,
      documentation: acc.documentation + repo.latest_analysis.documentation_score,
      structure: acc.structure + repo.latest_analysis.structure_score
    }), { codeQuality: 0, documentation: 0, structure: 0 })

    return {
      codeQuality: Math.round(totals.codeQuality / repos.length),
      documentation: Math.round(totals.documentation / repos.length),
      structure: Math.round(totals.structure / repos.length)
    }
  }

  // get technology usage across user's repositories
  async getTechnologyUsage(userId: string, githubUsername?: string): Promise<{ technology: string; count: number; percentage: number }[]> {
    const { data, error } = await supabase
      .from('analyses')
      .select('analysis_data')
      .eq('user_id', userId)

    if (error) throw new Error(`Failed to get technology data: ${error.message}`)
    if (!data || data.length === 0) return []

    // filter to only user's own repositories if GitHub username provided
    const filteredData = githubUsername 
      ? data.filter(analysis => {
          // we need to check the repository_url from the analysis_data or make another query
          // for now, we process all data and filter later if needed
          return true
        })
      : data

    const techCounts = new Map<string, number>()
    let totalRepos = 0

    filteredData.forEach(analysis => {
      if (analysis.analysis_data?.technologies) {
        totalRepos++
        let technologies: string[] = []
        
        // handle different technology data formats
        if (Array.isArray(analysis.analysis_data.technologies)) {
          // if it's an array, extract technology names
          technologies = analysis.analysis_data.technologies.map((tech: any) => {
            if (typeof tech === 'string') {
              return tech
            } else if (typeof tech === 'object' && tech.name) {
              return tech.name
            } else if (typeof tech === 'object' && tech.technology) {
              return tech.technology
            }
            return String(tech)
          }).filter(Boolean)
        } else if (typeof analysis.analysis_data.technologies === 'object') {
          // if it's an object, get the keys or extract names
          technologies = Object.keys(analysis.analysis_data.technologies)
        }
        
        technologies.forEach((tech: string) => {
          if (tech && typeof tech === 'string') {
            techCounts.set(tech, (techCounts.get(tech) || 0) + 1)
          }
        })
      }
    })

    return Array.from(techCounts.entries())
      .map(([technology, count]) => ({
        technology,
        count,
        percentage: Math.round((count / totalRepos) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20) // top 20 technologies
  }

  // test method to check database connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('count(*)')
        .limit(1)

      if (error) {
        console.error('Database connection test failed:', error)
        return false
      }

      console.log('Database connection test successful')
      return true
    } catch (error) {
      console.error('Database connection test error:', error)
      return false
    }
  }
}

export const progressTrackingService = new ProgressTrackingService()
