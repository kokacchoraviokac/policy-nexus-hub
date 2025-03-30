
import { useRef } from 'react';

interface PrintOptions {
  content: () => HTMLElement | null;
  documentTitle?: string;
  onBeforeGetContent?: () => Promise<void> | void;
  onAfterPrint?: () => void;
}

export const useReactToPrint = (options: PrintOptions) => {
  const {
    content,
    documentTitle = 'Document',
    onBeforeGetContent = () => {},
    onAfterPrint = () => {},
  } = options;

  const handlePrint = async () => {
    try {
      // Run before print hook
      await onBeforeGetContent();

      // Get content
      const element = content();
      if (!element) throw new Error("Content not available");

      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error("Could not open print window");

      // Set up print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                padding: 2rem;
                color: #000;
              }
              @media print {
                body {
                  padding: 0;
                }
                button {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  }
                }, 300);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
    } finally {
      onAfterPrint();
    }
  };

  return handlePrint;
};
