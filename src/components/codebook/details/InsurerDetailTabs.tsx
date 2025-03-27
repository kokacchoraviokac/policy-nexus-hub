
import React from "react";
import { Insurer } from "@/types/codebook";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { InsurerProductsList } from "@/components/codebook/relationships/InsurerProductsList";
import { TabItem } from "@/types/ui";

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

interface InsurerDetailTabsProps {
  insurer: Insurer;
  activityData: ActivityItem[];
  onAddProduct?: () => void;
}

const InsurerDetailTabs = ({ 
  insurer, 
  activityData,
  onAddProduct
}: InsurerDetailTabsProps): TabItem[] => {
  return [
    {
      id: 'details',
      label: 'Details',
      content: (
        <InfoGrid>
          <InfoItem label="Name" value={insurer.name} />
          <InfoItem label="Contact Person" value={insurer.contact_person} />
          <InfoItem label="Email" value={insurer.email} />
          <InfoItem label="Phone" value={insurer.phone} />
          <InfoItem label="Registration Number" value={insurer.registration_number} />
          <InfoItem label="Status" value={insurer.is_active ? "Active" : "Inactive"} />
          <InfoItem label="Address" value={
            [insurer.address, insurer.city, insurer.postal_code, insurer.country]
              .filter(Boolean)
              .join(", ")
          } />
        </InfoGrid>
      )
    },
    {
      id: 'products',
      label: 'Products',
      content: (
        <InsurerProductsList 
          insurerId={insurer.id} 
          onAddProduct={onAddProduct}
        />
      )
    },
    {
      id: 'activity',
      label: 'Activity History',
      content: <ActivityLog items={activityData} />
    }
  ];
};

export default InsurerDetailTabs;
