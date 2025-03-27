
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EntityActionsCellProps {
  id: string;
  entityType: 'client' | 'insurer' | 'product';
  onEdit: () => void;
  onDelete: () => void;
}

export default function EntityActionsCell({ id, entityType, onEdit, onDelete }: EntityActionsCellProps) {
  // Map entity types to their detail routes
  const detailRoutes = {
    client: `/codebook/clients/${id}`,
    insurer: `/codebook/companies/${id}`,
    product: `/codebook/products/${id}`
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link to={detailRoutes[entityType]}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
