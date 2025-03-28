
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, FileText, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PolicyAddendum } from "@/types/policies";

interface AddendumListProps {
  addendums: PolicyAddendum[];
  onRefresh: () => void;
}

const AddendumList: React.FC<AddendumListProps> = ({ addendums, onRefresh }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "default";
      case 'pending':
      case 'in_progress':
        return "secondary";
      case 'rejected':
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const handleViewAddendum = (id: string) => {
    // To be implemented
    console.log("View addendum:", id);
  };
  
  const handleDownloadAddendum = (id: string) => {
    // To be implemented
    console.log("Download addendum:", id);
  };
  
  return (
    <div className="space-y-4">
      {addendums.map((addendum) => (
        <Card key={addendum.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="p-4 md:p-6 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold">
                        {t("addendumNumber")}: {addendum.addendum_number}
                      </h3>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusVariant(addendum.status)}>
                          {addendum.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {t("effective")}: {formatDate(addendum.effective_date)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {addendum.description}
                      </p>
                    </div>
                  </div>
                  
                  {addendum.premium_adjustment && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {addendum.premium_adjustment > 0 ? "+" : ""}
                        {formatCurrency(addendum.premium_adjustment)}
                      </div>
                      <div className="text-xs text-muted-foreground">{t("premiumAdjustment")}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-border flex items-center md:self-stretch">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none flex-1 md:h-full"
                  onClick={() => handleViewAddendum(addendum.id)}
                >
                  <Eye className="h-5 w-5" />
                  <span className="sr-only">{t("view")}</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none flex-1 md:h-full"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">{t("more")}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleViewAddendum(addendum.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("viewDetails")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadAddendum(addendum.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      {t("download")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AddendumList;
