
import React from "react";
import { ActivityType } from "@/types/sales/activities";
import { 
  Phone, 
  Mail, 
  Calendar, 
  CalendarClock, 
  CheckCircle, 
  FileText 
} from "lucide-react";

export const getActivityTypeIcon = (type: ActivityType) => {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4 text-blue-500" />;
    case "email":
      return <Mail className="h-4 w-4 text-indigo-500" />;
    case "meeting":
      return <Calendar className="h-4 w-4 text-green-500" />;
    case "follow_up":
      return <CalendarClock className="h-4 w-4 text-amber-500" />;
    case "task":
      return <CheckCircle className="h-4 w-4 text-purple-500" />;
    case "note":
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <CalendarClock className="h-4 w-4" />;
  }
};

export const getActivityStatusClass = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    case "in_progress":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "completed":
      return "bg-green-50 text-green-600 border-green-200";
    case "canceled":
      return "bg-gray-50 text-gray-600 border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};
