"use strict";

/* =========================================================
   stress.js
   Nur Standard-Modus
========================================================= */

/* =========================================================
   HELPERS
========================================================= */

function stressSeverityFromScore(score){
  const s = Number(score || 0);
  if(s >= 8) return "darkbad";
  if(s >= 5) return "bad";
  if(s >= 2) return "warn";
  return "ok";
}

function stressColorFromCounts(baseC, healthC){
  const total =
    Number(baseC?.totalScore || 0) +
    Number(healthC?.totalScore || 0);

  const baseOnly = Number(baseC?.totalScore || 0);

  if(baseOnly >= 20 || total >= 30) return "darkbad";
  if(baseOnly >= 11 || total >= 17) return "bad";
  if(total >= 6) return "warn";
  return "good";
}

function stressLabel(mode){
  if(mode === "darkbad") return "Krisenmodus";
  if(mode === "bad") return "Erhöhter Stress";
  if(mode === "warn") return "Leichte Schwächen";
  return "Stabil";
}

function makeStressRule({
  id,
  label,
  mode = "num",
  missingScore = 0,
  explain = "",
  scoreIf
}){
  return { id, label, mode, missingScore, explain, scoreIf };
}

function formatRuleValue(value, mode){
  if(mode === "pct"){
    return Number.isFinite(value) ? `${(value * 100).toFixed(2)}%` : "–";
  }
  if(mode === "str"){
    return value == null || value === "" ? "–" : String(value);
  }
  return Number.isFinite(value) ? String(value) : "–";
}

function nzNumWithSuffix(raw){
  if(raw == null) return NaN;
  if(typeof raw === "number") return raw;

  const s = String(raw).trim().replace(/,/g, "");
  if(!s) return NaN;

  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*([KMBT])?$/i);
  if(!m) return Number(s);

  const num = Number(m[1]);
  const suf = (m[2] || "").toUpperCase();

  if(!Number.isFinite(num)) return NaN;
  if(suf === "K") return num * 1e3;
  if(suf === "M") return num * 1e6;
  if(suf === "B") return num * 1e9;
  if(suf === "T") return num * 1e12;
  return num;
}

function runStressRules(ctx, rules){
  const out = [];

  function dynId(id){
    return (typeof window.getDynamicCriteriaId === "function")
      ? window.getDynamicCriteriaId(id)
      : id;
  }

  for(const rule of (rules || [])){
    const realId = dynId(rule.id);

    let value;
    if(rule.mode === "pct") value = ctx.pct(realId);
    else if(rule.mode === "str") value = ctx.str(realId);
    else value = ctx.num(realId);

    const missing =
      rule.mode === "str"
        ? !ctx.hasValue(realId)
        : !Number.isFinite(value);

    if(missing){
      const score = Number(rule.missingScore || 0);
      if(score > 0){
        out.push({
          id: realId,
          label: rule.label,
          score,
          sev: stressSeverityFromScore(score),
          missing: true,
          value: "–",
          explain: rule.explain || ""
        });
      }
      continue;
    }

    const rawScore = typeof rule.scoreIf === "function"
      ? Number(rule.scoreIf(value, ctx))
      : 0;

    const score = Number.isFinite(rawScore) ? rawScore : 0;
    if(score <= 0) continue;

    out.push({
      id: realId,
      label: rule.label,
      score,
      sev: stressSeverityFromScore(score),
      missing: false,
      value: formatRuleValue(value, rule.mode || "num"),
      explain: rule.explain || ""
    });
  }

  return out;
}

function sumStressScore(triggers){
  return (triggers || []).reduce((sum, t) => sum + Number(t.score || 0), 0);
}

/* =========================================================
   STANDARD BASE STRESS
   Existenz / Bilanz / Liquidität / Cash / Verschuldung
========================================================= */

