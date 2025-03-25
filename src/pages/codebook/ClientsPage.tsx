
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientsDirectory from "@/components/codebook/ClientsDirectory";
import { Book, Users } from "lucide-react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ClientsPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Codebook</h1>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center space-x-1">
            <Users className="h-5 w-5" />
            <span className="font-medium">Clients</span>
          </div>
        </div>
        
        <ClientsDirectory />
      </div>
    </QueryClientProvider>
  );
};

export default ClientsPage;
