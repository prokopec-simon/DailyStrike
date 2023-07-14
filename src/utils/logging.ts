import { Axiom } from "@axiomhq/js";

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN,
  orgId: process.env.AXIOM_ORG_ID,
});

export function getLogger(): Axiom {
  return axiom;
}

export const defaultLog = (
  message: string,
  level = "info",
  traceId?: string,
  data?: any
) => {
  axiom.ingest("logs-private", {
    message: message,
    level: level,
    traceId: traceId,
    data: data,
  });
};
