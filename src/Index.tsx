
import React from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Redirect to dashboard if we're on the index page
    navigate("/dashboard");
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">PolicyHub</h1>
        <p className="text-xl">Loading...</p>
        <div className="mt-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
