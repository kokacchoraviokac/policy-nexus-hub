
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lead } from "@/types/sales/leads";
import { useLeadScoring } from "@/hooks/sales/useLeadScoring";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import LeadScoreIndicator from "./LeadScoreIndicator";

interface LeadScoringFormProps {
  lead: Lead;
  onSubmit: (values: LeadScoringFormValues) => void;
  isSubmitting?: boolean;
}

export interface LeadScoringFormValues {
  budgetScore: number;
  authorityScore: number;
  needScore: number;
  timelineScore: number;
  budgetNotes?: string;
  authorityNotes?: string;
  needNotes?: string;
  timelineNotes?: string;
}

const formSchema = z.object({
  budgetScore: z.number().min(0).max(25),
  authorityScore: z.number().min(0).max(25),
  needScore: z.number().min(0).max(25),
  timelineScore: z.number().min(0).max(25),
  budgetNotes: z.string().optional(),
  authorityNotes: z.string().optional(),
  needNotes: z.string().optional(),
  timelineNotes: z.string().optional(),
});

const LeadScoringForm: React.FC<LeadScoringFormProps> = ({ lead, onSubmit, isSubmitting = false }) => {
  const { t } = useLanguage();
  const { calculateScore } = useLeadScoring();
  
  const form = useForm<LeadScoringFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgetScore: lead.budget_score || 0,
      authorityScore: lead.authority_score || 0,
      needScore: lead.need_score || 0,
      timelineScore: lead.timeline_score || 0,
      budgetNotes: lead.budget_notes || "",
      authorityNotes: lead.authority_notes || "",
      needNotes: lead.need_notes || "",
      timelineNotes: lead.timeline_notes || "",
    },
  });
  
  const watchedValues = {
    budgetScore: form.watch("budgetScore"),
    authorityScore: form.watch("authorityScore"),
    needScore: form.watch("needScore"),
    timelineScore: form.watch("timelineScore"),
  };
  
  // Calculate total score based on current form values
  const currentScore = calculateScore(lead, watchedValues);
  
  const handleSubmit = (values: LeadScoringFormValues) => {
    onSubmit(values);
  };
  
  const ScoreCriteriaTooltip = ({ title, description }: { title: string; description: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground ml-1 inline cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium">{title}</p>
            <p className="text-xs mt-1">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/10">
          <div>
            <h3 className="font-medium">{t("totalLeadScore")}</h3>
            <p className="text-sm text-muted-foreground">{t("scoreBasedOnBANT")}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-36">
              <Progress value={currentScore.totalScore} className="h-2" />
            </div>
            <LeadScoreIndicator score={currentScore.totalScore} size="lg" />
          </div>
        </div>
        
        {/* Budget Criteria */}
        <div className="space-y-4 border-b pb-6">
          <div className="flex items-center">
            <h3 className="font-medium">{t("budgetCriteria")} (B)</h3>
            <ScoreCriteriaTooltip 
              title={t("budgetCriteria")}
              description={t("budgetCriteriaDescription")}
            />
            <span className="ml-auto font-medium">{watchedValues.budgetScore}/25</span>
          </div>
          
          <FormField
            control={form.control}
            name="budgetScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("budgetScore")}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={25}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="budgetNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("budgetNotes")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("enterBudgetNotes")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Authority Criteria */}
        <div className="space-y-4 border-b pb-6">
          <div className="flex items-center">
            <h3 className="font-medium">{t("authorityCriteria")} (A)</h3>
            <ScoreCriteriaTooltip 
              title={t("authorityCriteria")}
              description={t("authorityCriteriaDescription")}
            />
            <span className="ml-auto font-medium">{watchedValues.authorityScore}/25</span>
          </div>
          
          <FormField
            control={form.control}
            name="authorityScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("authorityScore")}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={25}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authorityNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("authorityNotes")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("enterAuthorityNotes")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Need Criteria */}
        <div className="space-y-4 border-b pb-6">
          <div className="flex items-center">
            <h3 className="font-medium">{t("needCriteria")} (N)</h3>
            <ScoreCriteriaTooltip 
              title={t("needCriteria")}
              description={t("needCriteriaDescription")}
            />
            <span className="ml-auto font-medium">{watchedValues.needScore}/25</span>
          </div>
          
          <FormField
            control={form.control}
            name="needScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("needScore")}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={25}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="needNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("needNotes")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("enterNeedNotes")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Timeline Criteria */}
        <div className="space-y-4 border-b pb-6">
          <div className="flex items-center">
            <h3 className="font-medium">{t("timelineCriteria")} (T)</h3>
            <ScoreCriteriaTooltip 
              title={t("timelineCriteria")}
              description={t("timelineCriteriaDescription")}
            />
            <span className="ml-auto font-medium">{watchedValues.timelineScore}/25</span>
          </div>
          
          <FormField
            control={form.control}
            name="timelineScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("timelineScore")}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={25}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timelineNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("timelineNotes")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("enterTimelineNotes")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("saveScore")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeadScoringForm;
