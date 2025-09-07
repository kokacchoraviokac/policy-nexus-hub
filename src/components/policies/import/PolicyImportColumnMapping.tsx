import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  confidence: number; // 0-100, how confident we are in the auto-mapping
  isMapped: boolean;
}

interface PolicyImportColumnMappingProps {
  headers: string[];
  sampleData: any[];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onBack?: () => void;
}

const PolicyImportColumnMapping: React.FC<PolicyImportColumnMappingProps> = ({
  headers,
  sampleData,
  onMappingComplete,
  onBack
}) => {
  const { t } = useLanguage();
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [availableFields] = useState([
    { key: 'policy_number', label: t('policyNumber'), required: true },
    { key: 'policy_type', label: t('policyType'), required: false },
    { key: 'insurer_name', label: t('insurer'), required: true },
    { key: 'product_name', label: t('product'), required: false },
    { key: 'product_code', label: t('productCode'), required: false },
    { key: 'policyholder_name', label: t('policyholder'), required: true },
    { key: 'insured_name', label: t('insured'), required: false },
    { key: 'start_date', label: t('startDate'), required: true },
    { key: 'expiry_date', label: t('expiryDate'), required: true },
    { key: 'premium', label: t('premium'), required: true },
    { key: 'currency', label: t('currency'), required: false },
    { key: 'payment_frequency', label: t('paymentFrequency'), required: false },
    { key: 'commission_percentage', label: t('commissionPercentage'), required: false },
    { key: 'commission_type', label: t('commissionType'), required: false },
    { key: 'notes', label: t('notes'), required: false }
  ]);

  // Smart column detection patterns
  const columnPatterns = {
    policy_number: ['policy', 'pol', 'number', 'num', 'id', 'reference'],
    policy_type: ['type', 'category', 'class'],
    insurer_name: ['insurer', 'insurance', 'carrier', 'company', 'provider'],
    product_name: ['product', 'plan', 'coverage'],
    product_code: ['code', 'sku', 'product_code'],
    policyholder_name: ['policyholder', 'client', 'customer', 'holder', 'owner'],
    insured_name: ['insured', 'beneficiary', 'person'],
    start_date: ['start', 'effective', 'begin', 'from'],
    expiry_date: ['expiry', 'end', 'expiration', 'to', 'until'],
    premium: ['premium', 'price', 'cost', 'amount', 'value'],
    currency: ['currency', 'curr', 'money'],
    payment_frequency: ['frequency', 'payment', 'period', 'interval'],
    commission_percentage: ['commission', 'comm', 'percentage', 'rate', 'pct'],
    commission_type: ['commission_type', 'comm_type'],
    notes: ['notes', 'comments', 'description', 'remarks']
  };

  useEffect(() => {
    console.log("PolicyImportColumnMapping - Headers:", headers);
    console.log("PolicyImportColumnMapping - SampleData:", sampleData);

    // Auto-detect column mappings based on header names
    const autoMappings = headers.map(header => {
      const lowerHeader = header.toLowerCase().trim();
      let bestMatch = '';
      let highestConfidence = 0;

      // Check each field pattern
      Object.entries(columnPatterns).forEach(([fieldKey, patterns]) => {
        const confidence = calculateMatchConfidence(lowerHeader, patterns);
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = fieldKey;
        }
      });

      return {
        sourceColumn: header,
        targetField: highestConfidence > 30 ? bestMatch : '',
        confidence: highestConfidence,
        isMapped: highestConfidence > 50
      };
    });

    console.log("PolicyImportColumnMapping - Auto mappings:", autoMappings);
    setMappings(autoMappings);
  }, [headers, sampleData]);

  const calculateMatchConfidence = (header: string, patterns: string[]): number => {
    let totalScore = 0;
    let matchCount = 0;

    patterns.forEach(pattern => {
      if (header.includes(pattern)) {
        // Exact word match gets higher score
        if (header === pattern || header.split(/[\s_-]+/).includes(pattern)) {
          totalScore += 100;
          matchCount++;
        } else {
          // Partial match gets lower score
          totalScore += 60;
          matchCount++;
        }
      }
    });

    // Boost score if multiple patterns match
    if (matchCount > 1) {
      totalScore += 20;
    }

    return Math.min(totalScore, 100);
  };

  const handleFieldMapping = (sourceColumn: string, targetField: string) => {
    setMappings(prev => prev.map(mapping =>
      mapping.sourceColumn === sourceColumn
        ? { ...mapping, targetField, isMapped: targetField !== '' }
        : mapping
    ));
  };

  const getAvailableFields = (currentSourceColumn: string) => {
    const usedFields = mappings
      .filter(m => m.sourceColumn !== currentSourceColumn && m.targetField)
      .map(m => m.targetField);

    return availableFields.filter(field => !usedFields.includes(field.key));
  };

  const getRequiredFieldsStatus = () => {
    const requiredFields = availableFields.filter(f => f.required).map(f => f.key);
    const mappedRequiredFields = mappings
      .filter(m => m.targetField && requiredFields.includes(m.targetField))
      .map(m => m.targetField);

    return {
      total: requiredFields.length,
      mapped: mappedRequiredFields.length,
      missing: requiredFields.filter(f => !mappedRequiredFields.includes(f))
    };
  };

  const handleContinue = () => {
    const mappingObject: Record<string, string> = {};
    mappings.forEach(mapping => {
      if (mapping.targetField) {
        mappingObject[mapping.sourceColumn] = mapping.targetField;
      }
    });
    onMappingComplete(mappingObject);
  };

  const requiredStatus = getRequiredFieldsStatus();
  const canContinue = requiredStatus.mapped === requiredStatus.total;

  // Debug logging
  console.log("Rendering PolicyImportColumnMapping with:", { headers, sampleData, mappings });

  if (!headers || headers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-destructive">No headers found</h3>
          <p className="text-sm text-muted-foreground">
            The uploaded file doesn't contain valid column headers. Please check your file and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">{t("mapColumns")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("mapColumnsDescription")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={canContinue ? "default" : "destructive"}>
            {requiredStatus.mapped}/{requiredStatus.total} {t("requiredFields")}
          </Badge>
        </div>
      </div>

      {!canContinue && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("missingRequiredFields")}: {requiredStatus.missing.map(field =>
              availableFields.find(f => f.key === field)?.label
            ).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("columnMapping")}</CardTitle>
          <CardDescription>
            {t("columnMappingDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("sourceColumn")}</TableHead>
                <TableHead>{t("sampleData")}</TableHead>
                <TableHead>{t("mapsTo")}</TableHead>
                <TableHead>{t("confidence")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping, index) => {
                const availableFieldsForColumn = getAvailableFields(mapping.sourceColumn);
                // Get sample value from the first row of sample data that has this column
                const sampleValue = sampleData.length > 0 ? sampleData[0][mapping.sourceColumn] || '' : '';

                return (
                  <TableRow key={mapping.sourceColumn}>
                    <TableCell className="font-medium">
                      {mapping.sourceColumn}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sampleValue ? `"${sampleValue}"` : t("noData")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={mapping.targetField}
                        onValueChange={(value) => handleFieldMapping(mapping.sourceColumn, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("selectField")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t("skipColumn")}</SelectItem>
                          {availableFieldsForColumn.map(field => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {mapping.confidence > 0 && (
                        <Badge variant={mapping.confidence > 70 ? "default" : "secondary"}>
                          {mapping.confidence}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {mapping.isMapped ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {t("mapped")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Info className="h-3 w-3" />
                          {t("unmapped")}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Real-time Data Preview */}
      {sampleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("dataPreview")}</CardTitle>
            <CardDescription>
              {t("previewOfHowDataWillLook")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {availableFields.map(field => {
                      const isMapped = mappings.some(m => m.targetField === field.key);
                      return (
                        <TableHead key={field.key} className={field.required ? "font-semibold" : ""}>
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                          {!isMapped && <span className="text-muted-foreground ml-1">(unmapped)</span>}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.slice(0, 3).map((row, rowIndex) => {
                    // Apply current mappings to create preview data
                    const previewRow: any = {};
                    mappings.forEach(mapping => {
                      if (mapping.targetField) {
                        previewRow[mapping.targetField] = row[mapping.sourceColumn] || '';
                      }
                    });

                    return (
                      <TableRow key={rowIndex}>
                        {availableFields.map(field => (
                          <TableCell key={field.key} className="text-sm">
                            {previewRow[field.key] || (
                              <span className="text-muted-foreground italic">empty</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {sampleData.length > 3 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing first 3 rows of {sampleData.length} total rows
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            {t("back")}
          </Button>
        )}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="ml-auto"
        >
          {t("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PolicyImportColumnMapping;