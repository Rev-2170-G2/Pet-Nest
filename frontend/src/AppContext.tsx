import { createContext, useState, useEffect, ReactNode } from "react";

export interface User {
  username: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({children}: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({username, token});
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
