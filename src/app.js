import express from "express";
import { timingSafeEqual } from "node:crypto";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { facilitator } from "@payai/facilitator";
import { buildQueryPlan } from "./query-plan.js";
import { rareEarthBundle } from "./rare-earth-bundle.js";

const DEFAULT_PAY_TO = "0x67234000d6d08567D7633CA41E79f8dcef8EDF08";
const NETWORK = process.env.X402_NETWORK || "eip155:8453";

export function createApp({ payTo = process.env.PAY_TO || DEFAULT_PAY_TO } = {}) {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "16kb" }));

  app.post("/webhook/the402", async (req, res) => {
    const provided = req.get("x-platform-secret") || "";
    const accepted = [process.env.THE402_WEBHOOK_SECRET, process.env.THE402_API_KEY]
      .filter(Boolean);
    if (!accepted.some((secret) => safeEqual(provided, secret))) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const inbox = path.resolve(process.env.THE402_JOB_INBOX || ".runtime/the402-jobs.jsonl");
    await appendFile(inbox, `${JSON.stringify({ received_at: new Date().toISOString(), payload: req.body })}\n`, "utf8");
    return res.json({ ok: true });
  });

  const facilitatorClient = new HTTPFacilitatorClient(facilitator);
  const resourceServer = new x402ResourceServer(facilitatorClient)
    .register("eip155:*", new ExactEvmScheme());

  app.use(paymentMiddleware({
    "POST /v1/query-plan": {
      accepts: [{ scheme: "exact", price: "$0.05", network: NETWORK, payTo }],
      description: "Generate a Chinese-language query matrix and primary-source verification plan for a China research topic.",
      mimeType: "application/json"
    },
    "GET /v1/rare-earth-export-controls": {
      accepts: [{ scheme: "exact", price: "$0.50", network: NETWORK, payTo }],
      description: "Get an auditable primary-source starter bundle on China's 2025 rare-earth export controls.",
      mimeType: "application/json"
    }
  }, resourceServer));

  app.get("/", (_req, res) => res.json({
    name: "QuietVector China Source Intelligence API",
    description: "Machine-callable Chinese-web research scaffolds with direct x402 USDC payment on Base.",
    docs: "/openapi.json",
    endpoints: ["POST /v1/query-plan", "GET /v1/rare-earth-export-controls"]
  }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.get("/openapi.json", (req, res) => res.json(openApi(req)));

  app.post("/v1/query-plan", (req, res) => {
    try {
      res.json(buildQueryPlan(req.body?.topic));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get("/v1/rare-earth-export-controls", (_req, res) => res.json(rareEarthBundle));

  return app;
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function openApi(req) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const paid = (summary, description, price) => ({
    summary,
    description,
    "x-payment-info": {
      protocols: [{ protocol: "x402", network: NETWORK }],
      fixed: { amount: price, currency: "USDC" }
    },
    responses: {
      "200": { description: "Paid response", content: { "application/json": {} } },
      "402": { description: "Payment Required" }
    }
  });
  return {
    openapi: "3.1.0",
    info: {
      title: "QuietVector China Source Intelligence API",
      version: "0.1.0",
      "x-guidance": "Use query-plan to start Chinese-language research. Use the evidence bundle for a cited rare-earth export-control baseline."
    },
    servers: [{ url: origin }],
    paths: {
      "/v1/query-plan": {
        post: {
          ...paid("Build a China research query plan", "Returns ten topic-specific Chinese query groups, official source domains, translation traps, and a verification sequence.", "0.05"),
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["topic"], properties: { topic: { type: "string", minLength: 1, maxLength: 160 } } } } }
          }
        }
      },
      "/v1/rare-earth-export-controls": {
        get: paid("Get a primary-source rare-earth controls bundle", "Returns four verified findings with official Chinese sources, scope limits, and research cautions.", "0.50")
      }
    }
  };
}
