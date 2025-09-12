import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calculator, FileText, DollarSign, Users } from "lucide-react";
import CalculatePayouts from "./CalculatePayouts";
import PayoutReports from "./PayoutReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AgentPayoutTest: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Payout System Test</h1>
          <p className="text-muted-foreground">
            Test the complete agent payout system with mock data
          </p>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Agent Payout System Overview
            </CardTitle>
            <CardDescription>
              Complete commission aggregation and payout management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">3 Mock Agents</h3>
                <p className="text-sm text-muted-foreground">John Anderson, Sarah Wilson, Michael Brown</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Calculator className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Commission Calculation</h3>
                <p className="text-sm text-muted-foreground">Period-based aggregation with overrides</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium">Historical Reports</h3>
                <p className="text-sm text-muted-foreground">Export and audit trail support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Status</CardTitle>
            <CardDescription>Track the progress of the agent payout system features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Agent Management with Mock Data</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Payout Calculation Engine</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Commission Aggregation by Period</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Payout Preview and Finalization</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Historical Payout Reports</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Excel Export Functionality</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Status Tracking (Pending/Paid/Cancelled)</span>
                <Badge variant="default">Implemented</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Payout System Test Interface</CardTitle>
            <CardDescription>
              Test both payout calculation and historical reporting functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calculate" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calculate" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate Payouts
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Payout Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calculate" className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Testing Instructions:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Select an agent from the dropdown (John Anderson, Sarah Wilson, or Michael Brown)</li>
                    <li>2. Choose a date range for the payout period</li>
                    <li>3. Click "Calculate Payouts" to see commission aggregation</li>
                    <li>4. Review the preview table with policy details</li>
                    <li>5. Click "Finalize Payouts" to create a payout record</li>
                  </ol>
                </div>
                <CalculatePayouts />
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Testing Instructions:</h4>
                  <ol className="text-sm text-green-700 space-y-1">
                    <li>1. View historical payout records in the table</li>
                    <li>2. Click "View Details" to see detailed payout breakdown</li>
                    <li>3. Test the export functionality with "Export Payouts"</li>
                    <li>4. Verify pagination and filtering work correctly</li>
                    <li>5. Check that finalized payouts from the Calculate tab appear here</li>
                  </ol>
                </div>
                <PayoutReports />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Mock Data Information */}
        <Card>
          <CardHeader>
            <CardTitle>Mock Data Scenarios</CardTitle>
            <CardDescription>Available test data for comprehensive testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">John Anderson</h4>
                <p className="text-sm text-muted-foreground mb-2">High-performing agent</p>
                <ul className="text-xs space-y-1">
                  <li>• 4 policies in portfolio</li>
                  <li>• Total potential: $1,249.50</li>
                  <li>• Commission rates: 10-18%</li>
                  <li>• Historical: 1 paid payout</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Sarah Wilson</h4>
                <p className="text-sm text-muted-foreground mb-2">Mid-level agent</p>
                <ul className="text-xs space-y-1">
                  <li>• 2 policies in portfolio</li>
                  <li>• Total potential: $439.00</li>
                  <li>• Commission rates: 12-15%</li>
                  <li>• Historical: 1 pending payout</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Michael Brown</h4>
                <p className="text-sm text-muted-foreground mb-2">New agent</p>
                <ul className="text-xs space-y-1">
                  <li>• 3 policies in portfolio</li>
                  <li>• Total potential: $1,069.50</li>
                  <li>• Commission rates: 10-18%</li>
                  <li>• Historical: No previous payouts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPayoutTest;