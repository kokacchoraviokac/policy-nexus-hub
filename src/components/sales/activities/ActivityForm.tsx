
import React from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { CreateActivityFormData, ActivityType } from "@/types/sales/activities";
import { Calendar, Mail, Phone, CheckCircle, CalendarClock, FileText } from "lucide-react";

interface ActivityFormProps {
  onSubmit: (data: CreateActivityFormData) => void;
  initialData?: Partial<CreateActivityFormData>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting = false,
  submitLabel = "Create Activity"
}) => {
  const { t } = useLanguage();
  const form = useForm<CreateActivityFormData>({
    defaultValues: {
      activity_type: initialData?.activity_type || "follow_up",
      description: initialData?.description || "",
      due_date: initialData?.due_date,
      assigned_to: initialData?.assigned_to,
    }
  });

  const getActivityTypeIcon = (type: ActivityType) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "follow_up":
        return <CalendarClock className="h-4 w-4" />;
      case "task":
        return <CheckCircle className="h-4 w-4" />;
      case "note":
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleSubmit = (data: CreateActivityFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="activity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("activityType")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectActivityType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="call">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {t("call")}
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {t("email")}
                    </div>
                  </SelectItem>
                  <SelectItem value="meeting">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t("meeting")}
                    </div>
                  </SelectItem>
                  <SelectItem value="follow_up">
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      {t("followUp")}
                    </div>
                  </SelectItem>
                  <SelectItem value="task">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("task")}
                    </div>
                  </SelectItem>
                  <SelectItem value="note">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {t("note")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("enterActivityDescription")}
                  {...field}
                  disabled={isSubmitting}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dueDate")}</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                  disabled={isSubmitting}
                  placeholder={t("selectDueDate")}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t("creating") + "..." : submitLabel || t("createActivity")}
        </Button>
      </form>
    </Form>
  );
};

export default ActivityForm;
