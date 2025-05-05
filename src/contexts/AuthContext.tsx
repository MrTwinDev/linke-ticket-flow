
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user types
export type ProfileType = "importer" | "broker";
export type PersonType = "PF" | "PJ";

export interface User {
  id: string;
  email: string;
  profileType: ProfileType;
  personType: PersonType;
  fullName?: string;
  companyName?: string;
  phone: string;
  documentNumber: string;
  responsibleName?: string;
  responsibleCpf?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

interface AuthContextType {
  currentUser: User | null;
  profileType: ProfileType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, profileType: ProfileType) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, "id"> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("linkeUser");
    const storedProfile = localStorage.getItem("linkeProfile") as ProfileType | null;
    
    if (storedUser && storedProfile) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setProfileType(storedProfile);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user", error);
        localStorage.removeItem("linkeUser");
        localStorage.removeItem("linkeProfile");
      }
    }
  }, []);

  // In a real app, this would make API calls to your backend
  const login = async (email: string, password: string, profile: ProfileType) => {
    // Simulate API call
    // In a real app, we would validate credentials with the server
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we're just checking if the user exists in local storage
    // This is obviously not secure and just for demonstration
    const demoUsers = {
      importer: {
        id: "12345",
        email: "importer@example.com",
        profileType: "importer" as ProfileType,
        personType: "PJ" as PersonType,
        companyName: "Import Company Ltd",
        phone: "11987654321",
        documentNumber: "12.345.678/0001-90",
        responsibleName: "John Doe",
        responsibleCpf: "123.456.789-00",
        address: {
          cep: "01234-567",
          street: "Av Paulista",
          number: "1000",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP"
        }
      },
      broker: {
        id: "67890",
        email: "broker@example.com",
        profileType: "broker" as ProfileType,
        personType: "PF" as PersonType,
        fullName: "Jane Smith",
        phone: "11912345678",
        documentNumber: "987.654.321-00",
        address: {
          cep: "01234-567",
          street: "Av Faria Lima",
          number: "500",
          neighborhood: "Itaim Bibi",
          city: "São Paulo",
          state: "SP"
        }
      }
    };
    
    // Check login credentials (simplified for demo)
    let user = null;
    if (email === "importer@example.com" && password === "password" && profile === "importer") {
      user = demoUsers.importer;
    } else if (email === "broker@example.com" && password === "password" && profile === "broker") {
      user = demoUsers.broker;
    } else {
      throw new Error("Invalid credentials or profile type");
    }
    
    if (user) {
      setCurrentUser(user);
      setProfileType(profile);
      setIsAuthenticated(true);
      localStorage.setItem("linkeUser", JSON.stringify(user));
      localStorage.setItem("linkeProfile", profile);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setProfileType(null);
    setIsAuthenticated(false);
    localStorage.removeItem("linkeUser");
    localStorage.removeItem("linkeProfile");
  };

  const register = async (userData: Omit<User, "id"> & { password: string }) => {
    // Simulate API call to register user
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send data to the server and get a response
    const user: User = {
      ...userData,
      id: Math.random().toString(36).substring(2, 15),
    };
    
    setCurrentUser(user);
    setProfileType(userData.profileType);
    setIsAuthenticated(true);
    localStorage.setItem("linkeUser", JSON.stringify(user));
    localStorage.setItem("linkeProfile", userData.profileType);
  };

  const value = {
    currentUser,
    profileType,
    isAuthenticated,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
