
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  aadhaarId?: string;
  userId?: string;
};
// <!-- hi harshal -
type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Simulate login for demo purposes
  const login = async (userId: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if there's a registered user with this ID in localStorage
      const tempUserData = localStorage.getItem("tempUserData");
      
      // For demo purposes, we'll accept both the hardcoded credentials and any registered user
      if ((userId === "AID123456" && password === "password") || 
          (tempUserData && JSON.parse(tempUserData).userId === userId && JSON.parse(tempUserData).password === password)) {
        
        // If it's a registered user, use their data
        let userData: User;
        
        if (tempUserData && JSON.parse(tempUserData).userId === userId) {
          const registeredUser = JSON.parse(tempUserData);
          userData = {
            id: "user-" + Math.random().toString(36).substr(2, 9),
            name: registeredUser.name || "Registered User",
            email: registeredUser.email,
            role: "user",
            aadhaarId: registeredUser.aadhaarId,
            userId: registeredUser.userId
          };
        } else {
          // Use demo data
          userData = {
            id: "user-1",
            name: "John Doe",
            email: "user@example.com",
            role: "user",
            aadhaarId: "1234-5678-9012",
            userId: "AID123456"
          };
        }
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!");
        return true;
      }
      
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulate admin login
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate admin credentials
      if (email === "admin@example.com" && password === "admin123") {
        const adminData: User = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        };
        
        setUser(adminData);
        localStorage.setItem("user", JSON.stringify(adminData));
        toast.success("Admin login successful!");
        return true;
      }
      
      toast.error("Invalid admin credentials");
      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("An error occurred during admin login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        adminLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
