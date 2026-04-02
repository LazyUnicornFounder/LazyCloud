import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-display font-bold text-foreground">404</h1>
      <p className="mb-4 text-xl text-muted-foreground">Page not found</p>
      <Link to="/">
        <Button variant="outline">Return to Home</Button>
      </Link>
    </div>
  </main>
);

export default NotFound;
