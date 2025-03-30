
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyTemplatesListProps {
  onAddTemplate: () => void;
}

export const EmptyTemplatesList = ({ onAddTemplate }: EmptyTemplatesListProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground mb-4">{t("noTemplatesFound")}</p>
        <Button onClick={onAddTemplate}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("createFirstTemplate")}
        </Button>
      </CardContent>
    </Card>
  );
};
