
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { FilePlus, Search, RefreshCw, Calendar, FileText, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";
import { DateRange } from "react-day-picker";

const Claims = () => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Fetch claims
  const { data: claims, isLoading, isError, refetch } = useQuery({
    queryKey: ['claims', searchTerm, statusFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('claims')
        .select(`
          *,
          policies:policy_id (
            policy_number,
            policyholder_name
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`claim_number.ilike.%${searchTerm}%,damage_description.ilike.%${searchTerm}%,policies.policy_number.ilike.%${searchTerm}%,policies.policyholder_name.ilike.%${searchTerm}%`);
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      // Apply date range filter
      if (dateRange?.from) {
        const fromDate = format(dateRange.from, 'yyyy-MM-dd');
        query = query.gte('incident_date', fromDate);
      }
      
      if (dateRange?.to) {
        const toDate = format(dateRange.to, 'yyyy-MM-dd');
        query = query.lte('incident_date', toDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  const handleCreateClaim = () => {
    navigate("/claims/new");
  };

  const handleViewClaim = (claimId: string) => {
    navigate(`/claims/${claimId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange(undefined);
    setFilterMenuOpen(false);
  };

  const hasActiveFilters = 
    statusFilter !== "all" || 
    dateRange?.from !== undefined || 
    dateRange?.to !== undefined || 
    searchTerm !== "";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("claims")}</h1>
          <p className="text-muted-foreground">
            {t("claimsManagementDescription")}
          </p>
        </div>
        
        <Button onClick={handleCreateClaim}>
          <FilePlus className="mr-2 h-4 w-4" />
          {t("createClaim")}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("claimsRegistry")}</CardTitle>
          <CardDescription>{t("manageAndTrackClaims")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchClaims")}
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
                  <SelectItem value="reported">{t("reported")}</SelectItem>
                  <SelectItem value="accepted">{t("accepted")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                  <SelectItem value="appealed">{t("appealed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Popover open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="ml-auto">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">{t("advancedFilters")}</h4>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">{t("dateRange")}</h5>
                    <CalendarComponent
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange as any}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleClearFilters}
                    >
                      {t("clearFilters")}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setFilterMenuOpen(false)}
                    >
                      {t("applyFilters")}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              title={t("refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {hasActiveFilters && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("activeFilters")}:</span>
              {statusFilter !== "all" && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {t("status")}: {t(statusFilter.toLowerCase().replace(/ /g, ""))}
                </div>
              )}
              {dateRange.from && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {t("from")}: {format(dateRange.from, "PPP")}
                </div>
              )}
              {dateRange.to && (
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {t("to")}: {format(dateRange.to, "PPP")}
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs" 
                onClick={handleClearFilters}
              >
                {t("clearAll")}
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p>{t("loadingClaims")}</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-destructive">{t("errorLoadingClaims")}</p>
              <Button className="mt-4" onClick={handleRefresh}>
                {t("tryAgain")}
              </Button>
            </div>
          ) : claims && claims.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("claimNumber")}</TableHead>
                  <TableHead>{t("policy")}</TableHead>
                  <TableHead>{t("incidentDate")}</TableHead>
                  <TableHead>{t("claimedAmount")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow 
                    key={claim.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewClaim(claim.id)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div>{claim.claim_number}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{claim.damage_description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{claim.policies?.policy_number}</div>
                        <div className="text-xs text-muted-foreground">{claim.policies?.policyholder_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(claim.incident_date)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(claim.claimed_amount)}</TableCell>
                    <TableCell><ClaimStatusBadge status={claim.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClaim(claim.id);
                        }}
                      >
                        {t("viewDetails")}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t("noClaimsFound")}</h3>
              <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
                {t("noClaimsDescription")}
              </p>
              <Button onClick={handleCreateClaim}>
                <FilePlus className="mr-2 h-4 w-4" />
                {t("createClaim")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Claims;
