
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Send, ArrowDownLeft, Phone, Calendar, MessageCircle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Communication } from "@/hooks/useCommunications";

interface CommunicationsTimelineProps {
  communications: Communication[];
  onRefresh: () => void;
}

const CommunicationsTimeline: React.FC<CommunicationsTimelineProps> = ({ 
  communications, 
  onRefresh 
}) => {
  const { t } = useLanguage();

  if (!communications.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("noCommunicationsFound")}</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Send className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction === 'inbound') {
      return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {communications.map((comm) => (
        <Card key={comm.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-full",
                  comm.type === 'email' && "bg-blue-100",
                  comm.type === 'call' && "bg-yellow-100",
                  comm.type === 'meeting' && "bg-green-100",
                  comm.type === 'note' && "bg-purple-100",
                )}>
                  {getIcon(comm.type)}
                </div>
                <div>
                  <CardTitle className="text-base">{comm.subject}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getDirectionIcon(comm.direction)}
                {getStatusIcon(comm.status)}
              </div>
            </div>
            <CardDescription>
              {comm.sent_at 
                ? format(new Date(comm.sent_at), 'MMM d, yyyy h:mm a')
                : format(new Date(comm.created_at), 'MMM d, yyyy h:mm a')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: comm.content }} 
            />
          </CardContent>
          {comm.email_metadata && (
            <CardFooter className="bg-muted/40 pt-2 text-sm text-muted-foreground">
              {comm.type === 'email' && comm.email_metadata?.recipientEmail && (
                <div>
                  {t("to")}: {comm.email_metadata.recipientName} &lt;{comm.email_metadata.recipientEmail}&gt;
                </div>
              )}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default CommunicationsTimeline;
