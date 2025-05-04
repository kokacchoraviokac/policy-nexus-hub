
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLeadScoring } from '@/hooks/sales/useLeadScoring';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface LeadScoringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  currentScore?: number;
  onScoreUpdate?: (newScore: number) => void;
}

const LeadScoringDialog: React.FC<LeadScoringDialogProps> = ({ 
  open, 
  onOpenChange, 
  leadId,
  currentScore = 0,
  onScoreUpdate
}) => {
  const { t } = useLanguage();
  const [score, setScore] = useState(currentScore);
  const { updateLeadScore, isUpdating } = useLeadScoring();
  
  const handleSliderChange = (value: number[]) => {
    setScore(value[0]);
  };
  
  const handleSave = async () => {
    try {
      await updateLeadScore(leadId, score);
      toast.success(t("leadScoreUpdated"));
      
      if (onScoreUpdate) {
        onScoreUpdate(score);
      }
      
      onOpenChange(false);
      
      // Remove the notification call since it doesn't exist in useNotificationService
      // We'll handle notifications separately if needed
    } catch (error) {
      console.error('Error updating lead score:', error);
      toast.error(t("leadScoreUpdateFailed"));
    }
  };
  
  const getScoreLabel = () => {
    if (score >= 80) return t("excellent");
    if (score >= 60) return t("good");
    if (score >= 40) return t("average");
    if (score >= 20) return t("poor");
    return t("veryPoor");
  };
  
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-emerald-600";
    if (score >= 40) return "text-yellow-600";
    if (score >= 20) return "text-orange-600";
    return "text-red-600";
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("updateLeadScore")}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex justify-between items-center mb-6">
            <span>{t("score")}:</span>
            <span className={`text-2xl font-bold ${getScoreColor()}`}>
              {score} - {getScoreLabel()}
            </span>
          </div>
          
          <Slider
            value={[score]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{t("veryPoor")}</span>
            <span>{t("poor")}</span>
            <span>{t("average")}</span>
            <span>{t("good")}</span>
            <span>{t("excellent")}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? t("saving") : t("saveScore")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadScoringDialog;
