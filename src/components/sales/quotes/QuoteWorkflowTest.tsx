import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SalesProcess } from "@/types/sales/salesProcesses";
import QuoteManagement from "./QuoteManagement";
import { CheckCircle, Send, Eye, Clock } from "lucide-react";

const QuoteWorkflowTest: React.FC = () => {
  const { t } = useLanguage();
  
  // Mock sales process for testing
  const mockSalesProcess: SalesProcess = {
    id: "sp-test-1",
    title: "Test Quote Management Process",
    client_name: "John Smith",
    company: "Smith Industries Ltd",
    stage: "quote",
    status: "active",
    insurance_type: "auto",
    estimated_value: 1500,
    expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    company_id: "default-company",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: "Testing complete quote management workflow"
  };

  const [currentProcess, setCurrentProcess] = useState<SalesProcess>(mockSalesProcess);

  const handleQuoteSent = () => {
    console.log("✅ Quote sent successfully");
    setCurrentProcess(prev => ({ ...prev, stage: "quote" }));
  };

  const handleQuoteResponded = () => {
    console.log("✅ Quote response received");
    setCurrentProcess(prev => ({ ...prev, stage: "quote" }));
  };

  const handleClientSelection = () => {
    console.log("✅ Client selection completed");
    setCurrentProcess(prev => ({ ...prev, stage: "authorization" }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quote Management Workflow Test</h1>
          <p className="text-muted-foreground">
            Test the complete quote management system with mock data
          </p>
        </div>

        {/* Process Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentProcess.title}</CardTitle>
              <Badge variant="outline">{currentProcess.stage}</Badge>
            </div>
            <CardDescription>
              Client: {currentProcess.client_name} | Company: {currentProcess.company} | Type: {currentProcess.insurance_type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Estimated Value:</span>
                <p className="text-muted-foreground">${currentProcess.estimated_value}</p>
              </div>
              <div>
                <span className="font-medium">Expected Close:</span>
                <p className="text-muted-foreground">
                  {new Date(currentProcess.expected_close_date!).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className="text-muted-foreground">{currentProcess.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Management System</CardTitle>
            <CardDescription>
              Test the complete quote workflow: Create → Send → Respond → Client Selection → Policy Import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuoteManagement
              process={currentProcess}
              onQuoteSent={handleQuoteSent}
              onQuoteResponded={handleQuoteResponded}
              onClientSelection={handleClientSelection}
            />
          </CardContent>
        </Card>

        {/* Workflow Status */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Status</CardTitle>
            <CardDescription>Track the progress of the quote management workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Quote Management UI</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Enhanced Quote Response (Accept/Modify/Reject)</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Client Quote Selection</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Policy Import Integration</span>
                <Badge variant="default">Implemented</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteWorkflowTest;