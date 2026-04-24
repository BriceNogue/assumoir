import { createContext, useContext, useState } from "react";

type UserContextValue = {
  user: any;
  setUser: any;
  isLoading: boolean;
  setIsLoading: any;
};

export const UserContext = createContext<UserContextValue>({
  user: {},
  isLoading: false,
  setUser: () => {},
  setIsLoading: () => {},
});

export const UserProvider = ({ children }: { children?: any }): any => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(UserContext);
