import { createContext, useState, useEffect, ReactNode, useContext } from "react";

export interface User {
  username: string;
  id: string;
  token: string;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  setUser: () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id")
    const username = localStorage.getItem("username");
    const admin = localStorage.getItem("admin") === "true";

    if (token && username && id) {
      setUser({ username, token, admin, id });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("admin", String(user.admin));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      localStorage.removeItem("admin");
    }
  }, [user]);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);