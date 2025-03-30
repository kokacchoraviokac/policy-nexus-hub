import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowLeft, 
  Loader2, 
  Save, 
  X, 
  AlertCircle,
  Search
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Claim form schema
const claimFormSchema = z.object({
  policy_id: z.string().min(1, { message: "Policy is required" }),
  claim_number: z.string().min(1, { message: "Claim number is required" }),
  damage_description: z.string().min(1, { message: "Damage description is required" }),
  incident_date: z.string().min(1, { message: "Incident date is required" }),
  claimed_amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  deductible: z.coerce.number().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
});

type ClaimFormValues = z.infer<typeof claimFormSchema>;

const NewClaimPage = () => {
  const [searchParams] = useSearchParams();
  const prefilledPolicyId = searchParams.get("policyId");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [policySearchOpen, setPolicySearchOpen] = useState(false);
  const [policySearchTerm, setPolicySearchTerm] = useState("");

  // Form
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      policy_id: prefilledPolicyId || "",
      claim_number: "",
      damage_description: "",
      incident_date: new Date().toISOString().split("T")[0],
      claimed_amount: 0,
      deductible: 0,
      status: "in processing",
      notes: "",
    },
  });

  // If policy ID is provided, fetch policy details
  const { data: selectedPolicy } = useQuery({
    queryKey: ['policy-for-claim', form.watch('policy_id')],
    queryFn: async () => {
      const policyId = form.watch('policy_id');
      if (!policyId) return null;
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!form.watch('policy_id')
  });

  // Fetch current user for reported_by field
  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  // Fetch company ID
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', currentUser.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser?.id
  });

  // Fetch policies for search dialog
  const { data: policies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['policies-search', policySearchTerm],
    queryFn: async () => {
      let query = supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (policySearchTerm) {
        query = query.or(`policy_number.ilike.%${policySearchTerm}%,policyholder_name.ilike.%${policySearchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: policySearchOpen
  });

  // Create claim mutation
  const { mutate: createClaim, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: ClaimFormValues) => {
      if (!currentUser?.id || !userProfile?.company_id) {
        throw new Error("User information is missing");
      }

      // Prepare claim data with required fields
      const claimData = {
        ...values,
        reported_by: currentUser.id,
        company_id: userProfile.company_id
      };
      
      const { data, error } = await supabase
        .from('claims')
        .insert(claimData)
        .select('id')
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: t("claimCreated"),
        description: t("claimCreatedSuccessfully"),
      });
      
      queryClient.invalidateQueries({ queryKey: ['policy-claims'] });
      
      // Navigate to the claim detail page
      navigate(`/claims/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating claim:", error);
      toast({
        title: t("errorCreatingClaim"),
        description: t("errorCreatingClaimDescription"),
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: ClaimFormValues) => {
    createClaim(values);
  };

  const handlePolicySelect = (policyId: string) => {
    form.setValue('policy_id', policyId);
    setPolicySearchOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">{t("createNewClaim")}</h1>
        <p className="text-muted-foreground">{t("createNewClaimDescription")}</p>
      </div>

      {/* Claim form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>{t("claimDetails")}</CardTitle>
          <CardDescription>{t("enterClaimInformation")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Policy selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>{t("policy")}</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPolicySearchOpen(true)}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {t("searchPolicy")}
                  </Button>
                </div>
                
                {form.watch('policy_id') && selectedPolicy ? (
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{selectedPolicy.policy_number}</p>
                        <p className="text-sm text-muted-foreground">{selectedPolicy.policyholder_name}</p>
                        <p className="text-sm text-muted-foreground">{selectedPolicy.insurer_name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => form.setValue('policy_id', '')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md p-8 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-medium">{t("noPolicySelected")}</p>
                    <p className="text-sm text-muted-foreground">{t("searchForPolicyDescription")}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setPolicySearchOpen(true)}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      {t("searchPolicy")}
                    </Button>
                  </div>
                )}
                {form.formState.errors.policy_id && (
                  <p className="text-sm text-destructive">{form.formState.errors.policy_id.message}</p>
                )}
              </div>
              
              {/* Claim number */}
              <FormField
                control={form.control}
                name="claim_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("claimNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Incident date */}
              <FormField
                control={form.control}
                name="incident_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("incidentDate")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Damage description */}
              <FormField
                control={form.control}
                name="damage_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("damageDescription")}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Claimed amount */}
              <FormField
                control={form.control}
                name="claimed_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("claimedAmount")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Deductible */}
              <FormField
                control={form.control}
                name="deductible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("deductible")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("status")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
                        <SelectItem value="reported">{t("reported")}</SelectItem>
                        <SelectItem value="accepted">{t("accepted")}</SelectItem>
                        <SelectItem value="rejected">{t("rejected")}</SelectItem>
                        <SelectItem value="appealed">{t("appealed")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("notes")}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormDescription>{t("additionalNotesDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Form buttons */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting || !currentUser || !userProfile}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("creating")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("createClaim")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Policy search dialog */}
      <Dialog open={policySearchOpen} onOpenChange={setPolicySearchOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("searchPolicy")}</DialogTitle>
            <DialogDescription>{t("searchPolicyDescription")}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchByPolicyOrPolicyholder")}
                className="pl-8"
                value={policySearchTerm}
                onChange={(e) => setPolicySearchTerm(e.target.value)}
              />
            </div>
            
            {isPoliciesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : policies && policies.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("policyNumber")}</TableHead>
                    <TableHead>{t("policyholder")}</TableHead>
                    <TableHead>{t("insurer")}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.policy_number}</TableCell>
                      <TableCell>{policy.policyholder_name}</TableCell>
                      <TableCell>{policy.insurer_name}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => handlePolicySelect(policy.id)}
                        >
                          {t("select")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">{t("noPoliciesFound")}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPolicySearchOpen(false)}>
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewClaimPage;
