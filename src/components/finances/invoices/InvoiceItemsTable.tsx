
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { nanoid } from 'nanoid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  policy_id?: string;
  policy?: {
    policy_number?: string;
    policyholder_name?: string;
  };
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
  onCalculateTotal: () => void;
  readonly?: boolean;
}

interface PolicySearchResult {
  id: string;
  policy_number: string;
  policyholder_name: string;
  premium: number;
}

const InvoiceItemsTable = ({ 
  items, 
  onItemsChange, 
  onCalculateTotal,
  readonly = false
}: InvoiceItemsTableProps) => {
  const { t } = useLanguage();
  const [policySearchOpen, setPolicySearchOpen] = React.useState(false);
  const [currentItemIndex, setCurrentItemIndex] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleAddItem = () => {
    const newItem = { id: nanoid(), description: "", amount: 0 };
    onItemsChange([...items, newItem]);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onItemsChange(newItems);
    onCalculateTotal();
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    onItemsChange(newItems);
    if (field === 'amount') {
      onCalculateTotal();
    }
  };
  
  const openPolicySearch = (index: number) => {
    setCurrentItemIndex(index);
    setPolicySearchOpen(true);
  };
  
  const handleSelectPolicy = (policy: PolicySearchResult) => {
    if (currentItemIndex === null) return;
    
    const newItems = [...items];
    newItems[currentItemIndex] = {
      ...newItems[currentItemIndex],
      policy_id: policy.id,
      description: `${newItems[currentItemIndex].description || 'Commission for'} policy ${policy.policy_number} - ${policy.policyholder_name}`,
      policy: {
        policy_number: policy.policy_number,
        policyholder_name: policy.policyholder_name
      }
    };
    
    onItemsChange(newItems);
    setPolicySearchOpen(false);
    setSearchQuery('');
  };
  
  // Policy search query
  const { data: policies, isLoading } = useQuery({
    queryKey: ['policies', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 3) return [];
      
      const { data, error } = await supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, premium')
        .or(`policy_number.ilike.%${searchQuery}%,policyholder_name.ilike.%${searchQuery}%`)
        .limit(10);
      
      if (error) throw error;
      return data as PolicySearchResult[];
    },
    enabled: policySearchOpen && searchQuery.length >= 3
  });
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{t("invoiceItems")}</h3>
          {!readonly && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddItem}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("addItem")}
            </Button>
          )}
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">{t("description")}</TableHead>
              <TableHead className="text-right">{t("amount")}</TableHead>
              {!readonly && <TableHead className="w-[100px]">{t("actions")}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readonly ? 2 : 3} className="text-center text-muted-foreground py-8">
                  {t("noInvoiceItems")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {readonly ? (
                      <div>
                        <div>{item.description}</div>
                        {item.policy && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {t("policy")}: {item.policy.policy_number} - {item.policy.policyholder_name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder={t("itemDescription")}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => openPolicySearch(index)}
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("linkToPolicy")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {readonly ? (
                      item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    ) : (
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-24 ml-auto text-right"
                      />
                    )}
                  </TableCell>
                  {!readonly && (
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={policySearchOpen} onOpenChange={setPolicySearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("linkToPolicy")}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              placeholder={t("searchPolicyNumberOrPolicyholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">{t("searching")}</div>
              ) : !searchQuery || searchQuery.length < 3 ? (
                <div className="p-4 text-center text-muted-foreground">{t("typeToSearch")}</div>
              ) : policies && policies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("policyNumber")}</TableHead>
                      <TableHead>{t("policyholder")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>{policy.policy_number}</TableCell>
                        <TableCell>{policy.policyholder_name}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectPolicy(policy)}
                          >
                            {t("select")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-muted-foreground">{t("noPoliciesFound")}</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceItemsTable;
