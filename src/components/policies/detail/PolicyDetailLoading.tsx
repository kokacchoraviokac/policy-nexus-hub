
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PolicyDetailLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-6 w-[350px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
};

export default PolicyDetailLoading;
