
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, Phone, Calendar, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Communication } from "@/hooks/useCommunications";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadCommunicationStatsProps {
  communications: Communication[];
  isLoading: boolean;
}

const LeadCommunicationStats: React.FC<LeadCommunicationStatsProps> = ({ 
  communications, 
  isLoading 
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="pt-4">
              <Skeleton className="h-8 w-8 rounded-full mb-2" />
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const emailCount = communications.filter(c => c.type === 'email').length;
  const callCount = communications.filter(c => c.type === 'call').length;
  const meetingCount = communications.filter(c => c.type === 'meeting').length;
  const noteCount = communications.filter(c => c.type === 'note').length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4 flex flex-col items-center">
          <div className="p-2 bg-blue-100 rounded-full mb-2">
            <Send className="h-5 w-5 text-blue-700" />
          </div>
          <div className="text-xl font-semibold">{emailCount}</div>
          <div className="text-sm text-muted-foreground">{t("emails")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 flex flex-col items-center">
          <div className="p-2 bg-yellow-100 rounded-full mb-2">
            <Phone className="h-5 w-5 text-yellow-700" />
          </div>
          <div className="text-xl font-semibold">{callCount}</div>
          <div className="text-sm text-muted-foreground">{t("calls")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 flex flex-col items-center">
          <div className="p-2 bg-green-100 rounded-full mb-2">
            <Calendar className="h-5 w-5 text-green-700" />
          </div>
          <div className="text-xl font-semibold">{meetingCount}</div>
          <div className="text-sm text-muted-foreground">{t("meetings")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 flex flex-col items-center">
          <div className="p-2 bg-purple-100 rounded-full mb-2">
            <MessageCircle className="h-5 w-5 text-purple-700" />
          </div>
          <div className="text-xl font-semibold">{noteCount}</div>
          <div className="text-sm text-muted-foreground">{t("notes")}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadCommunicationStats;
