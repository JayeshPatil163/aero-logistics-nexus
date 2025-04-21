
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plane, X } from "lucide-react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-wider">AERO NEXUS</span>
          </Link>
        </div>
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/airline" className="transition-colors hover:text-primary">
              Airline Portal
            </Link>
            <Link to="/cargo" className="transition-colors hover:text-primary">
              Cargo Portal
            </Link>
            {isLoggedIn && userRole === "admin" && (
              <Link to="/admin" className="transition-colors hover:text-primary">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isLoggedIn ? (
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="hover:bg-accent hover:text-accent-foreground"
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="default" 
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
                <Link to="/airline" className="hover:text-primary">
                  Airline Portal
                </Link>
                <Link to="/cargo" className="hover:text-primary">
                  Cargo Portal
                </Link>
                {isLoggedIn && userRole === "admin" && (
                  <Link to="/admin" className="hover:text-primary">
                    Admin Dashboard
                  </Link>
                )}
                <hr className="my-3" />
                {isLoggedIn ? (
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")}>
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
