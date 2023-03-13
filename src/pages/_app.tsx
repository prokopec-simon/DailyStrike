// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ConfigProvider, theme } from "antd";
import { createContext, useEffect, useState } from "react";
import {
  GlobalUserContext,
  MyGlobalContext,
  userContextSchema,
  userModel,
} from "../contexts/userContext";

const customTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#52C41A",
    colorInfo: "#49aa19",
    colorInfoTextActive: "#ffffff",
    colorPrimaryTextActive: "#ffffff",
    colorPrimaryActive: "#ffffff",
  },
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [copy, setCopy] = useState<userModel>({ name: null, balance: null });

  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={customTheme}>
        <MyGlobalContext.Provider value={{ copy, setCopy }}>
          <Component {...pageProps} />
        </MyGlobalContext.Provider>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
