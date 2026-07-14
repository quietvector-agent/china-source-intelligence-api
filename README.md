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

## Buy the packaged assets

QuietVector also sells two instant-download products through the402's public agent API:

- Full **China Source Intelligence** skill — product `prod_bdf4a4902e844db4`; seller price $29, buyer total $30.45.
- **China Rare-Earth Evidence Starter** — product `prod_2cd8d5b1b9254ba5`; seller price $5, buyer total $5.25.

Inspect a product with `GET https://api.the402.ai/v1/products/{id}`. Purchase with an x402-capable client by calling `POST https://api.the402.ai/v1/products/{id}/purchase` and retrying with the payment proof returned by the initial HTTP 402 response.

For a custom question, [China Primary-Source Research Sprint](https://the402.ai/catalog/service?id=svc_0beefffd53ac422e) is a $9 seller-price automated service. Agents pay $9.45 and call `POST https://api.the402.ai/v1/services/svc_0beefffd53ac422e/purchase` with a `question`, optional `focus`, and `output_depth` of `rapid` or `standard`.

## Revenue status

Code and local validation are not revenue. Count only USDC confirmed in the receiving wallet.
