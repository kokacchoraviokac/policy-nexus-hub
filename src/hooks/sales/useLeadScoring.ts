
import { useState } from 'react';
import { useSupabaseClient } from '../useSupabaseClient';
import { toast } from 'sonner';
import { Lead } from '@/types/sales/leads';
import { useLanguage } from '@/contexts/LanguageContext';

export interface LeadScoreResult {
  totalScore: number;
  budgetScore: number;
  authorityScore: number;
  needScore: number;
  timelineScore: number;
  isQualified: boolean;
  qualificationLevel: string;
}

export const useLeadScoring = () => {
  const { t } = useLanguage();
  const supabase = useSupabaseClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateLeadScore = async (leadId: string, score: number) => {
    if (!leadId) return;
    
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ score })
        .eq('id', leadId)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating lead score:', error);
      toast.error(t("failedToUpdateScore"));
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateScore = (
    lead: Lead,
    formData: {
      budgetScore?: number;
      authorityScore?: number;
      needScore?: number;
      timelineScore?: number;
      budgetNotes?: string;
      authorityNotes?: string;
      needNotes?: string;
      timelineNotes?: string;
    }
  ): LeadScoreResult => {
    const budget = formData.budgetScore || 0;
    const authority = formData.authorityScore || 0;
    const need = formData.needScore || 0;
    const timeline = formData.timelineScore || 0;
    
    // Calculate total score (average of all criteria)
    const totalScore = Math.round((budget + authority + need + timeline) / 4);
    
    // Determine if lead is qualified (minimum threshold)
    const isQualified = totalScore >= 60;
    
    return {
      totalScore,
      budgetScore: budget,
      authorityScore: authority,
      needScore: need,
      timelineScore: timeline,
      isQualified,
      qualificationLevel: getQualificationLevel(totalScore).level
    };
  };
  
  const getQualificationLevel = (score: number) => {
    if (score >= 80) return { level: 'excellent', color: 'green' };
    if (score >= 60) return { level: 'good', color: 'emerald' };
    if (score >= 40) return { level: 'average', color: 'yellow' };
    if (score >= 20) return { level: 'poor', color: 'orange' };
    return { level: 'veryPoor', color: 'red' };
  };
  
  const shouldQualifyLead = (scoreResult: LeadScoreResult): boolean => {
    // Rule: The lead should be qualified if total score is at least 60
    // AND they have at least 50 in both "Need" and "Authority" criteria
    return (
      scoreResult.isQualified && 
      scoreResult.needScore >= 50 && 
      scoreResult.authorityScore >= 50
    );
  };

  return {
    calculateScore,
    getQualificationLevel,
    shouldQualifyLead,
    updateLeadScore,
    isUpdating
  };
};
