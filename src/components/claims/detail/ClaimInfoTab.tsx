
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClaimInfoTabProps {
  claim: any;
}

const ClaimInfoTab: React.FC<ClaimInfoTabProps> = ({ claim }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Policy Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{t("policyInformation")}</CardTitle>
          <CardDescription>{t("relatedPolicyDetails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">{t("policyNumber")}</h4>
              <p>{claim.policies?.policy_number || "-"}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{t("policyholder")}</h4>
              <p>{claim.policies?.policyholder_name || "-"}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{t("insurer")}</h4>
              <p>{claim.policies?.insurer_name || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Damage Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{t("damageInformation")}</CardTitle>
          <CardDescription>{t("claimDamageDetails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">{t("incidentDate")}</h4>
              <p>{formatDate(claim.incident_date)}</p>
            </div>
            {claim.incident_location && (
              <div>
                <h4 className="font-medium text-sm mb-1">{t("incident_location")}</h4>
                <p>{claim.incident_location}</p>
              </div>
            )}
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-medium text-sm mb-1">{t("damageDescription")}</h4>
              <p className="whitespace-pre-line">{claim.damage_description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{t("financialDetails")}</CardTitle>
          <CardDescription>{t("claimFinancialInformation")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-1">{t("claimedAmount")}</h4>
              <p>{formatCurrency(claim.claimed_amount)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{t("approvedAmount")}</h4>
              <p>{claim.approved_amount ? formatCurrency(claim.approved_amount) : "-"}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">{t("deductible")}</h4>
              <p>{claim.deductible ? formatCurrency(claim.deductible) : "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Notes */}
      {claim.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("notes")}</CardTitle>
            <CardDescription>{t("additionalNotesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{claim.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimInfoTab;
