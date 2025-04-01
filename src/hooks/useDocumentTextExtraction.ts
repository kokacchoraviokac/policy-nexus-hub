
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { extractTextFromFile } from "@/utils/documentTextExtraction";

export const useDocumentTextExtraction = (file: File | null) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const processFile = async () => {
      if (!file) {
        setDocumentText(null);
        return;
      }

      setIsExtracting(true);
      try {
        const text = await extractTextFromFile(file);
        setDocumentText(text);
      } catch (err) {
        console.error("Error extracting text:", err);
        toast({
          title: t("textExtractionError"),
          description: t("couldNotExtractText"),
          variant: "destructive",
        });
      } finally {
        setIsExtracting(false);
      }
    };

    processFile();
  }, [file, toast, t]);

  return { documentText, isExtracting };
};
