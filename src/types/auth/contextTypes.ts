
export interface ResourceContext {
  ownerId?: string;
  currentUserId?: string;
  companyId?: string;
  currentUserCompanyId?: string;
  resourceType?: string;
  resourceValue?: any;
  [key: string]: any;
}
