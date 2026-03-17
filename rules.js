"use strict";

/* =========================
   STANDARD · BASE ROLES
   ========================= */

const ROLE_DEFS_STANDARD_BASE = [
  {
    roleId: "div_income",
    fallbackLabel: "Dividend Income",
    activeAt: 60,
    checks: [
      { id:"DIVIDEND_YIELD", label:"DIVIDEND_YIELD ≥ 4%", pts:25, mode:"pct", test:v => v >= 0.04 },
      { id:"PAYOUT_RATIO", label:"PAYOUT_RATIO 30–75%", pts:20, mode:"pct", test:v => v >= 0.30 && v <= 0.75 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:15, mode:"num", test:v => v > 0 },
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"FCF_YIELD_1Y", label:"FCF_YIELD_1Y ≥ 4%", pts:10, mode:"pct", test:v => v >= 0.04 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 3", pts:10, mode:"num", test:v => v >= 3 },
      { id:"SHAREHOLDER_YIELD", label:"SHAREHOLDER_YIELD ≥ 5%", pts:10, mode:"pct", test:v => v >= 0.05 }
    ],
    malus: [
      { id:"PAYOUT_RATIO", label:"PAYOUT_RATIO > 90% (Malus)", pts:-25, mode:"pct", test:v => v > 0.90 },
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0 (Malus)", pts:-20, mode:"num", test:v => v <= 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG < 2 (Malus)", pts:-15, mode:"num", test:v => v < 2 }
    ]
  },

  {
    roleId: "div_growth",
    fallbackLabel: "Dividend Growth",
    activeAt: 60,
    checks: [
      { id:"DIVIDEND_GROWTH", label:"DIVIDEND_GROWTH ≥ 6%", pts:25, mode:"pct", test:v => v >= 0.06 },
      { id:"DIVIDEND_GROWTH_YEARS", label:"DIVIDEND_GROWTH_YEARS ≥ 5", pts:20, mode:"num", test:v => v >= 5 },
      { id:"DIVIDEND_GROWTH_YEARS", label:"DIVIDEND_GROWTH_YEARS ≥ 10 (Bonus)", pts:5, mode:"num", test:v => v >= 10 },
      { id:"PAYOUT_RATIO", label:"PAYOUT_RATIO 25–70%", pts:20, mode:"pct", test:v => v >= 0.25 && v <= 0.70 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:15, mode:"num", test:v => v > 0 },
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:5, mode:"num", test:v => v > 0 },
      { id:"SHARES_CHANGE_YOY_1Y", label:"SHARES_CHANGE_YOY_1Y ≤ 0", pts:10, mode:"pct", test:v => v <= 0 }
    ],
    malus: [
      { id:"PAYOUT_RATIO", label:"PAYOUT_RATIO > 85% (Malus)", pts:-20, mode:"pct", test:v => v > 0.85 },
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0 (Malus)", pts:-15, mode:"num", test:v => v <= 0 }
    ]
  },

  {
    roleId: "value",
    fallbackLabel: "Value",
    activeAt: 60,
    checks: [
      { id:"PE_RATIO_1Y", label:"PE_RATIO_1Y ≤ 18", pts:15, mode:"num", test:v => v <= 18 },
      { id:"FORWARD_PE_1Y", label:"FORWARD_PE_1Y ≤ 17", pts:10, mode:"num", test:v => v <= 17 },
      { id:"PB_RATIO_1Y", label:"PB_RATIO_1Y ≤ 2.5", pts:10, mode:"num", test:v => v <= 2.5 },
      { id:"P_FCF_RATIO_1Y", label:"P_FCF_RATIO_1Y ≤ 15", pts:20, mode:"num", test:v => v <= 15 },
      { id:"P_OCF_RATIO_1Y", label:"P_OCF_RATIO_1Y ≤ 14", pts:15, mode:"num", test:v => v <= 14 },
      { id:"EV_EBITDA_RATIO_1Y", label:"EV_EBITDA_RATIO_1Y ≤ 12", pts:15, mode:"num", test:v => v <= 12 },
      { id:"EARNINGS_YIELD_1Y", label:"EARNINGS_YIELD_1Y ≥ 6%", pts:10, mode:"pct", test:v => v >= 0.06 },
      { id:"FCF_YIELD_1Y", label:"FCF_YIELD_1Y ≥ 5%", pts:10, mode:"pct", test:v => v >= 0.05 },
      { id:"ROIC_1Y", label:"ROIC_1Y ≥ 8%", pts:5, mode:"pct", test:v => v >= 0.08 }
    ]
  },

  {
    roleId: "deep_value",
    fallbackLabel: "Deep Value",
    activeAt: 60,
    checks: [
      { id:"PE_RATIO_1Y", label:"PE_RATIO_1Y ≤ 12", pts:20, mode:"num", test:v => v <= 12 },
      { id:"FORWARD_PE_1Y", label:"FORWARD_PE_1Y ≤ 11", pts:10, mode:"num", test:v => v <= 11 },
      { id:"PB_RATIO_1Y", label:"PB_RATIO_1Y ≤ 1.5", pts:15, mode:"num", test:v => v <= 1.5 },
      { id:"P_FCF_RATIO_1Y", label:"P_FCF_RATIO_1Y ≤ 10", pts:20, mode:"num", test:v => v <= 10 },
      { id:"P_OCF_RATIO_1Y", label:"P_OCF_RATIO_1Y ≤ 10", pts:15, mode:"num", test:v => v <= 10 },
      { id:"EV_EBITDA_RATIO_1Y", label:"EV_EBITDA_RATIO_1Y ≤ 8", pts:15, mode:"num", test:v => v <= 8 },
      { id:"FCF_YIELD_1Y", label:"FCF_YIELD_1Y ≥ 8%", pts:10, mode:"pct", test:v => v >= 0.08 },
      { id:"EARNINGS_YIELD_1Y", label:"EARNINGS_YIELD_1Y ≥ 9%", pts:10, mode:"pct", test:v => v >= 0.09 }
    ]
  },

  {
    roleId: "growth",
    fallbackLabel: "Growth",
    activeAt: 60,
    checks: [
      { id:"REVENUE_GROWTH_YOY_1Y", label:"REVENUE_GROWTH_YOY_1Y ≥ 10%", pts:25, mode:"pct", test:v => v >= 0.10 },
      { id:"REVENUE_CAGR_4Y", label:"REVENUE_CAGR_4Y ≥ 10%", pts:20, mode:"pct", test:v => v >= 0.10 },
      { id:"EPS_GROWTH_CAGR_4Y", label:"EPS_GROWTH_CAGR_4Y ≥ 10%", pts:20, mode:"pct", test:v => v >= 0.10 },
      { id:"ROIC_1Y", label:"ROIC_1Y ≥ 10%", pts:15, mode:"pct", test:v => v >= 0.10 },
      { id:"ROA_1Y", label:"ROA_1Y ≥ 5%", pts:10, mode:"pct", test:v => v >= 0.05 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:5, mode:"num", test:v => v > 0 },
      { id:"SHARES_CHANGE_YOY_1Y", label:"SHARES_CHANGE_YOY_1Y ≤ 3%", pts:5, mode:"pct", test:v => v <= 0.03 }
    ],
    malus: [
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0 (Malus)", pts:-10, mode:"num", test:v => v <= 0 },
      { id:"SHARES_CHANGE_YOY_1Y", label:"SHARES_CHANGE_YOY_1Y > 8% (Malus)", pts:-10, mode:"pct", test:v => v > 0.08 }
    ]
  },

  {
    roleId: "garp",
    fallbackLabel: "GARP",
    activeAt: 60,
    checks: [
      { id:"REVENUE_CAGR_4Y", label:"REVENUE_CAGR_4Y ≥ 8%", pts:20, mode:"pct", test:v => v >= 0.08 },
      { id:"EPS_GROWTH_CAGR_4Y", label:"EPS_GROWTH_CAGR_4Y ≥ 8%", pts:20, mode:"pct", test:v => v >= 0.08 },
      { id:"ROIC_1Y", label:"ROIC_1Y ≥ 10%", pts:15, mode:"pct", test:v => v >= 0.10 },
      { id:"ROE_1Y", label:"ROE_1Y ≥ 12%", pts:10, mode:"pct", test:v => v >= 0.12 },
      { id:"FORWARD_PE_1Y", label:"FORWARD_PE_1Y ≤ 22", pts:10, mode:"num", test:v => v <= 22 },
      { id:"EV_EBITDA_RATIO_1Y", label:"EV_EBITDA_RATIO_1Y ≤ 18", pts:10, mode:"num", test:v => v <= 18 },
      { id:"P_OCF_RATIO_1Y", label:"P_OCF_RATIO_1Y ≤ 22", pts:5, mode:"num", test:v => v <= 22 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:10, mode:"num", test:v => v > 0 }
    ],
    customScore(ctx, { checks }, utils){
      const { clamp } = utils;
      const growthSignal = checks[0].ok || checks[1].ok;
      const qualitySignal = checks[2].ok || checks[3].ok;
      const valuationSignal = checks[4].ok || (checks[5].ok && checks[6].ok);

      return clamp(
        (growthSignal ? 35 : 0) +
        (qualitySignal ? 30 : 0) +
        (valuationSignal ? 25 : 0) +
        (checks[7].ok ? 10 : 0),
        0,
        100
      );
    },
    customWhy(ctx, { checks }){
      const growthSignal = checks[0].ok || checks[1].ok;
      const qualitySignal = checks[2].ok || checks[3].ok;
      const valuationSignal = checks[4].ok || (checks[5].ok && checks[6].ok);

      return [
        ...(growthSignal ? ["+35 · Growth-Signal"] : []),
        ...(qualitySignal ? ["+30 · Qualität"] : []),
        ...(valuationSignal ? ["+25 · Bewertung vernünftig"] : []),
        ...(checks[7].ok ? ["+10 · FCF_1Y > 0"] : [])
      ];
    }
  },

  {
    roleId: "quality_compounder",
    fallbackLabel: "Quality Compounder",
    activeAt: 60,
    checks: [
      { id:"ROIC_1Y", label:"ROIC_1Y ≥ 15%", pts:25, mode:"pct", test:v => v >= 0.15 },
      { id:"ROE_1Y", label:"ROE_1Y ≥ 15%", pts:10, mode:"pct", test:v => v >= 0.15 },
      { id:"ROA_1Y", label:"ROA_1Y ≥ 7%", pts:10, mode:"pct", test:v => v >= 0.07 },
      { id:"OPERATING_MARGIN_1Y", label:"OPERATING_MARGIN_1Y ≥ 15%", pts:15, mode:"pct", test:v => v >= 0.15 },
      { id:"FCF_MARGIN_1Y", label:"FCF_MARGIN_1Y ≥ 10%", pts:10, mode:"pct", test:v => v >= 0.10 },
      { id:"REVENUE_CAGR_4Y", label:"REVENUE_CAGR_4Y ≥ 6%", pts:10, mode:"pct", test:v => v >= 0.06 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 5", pts:10, mode:"num", test:v => v >= 5 },
      { id:"SHARES_CHANGE_YOY_1Y", label:"SHARES_CHANGE_YOY_1Y ≤ 0", pts:10, mode:"pct", test:v => v <= 0 }
    ]
  },

  {
    roleId: "pricing_power",
    fallbackLabel: "Pricing Power",
    activeAt: 60,
    checks: [
      { id:"GROSS_MARGIN_1Y", label:"GROSS_MARGIN_1Y ≥ 40%", pts:30, mode:"pct", test:v => v >= 0.40 },
      { id:"OPERATING_MARGIN_1Y", label:"OPERATING_MARGIN_1Y ≥ 20%", pts:25, mode:"pct", test:v => v >= 0.20 },
      { id:"PROFIT_MARGIN_1Y", label:"PROFIT_MARGIN_1Y ≥ 15%", pts:20, mode:"pct", test:v => v >= 0.15 },
      { id:"ROA_1Y", label:"ROA_1Y ≥ 6%", pts:10, mode:"pct", test:v => v >= 0.06 },
      { id:"REVENUE_GROWTH_YOY_1Y", label:"REVENUE_GROWTH_YOY_1Y ≥ 0%", pts:10, mode:"pct", test:v => v >= 0.00 },
      { id:"BETA", label:"BETA ≤ 1.1", pts:5, mode:"num", test:v => v <= 1.1 }
    ]
  },

  {
    roleId: "cyclical",
    fallbackLabel: "Zykliker",
    activeAt: 60,
    checks: [
      { id:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y", label:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y ≥ 35%", pts:35, mode:"pct", test:v => v >= 0.35 },
      { id:"BETA", label:"BETA ≥ 1.3", pts:20, mode:"num", test:v => v >= 1.3 },
      { id:"REVENUE_GROWTH_YOY_1Y", label:"REVENUE_GROWTH_YOY_1Y < -5%", pts:15, mode:"pct", test:v => v < -0.05 },
      { id:"REVENUE_GROWTH_YOY_1Y", label:"REVENUE_GROWTH_YOY_1Y > 20%", pts:15, mode:"pct", test:v => v > 0.20 },
      { id:"PROFIT_MARGIN_1Y", label:"PROFIT_MARGIN_1Y ≤ 3%", pts:10, mode:"pct", test:v => v <= 0.03 }
    ],
    customScore(ctx, { checks }, utils){
      const { clamp } = utils;
      const revSwing = checks[2].ok || checks[3].ok;

      return clamp(
        (checks[0].ok ? 35 : 0) +
        (checks[1].ok ? 20 : 0) +
        (revSwing ? 25 : 0) +
        (checks[4].ok ? 20 : 0),
        0,
        100
      );
    },
    customWhy(ctx, { checks }){
      const revSwing = checks[2].ok || checks[3].ok;
      return [
        ...(checks[0].ok ? ["+35 · VOLATILITAET_ANNUALISIERT_STD_ABW_10Y ≥ 35%"] : []),
        ...(checks[1].ok ? ["+20 · BETA ≥ 1.3"] : []),
        ...(revSwing ? ["+25 · Umsatz schwankt stark"] : []),
        ...(checks[4].ok ? ["+20 · PROFIT_MARGIN_1Y ≤ 5%"] : [])
      ];
    }
  },

  {
    roleId: "turnaround",
    fallbackLabel: "Turnaround",
    activeAt: 60,
    checks: [
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0", pts:20, mode:"num", test:v => v <= 0 },
      { id:"NET_INCOME_1Y", label:"NET_INCOME_1Y ≤ 0", pts:20, mode:"num", test:v => v <= 0 },
      { id:"EPS_DILUTED_1Y", label:"EPS_DILUTED_1Y ≤ 0", pts:10, mode:"num", test:v => v <= 0 },
      { id:"REVENUE_GROWTH_YOY_1Y", label:"REVENUE_GROWTH_YOY_1Y ≥ 0%", pts:20, mode:"pct", test:v => v >= 0.00 },
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:15, mode:"num", test:v => v > 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 1.5", pts:15, mode:"num", test:v => v >= 1.5 }
    ],
customScore(ctx, { checks }, utils){
  const { clamp } = utils;
  const trouble = checks[0].ok || checks[1].ok || checks[2].ok;
  const improvementCount =
    (checks[3].ok ? 1 : 0) +
    (checks[4].ok ? 1 : 0) +
    (checks[5].ok ? 1 : 0);

  return clamp(
    (trouble ? 40 : 0) +
    (improvementCount >= 2 ? 40 : 0) +
    (improvementCount === 3 ? 20 : 0),
    0,
    100
  );
},
customWhy(ctx, { checks }){
  const trouble = checks[0].ok || checks[1].ok || checks[2].ok;
  const improvementCount =
    (checks[3].ok ? 1 : 0) +
    (checks[4].ok ? 1 : 0) +
    (checks[5].ok ? 1 : 0);

  return [
    ...(trouble ? ["+40 · Ergebnis-/Cashflow-Probleme vorhanden"] : []),
    ...(improvementCount >= 2 ? [`+40 · Mehrere Verbesserungszeichen (${improvementCount}/3)`] : []),
    ...(improvementCount === 3 ? ["+20 · Alle Verbesserungszeichen erfüllt"] : [])
  ];
}
  },

  {
    roleId: "distressed",
    fallbackLabel: "Krisenfall",
    activeAt: 60,
    checks: [
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG < 1.5", pts:35, mode:"num", test:v => v < 1.5 },
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0", pts:20, mode:"num", test:v => v <= 0 },
      { id:"NET_INCOME_1Y", label:"NET_INCOME_1Y ≤ 0", pts:15, mode:"num", test:v => v <= 0 },
      { id:"CURRENT_RATIO_1Y", label:"CURRENT_RATIO_1Y < 1.0", pts:15, mode:"num", test:v => v < 1.0 },
      { id:"QUICK_RATIO_1Y", label:"QUICK_RATIO_1Y < 0.8", pts:15, mode:"num", test:v => v < 0.8 }
    ]
  },

  {
    roleId: "speculation",
    fallbackLabel: "Spekulation",
    activeAt: 60,
    checks: [
      { id:"BETA", label:"BETA ≥ 1.5", pts:20, mode:"num", test:v => v >= 1.5 },
      { id:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y", label:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y ≥ 45%", pts:20, mode:"pct", test:v => v >= 0.45 },
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0", pts:15, mode:"num", test:v => v <= 0 },
      { id:"SHARES_CHANGE_YOY_1Y", label:"SHARES_CHANGE_YOY_1Y ≥ 5%", pts:15, mode:"pct", test:v => v >= 0.05 }
    ],
    customBuild(ctx, { checks }, utils){
      const { clamp } = utils;

      const coreIds = [
        "REVENUE_GROWTH_YOY_1Y","REVENUE_CAGR_4Y","ROIC_1Y","ROA_1Y","FCF_1Y","OPERATING_CASH_FLOW_1Y",
        "INTEREST_COVERAGE_ZINSDECKUNG","P_FCF_RATIO_1Y","P_OCF_RATIO_1Y","EV_EBITDA_RATIO_1Y",
        "FCF_YIELD_1Y","EARNINGS_YIELD_1Y","PE_RATIO_1Y","FORWARD_PE_1Y",
        "PB_RATIO_1Y","ROE_1Y","PROFIT_MARGIN_1Y","OPERATING_MARGIN_1Y"
      ];

      let miss = 0;
      for(const id of coreIds){
        const hasAny = Number.isFinite(ctx.num(id)) || Number.isFinite(ctx.pct(id));
        if(!hasAny) miss++;
      }

const missingSignal = miss >= 8;
const score = clamp(
  (missingSignal ? 10 : 0) +
  (checks[0].ok ? 20 : 0) +
  (checks[1].ok ? 20 : 0) +
  (checks[2].ok ? 15 : 0) +
  (checks[3].ok ? 15 : 0),
  0,
  100
);

      return {
        score,
        checks: [
          ...checks,
          {
            id: "CORE_MISSING",
            label: `Viele Missing (core missing: ${miss}/${coreIds.length})`,
            ok: missingSignal,
            missing: false,
pts: missingSignal ? 10 : 0,
maxPts: 10,
            value: `${miss}/${coreIds.length}`
          }
        ],
        why: [
          ...(missingSignal ? [`+10 · Viele Missing (core missing: ${miss}/${coreIds.length})`] : []),
          ...(checks[0].ok ? ["+20 · BETA ≥ 1.5"] : []),
          ...(checks[1].ok ? ["+20 · VOLATILITAET_ANNUALISIERT_STD_ABW_10Y ≥ 45%"] : []),
          ...(checks[2].ok ? ["+15 · FCF_1Y ≤ 0"] : []),
          ...(checks[3].ok ? ["+15 · SHARES_CHANGE_YOY_1Y ≥ 5%"] : [])
        ]
      };
    }
  }
];