const STRESS_RULES_STANDARD_BASE = [
  makeStressRule({
    id: "REVENUE_1Y",
    label: "Umsatzbasis schwach",
    mode: "num",
    missingScore: 2,
    explain: "Ohne positive Umsatzbasis ist das operative Fundament schwach oder unklar.",
    scoreIf: v => v <= 0 ? 6 : 0
  }),

  makeStressRule({
    id: "NET_INCOME_1Y",
    label: "Nettogewinn negativ",
    mode: "num",
    missingScore: 0,
    explain: "Verluste schwächen Innenfinanzierung und Stabilität.",
    scoreIf: v => v < 0 ? 5 : 0
  }),

  makeStressRule({
    id: "EPS_DILUTED_1Y",
    label: "EPS negativ",
    mode: "num",
    missingScore: 0,
    explain: "Negatives Ergebnis je Aktie ist ein klares Profitabilitätssignal.",
    scoreIf: v => v < 0 ? 4 : 0
  }),

  makeStressRule({
    id: "EBITDA_1Y",
    label: "EBITDA negativ",
    mode: "num",
    missingScore: 1,
    explain: "Negatives EBITDA zeigt operative Schwäche vor Zinsen, Steuern und Abschreibungen.",
    scoreIf: v => v < 0 ? 7 : 0
  }),

  makeStressRule({
    id: "OPERATING_CASH_FLOW_1Y",
    label: "Operativer Cashflow negativ",
    mode: "num",
    missingScore: 2,
    explain: "Negativer operativer Cashflow ist ein starkes Warnsignal im Kerngeschäft.",
    scoreIf: v => v < 0 ? 7 : 0
  }),

  makeStressRule({
    id: "FCF_1Y",
    label: "Freier Cashflow negativ",
    mode: "num",
    missingScore: 2,
    explain: "Negativer freier Cashflow erhöht den Finanzierungsbedarf von außen.",
    scoreIf: v => v < 0 ? 5 : 0
  }),

  makeStressRule({
    id: "INTEREST_COVERAGE_ZINSDECKUNG",
    label: "Zinsdeckung kritisch",
    mode: "num",
    missingScore: 2,
    explain: "Schwache Zinsdeckung macht Schulden deutlich riskanter.",
    scoreIf: v => v < 1 ? 8 : v < 2 ? 6 : v < 4 ? 3 : 0
  }),

  makeStressRule({
    id: "TOTAL_DEBT_1Y",
    label: "Schulden hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Schulden erhöhen Krisen- und Refinanzierungsrisiken.",
    scoreIf: (v, ctx) => {
      const ebitda = ctx.num("EBITDA_1Y");
      if(!(Number.isFinite(v) && v > 0 && Number.isFinite(ebitda) && ebitda > 0)) return 0;
      const ratio = v / ebitda;
      return ratio >= 6 ? 8 : ratio >= 4 ? 5 : ratio >= 2.5 ? 2 : 0;
    }
  }),

  makeStressRule({
    id: "QUICK_RATIO_1Y",
    label: "Quick Ratio schwach",
    mode: "num",
    missingScore: 0,
    explain: "Niedrige Quick Ratio zeigt knappe schnell verfügbare Mittel.",
    scoreIf: v => v < 0.7 ? 5 : v < 1.0 ? 2 : 0
  }),

  makeStressRule({
    id: "CURRENT_RATIO_1Y",
    label: "Current Ratio schwach",
    mode: "num",
    missingScore: 0,
    explain: "Schwache kurzfristige Liquidität reduziert den Puffer für laufende Verpflichtungen.",
    scoreIf: v => v < 0.8 ? 7 : v < 1.0 ? 5 : v < 1.3 ? 2 : 0
  }),

  makeStressRule({
    id: "TOTAL_DEBT_1Y",
    label: "Schulden gegenüber Liquidität hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Schulden relativ zu Cash erhöhen den Bilanzstress.",
    scoreIf: (v, ctx) => {
      const cash = ctx.num("CASH_AND_SHORT_TERM_INVESTMENTS_1Y");
      const sti  = ctx.num("SHORT_TERM_INVESTMENTS_1Y");

      let liquid = NaN;
      if(Number.isFinite(cash)) liquid = cash;
      else if(Number.isFinite(sti)) liquid = sti;

      if(!(Number.isFinite(v) && v > 0 && Number.isFinite(liquid) && liquid >= 0)) return 0;

      const ratio = liquid > 0 ? v / liquid : Infinity;
      return ratio >= 4 ? 5 : ratio >= 2 ? 2 : 0;
    }
  }),

  makeStressRule({
    id: "NET_CASH_DEBT_1Y",
    label: "Nettoliquidität negativ",
    mode: "num",
    missingScore: 0,
    explain: "Negative Nettoliquidität bedeutet mehr Schulden als liquide Mittel.",
    scoreIf: v => v < 0 ? 3 : 0
  }),

  makeStressRule({
    id: "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
    label: "Cash-Reserve schwach",
    mode: "num",
    missingScore: 0,
    explain: "Niedrige liquide Mittel reduzieren den Puffer in Stressphasen.",
    scoreIf: (v, ctx) => {
      const debt = ctx.num("TOTAL_DEBT_1Y");
      if(!(Number.isFinite(v) && v >= 0 && Number.isFinite(debt) && debt > 0)) return 0;
      const cov = v / debt;
      return cov < 0.15 ? 5 : cov < 0.35 ? 2 : 0;
    }
  }),

  makeStressRule({
    id: "BOOK_VALUE_PER_SHARE_1Y",
    label: "Buchwert je Aktie negativ oder null",
    mode: "num",
    missingScore: 0,
    explain: "Ein sehr schwacher oder negativer Buchwert kann auf Bilanzprobleme hindeuten.",
    scoreIf: v => v <= 0 ? 4 : 0
  })
];

