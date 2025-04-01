
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Grid } from "@/components/ui/grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Calendar, 
  Users, 
  Clipboard, 
  ChevronRight, 
  DollarSign, 
  AlertCircle,
  ArrowRightLeft,
  MoveLeft,
  MoveRight
} from "lucide-react";
import { toast } from "sonner";
import SalesProcessDetailsDialog from "../processes/SalesProcessDetailsDialog";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";

// Types for the pipeline stages and items
interface PipelineItem {
  id: string;
  title: string;
  company?: string;
  client_name: string;
  date: string;
  stage: string;
  responsible_person?: string;
  insurance_type: string;
  status: "active" | "completed" | "canceled";
  estimated_value?: string;
  created_at: string;
  expected_close_date?: string;
  notes?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  items: PipelineItem[];
}

// Mock data for the pipeline stages
const pipelineStagesMock: PipelineStage[] = [
  {
    id: "lead",
    name: "leadProspect",
    items: [
      {
        id: "1",
        title: "Initial Contact",
        company: "Global Industries",
        client_name: "John Smith",
        date: "2023-09-12",
        stage: "quote",
        responsible_person: "John Doe",
        status: "active",
        insurance_type: "nonLife",
        estimated_value: "€12,000",
        created_at: "2023-09-12T10:00:00Z",
        expected_close_date: "2023-10-15T00:00:00Z",
        notes: "Initial contact with client regarding business insurance needs."
      },
      {
        id: "2",
        title: "Lead Follow-up",
        company: "Tech Solutions",
        client_name: "Jane Smith",
        date: "2023-09-15",
        stage: "quote",
        responsible_person: "Jane Smith",
        status: "active",
        insurance_type: "life",
        estimated_value: "€8,500",
        created_at: "2023-09-15T14:15:00Z",
      },
    ],
  },
  {
    id: "quote",
    name: "quoteManagement",
    items: [
      {
        id: "3",
        title: "Quote Preparation",
        company: "Sunshine Corp",
        client_name: "Mike Johnson",
        date: "2023-09-10",
        stage: "quote",
        responsible_person: "Mike Johnson",
        status: "active",
        insurance_type: "nonLife",
        estimated_value: "€35,200",
        created_at: "2023-09-10T09:45:00Z",
        notes: "Preparing comprehensive quotes from multiple insurers."
      },
    ],
  },
  {
    id: "negotiation",
    name: "insurerQuotes",
    items: [
      {
        id: "4",
        title: "Negotiation",
        company: "Evergreen Ltd",
        client_name: "Sarah Williams",
        date: "2023-09-05",
        stage: "quote",
        responsible_person: "Sarah Williams",
        status: "active",
        insurance_type: "nonLife",
        estimated_value: "€22,750",
        created_at: "2023-09-05T16:20:00Z",
      },
      {
        id: "5",
        title: "Final Offer",
        company: "Bright Future Inc",
        client_name: "John Doe",
        date: "2023-09-08",
        stage: "quote",
        responsible_person: "John Doe",
        status: "active",
        insurance_type: "life",
        estimated_value: "€18,300",
        created_at: "2023-09-08T11:00:00Z",
      },
    ],
  },
  {
    id: "closing",
    name: "clientSelection",
    items: [
      {
        id: "6",
        title: "Contract Finalization",
        company: "Golden Investments",
        client_name: "Jane Smith",
        date: "2023-09-03",
        stage: "quote",
        responsible_person: "Jane Smith",
        status: "active",
        insurance_type: "nonLife",
        estimated_value: "€65,000",
        created_at: "2023-09-03T10:30:00Z",
        expected_close_date: "2023-09-30T00:00:00Z",
      },
    ],
  },
];

const PipelineKanbanBoard: React.FC = () => {
  const { t } = useLanguage();
  const [stages, setStages] = useState<PipelineStage[]>(pipelineStagesMock);
  const [selectedProcess, setSelectedProcess] = useState<PipelineItem | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const handleMoveItem = (itemId: string, currentStageId: string, direction: 'left' | 'right') => {
    const updatedStages = [...stages];
    
    // Find current stage index
    const currentStageIndex = updatedStages.findIndex(stage => stage.id === currentStageId);
    if (currentStageIndex === -1) return;
    
    // Calculate target stage index
    const targetStageIndex = direction === 'right' 
      ? Math.min(currentStageIndex + 1, updatedStages.length - 1)
      : Math.max(currentStageIndex - 1, 0);
    
    if (targetStageIndex === currentStageIndex) return;
    
    // Find the item
    const currentItems = updatedStages[currentStageIndex].items;
    const itemIndex = currentItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    // Move the item to the target stage
    const item = currentItems[itemIndex];
    updatedStages[currentStageIndex].items.splice(itemIndex, 1);
    updatedStages[targetStageIndex].items.push(item);
    
    setStages(updatedStages);
    
    // Show toast
    const targetStageName = t(updatedStages[targetStageIndex].name);
    toast.success(t("itemMoved"), {
      description: t("itemMovedDescription", { title: item.title, stage: targetStageName })
    });
  };
  
  const handleViewDetails = (item: PipelineItem) => {
    setSelectedProcess(item);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <Grid className="grid-cols-1 md:grid-cols-4 gap-4 min-w-[1000px]">
        {stages.map((stage) => (
          <div key={stage.id} className="flex flex-col">
            <div className="bg-muted rounded-t-md px-4 py-2 flex items-center justify-between">
              <h3 className="font-medium">{t(stage.name)}</h3>
              <Badge variant="outline">{stage.items.length}</Badge>
            </div>
            <div className="bg-card rounded-b-md border-x border-b p-3 flex-1 space-y-3 min-h-[400px]">
              {stage.items.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge 
                        variant={item.insurance_type === "life" ? "outline" : "secondary"}
                        className={item.insurance_type === "life" ? "" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}
                      >
                        {t(item.insurance_type)}
                      </Badge>
                      {item.estimated_value && (
                        <Badge variant="outline" className="font-medium">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {item.estimated_value}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-2">{item.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building className="h-4 w-4 mr-1.5" /> 
                      {item.company || item.client_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground space-y-1.5">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5" /> {item.date}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1.5" /> {item.responsible_person || t("unassigned")}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="flex space-x-1">
                      {stages.findIndex(s => s.id === stage.id) > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveItem(item.id, stage.id, 'left');
                          }}
                        >
                          <MoveLeft className="h-4 w-4" />
                        </Button>
                      )}
                      {stages.findIndex(s => s.id === stage.id) < stages.length - 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveItem(item.id, stage.id, 'right');
                          }}
                        >
                          <MoveRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Clipboard className="h-4 w-4 mr-1.5" />
                      {t("details")}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {stage.items.length === 0 && (
                <div className="flex items-center justify-center h-24 bg-background/50 rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">{t("noItemsInStage")}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </Grid>
      
      {selectedProcess && (
        <SalesProcessDetailsDialog 
          process={selectedProcess as unknown as SalesProcess}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      )}
    </div>
  );
};

export default PipelineKanbanBoard;
