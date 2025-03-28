
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const pathnames = location.pathname.split("/").filter((x) => x);
  
  // Don't show breadcrumbs on the main dashboard page
  if (pathnames.length === 0) {
    return null;
  }

  // Function to get translated path names
  const getTranslatedPathName = (path: string): string => {
    const pathMap: Record<string, string> = {
      "": "dashboard",
      "settings": "settings",
      "settings/users": "invitationManagement",
      "policies": "policyDirectory",
      "policies/workflow": "policyProcessing",
      "policies/addendums": "policyAddendums",
      "policies/unlinked-payments": "unmatchedPayments",
      "policies/documents": "policyDocuments",
      "sales": "sales",
      "claims": "claims",
      "finances": "finances",
      "codebook": "codebook",
      "agent": "agent",
      "reports": "reports",
      "profile": "myProfile",
    };
    
    const translationKey = pathMap[path] || path;
    // First try to translate with the key directly
    const translated = t(translationKey);
    
    // If translation returned the key itself, it means there's no translation
    // In that case, just capitalize the first letter
    if (translated === translationKey && !pathMap[path]) {
      return path.charAt(0).toUpperCase() + path.slice(1);
    }
    
    return translated;
  };

  return (
    <div className="py-2 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {pathnames.map((value, index) => {
            // Build the URL for this level
            const url = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const fullPath = pathnames.slice(0, index + 1).join("/");
            const displayName = getTranslatedPathName(fullPath);
            
            return (
              <React.Fragment key={url}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={url}>{displayName}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;
