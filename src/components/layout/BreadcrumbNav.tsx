
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const pathMap: Record<string, string> = {
  "": "Dashboard",
  "settings": "Settings",
  "settings/users": "User Management",
  "policies": "Policies",
  "sales": "Sales",
  "claims": "Claims",
  "finances": "Finances",
  "codebook": "Codebook",
  "agent": "Agent",
  "reports": "Reports",
  "profile": "Profile",
};

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  
  // Don't show breadcrumbs on the main dashboard page
  if (pathnames.length === 0) {
    return null;
  }

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
            const displayName = pathMap[fullPath] || value.charAt(0).toUpperCase() + value.slice(1);
            
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
