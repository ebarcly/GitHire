import { supabase } from "../lib/supabase";

export interface AnalysisResult {
  id?: string;
  user_id: string;
  repository_url: string;
  repository_name: string;
  overall_score: number;
  code_quality_score: number;
  documentation_score: number;
  structure_score: number;
  recommendations: string[];
  analysis_data: any;
  created_at?: string;
}

export interface ProgressComparison {
  current: AnalysisResult;
  previous: AnalysisResult | null;
  improvement: {
    overall_score: number;
    code_quality_score: number;
    documentation_score: number;
    structure_score: number;
  };
}

export class ProgressTrackingService {
  async saveAnalysis(
    analysis: Omit<AnalysisResult, "id" | "created_at">
  ): Promise<AnalysisResult> {
    const { data, error } = await supabase
      .from("analyses")
      .insert([analysis])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserAnalyses(userId: string): Promise<AnalysisResult[]> {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getRepositoryHistory(
    userId: string,
    repositoryUrl: string
  ): Promise<AnalysisResult[]> {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .eq("repository_url", repositoryUrl)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getProgressComparison(
    userId: string,
    repositoryUrl: string
  ): Promise<ProgressComparison | null> {
    const history = await this.getRepositoryHistory(userId, repositoryUrl);

    if (history.length === 0) return null;

    const current = history[0];
    const previous = history.length > 1 ? history[1] : null;

    const improvement = {
      overall_score: previous
        ? current.overall_score - previous.overall_score
        : 0,
      code_quality_score: previous
        ? current.code_quality_score - previous.code_quality_score
        : 0,
      documentation_score: previous
        ? current.documentation_score - previous.documentation_score
        : 0,
      structure_score: previous
        ? current.structure_score - previous.structure_score
        : 0,
    };

    return {
      current,
      previous,
      improvement,
    };
  }

  async getUniqueRepositories(
    userId: string
  ): Promise<
    {
      repository_url: string;
      repository_name: string;
      latest_analysis: AnalysisResult;
    }[]
  > {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const uniqueRepos = new Map<string, AnalysisResult>();

    data?.forEach((analysis) => {
      if (!uniqueRepos.has(analysis.repository_url)) {
        uniqueRepos.set(analysis.repository_url, analysis);
      }
    });

    return Array.from(uniqueRepos.values()).map((analysis) => ({
      repository_url: analysis.repository_url,
      repository_name: analysis.repository_name,
      latest_analysis: analysis,
    }));
  }
}

export const progressTrackingService = new ProgressTrackingService();
