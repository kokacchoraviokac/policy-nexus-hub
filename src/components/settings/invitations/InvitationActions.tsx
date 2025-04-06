
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Invitation, InvitationStatus } from '@/types/invitation';
import { 
  MoreHorizontal, 
  Copy, 
  RefreshCw, 
  X, 
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvitationActionsProps {
  invitation: Invitation;
  onResend?: (invitation: Invitation) => void;
  onCancel?: (invitation: Invitation) => void;
}

const InvitationActions: React.FC<InvitationActionsProps> = ({
  invitation,
  onResend,
  onCancel
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const copyInvitationLink = () => {
    // In a real implementation, this would generate the correct invitation link
    const invitationLink = `${window.location.origin}/register?invitation=${invitation.token}`;
    navigator.clipboard.writeText(invitationLink);
    
    toast({
      title: t("linkCopied"),
      description: t("invitationLinkCopiedToClipboard")
    });
  };

  const handleResend = () => {
    if (onResend) {
      onResend(invitation);
    } else {
      toast({
        title: t("notImplemented"),
        description: t("thisFeatureIsNotImplementedYet"),
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(invitation);
    } else {
      toast({
        title: t("notImplemented"),
        description: t("thisFeatureIsNotImplementedYet"),
        variant: "destructive"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyInvitationLink}>
          <Copy className="h-4 w-4 mr-2" />
          {t("copyLink")}
        </DropdownMenuItem>
        
        {invitation.status === InvitationStatus.PENDING && (
          <>
            <DropdownMenuItem onClick={handleResend}>
              <Send className="h-4 w-4 mr-2" />
              {t("resendInvitation")}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleCancel} className="text-destructive">
              <X className="h-4 w-4 mr-2" />
              {t("cancelInvitation")}
            </DropdownMenuItem>
          </>
        )}
        
        {invitation.status === InvitationStatus.EXPIRED && (
          <DropdownMenuItem onClick={handleResend}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("renewInvitation")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvitationActions;
