
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{t("codebook")}</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto mt-2">
          {t("codebookDescription")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          hasPrivilege(section.privilege) && (
            <Card key={section.path} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{t(section.title)}</CardTitle>
                    <CardDescription>
                      {t(section.description)}
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <section.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  {t(`${section.title}ModuleDescription`)}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/10 py-3">
                <Button asChild variant="default" className="w-full">
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
