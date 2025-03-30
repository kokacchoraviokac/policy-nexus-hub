
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Calculator, Download, Filter, Search, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import CommissionCalculator from "@/components/finances/CommissionCalculator";

interface Commission {
  id: string;
  policy_id: string;
  policy_number: string;
  client_name: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  status: string;
  created_at: string;
  payment_date: string | null;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "due":
      return "secondary";
    case "paid":
      return "default";
    case "overdue":
      return "outline";
    case "processing":
      return "outline";
    default:
      return "outline";
  }
};

const Commissions = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [insurerFilter, setInsurerFilter] = useState("all");
  
  // Fetch commissions
  const { data: commissions, isLoading } = useQuery({
    queryKey: ['commissions', activeTab, dateRange, searchTerm, insurerFilter],
    queryFn: async () => {
      let query = supabase
        .from('commissions')
        .select(`
          id,
          policy_id,
          policies(policy_number),
          policies(product_id),
          clients(name),
          base_amount,
          rate,
          calculated_amount,
          status,
          created_at,
          payment_date
        `);
      
      // Apply status filter
      if (activeTab === 'active') {
        query = query.in('status', ['due', 'processing']);
      } else if (activeTab === 'paid') {
        query = query.eq('status', 'paid');
      } else if (activeTab === 'overdue') {
        query = query.eq('status', 'overdue');
      }
      
      // Apply date range filter
      if (dateRange.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      
      if (dateRange.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`policies.policy_number.ilike.%${searchTerm}%,clients.name.ilike.%${searchTerm}%`);
      }
      
      // Apply insurer filter (assuming we have insurer_id in commissions or in policies table)
      if (insurerFilter !== 'all') {
        query = query.eq('policies.insurer_id', insurerFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        policy_id: item.policy_id,
        policy_number: item.policies?.policy_number || 'N/A',
        product_id: item.policies?.product_id || 'N/A',
        client_name: item.clients?.name || 'N/A',
        base_amount: item.base_amount,
        rate: item.rate,
        calculated_amount: item.calculated_amount,
        status: item.status,
        created_at: item.created_at,
        payment_date: item.payment_date
      })) as Commission[];
    }
  });

  const handleUploadCommission = () => {
    toast({
      title: t("featureComingSoon"),
      description: t("commissionUploadFeatureDescription"),
    });
  };
  
  const handleExportCommissions = () => {
    toast({
      title: t("exportingCommissions"),
      description: t("commissionExportStarted"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("commissions")}</h1>
        <p className="text-muted-foreground">
          {t("commissionsDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t("commissionManagement")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                  <TabsList>
                    <TabsTrigger value="active">{t("active")}</TabsTrigger>
                    <TabsTrigger value="paid">{t("paid")}</TabsTrigger>
                    <TabsTrigger value="overdue">{t("overdue")}</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleUploadCommission}>
                      <Upload className="h-4 w-4 mr-2" />
                      {t("upload")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportCommissions}>
                      <Download className="h-4 w-4 mr-2" />
                      {t("export")}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="flex-1 flex items-center relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("searchCommissions")}
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal w-[240px]"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>{t("dateRange")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from ?? undefined}
                          selected={{
                            from: dateRange.from,
                            to: dateRange.to,
                          }}
                          onSelect={(range) => setDateRange({ 
                            from: range?.from ?? null, 
                            to: range?.to ?? null 
                          })}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Select value={insurerFilter} onValueChange={setInsurerFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("selectInsurer")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("allInsurers")}</SelectItem>
                        <SelectItem value="company1">Company 1</SelectItem>
                        <SelectItem value="company2">Company 2</SelectItem>
                        <SelectItem value="company3">Company 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("policyNumber")}</TableHead>
                        <TableHead>{t("client")}</TableHead>
                        <TableHead className="text-right">{t("baseAmount")}</TableHead>
                        <TableHead className="text-center">{t("rate")}</TableHead>
                        <TableHead className="text-right">{t("commission")}</TableHead>
                        <TableHead>{t("date")}</TableHead>
                        <TableHead>{t("status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            {t("loadingCommissions")}
                          </TableCell>
                        </TableRow>
                      ) : commissions && commissions.length > 0 ? (
                        commissions.map((commission) => (
                          <TableRow key={commission.id}>
                            <TableCell className="font-medium">
                              {commission.policy_number}
                            </TableCell>
                            <TableCell>{commission.client_name}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(commission.base_amount, "EUR")}
                            </TableCell>
                            <TableCell className="text-center">
                              {commission.rate}%
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(commission.calculated_amount, "EUR")}
                            </TableCell>
                            <TableCell>
                              {formatDate(commission.created_at)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(commission.status)}>
                                {t(commission.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            {t("noCommissionsFound")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <CommissionCalculator />
          
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t("commissionFilters")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">{t("status")}</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("all")}</SelectItem>
                    <SelectItem value="due">{t("due")}</SelectItem>
                    <SelectItem value="paid">{t("paid")}</SelectItem>
                    <SelectItem value="overdue">{t("overdue")}</SelectItem>
                    <SelectItem value="processing">{t("processing")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">{t("period")}</Label>
                <Select defaultValue="currentMonth">
                  <SelectTrigger id="period">
                    <SelectValue placeholder={t("selectPeriod")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="currentMonth">{t("currentMonth")}</SelectItem>
                    <SelectItem value="lastMonth">{t("lastMonth")}</SelectItem>
                    <SelectItem value="last3Months">{t("last3Months")}</SelectItem>
                    <SelectItem value="last6Months">{t("last6Months")}</SelectItem>
                    <SelectItem value="currentYear">{t("currentYear")}</SelectItem>
                    <SelectItem value="custom">{t("customRange")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agent">{t("agent")}</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="agent">
                    <SelectValue placeholder={t("selectAgent")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allAgents")}</SelectItem>
                    <SelectItem value="agent1">Agent 1</SelectItem>
                    <SelectItem value="agent2">Agent 2</SelectItem>
                    <SelectItem value="agent3">Agent 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" variant="outline">
                {t("applyFilters")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Commissions;
