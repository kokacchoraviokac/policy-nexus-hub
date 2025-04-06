
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Invitation, InvitationStatus } from "@/types/invitation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Send, Copy, Trash2, RefreshCw } from "lucide-react";

interface InvitationActionsProps {
  invitation: Invitation;
}

const InvitationActions: React.FC<InvitationActionsProps> = ({ invitation }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);

  // Copy invitation link
  const handleCopyLink = () => {
    const invitationLink = `${window.location.origin}/accept-invitation?token=${invitation.token}`;
    navigator.clipboard.writeText(invitationLink).then(
      () => {
        toast({
          title: t("invitationLinkCopied"),
          description: t("invitationLinkCopiedDescription"),
        });
      },
      (err) => {
        toast({
          title: t("errorCopyingInvitationLink"),
          description: t("pleaseTryCopyingAgain"),
          variant: "destructive",
        });
      }
    );
  };

  // Cancel invitation mutation
  const cancelInvitation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("invitations")
        .update({ status: InvitationStatus.CANCELLED })
        .eq("id", invitation.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast({
        title: t("invitationCancelled"),
        description: t("invitationCancelledDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorCancellingInvitation"),
        description: t("errorOccurredTryAgain"),
        variant: "destructive",
      });
    },
  });

  // Resend invitation mutation
  const resendInvitation = useMutation({
    mutationFn: async () => {
      // Update expiry date to 7 days from now
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 7);

      const { error } = await supabase
        .from("invitations")
        .update({
          status: InvitationStatus.PENDING,
          expires_at: newExpiryDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast({
        title: t("invitationResent"),
        description: t("invitationResentDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorResendingInvitation"),
        description: t("errorOccurredTryAgain"),
        variant: "destructive",
      });
    },
  });

  // Only show actions for pending invitations
  const isPending = invitation.status === InvitationStatus.PENDING;
  const isExpired = invitation.status === InvitationStatus.EXPIRED;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copyInvitationLink")}
          </DropdownMenuItem>

          {(isPending || isExpired) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowResendDialog(true)}>
                <Send className="mr-2 h-4 w-4" />
                {t("resendInvitation")}
              </DropdownMenuItem>
            </>
          )}

          {isPending && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("cancelInvitation")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelInvitation")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelInvitationConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelInvitation.mutate()}
              className="bg-destructive text-destructive-foreground"
            >
              {t("confirmCancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resend Confirmation Dialog */}
      <AlertDialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("resendInvitation")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("resendInvitationConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => resendInvitation.mutate()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("confirmResend")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvitationActions;
