
export interface ResourceContext {
  [key: string]: any;
  policy?: string;
  claim?: string;
  client?: string;
  insurer?: string;
  invoice?: string;
  user?: string;
}
