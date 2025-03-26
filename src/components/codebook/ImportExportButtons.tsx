
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { parseCSV, exportToCSV } from '@/utils/csv';
import { FileCsv, Import, Export } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportExportButtonsProps<T> {
  onImport: (data: T[]) => Promise<void>;
  getData: () => T[];
  entityName: string;
  className?: string;
}

function ImportExportButtons<T>({ 
  onImport, 
  getData, 
  entityName,
  className 
}: ImportExportButtonsProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvData = event.target?.result as string;
          const parsedData = await parseCSV<T>(csvData);
          
          if (parsedData.length === 0) {
            toast({
              title: "Error importing data",
              description: "No valid records found in the CSV file",
              variant: "destructive"
            });
            return;
          }

          await onImport(parsedData);
          toast({
            title: "Import successful",
            description: `Imported ${parsedData.length} ${entityName.toLowerCase()} records`,
          });
          
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Error importing data",
            description: "Could not parse the CSV file. Please check the format.",
            variant: "destructive"
          });
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error reading file",
        description: "There was an error reading the file",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    try {
      const data = getData();
      if (data.length === 0) {
        toast({
          title: "Nothing to export",
          description: `No ${entityName.toLowerCase()} records available for export`,
          variant: "destructive"
        });
        return;
      }
      
      const filename = `${entityName.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(data, filename);
      
      toast({
        title: "Export successful",
        description: `Exported ${data.length} ${entityName.toLowerCase()} records to ${filename}`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error exporting data",
        description: "There was an error generating the export file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleImportClick}
      >
        <Import className="h-4 w-4" />
        Import
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleExport}
      >
        <Export className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
}

export default ImportExportButtons;
