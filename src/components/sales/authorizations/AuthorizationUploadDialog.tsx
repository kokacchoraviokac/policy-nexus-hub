
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

// Mock sales processes data
const mockSalesProcesses = [
  { id: "SP-001", name: "Acme Corporation - Auto Insurance", client: "Acme Corporation" },
  { id: "SP-002", name: "Globex Industries - Property Insurance", client: "Globex Industries" },
  { id: "SP-003", name: "Oceanic Airlines - Commercial Liability", client: "Oceanic Airlines" },
  { id: "SP-004", name: "Stark Industries - Employee Benefits", client: "Stark Industries" },
];

const formSchema = z.object({
  salesProcessId: z.string({
    required_error: "Please select a sales process",
  }),
  file: z.instanceof(File, {
    message: "Please upload a file",
  }),
  expiryDate: z.date({
    required_error: "Please select an expiry date",
  }).refine((date) => date > new Date(), {
    message: "Expiry date must be in the future",
  }),
  notes: z.string().optional(),
});

interface AuthorizationUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthorizationUploadDialog: React.FC<AuthorizationUploadDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesProcessId: "",
      notes: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get client name from selected sales process
      const salesProcess = mockSalesProcesses.find(sp => sp.id === values.salesProcessId);
      
      toast.success(t("authorizationUploaded"), {
        description: t("authorizationUploadedFor", { client: salesProcess?.client || "" }),
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(t("uploadFailed"), {
        description: t("errorUploadingAuthorization"),
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("uploadAuthorizationForm")}</DialogTitle>
          <DialogDescription>
            {t("uploadAuthorizationDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="salesProcessId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("salesProcess")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectSalesProcess")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockSalesProcesses.map(process => (
                        <SelectItem key={process.id} value={process.id}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{t("authorizationDocument")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          onChange(e.target.files[0]);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("acceptedFileFormats")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("expiryDate")}</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                  <FormDescription>
                    {t("expiryDateDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={t("optionalNotes")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isUploading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("uploading")}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {t("upload")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorizationUploadDialog;
