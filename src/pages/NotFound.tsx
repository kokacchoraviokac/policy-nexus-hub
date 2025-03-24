
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-card rounded-lg px-8 py-12 text-center max-w-md w-full animate-fade-in">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl font-medium mb-6">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you were looking for. The page may have been moved or deleted.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
