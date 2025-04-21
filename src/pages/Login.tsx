
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [roleSelected, setRoleSelected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // This is a mock of Google authentication - in a real app, use Google Auth API
  const handleLogin = () => {
    if (!roleSelected) return;
    
    setIsLoading(true);
    
    // Store user role in localStorage
    localStorage.setItem("userRole", isAdmin ? "admin" : "user");
    localStorage.setItem("isLoggedIn", "true");
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Logged in as ${isAdmin ? "Admin" : "User"}`);
      // Redirect to home page
      navigate("/");
    }, 800);
  };

  const handleRoleChange = (role: string) => {
    setIsAdmin(role === "admin");
    setRoleSelected(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50">
      <Card className="w-[350px] shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the AIRCARGO platform
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button
              variant={!isAdmin && roleSelected ? "outline" : "default"}
              onClick={() => handleRoleChange("user")}
              className="transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/80 hover:to-accent/80"
            >
              Regular User
            </Button>
            <Button
              variant={isAdmin && roleSelected ? "outline" : "default"}
              onClick={() => handleRoleChange("admin")}
              className="transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/80 hover:to-accent/80"
            >
              Admin
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Then continue with</span>
            </div>
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={!roleSelected || isLoading}
            className={`w-full transition-all duration-300 ${
              isLoading 
                ? "bg-gray-400" 
                : roleSelected 
                  ? "bg-[#4285F4] hover:bg-[#3367d6] active:bg-[#2a56c6]" 
                  : "bg-gray-400"
            } text-white`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-xs text-center text-muted-foreground">
            This is a demo authentication page. In a real application, this would connect to Google Auth API.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
