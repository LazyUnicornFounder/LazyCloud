import { Link } from "react-router-dom";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <Cloud className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
