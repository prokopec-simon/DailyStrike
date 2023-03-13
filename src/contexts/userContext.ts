import { createContext, useContext } from "react";

export type userContextSchema = {
  user: { name: string; balance: number } | null;
  setUser: (c: { name: string; balance: number }) => void;
};
export type userContext = {
  userContextValue: userContextSchema | null;
  setUserContextValue: React.Dispatch<
    React.SetStateAction<userContextSchema | null>
  >;
};
export const GlobalUserContext = createContext<userContext | null>(null);

export const MyGlobalContext = createContext<userContextSchema>({
  user: null, // set a default value
  setUser: () => {
    //.
  },
});
export const useGlobalContext = () => useContext(MyGlobalContext);
