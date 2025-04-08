
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ResourceContext } from "@/types/auth/contextTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PrivilegeTest: React.FC = () => {
  const { user, hasPrivilege, hasPrivilegeWithContext } = useAuth();
  const [privilegeToCheck, setPrivilegeToCheck] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [useContext, setUseContext] = useState(false);
  const [contextData, setContextData] = useState<ResourceContext>({
    resource: "",
    action: "",
  });

  const handleCheck = () => {
    if (!privilegeToCheck) return;
    
    if (useContext) {
      const hasAccess = hasPrivilegeWithContext(privilegeToCheck, contextData);
      setResult(hasAccess);
    } else {
      const hasAccess = hasPrivilege(privilegeToCheck);
      setResult(hasAccess);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privilege Testing Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="privilege">Privilege to check:</Label>
            <Input
              id="privilege"
              value={privilegeToCheck}
              onChange={(e) => setPrivilegeToCheck(e.target.value)}
              placeholder="e.g., policies:view, policies.own:edit"
              className="mt-1"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Examples: policies:view, claims.highValue:edit, finances.commissions:view
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="useContext" 
              checked={useContext}
              onCheckedChange={(checked) => setUseContext(checked === true)}
            />
            <Label htmlFor="useContext">Use context data</Label>
          </div>
          
          {useContext && (
            <div className="space-y-3 border p-3 rounded-md">
              <div>
                <Label htmlFor="resource">Resource:</Label>
                <Input
                  id="resource"
                  value={contextData.resource || ""}
                  onChange={(e) => setContextData({...contextData, resource: e.target.value})}
                  placeholder="Resource (e.g., policy, claim)"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="action">Action:</Label>
                <Input
                  id="action"
                  value={contextData.action || ""}
                  onChange={(e) => setContextData({...contextData, action: e.target.value})}
                  placeholder="Action (e.g., view, edit, delete)"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="ownerId">Owner ID (optional):</Label>
                <Input
                  id="ownerId"
                  value={contextData.ownerId || ""}
                  onChange={(e) => setContextData({...contextData, ownerId: e.target.value})}
                  placeholder="Resource owner's ID"
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {user?.id && (
                    <span>Current user ID: <Badge variant="outline">{user.id}</Badge></span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="companyId">Company ID (optional):</Label>
                <Input
                  id="companyId"
                  value={contextData.companyId || ""}
                  onChange={(e) => setContextData({...contextData, companyId: e.target.value})}
                  placeholder="Resource company ID"
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {user?.companyId && (
                    <span>Current user company ID: <Badge variant="outline">{user.companyId}</Badge></span>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="resourceType">Resource Type (optional):</Label>
                <Select
                  value={contextData.resourceType || ""}
                  onValueChange={(value) => setContextData({...contextData, resourceType: value})}
                >
                  <SelectTrigger id="resourceType">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {contextData.resourceType === 'amount' && (
                <div>
                  <Label htmlFor="resourceValue">Amount Value:</Label>
                  <Input
                    id="resourceValue"
                    type="number"
                    value={contextData.resourceValue || ""}
                    onChange={(e) => setContextData({...contextData, resourceValue: Number(e.target.value)})}
                    placeholder="e.g., 5000"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          
          <Button onClick={handleCheck}>Check Privilege</Button>
          
          {result !== null && (
            <div className="pt-2">
              <p>Result: {" "}
                {result ? (
                  <Badge className="bg-green-600">Access Granted</Badge>
                ) : (
                  <Badge variant="destructive">Access Denied</Badge>
                )}
              </p>
              <p className="text-sm mt-2">
                User <Badge variant="outline">{user?.name || 'Unknown'}</Badge> with role <Badge>{user?.role || 'Unknown'}</Badge> {result ? 'has' : 'does not have'} the privilege <Badge variant="secondary">{privilegeToCheck}</Badge>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivilegeTest;
