// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ConfigProvider, theme } from "antd";
import Header from "../components/Header";

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
  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={customTheme}>
        <Header />

        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
