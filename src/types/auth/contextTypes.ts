
import { CustomPrivilege } from "./userTypes";

export interface ResourceContext {
  [key: string]: string | number | boolean | undefined;
  resourceId?: string;
  resourceType?: string;
  actionType?: string;
}

// Context for privilege checking
export interface PrivilegeContext {
  resourceId?: string;
  resourceType?: string;
  actionType?: string;
  [key: string]: string | undefined;
}

// Context for authorization validation
export interface AuthorizationContext {
  privileges: CustomPrivilege[];
  resourceContext: ResourceContext;
}
