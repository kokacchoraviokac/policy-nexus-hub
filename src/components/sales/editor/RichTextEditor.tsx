
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// This is a simple implementation - in a real app, you would integrate 
// a proper rich text editor like TipTap, Quill, or TinyMCE
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  minHeight = "150px"
}) => {
  const { t } = useLanguage();

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted px-3 py-2 border-b">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className="p-1 hover:bg-muted-foreground/10 rounded"
            onClick={() => {
              const selection = window.getSelection();
              if (!selection) return;
              
              document.execCommand('bold', false);
              
              // Update the value
              const element = document.getElementById('rich-text-editor') as HTMLDivElement;
              onChange(element.innerHTML);
            }}
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            className="p-1 hover:bg-muted-foreground/10 rounded"
            onClick={() => {
              document.execCommand('italic', false);
              
              // Update the value
              const element = document.getElementById('rich-text-editor') as HTMLDivElement;
              onChange(element.innerHTML);
            }}
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            className="p-1 hover:bg-muted-foreground/10 rounded"
            onClick={() => {
              document.execCommand('underline', false);
              
              // Update the value
              const element = document.getElementById('rich-text-editor') as HTMLDivElement;
              onChange(element.innerHTML);
            }}
          >
            <span className="underline">U</span>
          </button>
          <span className="mx-2 text-muted-foreground/50">|</span>
          <button
            type="button"
            className="p-1 hover:bg-muted-foreground/10 rounded"
            onClick={() => {
              document.execCommand('insertUnorderedList', false);
              
              // Update the value
              const element = document.getElementById('rich-text-editor') as HTMLDivElement;
              onChange(element.innerHTML);
            }}
          >
            <span>• List</span>
          </button>
          <button
            type="button"
            className="p-1 hover:bg-muted-foreground/10 rounded"
            onClick={() => {
              document.execCommand('insertOrderedList', false);
              
              // Update the value
              const element = document.getElementById('rich-text-editor') as HTMLDivElement;
              onChange(element.innerHTML);
            }}
          >
            <span>1. List</span>
          </button>
        </div>
      </div>

      <div
        id="rich-text-editor"
        contentEditable
        className="p-3 focus:outline-none min-h-[150px]"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => {
          const element = e.target as HTMLDivElement;
          onChange(element.innerHTML);
        }}
        placeholder={placeholder || t("typeHere")}
      />
    </div>
  );
};

export default RichTextEditor;
