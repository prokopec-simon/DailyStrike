import { createContext, useContext } from "react";

export type userModel = {
  name: string | null;
  balance: number | null;
  dailyMatchupPickedTeam: number | null;
  dailyMatchupPlacedAmount: number | null;
};
export type UserContent = {
  user: userModel;
  setUser: (user: userModel) => void;
};

export const UserContext = createContext<UserContent>({
  user: {
    name: null,
    balance: null,
    dailyMatchupPickedTeam: null,
    dailyMatchupPlacedAmount: null,
  },
  setUser: () => {
    //
  },
});

export const useGlobalUserContext = () => useContext(UserContext);
