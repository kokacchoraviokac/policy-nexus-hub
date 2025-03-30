
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PolicyAddendaTabProps {
  policyId: string;
}

const PolicyAddendaTab: React.FC<PolicyAddendaTabProps> = ({ policyId }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const [showAddendumForm, setShowAddendumForm] = useState(false);
  
  const { data: addendums, isLoading, error } = useQuery({
    queryKey: ['policy-addendums', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_addendums')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("policyAddendums")}</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <h3 className="font-semibold">{t("errorLoadingAddendums")}</h3>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : t("unknownError")}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("policyAddendums")}</h2>
        <Button onClick={() => setShowAddendumForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createAddendum")}
        </Button>
      </div>
      
      <Separator />
      
      {addendums && addendums.length > 0 ? (
        <div className="space-y-4">
          {addendums.map((addendum: any) => (
            <Card key={addendum.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{addendum.addendum_number}</h3>
                      <Badge>{addendum.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("effectiveDate")}: {formatDate(addendum.effective_date)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </div>
                
                <Separator className="my-3" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("description")}</p>
                    <p className="mt-1">{addendum.description || "-"}</p>
                  </div>
                  
                  {addendum.premium_adjustment && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t("premiumAdjustment")}</p>
                      <p className="font-medium mt-1">{formatCurrency(addendum.premium_adjustment)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/40 rounded-lg">
          <FileEdit className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">{t("noAddendums")}</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">{t("noAddendumsDescription")}</p>
          <Button onClick={() => setShowAddendumForm(true)} className="mt-6">
            {t("createFirstAddendum")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PolicyAddendaTab;
