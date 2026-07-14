import test from "node:test";
import assert from "node:assert/strict";
import { buildQueryPlan } from "../src/query-plan.js";

test("builds a bounded, auditable query plan", () => {
  const plan = buildQueryPlan("比亚迪 电池安全");
  assert.equal(plan.topic, "比亚迪 电池安全");
  assert.equal(plan.queries.length, 12);
  assert.ok(plan.queries.some(({ query }) => query.includes("行政处罚")));
  assert.ok(plan.primary_domains.includes("samr.gov.cn"));
  assert.equal(plan.translation_traps["涉嫌"], "suspected or alleged, not proven");
});

test("rejects empty and oversized topics", () => {
  assert.throws(() => buildQueryPlan("  "), /1-160/);
  assert.throws(() => buildQueryPlan("x".repeat(161)), /1-160/);
});
