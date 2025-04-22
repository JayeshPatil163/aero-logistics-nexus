
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plane, Truck, LogOut, User, Calendar, SunMoon } from "lucide-react";
import { toast } from "sonner";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useTheme } from "@/hooks/use-theme";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("userRole");
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <Plane className="h-6 w-6 text-primary transition-all group-hover:text-accent" />
            <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent transition-all group-hover:from-accent group-hover:to-primary">AIRCARGO</span>
          </Link>
        </div>
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/" 
              className={`transition-colors relative ${isActive('/') ? 'text-primary' : 'hover:text-primary'}`}
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-100 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-right hover:after:scale-x-100">
                Home
              </span>
            </Link>
            <Link 
              to="/airline" 
              className={`transition-colors relative ${isActive('/airline') ? 'text-primary' : 'hover:text-primary'}`}
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                Airline Portal
              </span>
            </Link>
            <Link 
              to="/cargo" 
              className={`transition-colors relative ${isActive('/cargo') ? 'text-primary' : 'hover:text-primary'}`}
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                Cargo Portal
              </span>
            </Link>
            {isLoggedIn && userRole !== "admin" && (
              <>
                <Link 
                  to="/manage-bookings" 
                  className={`transition-colors relative ${isActive('/manage-bookings') ? 'text-primary' : 'hover:text-primary'}`}
                >
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                    Manage Bookings
                  </span>
                </Link>
              </>
            )}
            {/* Add Admin Schedule Management Link */}
            {isLoggedIn && userRole === "admin" && (
              <>
                <Link 
                  to="/schedule-management" 
                  className={`transition-colors relative ${isActive('/schedule-management') ? 'text-primary' : 'hover:text-primary'}`}
                >
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Management
                  </span>
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
            aria-label="Toggle theme"
          >
            <SunMoon className="h-5 w-5" />
          </Button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
                    <User className="h-4 w-4" />
                    <span className="sr-only">User profile</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-56 gemini-card">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold gemini-gradient-text">Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        You are logged in as a {userRole === "admin" ? "Admin" : "Regular User"}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
              >
                <LogOut className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 text-primary-foreground active:scale-95"
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
            <SheetContent side="right" className="gemini-card">
              <nav className="grid gap-6 text-lg font-medium">
                <Link to="/" className="hover:text-primary gemini-gradient-text">
                  Home
                </Link>
                <Link to="/airline" className="hover:text-primary">
                  Airline Portal
                </Link>
                <Link to="/cargo" className="hover:text-primary">
                  Cargo Portal
                </Link>
                {isLoggedIn && userRole === "admin" && (
                  <Link to="/schedule-management" className="hover:text-primary flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Management
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span>Theme:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="h-8"
                  >
                    <SunMoon className="h-4 w-4 mr-2" />
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
                <hr className="my-3" />
                {isLoggedIn ? (
                  <Button variant="outline" onClick={handleLogout} className="gemini-hover-effect">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")} className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary gemini-hover-effect">
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
