
export interface CustomPrivilege {
  id: string;
  privilege: string;
  context?: Record<string, any>;
  description?: string;
}
