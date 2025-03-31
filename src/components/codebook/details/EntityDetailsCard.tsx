
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowLeft, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TabItem } from "@/types/ui";
import { useLanguage } from "@/contexts/LanguageContext";

interface EntityDetailsCardProps {
  title: string;
  subtitle?: string;
  backLink: string;
  backLinkLabel: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  children?: React.ReactNode;
  tabs?: TabItem[];
}

export function EntityDetailsCard({
  title,
  subtitle,
  backLink,
  backLinkLabel,
  onEdit,
  onDelete,
  onExport,
  children,
  tabs
}: EntityDetailsCardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            onClick={() => navigate(backLink)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("backTo")} {backLinkLabel}
          </Button>
          
          <div className="flex items-center space-x-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <FileDown className="mr-1 h-4 w-4" />
                {t("export")}
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="mr-1 h-4 w-4" />
                {t("edit")}
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash className="mr-1 h-4 w-4" />
                {t("delete")}
              </Button>
            )}
          </div>
        </div>

        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {subtitle && <CardDescription className="mt-1">{subtitle}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        {tabs ? (
          <Tabs defaultValue={tabs[0].id} className="mt-2">
            <TabsList className="mb-4">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="p-1">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
