
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface PolicyAssignmentCardProps {
  policy: any;
}

const PolicyAssignmentCard: React.FC<PolicyAssignmentCardProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{t("policyAssignment")}</CardTitle>
        <CardDescription className="text-xs">{t("policyAssignmentDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        {policy.assigned_to ? (
          <div className="flex items-center mt-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Assigned on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3">
            <p className="text-sm text-muted-foreground mb-2">{t("noAssignedUser")}</p>
            <Button size="sm" variant="outline">
              {t("assign")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyAssignmentCard;
