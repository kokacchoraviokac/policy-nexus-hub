
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface ClaimLoadingProps {
  isLoading: boolean;
}

const ClaimLoading: React.FC<ClaimLoadingProps> = ({ isLoading }) => {
  const { t } = useLanguage();
  
  if (!isLoading) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>{t("loadingClaimDetails")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimLoading;
