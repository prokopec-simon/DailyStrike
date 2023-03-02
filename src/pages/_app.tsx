// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ConfigProvider, theme } from "antd";
import { createContext, useState } from "react";

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

export const Context = createContext({});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [balance, setBalance] = useState(1);
  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={customTheme}>
        <Context.Provider value={{ balance, setBalance }}>
          <Component {...pageProps} />
        </Context.Provider>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
