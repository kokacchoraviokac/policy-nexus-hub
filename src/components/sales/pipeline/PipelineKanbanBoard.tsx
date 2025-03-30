
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Grid } from "@/components/ui/grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, CreditCard, Users, Clipboard, ChevronRight } from "lucide-react";

// Types for the pipeline stages and items
interface PipelineItem {
  id: string;
  title: string;
  company: string;
  date: string;
  assignedTo: string;
  status: string;
  category: string;
  value?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  items: PipelineItem[];
}

// Mock data for the pipeline stages
const pipelineStagesMock: PipelineStage[] = [
  {
    id: "new",
    name: "leadProspect",
    items: [
      {
        id: "1",
        title: "Initial Contact",
        company: "Global Industries",
        date: "2023-09-12",
        assignedTo: "John Doe",
        status: "new",
        category: "nonLife",
        value: "€12,000",
      },
      {
        id: "2",
        title: "Lead Follow-up",
        company: "Tech Solutions",
        date: "2023-09-15",
        assignedTo: "Jane Smith",
        status: "new",
        category: "life",
        value: "€8,500",
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
        date: "2023-09-10",
        assignedTo: "Mike Johnson",
        status: "quoting",
        category: "nonLife",
        value: "€35,200",
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
        date: "2023-09-05",
        assignedTo: "Sarah Williams",
        status: "negotiation",
        category: "nonLife",
        value: "€22,750",
      },
      {
        id: "5",
        title: "Final Offer",
        company: "Bright Future Inc",
        date: "2023-09-08",
        assignedTo: "John Doe",
        status: "negotiation",
        category: "life",
        value: "€18,300",
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
        date: "2023-09-03",
        assignedTo: "Jane Smith",
        status: "closing",
        category: "nonLife",
        value: "€65,000",
      },
    ],
  },
];

const PipelineKanbanBoard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <Grid className="grid-cols-1 md:grid-cols-4 gap-6 min-w-[1000px]">
        {pipelineStagesMock.map((stage) => (
          <div key={stage.id} className="flex flex-col">
            <div className="bg-muted rounded-t-md px-4 py-2 flex items-center justify-between">
              <h3 className="font-medium">{t(stage.name)}</h3>
              <Badge variant="outline">{stage.items.length}</Badge>
            </div>
            <div className="bg-muted/50 rounded-b-md p-3 flex-1 space-y-3">
              {stage.items.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge 
                        variant={item.category === "life" ? "outline" : "secondary"}
                        className={item.category === "life" ? "" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}
                      >
                        {t(item.category)}
                      </Badge>
                      {item.value && (
                        <Badge variant="outline" className="font-medium">{item.value}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-2">{item.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building className="h-3 w-3 mr-1" /> {item.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> {item.date}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" /> {item.assignedTo}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Clipboard className="h-3 w-3 mr-1" />
                      {t("details")}
                      <ChevronRight className="h-3 w-3 ml-1" />
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
    </div>
  );
};

export default PipelineKanbanBoard;
