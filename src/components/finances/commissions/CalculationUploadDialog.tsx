
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileUp, Upload, Check } from "lucide-react";

interface CalculationUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

const CalculationUploadDialog: React.FC<CalculationUploadDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [insurerId, setInsurerId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const resetState = () => {
    setStep(1);
    setSelectedFile(null);
    setInsurerId("");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setStep(3);
          toast({
            title: t("uploadSuccessful"),
            description: t("commissionCalculationProcessed"),
          });
        }, 500);
      }
    }, 300);
  };

  const handleProcessCalculation = () => {
    if (!selectedFile || !insurerId) {
      toast({
        title: t("validationError"),
        description: t("pleaseSelectFileAndInsurer"),
        variant: "destructive",
      });
      return;
    }
    simulateUpload();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">{t("selectCalculationFile")}</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    {t("selectedFile")}: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurer">{t("selectInsurer")}</Label>
                <Select value={insurerId} onValueChange={setInsurerId}>
                  <SelectTrigger id="insurer">
                    <SelectValue placeholder={t("selectInsurer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insurer1">Insurance Company 1</SelectItem>
                    <SelectItem value="insurer2">Insurance Company 2</SelectItem>
                    <SelectItem value="insurer3">Insurance Company 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button onClick={handleNextStep} disabled={!selectedFile || !insurerId}>
                {t("next")}
              </Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">{t("confirmationDetails")}</h3>
                <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                  <div className="text-sm text-muted-foreground">
                    {t("selectedFile")}:
                  </div>
                  <div className="text-sm font-medium">{selectedFile?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("fileSize")}:
                  </div>
                  <div className="text-sm font-medium">
                    {Math.round(selectedFile?.size / 1024)} KB
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("insurer")}:
                  </div>
                  <div className="text-sm font-medium">
                    {insurerId === "insurer1"
                      ? "Insurance Company 1"
                      : insurerId === "insurer2"
                      ? "Insurance Company 2"
                      : "Insurance Company 3"}
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <Label>{t("uploadProgress")}</Label>
                    <span className="text-sm">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={isUploading}
              >
                {t("back")}
              </Button>
              <Button
                onClick={handleProcessCalculation}
                disabled={isUploading}
              >
                {isUploading ? t("processing") : t("processCalculation")}
              </Button>
            </DialogFooter>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-lg">{t("processingCompleted")}</h3>
              <p className="text-muted-foreground">
                {t("commissionsProcessingCompleted")}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>{t("close")}</Button>
            </DialogFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            {t("uploadCommissionCalculation")}
          </DialogTitle>
          <DialogDescription>
            {t("uploadCommissionCalculationDescription")}
          </DialogDescription>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CalculationUploadDialog;
