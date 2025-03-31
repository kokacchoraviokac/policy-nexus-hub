
import React from "react";
import { Book, Building2 } from "lucide-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import InsurersDirectory from "@/components/codebook/InsurersDirectory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const InsurersPage = () => {
  const { t } = useLanguage();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">{t("codebook")}</h1>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center space-x-1">
            <Building2 className="h-5 w-5" />
            <span className="font-medium">{t("insuranceCompanies")}</span>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("insuranceCompaniesDirectory")}</CardTitle>
            <CardDescription>
              {t("insuranceCompaniesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InsurersDirectory />
          </CardContent>
        </Card>
      </div>
    </QueryClientProvider>
  );
};

export default InsurersPage;