/* =========================================================
   STANDARD HEALTH STRESS
   Wachstum / Profitabilität / Kapitalrendite / Aktionär / Markt
========================================================= */

const STRESS_RULES_STANDARD_HEALTH = [
  makeStressRule({
    id: "REVENUE_GROWTH_YOY_1Y",
    label: "Umsatzwachstum schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Schwaches oder negatives Umsatzwachstum kann auf operative Probleme hindeuten.",
    scoreIf: v => v < -0.10 ? 5 : v < 0.03 ? 2 : 0
  }),

  makeStressRule({
    id: "REVENUE_CAGR_4Y",
    label: "Mehrjahreswachstum schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Schwache Umsatzdynamik über mehrere Jahre spricht für ein zäheres Geschäftsmodell.",
    scoreIf: v => v < 0 ? 4 : v < 0.04 ? 2 : 0
  }),

  makeStressRule({
    id: "NET_INCOME_GROWTH_1Y",
    label: "Nettogewinnwachstum schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Schwaches Gewinnwachstum zeigt begrenzte Ergebnisdynamik.",
    scoreIf: v => v < -0.15 ? 5 : v < 0.03 ? 2 : 0
  }),

  makeStressRule({
    id: "EPS_GROWTH_CAGR_4Y",
    label: "EPS-Wachstum schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Schwaches Gewinnwachstum je Aktie zeigt begrenzte Ergebnisdynamik.",
    scoreIf: v => v < 0 ? 4 : v < 0.05 ? 2 : 0
  }),

  makeStressRule({
    id: "SHARES_CHANGE_YOY_1Y",
    label: "Verwässerung hoch",
    mode: "pct",
    missingScore: 0,
    explain: "Eine steigende Aktienanzahl verwässert Gewinn und Cashflow pro Aktie.",
    scoreIf: v => v >= 0.08 ? 4 : v >= 0.03 ? 2 : 0
  }),

  makeStressRule({
    id: "GROSS_MARGIN_1Y",
    label: "Bruttomarge schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Eine niedrige Bruttomarge verringert den Puffer vor operativen Kosten.",
    scoreIf: v => v < 0.15 ? 4 : v < 0.25 ? 2 : 0
  }),

  makeStressRule({
    id: "OPERATING_MARGIN_1Y",
    label: "Operative Marge schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Eine niedrige operative Marge deutet auf schwächere Kernertragskraft hin.",
    scoreIf: v => v < 0 ? 5 : v < 0.08 ? 2 : 0
  }),

  makeStressRule({
    id: "PROFIT_MARGIN_1Y",
    label: "Nettomarge schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Sehr niedrige oder negative Nettomargen zeigen geringen Ergebnispuffer.",
    scoreIf: v => v < 0 ? 5 : v < 0.05 ? 2 : 0
  }),

  makeStressRule({
    id: "FCF_MARGIN_1Y",
    label: "FCF-Marge schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Schwache FCF-Marge zeigt geringe Umwandlung von Umsatz in freien Cashflow.",
    scoreIf: v => v < 0 ? 5 : v < 0.05 ? 2 : 0
  }),

  makeStressRule({
    id: "EBITDA_MARGIN_1Y",
    label: "EBITDA-Marge schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Niedrige EBITDA-Marge bedeutet wenig operativen Puffer vor Abschreibungen und Zinsen.",
    scoreIf: v => v < 0.08 ? 3 : v < 0.15 ? 1 : 0
  }),

  makeStressRule({
    id: "ROE_1Y",
    label: "ROE schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Niedrige Eigenkapitalrendite spricht für schwächere Profitabilität aus Aktionärssicht.",
    scoreIf: v => v < 0.05 ? 4 : v < 0.10 ? 2 : 0
  }),

  makeStressRule({
    id: "ROA_1Y",
    label: "ROA schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Eine niedrige Kapitalnutzung deutet auf geringe operative Effizienz hin.",
    scoreIf: v => v < 0.02 ? 3 : v < 0.04 ? 1 : 0
  }),

  makeStressRule({
    id: "ROIC_1Y",
    label: "ROIC schwach",
    mode: "pct",
    missingScore: 2,
    explain: "Niedrige Kapitalrendite spricht für schwächere Geschäftsqualität oder Kapitalallokation.",
    scoreIf: v => v < 0.04 ? 5 : v < 0.10 ? 2 : 0
  }),

  makeStressRule({
    id: "FCF_YIELD_1Y",
    label: "FCF Yield schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Sehr niedrige freie Cashflow-Rendite zeigt wenig Cash relativ zur Bewertung.",
    scoreIf: v => v < 0.02 ? 3 : v < 0.04 ? 1 : 0
  }),

  makeStressRule({
    id: "EARNINGS_YIELD_1Y",
    label: "Earnings Yield schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Eine sehr niedrige Gewinnrendite lässt wenig Bewertungs-Puffer.",
    scoreIf: v => v < 0.03 ? 2 : 0
  }),

  makeStressRule({
    id: "PE_RATIO_1Y",
    label: "PE Ratio hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Bewertung reduziert den Sicherheitsabstand.",
    scoreIf: v => v >= 30 ? 2 : v >= 22 ? 1 : 0
  }),

  makeStressRule({
    id: "FORWARD_PE_1Y",
    label: "Forward PE hoch",
    mode: "num",
    missingScore: 0,
    explain: "Auch auf Forward-Basis kann eine hohe Bewertung den Puffer reduzieren.",
    scoreIf: v => v >= 28 ? 2 : v >= 20 ? 1 : 0
  }),

  makeStressRule({
    id: "PS_RATIO_1Y",
    label: "P/S hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Umsatzbewertung erhöht das Rückschlagrisiko, ist aber kein harter operativer Stress.",
    scoreIf: v => v >= 8 ? 2 : v >= 5 ? 1 : 0
  }),

  makeStressRule({
    id: "PB_RATIO_1Y",
    label: "P/B hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Bewertung auf Buchwertbasis reduziert den Bewertungs-Puffer.",
    scoreIf: v => v >= 5 ? 2 : v >= 3 ? 1 : 0
  }),

  makeStressRule({
    id: "P_FCF_RATIO_1Y",
    label: "P/FCF hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Bewertung erhöht das Rückschlagrisiko, ist aber kein harter operativer Stress.",
    scoreIf: v => v >= 35 ? 2 : v >= 25 ? 1 : 0
  }),

  makeStressRule({
    id: "P_OCF_RATIO_1Y",
    label: "P/OCF hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe Bewertung relativ zum operativen Cashflow ist nur ein weiches Warnsignal.",
    scoreIf: v => v >= 28 ? 2 : v >= 20 ? 1 : 0
  }),

  makeStressRule({
    id: "EV_SALES_RATIO_1Y",
    label: "EV/Sales hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe EV/Sales-Bewertung reduziert den Bewertungs-Puffer.",
    scoreIf: v => v >= 8 ? 2 : v >= 5 ? 1 : 0
  }),

  makeStressRule({
    id: "EV_EBITDA_RATIO_1Y",
    label: "EV/EBITDA hoch",
    mode: "num",
    missingScore: 0,
    explain: "Hohe EV/EBITDA-Bewertung reduziert den Bewertungs-Puffer.",
    scoreIf: v => v >= 20 ? 2 : v >= 14 ? 1 : 0
  }),

  makeStressRule({
    id: "DIVIDEND_YIELD",
    label: "Dividendenrendite auffällig hoch",
    mode: "pct",
    missingScore: 0,
    explain: "Eine sehr hohe Rendite kann ein Warnsignal für Kursdruck oder Dividendenrisiken sein.",
    scoreIf: (v, ctx) => {
      const payout = ctx.pct("PAYOUT_RATIO");
      if(v >= 0.08 && (!Number.isFinite(payout) || payout > 0.75)) return 4;
      if(v >= 0.06) return 2;
      return 0;
    }
  }),

  makeStressRule({
    id: "PAYOUT_RATIO",
    label: "Payout Ratio hoch",
    mode: "pct",
    missingScore: 0,
    explain: "Eine hohe Ausschüttungsquote reduziert die Sicherheit der Dividende.",
    scoreIf: v => v >= 1.0 ? 4 : v >= 0.80 ? 2 : 0
  }),

  makeStressRule({
    id: "DIVIDEND_GROWTH",
    label: "Dividendenwachstum schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Schwaches oder negatives Dividendenwachstum ist ein weicheres Qualitätssignal.",
    scoreIf: v => v < 0 ? 3 : v < 0.03 ? 1 : 0
  }),

  makeStressRule({
    id: "DIVIDEND_GROWTH_YEARS",
    label: "Dividendenhistorie schwach",
    mode: "num",
    missingScore: 0,
    explain: "Wenig Historie bei Dividendenwachstum ist ein weiches Signal.",
    scoreIf: v => v <= 0 ? 1 : 0
  }),

  makeStressRule({
    id: "BUYBACK_YIELD",
    label: "Buyback Yield negativ",
    mode: "pct",
    missingScore: 0,
    explain: "Negativer Buyback Yield deutet eher auf Verwässerung als auf Rückkäufe hin.",
    scoreIf: v => v < 0 ? 2 : 0
  }),

  makeStressRule({
    id: "SHAREHOLDER_YIELD",
    label: "Shareholder Yield schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Ein negativer Shareholder Yield ist ein weiches Aktionärssignal.",
    scoreIf: v => v < 0 ? 2 : 0
  }),

  makeStressRule({
    id: "PAYMENT_FREQUENCY",
    label: "Ausschüttungsfrequenz auffällig",
    mode: "str",
    missingScore: 0,
    explain: "Irreguläre oder variable Ausschüttungen sind etwas unsicherer als planbare Dividenden.",
    scoreIf: v => {
      const s = String(v || "").trim().toLowerCase();
      if(!s) return 0;

      if(
        s.includes("irregular") ||
        s.includes("variable") ||
        s.includes("none") ||
        s.includes("no dividend") ||
        s === "n/a" ||
        s === "na"
      ) return 2;

      return 0;
    }
  }),

  makeStressRule({
    id: "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
    label: "Volatilität hoch",
    mode: "pct",
    missingScore: 0,
    explain: "Hohe Volatilität ist eher ein Markt- als ein Bilanzsignal.",
    scoreIf: v => v >= 0.50 ? 3 : v >= 0.30 ? 1 : 0
  }),

  makeStressRule({
    id: "BETA",
    label: "Beta erhöht",
    mode: "num",
    missingScore: 0,
    explain: "Ein hohes Beta zeigt stärkere Schwankungen relativ zum Markt.",
    scoreIf: v => v >= 1.6 ? 2 : v >= 1.15 ? 1 : 0
  }),

  makeStressRule({
    id: "PRICE_CAGR_4Y",
    label: "Kurs-CAGR schwach",
    mode: "pct",
    missingScore: 0,
    explain: "Eine schwache Mehrjahres-Kursentwicklung ist nur ein weiches Marktsignal.",
    scoreIf: v => v < 0 ? 1 : 0
  }),

  makeStressRule({
    id: "RANGE_52W",
    label: "Kurs nahe 52W-Tief",
    mode: "str",
    missingScore: 0,
    explain: "Ein Kurs nahe dem 52-Wochen-Tief ist ein Marktwarnsignal.",
    scoreIf: (_v, ctx) => {
      const range = ctx.range("RANGE_52W");
      const price = ctx.num("KURS_CLOSE_AKTUELL");
      if(!range || !Number.isFinite(price)) return 0;

      const span = range.high - range.low;
      if(!(Number.isFinite(span) && span > 0)) return 0;

      const pos = (price - range.low) / span;
      return pos <= 0.10 ? 2 : 0;
    }
  }),

  makeStressRule({
    id: "MARKET_CAP",
    label: "Marktkapitalisierung sehr klein",
    mode: "num",
    missingScore: 0,
    explain: "Sehr kleine Unternehmen sind oft anfälliger für operative und finanzielle Schocks.",
    scoreIf: (_v, ctx) => {
      const raw = ctx.raw("MARKET_CAP");
      const mc = nzNumWithSuffix(raw);
      if(!Number.isFinite(mc)) return 0;
      return mc < 1e9 ? 2 : 0;
    }
  }),

  makeStressRule({
    id: "FAIR_VALUE",
    label: "Kurs klar über Fair Value",
    mode: "num",
    missingScore: 0,
    explain: "Eine deutliche Überbewertung ist kein operativer Stress, reduziert aber den Puffer.",
    scoreIf: (v, ctx) => {
      const price = ctx.num("KURS_CLOSE_AKTUELL");
      if(!(Number.isFinite(v) && v > 0 && Number.isFinite(price) && price > 0)) return 0;
      const premium = price / v - 1;
      return premium >= 0.50 ? 2 : premium >= 0.25 ? 1 : 0;
    }
  })
];

