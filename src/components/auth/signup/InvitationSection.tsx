
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface InvitationSectionProps {
  invitation: any;
}

const InvitationSection: React.FC<InvitationSectionProps> = ({ invitation }) => {
  if (!invitation) return null;
  
  return (
    <Alert className="mb-4 bg-green-50 border-green-200">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-600">
        You've been invited to join as a{' '}
        <strong>{invitation.role === 'admin' ? 'Company Admin' : 'Employee'}</strong>.
        Complete your registration below.
      </AlertDescription>
    </Alert>
  );
};

export default InvitationSection;
