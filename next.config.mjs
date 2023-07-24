// @ts-check
import { env } from "./src/env/server.mjs";
import { withAxiom } from "next-axiom";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig(
  withAxiom({
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },
    images: {
      domains: [
        "cdn.discordapp.com",
        "img-cdn.hltv.org",
        "avatars.akamai.steamstatic.com",
        "community.cloudflare.steamstatic.com",
      ],
    },
  })
);
