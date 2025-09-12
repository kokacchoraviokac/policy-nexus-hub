import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { PlusCircle, Edit, Trash, Search, FileText, Eye } from "lucide-react";
import { toast } from "sonner";

interface Instruction {
  id: string;
  title: string;
  content: string;
  module: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const InstructionsPage = () => {
  const { t } = useLanguage();
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingInstruction, setViewingInstruction] = useState<Instruction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    module: ""
  });

  const modules = [
    { value: "dashboard", label: t("dashboard") },
    { value: "policies", label: t("policies") },
    { value: "sales", label: t("sales") },
    { value: "claims", label: t("claims") },
    { value: "finances", label: t("finances") },
    { value: "codebook", label: t("codebook") },
    { value: "agent", label: t("agent") },
    { value: "reports", label: t("reports") },
    { value: "settings", label: t("settings") }
  ];

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    setIsLoading(true);
    console.log("Using mock instructions data for testing");
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get stored instructions from localStorage
      const storedInstructions = JSON.parse(localStorage.getItem('mockInstructions') || '[]');
      
      // Mock instructions data
      const mockInstructions: Instruction[] = [
        {
          id: "inst-1",
          title: "How to Create Quotes",
          content: "To create a quote:\n1. Navigate to Sales > Sales Processes\n2. Create a new sales process\n3. Use the Quote Management section\n4. Fill in coverage details and premium\n5. Send to insurers for response",
          module: "sales",
          created_by: "admin",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "inst-2", 
          title: "Policy Import Process",
          content: "When importing policies:\n1. Ensure all required fields are mapped\n2. Review validation errors before import\n3. Finalize policies after import\n4. Check commission calculations\n5. Upload supporting documents",
          module: "policies",
          created_by: "admin",
          created_at: "2024-01-20T14:30:00Z",
          updated_at: "2024-01-20T14:30:00Z"
        },
        {
          id: "inst-3",
          title: "Agent Payout Calculation",
          content: "To calculate agent payouts:\n1. Go to Agent > Calculate Payouts\n2. Select the agent and period\n3. Review the commission breakdown\n4. Finalize the payout\n5. Track payment in Payout Reports",
          module: "agent",
          created_by: "admin",
          created_at: "2024-02-01T09:15:00Z",
          updated_at: "2024-02-01T09:15:00Z"
        },
        {
          id: "inst-4",
          title: "Claims Processing Guidelines",
          content: "When processing claims:\n1. Verify policy details are correct\n2. Upload all supporting documents\n3. Set appropriate claim status\n4. Add detailed notes for audit trail\n5. Notify relevant parties of status changes",
          module: "claims",
          created_by: "admin",
          created_at: "2024-02-05T16:45:00Z",
          updated_at: "2024-02-05T16:45:00Z"
        },
        ...storedInstructions
      ];
      
      setInstructions(mockInstructions);
    } catch (error) {
      console.error("Error fetching instructions:", error);
      toast.error(t("errorFetchingInstructions"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInstruction = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.module) {
      toast.error(t("pleaseCompleteAllFields"));
      return;
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date().toISOString();
      
      if (editingInstruction) {
        // Update existing instruction
        const updatedInstruction: Instruction = {
          ...editingInstruction,
          title: formData.title,
          content: formData.content,
          module: formData.module,
          updated_at: now
        };
        
        setInstructions(prev => prev.map(inst => 
          inst.id === editingInstruction.id ? updatedInstruction : inst
        ));
        
        // Update localStorage
        const storedInstructions = JSON.parse(localStorage.getItem('mockInstructions') || '[]');
        const updatedStored = storedInstructions.map((inst: Instruction) =>
          inst.id === editingInstruction.id ? updatedInstruction : inst
        );
        localStorage.setItem('mockInstructions', JSON.stringify(updatedStored));
        
        toast.success(t("instructionUpdated"));
      } else {
        // Create new instruction
        const newInstruction: Instruction = {
          id: `inst-${Date.now()}`,
          title: formData.title,
          content: formData.content,
          module: formData.module,
          created_by: "admin",
          created_at: now,
          updated_at: now
        };
        
        setInstructions(prev => [...prev, newInstruction]);
        
        // Store in localStorage
        const storedInstructions = JSON.parse(localStorage.getItem('mockInstructions') || '[]');
        storedInstructions.push(newInstruction);
        localStorage.setItem('mockInstructions', JSON.stringify(storedInstructions));
        
        toast.success(t("instructionCreated"));
      }
      
      // Reset form and close dialog
      setFormData({ title: "", content: "", module: "" });
      setEditingInstruction(null);
      setDialogOpen(false);
      
    } catch (error) {
      console.error("Error saving instruction:", error);
      toast.error(t("errorSavingInstruction"));
    }
  };

  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setFormData({
      title: instruction.title,
      content: instruction.content,
      module: instruction.module
    });
    setDialogOpen(true);
  };

  const handleDeleteInstruction = async (instructionId: string) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setInstructions(prev => prev.filter(inst => inst.id !== instructionId));
      
      // Update localStorage
      const storedInstructions = JSON.parse(localStorage.getItem('mockInstructions') || '[]');
      const updatedStored = storedInstructions.filter((inst: Instruction) => inst.id !== instructionId);
      localStorage.setItem('mockInstructions', JSON.stringify(updatedStored));
      
      toast.success(t("instructionDeleted"));
    } catch (error) {
      console.error("Error deleting instruction:", error);
      toast.error(t("errorDeletingInstruction"));
    }
  };

  const handleViewInstruction = (instruction: Instruction) => {
    setViewingInstruction(instruction);
    setViewDialogOpen(true);
  };

  const filteredInstructions = instructions.filter(instruction => {
    const matchesSearch = instruction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instruction.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === "all" || instruction.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SettingsHeader 
        title={t("instructions")}
        description={t("instructionsDescription")}
      />

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>{t("manageInstructions")}</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingInstruction(null);
                  setFormData({ title: "", content: "", module: "" });
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("addInstruction")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingInstruction ? t("editInstruction") : t("addInstruction")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("instructionFormDescription")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("title")} *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={t("enterInstructionTitle")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="module">{t("module")} *</Label>
                    <Select value={formData.module} onValueChange={(value) => setFormData(prev => ({ ...prev, module: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectModule")} />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map(module => (
                          <SelectItem key={module.value} value={module.value}>
                            {module.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">{t("content")} *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={t("enterInstructionContent")}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleSaveInstruction}>
                    {editingInstruction ? t("updateInstruction") : t("createInstruction")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchInstructions")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t("filterByModule")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allModules")}</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module.value} value={module.value}>
                    {module.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredInstructions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("noInstructionsFound")}</h3>
              <p className="text-muted-foreground mb-4">{t("noInstructionsDescription")}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("title")}</TableHead>
                    <TableHead>{t("module")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("createdAt")}</TableHead>
                    <TableHead className="w-[120px]">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstructions.map((instruction) => (
                    <TableRow key={instruction.id}>
                      <TableCell className="font-medium">
                        {instruction.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {modules.find(m => m.value === instruction.module)?.label || instruction.module}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(instruction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInstruction(instruction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInstruction(instruction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInstruction(instruction.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Instruction Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewingInstruction?.title}</DialogTitle>
            <DialogDescription>
              Module: {modules.find(m => m.value === viewingInstruction?.module)?.label}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {viewingInstruction?.content}
              </pre>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Created: {viewingInstruction && new Date(viewingInstruction.created_at).toLocaleString()}
              {viewingInstruction?.updated_at !== viewingInstruction?.created_at && (
                <span> • Updated: {viewingInstruction && new Date(viewingInstruction.updated_at).toLocaleString()}</span>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              {t("close")}
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              handleEditInstruction(viewingInstruction!);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              {t("edit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructionsPage;