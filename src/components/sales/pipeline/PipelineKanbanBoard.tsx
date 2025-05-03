
import * as React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { SalesProcess, SalesStage } from "@/types/sales/salesProcesses";
import { useSalesProcesses } from "@/hooks/sales/useSalesProcesses";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const PipelineKanbanBoard: React.FC = () => {
  const { t } = useLanguage();
  const { salesProcesses, isLoading } = useSalesProcesses("", "all", "active");

  // Define our pipeline stages
  const stages: SalesStage[] = [
    'quote',
    'authorization',
    'request',
    'proposal',
    'receipt',
    'signed',
    'concluded'
  ];

  // Group sales processes by stage
  const processesByStage = stages.reduce((acc, stage) => {
    acc[stage] = salesProcesses.filter(process => process.stage === stage);
    return acc;
  }, {} as Record<SalesStage, SalesProcess[]>);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-6">
      {stages.map(stage => (
        <div key={stage} className="min-w-[250px]">
          <div className="bg-muted rounded-t-md p-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">{t(stage)}</h3>
              <Badge variant="outline">{processesByStage[stage].length}</Badge>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-b-md p-2 min-h-[400px] space-y-2">
            {processesByStage[stage].map(process => (
              <Card 
                key={process.id} 
                className="bg-background border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-3 space-y-2">
                  <div className="font-medium truncate">{process.title}</div>
                  
                  <div className="text-sm text-muted-foreground truncate">
                    {process.client_name}
                    {process.company && ` · ${process.company}`}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {process.estimated_value && (
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {process.estimated_value}
                      </div>
                    )}
                    
                    {process.expected_close_date && (
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(process.expected_close_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    <Badge 
                      className={cn(
                        "text-[10px] h-5",
                        process.status === 'active' && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                        process.status === 'won' && "bg-green-100 text-green-800 hover:bg-green-100",
                        process.status === 'lost' && "bg-red-100 text-red-800 hover:bg-red-100",
                        process.status === 'on_hold' && "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      )}
                      variant="outline"
                    >
                      {t(process.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {processesByStage[stage].length === 0 && (
              <div className="flex items-center justify-center h-full min-h-[100px] text-muted-foreground text-sm">
                {t("noProcessesInStage")}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PipelineKanbanBoard;
