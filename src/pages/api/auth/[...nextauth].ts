import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { TokenSet } from "openid-client";
import { v4 as uuidv4 } from "uuid";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    callbacks: {
      session: async ({ session, user }) => {
        if (session?.user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
      DiscordProvider({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
      }),
      {
        id: "steam",
        name: "Steam",
        type: "oauth",
        authorization: {
          url: "https://steamcommunity.com/openid/login",
          params: {
            "openid.ns": "http://specs.openid.net/auth/2.0",
            "openid.mode": "checkid_setup",
            "openid.return_to": `${process.env.HOST_NAME}/api/auth/callback/steam`,
            "openid.realm": `${process.env.HOST_NAME}`,
            "openid.identity":
              "http://specs.openid.net/auth/2.0/identifier_select",
            "openid.claimed_id":
              "http://specs.openid.net/auth/2.0/identifier_select",
          },
        },
        token: {
          async request(ctx) {
            const token_params = {
              "openid.assoc_handle":
                req.query["openid.assoc_handle"]?.toString() ?? "",
              "openid.signed": req.query["openid.signed"]?.toString() ?? "",
              "openid.sig": req.query["openid.sig"]?.toString() ?? "",
              "openid.ns": "http://specs.openid.net/auth/2.0",
              "openid.mode": "check_authentication",
            };
            for (const val of req.query["openid.signed"]!.toString().split(
              ","
            )) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              token_params[`openid.${val}`] = req.query[`openid.${val}`];
            }
            const token_url = new URL(
              "https://steamcommunity.com/openid/login"
            );
            const token_url_params = new URLSearchParams(token_params);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            token_url.search = token_url_params;
            const token_res = await fetch(token_url, {
              method: "POST",
              headers: {
                "Accept-language": "en",
                "Content-type": "application/x-www-form-urlencoded",
                "Content-Length": `${token_url_params.toString().length}`,
              },
              body: token_url_params.toString(),
            });
            const result = await token_res.text();
            if (result.match(/is_valid\s*:\s*true/i)) {
              const matches = req.query["openid.claimed_id"]!.toString().match(
                /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/
              );
              const steamid = matches![1]!.match(/^-?\d+$/) ? matches![1]! : 0;

              const tokenset = new TokenSet({
                id_token: uuidv4(),
                access_token: uuidv4(),
                steamid: steamid,
              });

              return { tokens: tokenset };
            } else {
              return { tokens: new TokenSet({}) };
            }
          },
        },
        userinfo: {
          async request(ctx) {
            const user_result = await fetch(
              `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`
            );
            const json = await user_result.json();
            return json.response.players[0];
          },
        },
        idToken: false,
        checks: ["none"],
        profile(profile: any) {
          return {
            id: profile.steamid,
            image: profile.avatarfull,
            name: profile.personaname,
          };
        },
        clientId: "DailyStrike",
        clientSecret: process.env.STEAM_API,
      },
    ],
  });
}
