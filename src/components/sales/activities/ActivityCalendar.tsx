
import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { format, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  LayoutGrid,
  List
} from "lucide-react";
import { SalesActivity } from "@/types/sales/activities";
import { getActivityTypeIcon } from "@/utils/activityUtils";

interface ActivityCalendarProps {
  activities: SalesActivity[];
  isLoading?: boolean;
  onDateClick?: (date: Date, activities: SalesActivity[]) => void;
  onActivityClick?: (activity: SalesActivity) => void;
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activities,
  isLoading = false,
  onDateClick,
  onActivityClick,
}) => {
  const { t } = useLanguage();
  const [view, setView] = useState<"month" | "list">("month");
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Filter activities to current month for month view
  const currentMonthActivities = useMemo(() => {
    if (!activities?.length) return [];
    
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    return activities.filter(activity => {
      if (!activity.due_date) return false;
      const activityDate = new Date(activity.due_date);
      return activityDate >= monthStart && activityDate <= monthEnd;
    });
  }, [activities, date]);

  // Group activities by date
  const activitiesByDate = useMemo(() => {
    if (!activities?.length) return {};
    
    return activities.reduce((acc: Record<string, SalesActivity[]>, activity) => {
      if (!activity.due_date) return acc;
      
      const dateKey = format(new Date(activity.due_date), "yyyy-MM-dd");
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(activity);
      return acc;
    }, {});
  }, [activities]);

  // Helper to determine if a date has activities
  const hasActivitiesOnDate = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return !!activitiesByDate[dateKey]?.length;
  };

  // Handle changing month
  const handleMonthChange = (increment: boolean) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + (increment ? 1 : -1));
    setDate(newDate);
  };

  // Customize day rendering in calendar
  const renderDay = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const dayActivities = activitiesByDate[dateKey] || [];
    const hasActivities = dayActivities.length > 0;
    
    if (!hasActivities) return undefined;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-7 h-7 bg-primary/10 rounded-full" />
            <span>{format(day, "d")}</span>
            {hasActivities && (
              <div className="absolute bottom-0 right-0">
                <Badge className="h-3 w-3 p-0 rounded-full bg-primary" />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-2 border-b">
            <h3 className="font-medium">{format(day, "PPP")}</h3>
            <p className="text-xs text-muted-foreground">
              {dayActivities.length} {dayActivities.length === 1 ? t("activity") : t("activities")}
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {dayActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="p-2 border-b hover:bg-muted cursor-pointer"
                onClick={() => onActivityClick?.(activity)}
              >
                <div className="flex items-center gap-2">
                  {getActivityTypeIcon(activity.activity_type)}
                  <span className="font-medium">{t(activity.activity_type)}</span>
                </div>
                <p className="text-sm truncate">{activity.description}</p>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  // Handle date selection
  const handleSelectDate = (selectedDate: Date | undefined) => {
    setSelectedDate(selectedDate);
    
    if (selectedDate && onDateClick) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      onDateClick(selectedDate, activitiesByDate[dateKey] || []);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (view === "list") {
    return (
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-medium">{t("scheduledActivities")}</div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setView("month")}
            >
              <CalendarIcon className="h-4 w-4 mr-1" /> {t("monthView")}
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t("noScheduledActivities")}
            </div>
          ) : (
            <div className="divide-y">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => onActivityClick?.(activity)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      {getActivityTypeIcon(activity.activity_type)}
                      <span className="font-medium ml-2">{t(activity.activity_type)}</span>
                    </div>
                    {activity.due_date && (
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(activity.due_date), "PPP")}
                      </div>
                    )}
                  </div>
                  <p className="text-sm">{activity.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-medium">{format(date, "MMMM yyyy")}</div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleMonthChange(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleMonthChange(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-1" /> {t("listView")}
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          month={date}
          onMonthChange={setDate}
          className="w-full border-none"
          components={{
            Day: ({ date: day, ...props }) => (
              <div {...props}>
                {renderDay(day as Date) || format(day as Date, "d")}
              </div>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};
