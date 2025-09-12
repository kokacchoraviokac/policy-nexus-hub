
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [],  // Don't explicitly exclude any dependencies
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'vendor-data';
            }
            if (id.includes('lucide-react') || id.includes('recharts')) {
              return 'vendor-icons-charts';
            }
            return 'vendor-misc';
          }
          
          // Route-based chunks
          if (id.includes('/pages/')) {
            if (id.includes('/pages/policies/')) return 'pages-policies';
            if (id.includes('/pages/sales/')) return 'pages-sales';
            if (id.includes('/pages/claims/')) return 'pages-claims';
            if (id.includes('/pages/finances/')) return 'pages-finances';
            if (id.includes('/pages/reports/')) return 'pages-reports';
            if (id.includes('/pages/settings/')) return 'pages-settings';
            return 'pages-misc';
          }
          
          // Component chunks
          if (id.includes('/components/')) {
            if (id.includes('/components/ui/')) return 'components-ui';
            if (id.includes('/components/policies/')) return 'components-policies';
            if (id.includes('/components/sales/')) return 'components-sales';
            if (id.includes('/components/claims/')) return 'components-claims';
            if (id.includes('/components/finances/')) return 'components-finances';
            return 'components-misc';
          }
        },
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
