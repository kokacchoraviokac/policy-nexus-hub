
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import AddendumFormDialog from "@/components/policies/addendums/AddendumFormDialog";
import { Button } from "@/components/ui/button";

const NewAddendumPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const policyId = searchParams.get("policyId");
  
  const [showForm, setShowForm] = useState(true);
  
  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy-for-addendum', policyId],
    queryFn: async () => {
      if (!policyId) throw new Error("Policy ID is required");
      
      const { data, error } = await supabase
        .from('policies')
        .select('id, policy_number')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!policyId,
  });
  
  const handleSuccess = () => {
    toast({
      title: t("addendumCreated"),
      description: t("addendumCreatedSuccess"),
    });
    navigate(`/policies/${policyId}`);
  };
  
  const handleClose = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!policyId || !policy) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("createAddendum")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t("noPolicySelected")}</p>
            <Button onClick={() => navigate("/policies/addendums")}>
              {t("goToAddendums")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("createAddendum")}</h1>
      
      {showForm && (
        <AddendumFormDialog
          policyId={policyId}
          policyNumber={policy.policy_number}
          open={showForm}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default NewAddendumPage;