/* =========================================================
   STANDARD WRAPPER
========================================================= */

function scoreStandardStressBase(ctx){
  return runStressRules(ctx, STRESS_RULES_STANDARD_BASE);
}

function scoreStandardStressHealth(ctx){
  return runStressRules(ctx, STRESS_RULES_STANDARD_HEALTH);
}

function evalStressForCurrentSector(snapshotArg){
  const snap = snapshotArg || null;
  const ctx = snap?.ctx || buildNutzenCtxFromTableMap(tableToMap());

  const modeObj = typeof getMode === "function" ? getMode() : null;

  const baseFn = modeObj?.stress?.base;
  const healthFn = modeObj?.stress?.health;

  const baseRaw = typeof baseFn === "function" ? baseFn(ctx) : [];
  const healthRaw = typeof healthFn === "function" ? healthFn(ctx) : [];

  const baseTriggers = Array.isArray(baseRaw) ? baseRaw : [];
  const healthTriggers = Array.isArray(healthRaw) ? healthRaw : [];

  const baseScore = sumStressScore(baseTriggers);
  const healthScore = sumStressScore(healthTriggers);
  const totalScore = baseScore + healthScore;

  const baseC = {
    totalScore: baseScore,
    triggerCount: baseTriggers.length
  };

  const healthC = {
    totalScore: healthScore,
    triggerCount: healthTriggers.length
  };

  const modeColor = stressColorFromCounts(baseC, healthC);

  return {
    mode: modeColor,
    label: stressLabel(modeColor),
    baseTriggers,
    healthTriggers,
    score: {
      base: baseC,
      health: healthC,
      total: totalScore
    }
  };
}

/* =========================================================
   EXPORTS
========================================================= */

window.STRESS_RULES_STANDARD_BASE = STRESS_RULES_STANDARD_BASE;
window.STRESS_RULES_STANDARD_HEALTH = STRESS_RULES_STANDARD_HEALTH;

window.scoreStandardStressBase = scoreStandardStressBase;
window.scoreStandardStressHealth = scoreStandardStressHealth;

window.evalStressForCurrentSector = evalStressForCurrentSector;
window.sumStressScore = sumStressScore;

window.stressSeverityFromScore = stressSeverityFromScore;
window.stressColorFromCounts = stressColorFromCounts;
window.stressLabel = stressLabel;