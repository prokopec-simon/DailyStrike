// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import {
  ChakraProvider,
  extendTheme,
  StyleFunctionProps,
} from "@chakra-ui/react";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        color: "default",
        bg: "#1D1D1D",
        height: "100vh",
      },
    }),
  },
});
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
