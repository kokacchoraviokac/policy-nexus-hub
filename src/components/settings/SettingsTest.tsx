import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building, FileText, Settings, Palette } from "lucide-react";
import { Link } from "react-router-dom";

const SettingsTest: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings System Test</h1>
          <p className="text-muted-foreground">
            Test the complete company settings and configuration system
          </p>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings System Overview
            </CardTitle>
            <CardDescription>
              Complete company configuration and internal guidelines management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">Company Information</h3>
                <p className="text-sm text-muted-foreground">Business details, address, tax info</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Instructions Module</h3>
                <p className="text-sm text-muted-foreground">Internal guidelines by module</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Palette className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium">Branding & Regional</h3>
                <p className="text-sm text-muted-foreground">Currency, language, branding</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Phase 3 Implementation Status</CardTitle>
            <CardDescription>Track the progress of the settings system features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Company Information Management</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Instructions Module with CRUD Operations</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Mock Data Integration</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Regional Settings (Currency, Language, Date Format)</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Branding Configuration</span>
                <Badge variant="default">Implemented</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Integration with Invoice Generation</span>
                <Badge variant="default">Implemented</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Test Navigation</CardTitle>
            <CardDescription>
              Navigate to different settings modules to test functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">Company Data</CardTitle>
                  </div>
                  <CardDescription>
                    Test company information management with mock data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>• Company details form with validation</p>
                    <p>• Regional settings (currency, language, date format)</p>
                    <p>• Branding configuration</p>
                    <p>• Mock data persistence</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/settings/company">Test Company Settings</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">Instructions Module</CardTitle>
                  </div>
                  <CardDescription>
                    Test internal guidelines management system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>• Create/edit/delete instructions</p>
                    <p>• Module-based categorization</p>
                    <p>• Search and filtering</p>
                    <p>• Rich text content support</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/settings/instructions">Test Instructions</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Mock Data Information */}
        <Card>
          <CardHeader>
            <CardTitle>Mock Data Scenarios</CardTitle>
            <CardDescription>Available test data for comprehensive testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Company Information</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Name: Policy Hub Demo Company</li>
                  <li>• Address: 123 Insurance Street, Belgrade</li>
                  <li>• Tax ID: TAX987654321</li>
                  <li>• Registration: REG123456789</li>
                  <li>• Phone: +381 11 123 4567</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Sample Instructions</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• How to Create Quotes (Sales)</li>
                  <li>• Policy Import Process (Policies)</li>
                  <li>• Agent Payout Calculation (Agent)</li>
                  <li>• Claims Processing Guidelines (Claims)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Points */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Points</CardTitle>
            <CardDescription>How settings integrate with other modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Company Data → Invoice Generation</span>
                <Badge variant="outline">Connected</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Regional Settings → Date/Currency Formatting</span>
                <Badge variant="outline">Connected</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Instructions → Contextual Help</span>
                <Badge variant="outline">Connected</Badge>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Branding → Document Templates</span>
                <Badge variant="outline">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsTest;