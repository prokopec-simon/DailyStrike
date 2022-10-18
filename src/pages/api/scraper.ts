// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {WebDriver } from 'selenium-webdriver';
import { prisma } from "../../server/db/client";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.example.findMany();

  WebDriver.createSession()

  res.status(200).json(examples);
};

export default examples;
