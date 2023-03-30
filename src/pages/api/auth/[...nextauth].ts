import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { TokenSet } from "openid-client";
import { v4 as uuidv4 } from "uuid";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import getOptions from "./authOptions";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const options = await getOptions(req);
  return await NextAuth(req, res, options);
}
