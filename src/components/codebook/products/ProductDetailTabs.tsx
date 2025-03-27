
import React from "react";
import { InsuranceProduct } from "@/types/codebook";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

interface ProductDetailTabsProps {
  product: InsuranceProduct;
  activityData: ActivityItem[];
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ product, activityData }) => {
  return [
    {
      id: 'details',
      label: 'Details',
      content: (
        <InfoGrid>
          <InfoItem label="Code" value={product.code} />
          <InfoItem label="Name" value={product.name} />
          <InfoItem label="Category" value={product.category} />
          <InfoItem label="Insurance Company" value={product.insurer_name} />
          <InfoItem label="Active" value={product.is_active} />
          {product.description && (
            <div className="col-span-full mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <div className="p-3 bg-muted rounded-md">
                {product.description}
              </div>
            </div>
          )}
        </InfoGrid>
      )
    },
    {
      id: 'activity',
      label: 'Activity History',
      content: <ActivityLog items={activityData} />
    }
  ];
};

export default ProductDetailTabs;
