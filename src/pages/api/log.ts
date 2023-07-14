import { NextApiRequest, NextApiResponse } from "next";
import { defaultLog, flushLogs } from "../../utils/logging";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  defaultLog("Logging API example", "info");
  flushLogs();
  res.status(200).json({ message: "Logs flushed" });
}
