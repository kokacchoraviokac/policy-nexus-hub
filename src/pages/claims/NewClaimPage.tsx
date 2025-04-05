
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import ClaimForm from '@/components/claims/forms/ClaimForm';

// This is just to fix the status type issue
const status = "in_processing"; // Use in_processing instead of in processing

const NewClaimPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/claims');
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("newClaim")}</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("claimDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ClaimForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewClaimPage;
