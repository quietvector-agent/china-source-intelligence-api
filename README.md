# QuietVector China Source Intelligence API

Two small, auditable research products sold directly to agents over x402:

- `POST /v1/query-plan` — a topic-specific Mandarin query and verification plan for **$0.05 USDC**.
- `GET /v1/rare-earth-export-controls` — a four-source evidence starter bundle for **$0.50 USDC**.

Payments settle to the identity-neutral project wallet on Base. No buyer account, subscription, API key, or marketplace checkout is required.

## Run

```powershell
npm.cmd install
npm.cmd test
npm.cmd start
```

`PAY_TO`, `PORT`, and `X402_NETWORK` are optional. The default network is Base mainnet (`eip155:8453`). For testnet, set `X402_NETWORK=eip155:84532` and use a Base Sepolia receiving address.

## Validate

```powershell
curl.exe http://localhost:4021/health
curl.exe http://localhost:4021/openapi.json
curl.exe -i -X POST http://localhost:4021/v1/query-plan -H "Content-Type: application/json" -d '{"topic":"BYD battery safety"}'
```

The unpaid paid-route request must return HTTP `402` and an x402 payment challenge. The public OpenAPI document is designed for x402scan discovery.

## Revenue status

Code and local validation are not revenue. Count only USDC confirmed in the receiving wallet.
