import { createContext, useContext } from "react";

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
