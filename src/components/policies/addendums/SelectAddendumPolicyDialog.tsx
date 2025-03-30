
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Policy } from "@/types/policies";

interface SelectAddendumPolicyDialogProps {
  open: boolean;
  onClose: () => void;
  onPolicySelected: (policyId: string, policyNumber: string) => void;
}

const SelectAddendumPolicyDialog: React.FC<SelectAddendumPolicyDialogProps> = ({
  open,
  onClose,
  onPolicySelected,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: policies, isLoading } = useQuery({
    queryKey: ['policies-for-addendum', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name, status')
        .order('created_at', { ascending: false });

      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%`);
      }

      // Limit the number of results for performance
      query = query.limit(20);

      const { data, error } = await query;

      if (error) throw error;
      return data as Policy[];
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePolicySelect = (policyId: string, policyNumber: string) => {
    onPolicySelected(policyId, policyNumber);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("selectPolicy")}</DialogTitle>
          <DialogDescription>
            {t("selectPolicyForAddendum")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPolicies")}
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {policies && policies.length > 0 ? (
              <div className="space-y-2">
                {policies.map((policy) => (
                  <Button
                    key={policy.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handlePolicySelect(policy.id, policy.policy_number)}
                  >
                    <div>
                      <div className="font-medium">{policy.policy_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {policy.policyholder_name} • {policy.insurer_name}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? t("noPoliciesFound") : t("startTypingToSearch")}
              </div>
            )}
          </ScrollArea>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectAddendumPolicyDialog;
