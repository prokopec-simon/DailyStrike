import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const name = await prisma.user.findFirst();
        session.user.balance = Number(name!.balance);
        session.user.livePredictionAmount = Number(
          (
            await prisma.userMatchPrediction.findFirst({
              where: { userId: name?.id },
            })
          )?.predictionAmount
        );
        session.user.livePredictionTeam = Number(
          (
            await prisma.userMatchPrediction.findFirst({
              where: { userId: name?.id },
            })
          )?.pickedTeam
        );
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
