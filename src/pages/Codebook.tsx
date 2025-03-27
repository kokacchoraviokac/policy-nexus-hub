
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Book, Users, Building2, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Codebook = () => {
  const { t } = useLanguage();
  const { hasPrivilege } = useAuth();

  const sections = [
    {
      title: "clients",
      description: "clientsDescription",
      icon: Users,
      path: "/codebook/clients",
      privilege: "codebook.clients:view"
    },
    {
      title: "insuranceCompanies",
      description: "insuranceCompaniesDescription",
      icon: Building2,
      path: "/codebook/companies",
      privilege: "codebook.companies:view"
    },
    {
      title: "insuranceProducts",
      description: "insuranceProductsDescription",
      icon: Tag,
      path: "/codebook/products",
      privilege: "codebook.codes:view"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{t("codebook")}</h1>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {t("codebookDescription")}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          hasPrivilege(section.privilege) && (
            <Card key={section.path} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{t(section.title)}</CardTitle>
                  <CardDescription>
                    {t(section.description)}
                  </CardDescription>
                </div>
                <section.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardFooter className="pt-4">
                <Button asChild className="w-full">
                  <Link to={section.path}>{t("access")} {t(section.title)}</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        ))}
      </div>
    </div>
  );
};

export default Codebook;
