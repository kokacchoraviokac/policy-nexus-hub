
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useCalculatePayouts } from "@/hooks/agent/useCalculatePayouts";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PayoutPreviewTable from "./payout/PayoutPreviewTable";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

const CalculatePayouts = () => {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  const [selectedAgent, setSelectedAgent] = useState("");
  
  const {
    agents,
    calculatePayoutPreview,
    payoutPreviewData,
    isCalculating,
    isLoading,
    finalizePayouts,
    isFinalizing
  } = useCalculatePayouts();

  const handleCalculate = () => {
    if (!dateRange.from || !dateRange.to) return;
    
    calculatePayoutPreview({
      agentId: selectedAgent,
      periodStart: format(dateRange.from, 'yyyy-MM-dd'),
      periodEnd: format(dateRange.to, 'yyyy-MM-dd')
    });
  };

  const handleFinalize = () => {
    if (!dateRange.from || !dateRange.to) return;
    
    finalizePayouts({
      agentId: selectedAgent,
      periodStart: format(dateRange.from, 'yyyy-MM-dd'),
      periodEnd: format(dateRange.to, 'yyyy-MM-dd'),
      items: payoutPreviewData?.items || []
    });
  };

  const handleDateRangeChange = (range: DateRange) => {
    // Only update if both from and to are set
    if (range?.from && range?.to) {
      setDateRange(range);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("payoutCalculationParameters")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent">{t("selectAgent")}</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger id="agent">
                  <SelectValue placeholder={t("selectAgent")} />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t("payoutPeriod")}</Label>
              <DatePickerWithRange
                className=""
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleCalculate} 
            disabled={!selectedAgent || isCalculating || !dateRange.from || !dateRange.to}
            className="mt-4"
          >
            {isCalculating ? t("calculating") : t("calculatePayouts")}
          </Button>
        </CardContent>
      </Card>
      
      {payoutPreviewData && (
        <Card>
          <CardHeader>
            <CardTitle>{t("payoutPreview")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{t("totalPayout")}: {payoutPreviewData.totalAmount}</p>
                <p>{t("policies")}: {payoutPreviewData.items.length}</p>
              </div>
              <Button 
                onClick={handleFinalize} 
                disabled={isFinalizing || !payoutPreviewData.items.length}
              >
                {isFinalizing ? t("finalizing") : t("finalizePayouts")}
              </Button>
            </div>
            
            <PayoutPreviewTable items={payoutPreviewData.items} isLoading={isLoading} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatePayouts;
