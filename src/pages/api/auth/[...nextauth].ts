import NextAuth from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import getOptions from "./authOptions";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const options = await getOptions(req);
  return await NextAuth(req, res, options);
}
