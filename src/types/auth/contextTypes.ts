
export interface ResourceContext {
  resource: string;
  action: string;
  condition?: string;
  ownerId?: string;
  companyId?: string;
  resourceType?: string;
  resourceValue?: any;
  [key: string]: any;
}
