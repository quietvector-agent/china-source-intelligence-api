const TERM_SETS = {
  company: ["公司全称", "统一社会信用代码", "工商变更", "股东", "实际控制人", "年报", "公告"],
  regulation: ["行政处罚", "监管措施", "通报", "召回", "整改", "立案", "判决书"],
  product: ["实测", "故障", "事故", "投诉", "缺陷", "召回", "售后"],
  commercial: ["营收", "净利润", "毛利率", "出货量", "订单", "中标", "采购"],
  skeptical: ["争议", "质疑", "虚假宣传", "风险", "处罚", "投诉", "事故"]
};

const PRIMARY_DOMAINS = [
  "gov.cn", "miit.gov.cn", "samr.gov.cn", "stats.gov.cn", "pbc.gov.cn",
  "csrc.gov.cn", "cac.gov.cn", "cninfo.com.cn", "sse.com.cn", "szse.cn",
  "hkexnews.hk", "std.samr.gov.cn", "cnipa.gov.cn", "ccgp.gov.cn"
];

export function buildQueryPlan(topic) {
  const clean = String(topic ?? "").trim().replace(/\s+/g, " ");
  if (!clean || clean.length > 160) {
    throw new TypeError("topic must contain 1-160 characters");
  }

  const queries = Object.entries(TERM_SETS).flatMap(([lane, terms]) => [
    { lane, query: `\"${clean}\" ${terms.slice(0, 3).join(" OR ")}` },
    { lane, query: `\"${clean}\" ${terms.slice(3).join(" OR ")}` }
  ]);
  queries.push(
    { lane: "primary", query: `site:gov.cn \"${clean}\"` },
    { lane: "primary", query: `site:cninfo.com.cn \"${clean}\" 公告` }
  );

  return {
    topic: clean,
    generated_at: new Date().toISOString(),
    queries,
    primary_domains: PRIMARY_DOMAINS,
    verification_order: [
      "Resolve the exact Chinese legal entity, product, policy, or document name.",
      "Use social and secondary sources only as leads.",
      "Trace every load-bearing claim to an official record or original document.",
      "Preserve the original Chinese sentence beside the English translation.",
      "Record publication date, access date, and whether the source supports or contradicts the claim.",
      "Keep allegations, proposals, approvals, shipments, and completions as distinct states."
    ],
    translation_traps: {
      "拟": "proposed, not completed",
      "将": "will happen, not already completed",
      "涉嫌": "suspected or alleged, not proven",
      "同比": "year over year",
      "环比": "period over period",
      "营收": "revenue, not profit",
      "销量/出货量/交付量": "different metrics; do not merge"
    }
  };
}
