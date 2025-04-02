
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalesProcess } from "@/types/salesProcess";

interface ProcessActionsMenuProps {
  process: SalesProcess;
  onView: (process: SalesProcess) => void;
  onDelete: (process: SalesProcess) => void;
}

const ProcessActionsMenu: React.FC<ProcessActionsMenuProps> = ({
  process,
  onView,
  onDelete,
}) => {
  const { t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(process)}>
          <Eye className="mr-2 h-4 w-4" />
          {t("viewDetails")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          {t("editProcess")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowRight className="mr-2 h-4 w-4" />
          {t("moveToNextStage")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(process)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("deleteProcess")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProcessActionsMenu;
