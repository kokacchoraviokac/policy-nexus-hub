
import React from 'react';
import { formatDistance, parseISO } from 'date-fns';
import { Trash } from 'lucide-react';
import { Invitation } from '@/types/invitation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface InvitationListProps {
  invitations: Invitation[];
  loading: boolean;
  onDeleteInvitation: (id: string) => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  loading,
  onDeleteInvitation,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Loading invitations...
            </TableCell>
          </TableRow>
        ) : invitations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No invitations found
            </TableCell>
          </TableRow>
        ) : (
          invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell className="capitalize">{invitation.role}</TableCell>
              <TableCell className="capitalize">{invitation.status}</TableCell>
              <TableCell>
                {formatDistance(parseISO(invitation.expires_at), new Date(), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDeleteInvitation(invitation.id)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default InvitationList;
