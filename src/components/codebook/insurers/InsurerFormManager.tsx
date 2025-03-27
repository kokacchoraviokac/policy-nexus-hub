
import React, { useState } from "react";
import { useInsurers } from "@/hooks/useInsurers";
import InsurerFormDialog from "../dialogs/InsurerFormDialog";

interface InsurerFormManagerProps {
  children: (props: {
    openAddForm: () => void;
    openEditForm: (insurerId: string) => void;
  }) => React.ReactNode;
}

const InsurerFormManager: React.FC<InsurerFormManagerProps> = ({ children }) => {
  const [isInsurerFormOpen, setIsInsurerFormOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(undefined);

  const handleAddInsurer = () => {
    setSelectedInsurerId(undefined);
    setIsInsurerFormOpen(true);
  };

  const handleEditInsurer = (insurerId: string) => {
    setSelectedInsurerId(insurerId);
    setIsInsurerFormOpen(true);
  };

  return (
    <>
      {children({
        openAddForm: handleAddInsurer,
        openEditForm: handleEditInsurer
      })}
      
      <InsurerFormDialog 
        open={isInsurerFormOpen}
        onOpenChange={setIsInsurerFormOpen}
        insurerId={selectedInsurerId}
      />
    </>
  );
};

export default InsurerFormManager;
