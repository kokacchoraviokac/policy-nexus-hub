
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md mb-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-orange-100 p-4">
            <Shield className="h-12 w-12 text-orange-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-lg text-gray-600 mt-4">
          You don't have permission to access this page. Please contact your administrator for assistance.
        </p>
        <div className="mt-8 space-x-4">
          <Button onClick={() => navigate("/")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
