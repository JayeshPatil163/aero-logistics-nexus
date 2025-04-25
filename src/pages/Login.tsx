
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { provider, auth } from "@/firebase";
import { LogIn } from "lucide-react";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



const Login = () => {
  const [roleSelected, setRoleSelected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Firebase Google Auth
  const handleGoogleSignIn = async () => {
    if (!roleSelected) {
      toast.error("Please select a role first!");
      return;
    }
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      // User data
      const user = result.user;
      localStorage.setItem("userRole", isAdmin ? "admin" : "user");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", user.displayName || "");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userPhoto", user.photoURL || "");
      toast.success(`Logged in as ${user.displayName || (isAdmin ? "Admin" : "User")}`);
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err: any) {
      toast.error("Google login failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
              variant="outline"
              onClick={() => handleRoleChange("user")}
              className={`transition-all duration-200 ${
                !roleSelected || (roleSelected && !isAdmin)
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : ""
              }`}
            >
              Regular User
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRoleChange("admin")}
              className={`transition-all duration-200 ${
                roleSelected && isAdmin
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : ""
              }`}
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
            onClick={handleGoogleSignIn}
            disabled={!roleSelected || isLoading}
            className={`w-full transition-all duration-300 flex items-center justify-center ${
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
                <LogIn className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-xs text-center text-muted-foreground">
            This is a demo authentication page. Now, sign in securely with your Google account!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