function scoreStandardRolesBase(ctx){
  return evaluateRoleRules(ctx, ROLE_DEFS_STANDARD_BASE);
}

const ROLE_DEFS_STANDARD_HEALTH = [
  {
    roleId: "balance_sheet_strong",
    fallbackLabel: "Balance Sheet Strong",
    activeAt: 60,
    checks: [
      { id:"NET_CASH_DEBT_1Y", label:"NET_CASH_DEBT_1Y > 0", pts:25, mode:"num", test:v => v > 0 },
      { id:"CURRENT_RATIO_1Y", label:"CURRENT_RATIO_1Y ≥ 1.5", pts:20, mode:"num", test:v => v >= 1.5 },
      { id:"QUICK_RATIO_1Y", label:"QUICK_RATIO_1Y ≥ 1.0", pts:15, mode:"num", test:v => v >= 1.0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 6", pts:20, mode:"num", test:v => v >= 6 },
      { id:"CASH_AND_SHORT_TERM_INVESTMENTS_1Y", label:"CASH_AND_SHORT_TERM_INVESTMENTS_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"BOOK_VALUE_PER_SHARE_1Y", label:"BOOK_VALUE_PER_SHARE_1Y > 0", pts:10, mode:"num", test:v => v > 0 }
    ]
  },

  {
    roleId: "leveraged",
    fallbackLabel: "Schuldenlastig / Leveraged",
    activeAt: 60,
    checks: [
      { id:"NET_CASH_DEBT_1Y", label:"NET_CASH_DEBT_1Y < 0", pts:25, mode:"num", test:v => v < 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG < 3", pts:25, mode:"num", test:v => v < 3 },
      { id:"CURRENT_RATIO_1Y", label:"CURRENT_RATIO_1Y < 1.2", pts:20, mode:"num", test:v => v < 1.2 },
      { id:"QUICK_RATIO_1Y", label:"QUICK_RATIO_1Y < 1.0", pts:15, mode:"num", test:v => v < 1.0 },
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0", pts:15, mode:"num", test:v => v <= 0 }
    ]
  },

  {
    roleId: "healthy",
    fallbackLabel: "Gesund",
    activeAt: 60,
    checks: [
      { id:"ROIC_1Y", label:"ROIC_1Y ≥ 10%", pts:20, mode:"pct", test:v => v >= 0.10 },
      { id:"ROE_1Y", label:"ROE_1Y ≥ 12%", pts:15, mode:"pct", test:v => v >= 0.12 },
      { id:"ROA_1Y", label:"ROA_1Y ≥ 5%", pts:10, mode:"pct", test:v => v >= 0.05 },
      { id:"PROFIT_MARGIN_1Y", label:"PROFIT_MARGIN_1Y ≥ 8%", pts:15, mode:"pct", test:v => v >= 0.08 },
      { id:"NET_INCOME_1Y", label:"NET_INCOME_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 4", pts:10, mode:"num", test:v => v >= 4 }
    ]
  },

  {
    roleId: "cashflow_strong",
    fallbackLabel: "Cashflow-stark",
    activeAt: 60,
    checks: [
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:25, mode:"num", test:v => v > 0 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:25, mode:"num", test:v => v > 0 },
      { id:"FCF_MARGIN_1Y", label:"FCF_MARGIN_1Y ≥ 10%", pts:20, mode:"pct", test:v => v >= 0.10 },
      { id:"FCF_YIELD_1Y", label:"FCF_YIELD_1Y ≥ 5%", pts:15, mode:"pct", test:v => v >= 0.05 },
      { id:"P_OCF_RATIO_1Y", label:"P_OCF_RATIO_1Y ≤ 20", pts:5, mode:"num", test:v => v <= 20 },
      { id:"P_FCF_RATIO_1Y", label:"P_FCF_RATIO_1Y ≤ 20", pts:5, mode:"num", test:v => v <= 20 },
      { id:"CAPEX_CAPITAL_EXPENDITURES_1Y", label:"CAPEX_CAPITAL_EXPENDITURES_1Y vorhanden", pts:5, mode:"num", test:v => Number.isFinite(v) }
    ]
  },

  {
    roleId: "weak_liquidity",
    fallbackLabel: "Liquidität schwach",
    activeAt: 60,
    checks: [
      { id:"CURRENT_RATIO_1Y", label:"CURRENT_RATIO_1Y < 1.2", pts:30, mode:"num", test:v => v < 1.2 },
      { id:"QUICK_RATIO_1Y", label:"QUICK_RATIO_1Y < 1.0", pts:25, mode:"num", test:v => v < 1.0 },
      { id:"NET_CASH_DEBT_1Y", label:"NET_CASH_DEBT_1Y < 0", pts:15, mode:"num", test:v => v < 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG < 3", pts:15, mode:"num", test:v => v < 3 },
      { id:"FCF_1Y", label:"FCF_1Y ≤ 0", pts:15, mode:"num", test:v => v <= 0 }
    ]
  },

  {
    roleId: "defensive",
    fallbackLabel: "Defensiv",
    activeAt: 60,
    checks: [
      { id:"BETA", label:"BETA ≤ 1.0", pts:25, mode:"num", test:v => v <= 1.0 },
      { id:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y", label:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y ≤ 30%", pts:20, mode:"pct", test:v => v <= 0.30 },
      { id:"PROFIT_MARGIN_1Y", label:"PROFIT_MARGIN_1Y ≥ 8%", pts:15, mode:"pct", test:v => v >= 0.08 },
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 4", pts:10, mode:"num", test:v => v >= 4 },
      { id:"CURRENT_RATIO_1Y", label:"CURRENT_RATIO_1Y ≥ 1.2", pts:10, mode:"num", test:v => v >= 1.2 }
    ]
  },

  {
    roleId: "stable_defensive",
    fallbackLabel: "Stabil Defensiv",
    activeAt: 60,
    checks: [
      { id:"BETA", label:"BETA ≤ 0.9", pts:20, mode:"num", test:v => v <= 0.9 },
      { id:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y", label:"VOLATILITAET_ANNUALISIERT_STD_ABW_10Y ≤ 25%", pts:20, mode:"pct", test:v => v <= 0.25 },
      { id:"OPERATING_MARGIN_1Y", label:"OPERATING_MARGIN_1Y ≥ 15%", pts:15, mode:"pct", test:v => v >= 0.15 },
      { id:"PROFIT_MARGIN_1Y", label:"PROFIT_MARGIN_1Y ≥ 10%", pts:10, mode:"pct", test:v => v >= 0.10 },
      { id:"FCF_MARGIN_1Y", label:"FCF_MARGIN_1Y ≥ 10%", pts:15, mode:"pct", test:v => v >= 0.10 },
      { id:"REVENUE_GROWTH_YOY_1Y", label:"REVENUE_GROWTH_YOY_1Y ≥ 0%", pts:5, mode:"pct", test:v => v >= 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 5", pts:10, mode:"num", test:v => v >= 5 },
      { id:"NET_CASH_DEBT_1Y", label:"NET_CASH_DEBT_1Y > 0", pts:5, mode:"num", test:v => v > 0 }
    ]
  },

  {
    roleId: "crisis_resistant",
    fallbackLabel: "Krisenfest",
    activeAt: 60,
    checks: [
      { id:"NET_CASH_DEBT_1Y", label:"NET_CASH_DEBT_1Y > 0", pts:15, mode:"num", test:v => v > 0 },
      { id:"INTEREST_COVERAGE_ZINSDECKUNG", label:"INTEREST_COVERAGE_ZINSDECKUNG ≥ 6", pts:20, mode:"num", test:v => v >= 6 },
      { id:"CURRENT_RATIO_1Y", label:"CURRENT_RATIO_1Y ≥ 1.5", pts:15, mode:"num", test:v => v >= 1.5 },
      { id:"QUICK_RATIO_1Y", label:"QUICK_RATIO_1Y ≥ 1.0", pts:10, mode:"num", test:v => v >= 1.0 },
      { id:"OPERATING_CASH_FLOW_1Y", label:"OPERATING_CASH_FLOW_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"FCF_1Y", label:"FCF_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"NET_INCOME_1Y", label:"NET_INCOME_1Y > 0", pts:10, mode:"num", test:v => v > 0 },
      { id:"PROFIT_MARGIN_1Y", label:"PROFIT_MARGIN_1Y ≥ 8%", pts:10, mode:"pct", test:v => v >= 0.08 }
    ]
  }
];

function scoreStandardRolesHealth(ctx){
  return evaluateRoleRules(ctx, ROLE_DEFS_STANDARD_HEALTH);
}

function evaluateRoleRules(ctx, defs){
  const roles = [];

  function dynId(id){
    return (typeof window.getDynamicCriteriaId === "function")
      ? window.getDynamicCriteriaId(id)
      : id;
  }

  function isFin(x){
    return Number.isFinite(x);
  }

  function clamp(v, min, max){
    return Math.max(min, Math.min(max, v));
  }

  function fmtValByMode(value, mode){
    if(mode === "str") return value || "–";
    if(!isFin(value)) return "–";
    if(mode === "pct"){
      return (value * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 }) + "%";
    }
    return value.toLocaleString("de-DE", { maximumFractionDigits: 2 });
  }

  function readValue(id, mode){
    const realId = dynId(id);
    if(mode === "pct") return ctx.pct(realId);
    if(mode === "str") return ctx.str(realId);
    return ctx.num(realId);
  }

  function makeEvalCheck(rule){
    const mode = rule.mode || "num";
    const value = readValue(rule.id, mode);
    const realId = dynId(rule.id);

    const missing =
      mode === "str"
        ? !ctx.hasValue(realId)
        : !isFin(value);

    const ok = !missing && !!rule.test(value, ctx);

    return {
      id: dynId(rule.id),
      label: rule.label,
      ok,
      missing,
      pts: ok ? (rule.pts || 0) : 0,
      maxPts: Math.abs(rule.pts || 0),
      value: fmtValByMode(value, mode)
    };
  }

  function makeEvalMalus(rule){
    const mode = rule.mode || "num";
    const value = readValue(rule.id, mode);
    const realId = dynId(rule.id);

    const missing =
      mode === "str"
        ? !ctx.hasValue(realId)
        : !isFin(value);

    const malus = !missing && !!rule.test(value, ctx);

    return {
      id: dynId(rule.id),
      label: rule.label,
      ok: false,
      missing,
      pts: 0,
      maxPts: 0,
      value: fmtValByMode(value, mode),
      malus,
      malusPts: rule.pts || 0
    };
  }

  for(const def of defs){
    const checks = (def.checks || []).map(makeEvalCheck);
    const malusChecks = (def.malus || []).map(makeEvalMalus);

    if(typeof def.customBuild === "function"){
      const custom = def.customBuild(ctx, { checks, malusChecks }, { clamp });

      const safeScore = clamp(Number(custom?.score || 0), 0, 100);

      roles.push({
        id: def.roleId,
        label: window.NUTZEN_TAXONOMY?.roleById(def.roleId)?.label || def.fallbackLabel,
        score: safeScore,
        active: safeScore >= (def.activeAt ?? 60),
        checks: Array.isArray(custom?.checks) ? custom.checks : checks,
        why: Array.isArray(custom?.why) ? custom.why : []
      });
      continue;
    }

    let score;

    if(typeof def.customScore === "function"){
      score = def.customScore(ctx, { checks, malusChecks }, { clamp });
    } else {
      score = clamp(
        checks.reduce((sum, c) => sum + (c.pts || 0), 0),
        0,
        100
      );
    }

    if(malusChecks.length){
      for(const m of malusChecks){
        if(m.malus) score += m.malusPts;
      }
      score = clamp(score, 0, 100);
    }

    let why;
    if(typeof def.customWhy === "function"){
      why = def.customWhy(ctx, { checks, malusChecks }, { clamp });
    } else {
      why = [
        ...checks.filter(c => c.ok).map(c => `+${c.pts} · ${c.label}`),
        ...malusChecks.filter(m => m.malus).map(m => `${m.malusPts} · ${m.label}`)
      ];
    }

    roles.push({
      id: def.roleId,
      label: window.NUTZEN_TAXONOMY?.roleById(def.roleId)?.label || def.fallbackLabel,
      score,
      active: score >= (def.activeAt ?? 60),
      checks: [...checks, ...malusChecks],
      why
    });
  }

  roles.sort((a, b) => b.score - a.score);
  return roles;
}

function buildStandardCategories(ctx, rolesOrBuckets){
  const categories = {};

  const combined = Array.isArray(rolesOrBuckets?.combined)
    ? rolesOrBuckets.combined
    : (Array.isArray(rolesOrBuckets) ? rolesOrBuckets : []);

  const activeRoles = combined.filter(r => r && r.active);

  const dyn = (id) =>
    (typeof window.getDynamicCriteriaId === "function")
      ? window.getDynamicCriteriaId(id)
      : id;

  const pct = (id) => ctx.pct(dyn(id));
  const num = (id) => ctx.num(dyn(id));
  const raw = (id) => ctx.raw(dyn(id));
  const isFin = (x) => Number.isFinite(x);
  const hasRole = (id) => activeRoles.some(r => r.id === id);

  function pushCategory(catId, optionId){
    if(!catId || !optionId) return;
    if(!categories[catId]) categories[catId] = [];
    if(!categories[catId].includes(optionId)){
      categories[catId].push(optionId);
    }
  }

  function finalizeCategory(catId, fallbackOptionId){
    if(!Array.isArray(categories[catId]) || categories[catId].length === 0){
      categories[catId] = [fallbackOptionId];
    }
  }

  {
    const catId = "market_style";

    if(hasRole("deep_value")) pushCategory(catId, "style_deep_value");
    if(hasRole("value")) pushCategory(catId, "style_value");
    if(hasRole("garp")) pushCategory(catId, "style_garp");
    if(hasRole("growth")) pushCategory(catId, "style_growth");
    if(hasRole("quality_compounder") || hasRole("pricing_power")) pushCategory(catId, "style_quality");
    if(hasRole("div_income") || hasRole("div_growth")) pushCategory(catId, "style_dividend");
    if(hasRole("turnaround")) pushCategory(catId, "style_turnaround");
    if(hasRole("distressed")) pushCategory(catId, "style_distressed");
    if(hasRole("speculation")) pushCategory(catId, "style_speculation");

    finalizeCategory(catId, "style_unknown");
  }

  {
    const catId = "business_model";
    const gm   = pct("GROSS_MARGIN_1Y");
    const om   = pct("OPERATING_MARGIN_1Y");
    const pm   = pct("PROFIT_MARGIN_1Y");
    const revY = pct("REVENUE_GROWTH_YOY_1Y");
    const revC = pct("REVENUE_CAGR_4Y");
    const vol  = pct("VOLATILITAET_ANNUALISIERT_STD_ABW_10Y");

    const recurring =
      ((isFin(gm) && gm >= 0.55) || hasRole("pricing_power") || hasRole("quality_compounder")) &&
      ((isFin(om) && om >= 0.18) || (isFin(pm) && pm >= 0.12)) &&
      (!isFin(vol) || vol < 0.35);

    const projectBased =
      (isFin(revY) && Math.abs(revY) >= 0.20) ||
      (isFin(vol) && vol >= 0.40) ||
      hasRole("cyclical");

    const transactionHeavy =
      (isFin(gm) && gm < 0.40) &&
      (
        (isFin(revY) && Math.abs(revY) > 0.05) ||
        (isFin(revC) && revC > 0.03)
      );

    if(recurring) pushCategory(catId, "bm_recurring");
    if(projectBased) pushCategory(catId, "bm_project");
    if(transactionHeavy) pushCategory(catId, "bm_transaction");

    finalizeCategory(catId, "bm_unknown");
  }

  {
    const catId = "margin_profile";
    const gm    = pct("GROSS_MARGIN_1Y");
    const om    = pct("OPERATING_MARGIN_1Y");
    const pm    = pct("PROFIT_MARGIN_1Y");
    const fcfm  = pct("FCF_MARGIN_1Y");

    let optionId = "mp_unknown";

    const high =
      (isFin(om) && om >= 0.20) ||
      (isFin(pm) && pm >= 0.15) ||
      (isFin(fcfm) && fcfm >= 0.15);

    const mid =
      (isFin(om) && om >= 0.10) ||
      (isFin(pm) && pm >= 0.08) ||
      (isFin(gm) && gm >= 0.30);

    const low =
      isFin(om) || isFin(pm) || isFin(gm) || isFin(fcfm);

    if(high) optionId = "mp_high";
    else if(mid) optionId = "mp_mid";
    else if(low) optionId = "mp_low";

    categories[catId] = [optionId];
  }

  {
    const catId = "leverage";
    const netCashDebt = num("NET_CASH_DEBT_1Y");
    const ic          = num("INTEREST_COVERAGE_ZINSDECKUNG");
    const curr        = num("CURRENT_RATIO_1Y");
    const quick       = num("QUICK_RATIO_1Y");

    if(isFin(netCashDebt) && netCashDebt > 0){
      pushCategory(catId, "lev_net_cash");
    }

    let debtOptionId = "lev_unknown";

    const low =
      (isFin(netCashDebt) && netCashDebt > 0) ||
      (isFin(ic) && ic >= 6 && (!isFin(curr) || curr >= 1.5));

    const mid =
      (isFin(ic) && ic >= 3) ||
      (isFin(curr) && curr >= 1.2) ||
      (isFin(quick) && quick >= 1.0);

    const high =
      (isFin(netCashDebt) && netCashDebt < 0) &&
      (
        (isFin(ic) && ic < 3) ||
        (isFin(curr) && curr < 1.2) ||
        (isFin(quick) && quick < 1.0)
      );

    if(low) debtOptionId = "lev_low";
    else if(high) debtOptionId = "lev_high";
    else if(mid) debtOptionId = "lev_mid";

    pushCategory(catId, debtOptionId);
    finalizeCategory(catId, "lev_unknown");
  }

  {
    const catId = "cashflow_type";
    const ocf   = num("OPERATING_CASH_FLOW_1Y");
    const fcf   = num("FCF_1Y");
    const fcfm  = pct("FCF_MARGIN_1Y");
    const fcfy  = pct("FCF_YIELD_1Y");
    const vol   = pct("VOLATILITAET_ANNUALISIERT_STD_ABW_10Y");
    const revY  = pct("REVENUE_GROWTH_YOY_1Y");

    if(isFin(ocf) && ocf > 0 && isFin(fcf) && fcf > 0 && isFin(fcfm) && fcfm >= 0.15){
      pushCategory(catId, "cf_cash_cow");
    }

    if(isFin(ocf) && ocf > 0 && isFin(fcf) && fcf > 0){
      pushCategory(catId, "cf_stable");
    }

    if(isFin(fcfy) && fcfy >= 0.05){
      pushCategory(catId, "cf_yield_strong");
    }

    if(isFin(fcf) && fcf > 0) pushCategory(catId, "cf_fcf_positive");
    if(isFin(fcf) && fcf <= 0) pushCategory(catId, "cf_fcf_negative");

    if((isFin(vol) && vol >= 0.35) || (isFin(revY) && Math.abs(revY) > 0.20)){
      pushCategory(catId, "cf_volatile");
    }

    finalizeCategory(catId, "cf_unknown");
  }

  {
    const catId = "cyclicality";
    const beta  = num("BETA");
    const vol   = pct("VOLATILITAET_ANNUALISIERT_STD_ABW_10Y");
    const revY  = pct("REVENUE_GROWTH_YOY_1Y");

    let optionId = "cy_unknown";

    if(
      hasRole("cyclical") ||
      (isFin(beta) && beta >= 1.5) ||
      (isFin(vol) && vol >= 0.45)
    ){
      optionId = "cy_highly";
    } else if(
      (isFin(beta) && beta >= 1.2) ||
      (isFin(vol) && vol >= 0.35) ||
      (isFin(revY) && Math.abs(revY) >= 0.20)
    ){
      optionId = "cy_cyclical";
    } else if(
      ((isFin(beta) && beta <= 0.9) || hasRole("defensive") || hasRole("stable_defensive")) &&
      (!isFin(vol) || vol <= 0.25)
    ){
      optionId = "cy_defensive";
    } else if(isFin(beta) || isFin(vol) || isFin(revY)){
      optionId = "cy_mixed";
    }

    categories[catId] = [optionId];
  }

  {
    const catId = "moat";
    const roic  = pct("ROIC_1Y");
    const roa   = pct("ROA_1Y");
    const gm    = pct("GROSS_MARGIN_1Y");
    const om    = pct("OPERATING_MARGIN_1Y");

    const strong =
      (hasRole("quality_compounder") || hasRole("pricing_power")) &&
      isFin(roic) && roic >= 0.15 &&
      ((isFin(gm) && gm >= 0.50) || (isFin(om) && om >= 0.20));

    const medium =
      (isFin(roic) && roic >= 0.10) ||
      (isFin(roa) && roa >= 0.05);

    const weak =
      isFin(roic) || isFin(roa) || isFin(gm) || isFin(om);

    if(strong) pushCategory(catId, "moat_strong");
    else if(medium) pushCategory(catId, "moat_medium");
    else if(weak) pushCategory(catId, "moat_weak");

    finalizeCategory(catId, "moat_unknown");
  }

  {
    const catId  = "dividend_profile";
    const yld    = pct("DIVIDEND_YIELD");
    const payout = pct("PAYOUT_RATIO");
    const divG   = pct("DIVIDEND_GROWTH");
    const yrs    = num("DIVIDEND_GROWTH_YEARS");
    const fcf    = num("FCF_1Y");

    const hasDividend = isFin(yld) && yld > 0;

const risky =
  ((isFin(yld) && yld >= 0.06) && ((isFin(payout) && payout > 0.75) || (isFin(fcf) && fcf <= 0))) ||
  (isFin(payout) && payout > 0.85) ||
  (isFin(fcf) && fcf <= 0);

    const growing =
      (isFin(divG) && divG >= 0.05) &&
      (isFin(yrs) && yrs >= 5);

    if(isFin(yld) && yld <= 0){
      pushCategory(catId, "div_none");
    }

    if(hasDividend && risky){
      pushCategory(catId, "div_high_risky");
    }

    if(hasDividend && growing){
      pushCategory(catId, "div_growing");
    }

    if(hasDividend && !risky && !growing){
      pushCategory(catId, "div_low_safe");
    }

    finalizeCategory(catId, "div_unknown");
  }

  {
    const catId = "profitability";
    const roe  = pct("ROE_1Y");
    const roa  = pct("ROA_1Y");
    const roic = pct("ROIC_1Y");
    const pm   = pct("PROFIT_MARGIN_1Y");

    let optionId = "prof_unknown";

    const high =
      (isFin(roic) && roic >= 0.15) ||
      (isFin(roe) && roe >= 0.18) ||
      (isFin(roa) && roa >= 0.08);

    const solid =
      (isFin(roic) && roic >= 0.10) ||
      (isFin(roe) && roe >= 0.12) ||
      (isFin(roa) && roa >= 0.05) ||
      (isFin(pm) && pm >= 0.08);

    const weak =
      isFin(roic) || isFin(roe) || isFin(roa) || isFin(pm);

    if(high) optionId = "prof_high";
    else if(solid) optionId = "prof_solid";
    else if(weak) optionId = "prof_weak";

    categories[catId] = [optionId];
  }

  {
    const catId = "balance_sheet_liquidity";
    const curr = num("CURRENT_RATIO_1Y");
    const quick = num("QUICK_RATIO_1Y");
    const ic = num("INTEREST_COVERAGE_ZINSDECKUNG");
    const netCashDebt = num("NET_CASH_DEBT_1Y");

    const strong =
      (isFin(curr) && curr >= 1.5) &&
      (isFin(quick) ? quick >= 1.0 : true) &&
      (isFin(ic) ? ic >= 6 : true);

    const weak =
      (isFin(curr) && curr < 1.2) ||
      (isFin(quick) && quick < 1.0) ||
      (isFin(ic) && ic < 3) ||
      (isFin(netCashDebt) && netCashDebt < 0);

    let optionId = "bal_unknown";

    if(strong) optionId = "bal_strong";
    else if(weak) optionId = "bal_weak";
    else if(isFin(curr) || isFin(quick) || isFin(ic) || isFin(netCashDebt)) optionId = "bal_solid";

    categories[catId] = [optionId];
  }

  {
    const catId = "valuation";
    const pe   = num("PE_RATIO_1Y");
    const fpe  = num("FORWARD_PE_1Y");
    const pfcf = num("P_FCF_RATIO_1Y");
    const pocf = num("P_OCF_RATIO_1Y");
    const eve  = num("EV_EBITDA_RATIO_1Y");
    const pb   = num("PB_RATIO_1Y");
    const ey   = pct("EARNINGS_YIELD_1Y");
    const fcfy = pct("FCF_YIELD_1Y");

    let cheapScore = 0;
    let richScore  = 0;
    let hasData = false;

    if(isFin(pe)){ hasData = true; if(pe <= 15) cheapScore++; else if(pe >= 25) richScore++; }
    if(isFin(fpe)){ hasData = true; if(fpe <= 17) cheapScore++; else if(fpe >= 28) richScore++; }
    if(isFin(pb)){ hasData = true; if(pb <= 2.5) cheapScore++; else if(pb >= 5) richScore++; }
    if(isFin(pfcf)){ hasData = true; if(pfcf <= 15) cheapScore++; else if(pfcf >= 30) richScore++; }
    if(isFin(pocf)){ hasData = true; if(pocf <= 14) cheapScore++; else if(pocf >= 25) richScore++; }
    if(isFin(eve)){ hasData = true; if(eve <= 12) cheapScore++; else if(eve >= 20) richScore++; }
    if(isFin(ey)){ hasData = true; if(ey >= 0.06) cheapScore++; else if(ey <= 0.03) richScore++; }
    if(isFin(fcfy)){ hasData = true; if(fcfy >= 0.05) cheapScore++; else if(fcfy <= 0.02) richScore++; }

    let optionId = "val_unknown";
    if(hasData){
      if(cheapScore >= 3 && cheapScore > richScore) optionId = "val_cheap";
      else if(richScore >= 3 && richScore > cheapScore) optionId = "val_expensive";
      else optionId = "val_fair";
    }

    categories[catId] = [optionId];
  }

  {
    const catId = "cap_size";
    const mc = nzNumWithSuffix(raw("MARKET_CAP"));

    let optionId = "cap_unknown";

    if(isFin(mc)){
      if(mc < 2e9) optionId = "cap_small";
      else if(mc < 10e9) optionId = "cap_mid";
      else if(mc < 200e9) optionId = "cap_large";
      else optionId = "cap_mega";
    }

    categories[catId] = [optionId];
  }

  return categories;
}

window.ROLE_DEFS_STANDARD_BASE = ROLE_DEFS_STANDARD_BASE;
window.ROLE_DEFS_STANDARD_HEALTH = ROLE_DEFS_STANDARD_HEALTH;
window.scoreStandardRolesBase = scoreStandardRolesBase;
window.scoreStandardRolesHealth = scoreStandardRolesHealth;
window.buildStandardCategories = buildStandardCategories;