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
    
    // First, let's check if the user exists and has any data
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

  // Test method to check database connection
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
