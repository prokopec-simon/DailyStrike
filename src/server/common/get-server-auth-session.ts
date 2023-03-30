// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import type { GetServerSidePropsContext, NextApiRequest } from "next";
import { unstable_getServerSession } from "next-auth";
import getOptions from "../../pages/api/auth/authOptions";

// Next API route example - /pages/api/restricted.ts
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const options = await getOptions(ctx.req as NextApiRequest);
  return await unstable_getServerSession(ctx.req, ctx.res, options);
};
