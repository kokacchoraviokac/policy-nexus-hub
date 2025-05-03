
import React from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Skip breadcrumbs on the login page
  if (location.pathname === "/login") {
    return null;
  }
  
  // Split the path into segments
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  if (pathSegments.length === 0) {
    return (
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Home className="h-4 w-4 mr-1" />
              {t("dashboard")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  
  return (
    <Breadcrumb className="flex-1">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4 mr-1" />
            {t("dashboard")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {pathSegments.map((segment, index) => {
          // Skip IDs and numeric segments in the breadcrumb
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(segment) || !isNaN(Number(segment))) {
            return null;
          }
          
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          
          // Try to translate the segment or capitalize it
          const segmentTitle = t(segment) !== segment 
            ? t(segment) 
            : segment.charAt(0).toUpperCase() + segment.slice(1);
          
          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segmentTitle}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path}>{segmentTitle}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
