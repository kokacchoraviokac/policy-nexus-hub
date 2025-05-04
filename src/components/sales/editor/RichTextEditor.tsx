
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Unlink,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  minHeight = "150px",
  maxHeight = '400px',
  className
}) => {
  const { t } = useLanguage();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const handleContentChange = (e: FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).innerHTML;
    onChange(newContent);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      editorRef.current.focus();
    }
  };

  const handleAddLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <div className="bg-muted/40 p-2 flex flex-wrap gap-1 border-b">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('bold')}
          title={t("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('italic')}
          title={t("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('insertUnorderedList')}
          title={t("bulletList")}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('insertOrderedList')}
          title={t("numberedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('justifyLeft')}
          title={t("alignLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('justifyCenter')}
          title={t("alignCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('justifyRight')}
          title={t("alignRight")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        {showLinkInput ? (
          <div className="flex">
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder={t("enterUrl")}
              className="text-sm border rounded-l-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="button"
              size="sm"
              className="rounded-l-none"
              onClick={handleAddLink}
            >
              {t("add")}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowLinkInput(true)}
            title={t("addLink")}
          >
            <Link className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('unlink')}
          title={t("removeLink")}
        >
          <Unlink className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="mx-1 h-8" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('undo')}
          title={t("undo")}
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => execCommand('redo')}
          title={t("redo")}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      <div
        id="editor"
        ref={editorRef}
        contentEditable={true}
        className={cn(
          "p-4 focus:outline-none",
          isFocused ? "ring-1 ring-primary" : ""
        )}
        style={{ minHeight: minHeight }}
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
      />
      
      <style>
        {`[contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: gray;
          cursor: text;
        }`}
      </style>
    </div>
  );
};

export default RichTextEditor;
