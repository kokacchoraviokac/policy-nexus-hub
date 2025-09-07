import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardKPIs {
  totalPolicies: number;
  salesPipelineValue: number;
  openClaims: number;
  monthlyRevenue: number;
}

export interface UpcomingPolicy {
  id: string;
  policy_number: string;
  insurer_name: string;
  expiry_date: string;
  policyholder_name: string;
  premium: number;
  currency: string;
}

export interface IncompletePolicy {
  id: string;
  policy_number: string;
  insurer_name: string;
  missing_fields: string[];
  created_at: string;
}

export interface OpenClaim {
  id: string;
  claim_number: string;
  policy_id: string;
  policy_number: string;
  claimed_amount: number;
  status: string;
  incident_date: string;
}

export interface SalesPipelineData {
  totalLeads: number;
  qualifiedLeads: number;
  quotesSent: number;
  policiesCreated: number;
  conversionRate: number;
}

export const useDashboardKPIs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-kpis', user?.id],
    queryFn: async (): Promise<DashboardKPIs> => {
      if (!user) throw new Error('User not authenticated');

      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Return mock KPI data
        console.log("Using mock dashboard KPI data");
        return {
          totalPolicies: 25,
          salesPipelineValue: 150000,
          openClaims: 3,
          monthlyRevenue: 12500
        };
      }

      // Get user's company ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      const companyId = profile.company_id;

      // Fetch KPIs in parallel
      const [
        policiesResult,
        salesPipelineResult,
        claimsResult,
        revenueResult
      ] = await Promise.all([
        // Total active policies
        supabase
          .from('policies')
          .select('id', { count: 'exact' })
          .eq('company_id', companyId)
          .eq('status', 'active'),

        // Sales pipeline value (sum of estimated values from sales processes)
        supabase
          .from('sales_processes')
          .select('estimated_value')
          .eq('company_id', companyId)
          .not('estimated_value', 'is', null),

        // Open claims count
        supabase
          .from('claims')
          .select('id', { count: 'exact' })
          .eq('company_id', companyId)
          .in('status', ['in_processing', 'reported', 'accepted', 'partially_accepted', 'appealed']),

        // Monthly revenue (sum of paid commissions this month)
        supabase
          .from('commissions')
          .select('calculated_amount')
          .eq('company_id', companyId)
          .eq('status', 'paid')
          .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      const totalPolicies = policiesResult.count || 0;

      const salesPipelineValue = salesPipelineResult.data?.reduce((sum, item) =>
        sum + (item.estimated_value || 0), 0) || 0;

      const openClaims = claimsResult.count || 0;

      const monthlyRevenue = revenueResult.data?.reduce((sum, item) =>
        sum + (item.calculated_amount || 0), 0) || 0;

      return {
        totalPolicies,
        salesPipelineValue,
        openClaims,
        monthlyRevenue
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpcomingPolicies = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['upcoming-policies', user?.id],
    queryFn: async (): Promise<UpcomingPolicy[]> => {
      if (!user) throw new Error('User not authenticated');

      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Return mock upcoming policies data
        console.log("Using mock upcoming policies data");
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        
        return [
          {
            id: "policy-1",
            policy_number: "POL-2024-001",
            insurer_name: "Demo Insurance Co",
            expiry_date: futureDate.toISOString(),
            policyholder_name: "Demo Client 1",
            premium: 5000,
            currency: "USD"
          }
        ];
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      const fortyDaysFromNow = new Date();
      fortyDaysFromNow.setDate(fortyDaysFromNow.getDate() + 40);

      const { data, error } = await supabase
        .from('policies')
        .select(`
          id,
          policy_number,
          insurer_name,
          expiry_date,
          policyholder_name,
          premium,
          currency
        `)
        .eq('company_id', profile.company_id)
        .eq('status', 'active')
        .lte('expiry_date', fortyDaysFromNow.toISOString())
        .gte('expiry_date', new Date().toISOString())
        .order('expiry_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useIncompletePolicies = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['incomplete-policies', user?.id],
    queryFn: async (): Promise<IncompletePolicy[]> => {
      if (!user) throw new Error('User not authenticated');

      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Return mock incomplete policies data
        console.log("Using mock incomplete policies data");
        return [
          {
            id: "policy-incomplete-1",
            policy_number: "POL-2024-002",
            insurer_name: "Demo Insurance Co",
            missing_fields: ["premium", "policyholder_name"],
            created_at: new Date().toISOString()
          }
        ];
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      // Get policies that are missing mandatory fields
      const { data, error } = await supabase
        .from('policies')
        .select(`
          id,
          policy_number,
          insurer_name,
          policyholder_name,
          premium,
          created_at
        `)
        .eq('company_id', profile.company_id)
        .or('insurer_name.is.null,policyholder_name.is.null,premium.is.null')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Add missing fields information
      const incompletePolicies = data?.map(policy => ({
        ...policy,
        missing_fields: [
          !policy.insurer_name && 'insurer_name',
          !policy.policyholder_name && 'policyholder_name',
          !policy.premium && 'premium'
        ].filter(Boolean) as string[]
      })) || [];

      return incompletePolicies;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOpenClaims = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['open-claims', user?.id],
    queryFn: async (): Promise<OpenClaim[]> => {
      if (!user) throw new Error('User not authenticated');

      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Return mock open claims data
        console.log("Using mock open claims data");
        return [
          {
            id: "claim-1",
            claim_number: "CLM-2024-001",
            policy_id: "policy-1",
            policy_number: "POL-2024-001",
            claimed_amount: 15000,
            status: "in_processing",
            incident_date: new Date().toISOString()
          }
        ];
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      const { data, error } = await supabase
        .from('claims')
        .select(`
          id,
          claim_number,
          policy_id,
          claimed_amount,
          status,
          incident_date,
          policies!inner(policy_number)
        `)
        .eq('company_id', profile.company_id)
        .in('status', ['in_processing', 'reported', 'accepted', 'partially_accepted', 'appealed'])
        .order('incident_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map(claim => ({
        ...claim,
        policy_number: claim.policies?.policy_number || 'Unknown'
      })) || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSalesPipelineData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sales-pipeline-data', user?.id],
    queryFn: async (): Promise<SalesPipelineData> => {
      if (!user) throw new Error('User not authenticated');

      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Return mock sales pipeline data
        console.log("Using mock sales pipeline data");
        return {
          totalLeads: 15,
          qualifiedLeads: 8,
          quotesSent: 5,
          policiesCreated: 3,
          conversionRate: 20
        };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('Company not found');

      const companyId = profile.company_id;

      // Get sales pipeline metrics
      const [
        totalLeadsResult,
        qualifiedLeadsResult,
        quotesSentResult,
        policiesCreatedResult
      ] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact' }).eq('company_id', companyId),
        supabase.from('leads').select('id', { count: 'exact' }).eq('company_id', companyId).eq('status', 'qualified'),
        supabase.from('sales_quotes').select('id', { count: 'exact' }).eq('company_id', companyId),
        supabase.from('policies').select('id', { count: 'exact' }).eq('company_id', companyId).eq('status', 'active')
      ]);

      const totalLeads = totalLeadsResult.count || 0;
      const qualifiedLeads = qualifiedLeadsResult.count || 0;
      const quotesSent = quotesSentResult.count || 0;
      const policiesCreated = policiesCreatedResult.count || 0;
      const conversionRate = totalLeads > 0 ? (policiesCreated / totalLeads) * 100 : 0;

      return {
        totalLeads,
        qualifiedLeads,
        quotesSent,
        policiesCreated,
        conversionRate
      };
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};