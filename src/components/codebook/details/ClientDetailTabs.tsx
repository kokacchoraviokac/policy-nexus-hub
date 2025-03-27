
import React from "react";
import { Client } from "@/types/codebook";
import { InfoGrid, InfoItem } from "@/components/codebook/details/InfoItem";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { ClientPoliciesList } from "@/components/codebook/relationships/ClientPoliciesList";

interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

interface ClientDetailTabsProps {
  client: Client;
  activityData: ActivityItem[];
}

const ClientDetailTabs: React.FC<ClientDetailTabsProps> = ({ client, activityData }) => {
  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <InfoGrid>
          <InfoItem label="Name" value={client.name} />
          <InfoItem label="Contact Person" value={client.contact_person} />
          <InfoItem label="Email" value={client.email} />
          <InfoItem label="Phone" value={client.phone} />
          <InfoItem label="Tax ID" value={client.tax_id} />
          <InfoItem label="Registration Number" value={client.registration_number} />
          <InfoItem label="Status" value={client.is_active ? "Active" : "Inactive"} />
          <InfoItem label="Address" value={
            [client.address, client.city, client.postal_code, client.country]
              .filter(Boolean)
              .join(", ")
          } />
          {client.notes && (
            <div className="col-span-full mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <div className="p-3 bg-muted rounded-md">
                {client.notes}
              </div>
            </div>
          )}
        </InfoGrid>
      )
    },
    {
      id: 'policies',
      label: 'Policies',
      content: <ClientPoliciesList clientId={client.id} />
    },
    {
      id: 'activity',
      label: 'Activity History',
      content: <ActivityLog items={activityData} />
    }
  ];
  
  return tabs;
};

export default ClientDetailTabs;
