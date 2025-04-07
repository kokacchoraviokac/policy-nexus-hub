
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DocumentApprovalStatus } from "@/types/documents";

interface DocumentApprovalDialogProps {
  document: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (status: DocumentApprovalStatus, notes: string) => void;
  onReject?: (status: DocumentApprovalStatus, notes: string) => void;
}

export function DocumentApprovalDialog({ 
  document, 
  open, 
  onOpenChange, 
  onApprove, 
  onReject 
}: DocumentApprovalDialogProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<DocumentApprovalStatus>(DocumentApprovalStatus.PENDING);
  const [notes, setNotes] = useState("");

  const handleApprove = () => {
    if (onApprove) {
      onApprove(status, notes);
    }
    toast({
      title: "Document Approved",
      description: "The document has been approved.",
    });
    onOpenChange(false);
  };

  const handleReject = () => {
    if (onReject) {
      onReject(status, notes);
    }
    toast({
      title: "Document Rejected",
      description: "The document has been rejected.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Document</DialogTitle>
          <DialogDescription>
            Review the document and add any relevant notes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Document Name
            </Label>
            <Input
              type="text"
              id="name"
              value={document?.document_name}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Document Type
            </Label>
            <Input
              type="text"
              id="type"
              value={document?.document_type}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleApprove}>
            Approve
          </Button>
          <Button type="submit" variant="destructive" onClick={handleReject}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
