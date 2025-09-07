import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  User,
  Table,
  RefreshCw,
  Info
} from 'lucide-react';
import { getDatabaseInfo } from '@/utils/databaseDebug';

const DebugDatabase: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<{
    connection?: { success: boolean; error?: any };
    authentication?: { success: boolean; user?: any; error?: any };
    tables?: { [key: string]: { exists: boolean; error?: any } };
    timestamp?: string;
    error?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDatabaseDebug = async () => {
    setIsLoading(true);
    try {
      const info = await getDatabaseInfo();
      setDebugInfo(info);
    } catch (error) {
      console.error('Debug failed:', error);
      setDebugInfo({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Success" : "Failed"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Database Debug Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={runDatabaseDebug}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {isLoading ? "Running Debug..." : "Run Database Debug"}
            </Button>
          </div>

          {debugInfo?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Debug failed: {debugInfo.error.message}
              </AlertDescription>
            </Alert>
          )}

          {debugInfo && !debugInfo.error && (
            <div className="space-y-4">
              {/* Connection Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(debugInfo.connection?.success)}
                    Database Connection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(debugInfo.connection?.success)}
                    <span className="text-sm text-muted-foreground">
                      {debugInfo.connection?.success
                        ? "Connected to Supabase successfully"
                        : "Failed to connect to database"}
                    </span>
                  </div>
                  {debugInfo.connection?.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {debugInfo.connection.error.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Authentication Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Authentication Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(debugInfo.authentication?.success)}
                    <span className="text-sm text-muted-foreground">
                      {debugInfo.authentication?.user
                        ? `Authenticated as: ${debugInfo.authentication.user.email}`
                        : "No user authenticated"}
                    </span>
                  </div>
                  {debugInfo.authentication?.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {debugInfo.authentication.error.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Tables Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Table className="h-5 w-5" />
                    Required Tables Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {Object.entries(debugInfo.tables || {}).map(([table, status]: [string, any]) => (
                        <div key={table} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status.exists)}
                            <span className="font-medium">{table}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(status.exists)}
                            {status.error && (
                              <Alert variant="destructive" className="ml-2">
                                <AlertDescription className="text-xs">
                                  {status.error.message}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Debug Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Object.keys(debugInfo.tables || {}).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Tables</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.values(debugInfo.tables || {}).filter((s: any) => s.exists).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Existing Tables</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {Object.values(debugInfo.tables || {}).filter((s: any) => !s.exists).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Missing Tables</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {debugInfo.timestamp ? new Date(debugInfo.timestamp).toLocaleTimeString() : 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Last Check</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugDatabase;