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

export type userModel = { name: string | null; balance: number | null };

export type GlobalContent = {
  copy: userModel;
  setCopy: (user: userModel) => void;
};

export const MyGlobalContext = createContext<GlobalContent>({
  copy: { name: null, balance: null },
  setCopy: () => {
    //
  },
});

export const useGlobalContext = () => useContext(MyGlobalContext);
