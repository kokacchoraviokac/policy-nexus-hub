
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyAssignmentCardProps {
  policy: any;
}

const PolicyAssignmentCard: React.FC<PolicyAssignmentCardProps> = ({ policy }) => {
  const { t } = useLanguage();
  
  // This could be fetched from an API in a real implementation
  const assignedUser = policy.assigned_to ? {
    name: "John Doe", // Placeholder
    role: "Agent", // Placeholder
    avatar: null
  } : null;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <User className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("assignment")}</h3>
        </div>
        
        {assignedUser ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {assignedUser.avatar ? (
                  <img 
                    src={assignedUser.avatar}
                    alt={assignedUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium">{assignedUser.name}</p>
                <p className="text-sm text-muted-foreground">{assignedUser.role}</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              {t("changeAssignment")}
            </Button>
          </div>
        ) : (
          <div className="text-center p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("noUserAssigned")}
            </p>
            <Button variant="default" size="sm" className="w-full">
              {t("assignUser")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyAssignmentCard;
