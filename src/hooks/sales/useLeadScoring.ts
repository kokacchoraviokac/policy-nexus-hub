
import { useState } from "react";
import { Lead } from "@/types/sales/leads";

interface LeadScoreResult {
  totalScore: number;
  budgetScore: number;
  authorityScore: number;
  needScore: number;
  timelineScore: number;
}

export function useLeadScoring() {
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Calculate lead score based on BANT criteria
  const calculateScore = (lead: Lead, formData: {
    budgetScore?: number;
    authorityScore?: number;
    needScore?: number;
    timelineScore?: number;
    budgetNotes?: string;
    authorityNotes?: string;
    needNotes?: string;
    timelineNotes?: string;
  }): LeadScoreResult => {
    setIsCalculating(true);
    
    try {
      // Use provided scores or existing scores from lead
      const budgetScore = formData.budgetScore !== undefined ? formData.budgetScore : lead.budget_score || 0;
      const authorityScore = formData.authorityScore !== undefined ? formData.authorityScore : lead.authority_score || 0;
      const needScore = formData.needScore !== undefined ? formData.needScore : lead.need_score || 0;
      const timelineScore = formData.timelineScore !== undefined ? formData.timelineScore : lead.timeline_score || 0;
      
      // Calculate total score - each BANT criteria can have 0-25 points
      // This creates a total score range of 0-100
      const totalScore = budgetScore + authorityScore + needScore + timelineScore;
      
      return {
        totalScore,
        budgetScore,
        authorityScore,
        needScore,
        timelineScore
      };
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Get lead qualification level based on score
  const getQualificationLevel = (score: number): {
    level: 'cold' | 'warm' | 'hot';
    color: string;
    label: string;
  } => {
    if (score >= 75) {
      return { level: 'hot', color: 'bg-red-500', label: 'Hot Lead' };
    } else if (score >= 50) {
      return { level: 'warm', color: 'bg-yellow-500', label: 'Warm Lead' };
    } else {
      return { level: 'cold', color: 'bg-blue-500', label: 'Cold Lead' };
    }
  };
  
  // Check if lead qualifies for status change based on score
  const shouldQualifyLead = (score: number): boolean => {
    // Suggest qualification if score is 50 or higher
    return score >= 50;
  };

  return {
    calculateScore,
    getQualificationLevel,
    shouldQualifyLead,
    isCalculating
  };
}
