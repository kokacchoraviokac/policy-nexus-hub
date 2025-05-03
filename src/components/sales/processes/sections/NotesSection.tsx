
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

interface NotesSectionProps {
  notes?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  const { t } = useLanguage();

  if (!notes) return null;

  return (
    <>
      <Separator />
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h4>
        <p className="text-sm whitespace-pre-wrap">{notes}</p>
      </div>
    </>
  );
};

export default NotesSection;
