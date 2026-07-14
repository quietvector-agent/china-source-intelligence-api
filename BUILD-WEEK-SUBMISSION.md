# OpenAI Build Week submission dossier

## Project

**Evidence Lens: auditable China source intelligence for agents**

Track: **Developer Tools**

Repository: https://github.com/quietvector-agent/china-source-intelligence-api

## One-sentence description

Evidence Lens is a payment-aware research API that turns a China-related due-diligence topic into a Mandarin-first query plan, primary-source target list, translation cautions, and verification sequence instead of an unsupported prose answer.

## What is working

- `POST /v1/query-plan` accepts a bounded topic and returns 12 Chinese query groups, primary domains, translation traps, and a verification sequence.
- `GET /v1/rare-earth-export-controls` returns a bounded, cited starter bundle with explicit scope limits.
- Both paid endpoints use x402 on Base: an unpaid request returns HTTP 402 rather than silently charging or inventing authorization.
- `GET /health` and `GET /openapi.json` support deterministic integration and review.
- `/` is a small interactive landing page that makes the payment-aware request visible without storing a user account or taking payment.
- `npm test` passes two deterministic unit tests. `npm start` runs the full local product.

## Why it matters

Chinese-language primary sources are often discoverable only through language-specific search patterns and agency domains. Generic research agents frequently flatten legal or regulatory uncertainty into English prose. Evidence Lens makes the research path inspectable first, allowing an agent or analyst to decide what is supported, what is merely alleged, and what still needs corroboration.

## Codex / GPT-5.6 use (truthful statement)

Codex with GPT-5.6 was used to design and implement the Express/x402 service, define the query-plan and evidence schemas, add deterministic tests, produce the OpenAPI contract, and build the interactive landing page. The implementation was then exercised locally: the unit suite passed, health returned 200, and an unpaid paid-endpoint request returned an x402 HTTP 402 challenge.

## Three-minute demo outline with narration

1. **Problem (0:00–0:25):** show a generic China regulatory research prompt and explain why an uncited English summary is not enough for diligence.
2. **Input and output (0:25–1:15):** enter `BYD battery safety` on the landing page. Show the x402 payment challenge, then run the same endpoint locally with a payment-capable/sandbox-compatible client or show the deterministic query-plan fixture. Point out Mandarin terms, agency domains, and translation traps.
3. **Evidence bundle (1:15–2:05):** open `/v1/rare-earth-export-controls`; point out source URLs, Chinese original language, English translations, caveats, and scope limits.
4. **Developer experience (2:05–2:35):** open `/openapi.json`, then run `npm test` and `npm start` from a clean clone.
5. **Codex workflow (2:35–2:55):** explain that Codex/GPT-5.6 built the contract-first service, tests, and interactive landing page, while the source and verification constraints keep claims auditable.

## Required before submission

- Create/join the dedicated neutral Devpost identity and join the Build Week challenge.
- Capture a public YouTube video under three minutes with spoken or synthesized narration covering the above points and the Codex/GPT-5.6 workflow.
- Obtain the required `/feedback` Codex session ID for the core implementation; do not invent one.
- Review the final Devpost form and rules, then obtain action-time approval before the public submission.

## Deliberate boundaries

- Do not claim sales, paid users, or live data collection.
- Do not expose the private Sites deployment URL or any credential.
- Do not self-purchase the service to fabricate traction.
- Do not claim final cash-prize eligibility or winnings; the contest is judged after the July 21, 2026 deadline.
