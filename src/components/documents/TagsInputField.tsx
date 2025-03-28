
import React from "react";
import { Tag, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagsInputFieldProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TagsInputField: React.FC<TagsInputFieldProps> = ({
  tags,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
  onKeyDown
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-2">
      <Label htmlFor="tags">{t("tags")}</Label>
      <div className="flex gap-2">
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("addTags")}
          className="flex-1"
        />
        <Button type="button" variant="secondary" onClick={addTag} size="sm">
          <Tag className="h-4 w-4 mr-1" />
          {t("add")}
        </Button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)} 
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsInputField;
