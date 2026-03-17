"use strict";

/* =========================
   FAIR VALUE · STANDARD
   FINAL
   ========================= */

/* ---------------------------------------------------------
   CORE HELPERS
--------------------------------------------------------- */

function firstFiniteNum(ctx, ids){
  for(const id of (ids || [])){
    const v = ctx?.num?.(id);
    if(Number.isFinite(v)) return v;
  }
  return NaN;
}

function firstFinitePct(ctx, ids){
  for(const id of (ids || [])){
    const v = ctx?.pct?.(id);
    if(Number.isFinite(v)) return v;
  }
  return NaN;
}

function finitePositive(n){
  return Number.isFinite(n) && n > 0;
}

function finiteNonNegative(n){
  return Number.isFinite(n) && n >= 0;
}

function safeMedian(arr){
  return medianFinite((arr || []).filter(Number.isFinite));
}

function avgFinite(arr){
  const a = (arr || []).filter(Number.isFinite);
  if(!a.length) return NaN;
  return a.reduce((s, x) => s + x, 0) / a.length;
}
function sanitizeFairValueRange(range, priceNow){
  if(!range) return { low: NaN, base: NaN, high: NaN };

  let low  = Number(range.low);
  let base = Number(range.base);
  let high = Number(range.high);

  if(!(Number.isFinite(low) && low > 0)) low = NaN;
  if(!(Number.isFinite(base) && base > 0)) base = NaN;
  if(!(Number.isFinite(high) && high > 0)) high = NaN;

  if(Number.isFinite(low) && Number.isFinite(base) && low > base){
    const t = low; low = base; base = t;
  }
  if(Number.isFinite(base) && Number.isFinite(high) && base > high){
    const t = base; base = high; high = t;
  }
  if(Number.isFinite(low) && Number.isFinite(high) && low > high){
    const t = low; low = high; high = t;
  }

  // Schutz gegen absurde Ausreißer
  if(Number.isFinite(priceNow) && priceNow > 0){
    const maxFair = priceNow * 5.0;
    const minFair = priceNow * 0.20;

    if(Number.isFinite(low)  && (low  < minFair || low  > maxFair)) low  = NaN;
    if(Number.isFinite(base) && (base < minFair || base > maxFair)) base = NaN;
    if(Number.isFinite(high) && (high < minFair || high > maxFair)) high = NaN;
  }

  return { low, base, high };
}

function isReasonablePerShareValue(v, priceNow){
  if(!(Number.isFinite(v) && v > 0)) return false;
  if(Number.isFinite(priceNow) && priceNow > 0){
    if(v > priceNow * 5.0) return false;
    if(v < priceNow * 0.20) return false;
  }
  return true;
}


/* ---------------------------------------------------------
   DCF PRESETS / UI
--------------------------------------------------------- */

const DCF_PRESETS = {
  eu:         { label: "EU",          rf: 3.00, erp: 5.00, gT: 2.00 },
  usa:        { label: "USA",         rf: 4.00, erp: 5.00, gT: 2.50 },
  middleeast: { label: "Middle East", rf: 5.00, erp: 6.50, gT: 2.50 },
  china:      { label: "China",       rf: 3.50, erp: 6.00, gT: 2.00 },
  defensive:  { label: "Defensiv",    rf: 4.00, erp: 6.00, gT: 1.50 },
  normal:     { label: "Normal",      rf: 3.50, erp: 5.50, gT: 2.00 },
  aggressive: { label: "Aggressiv",   rf: 3.00, erp: 4.50, gT: 3.00 }
};

function readDcfSettingsFromUI(){
  const presetSel = el("ovDcfPreset");
  const preset = presetSel?.value || "custom";

  const def = DCF_PRESETS.eu;

  const rfPct  = readPctInput("ovRf", def.rf);
  const erpPct = readPctInput("ovErp", def.erp);
  const gTPct  = readPctInput("ovGt", def.gT);

  const yEl = el("ovYears");
  let years = Number.isFinite(nzNumInput(yEl?.value)) ? Math.round(nzNumInput(yEl.value)) : 5;
  years = Math.max(1, Math.min(30, years));

  return {
    preset,
    rf: rfPct / 100,
    erp: erpPct / 100,
    gT: gTPct / 100,
    years
  };
}

function applyDcfPreset(key){
  const p = DCF_PRESETS?.[key];
  if(!p) return;

  const rfEl  = el("ovRf");
  const erpEl = el("ovErp");
  const gtEl  = el("ovGt");

  if(rfEl) rfEl.value = String(p.rf).replace(".", ",");
  if(erpEl) erpEl.value = String(p.erp).replace(".", ",");
  if(gtEl) gtEl.value = String(p.gT).replace(".", ",");
}

function readValuationPresetFromUI(){
  const cfg = (typeof readDcfSettingsFromUI === "function")
    ? readDcfSettingsFromUI()
    : { preset: "custom", erp: 0.055 };

  const preset = cfg?.preset || "custom";

  const base = (
    preset === "defensive" ? { pe: 14, pb: 1.4, pfcf: 12, pocf: 11, ps: 1.8 } :
    preset === "aggressive" ? { pe: 24, pb: 2.6, pfcf: 20, pocf: 18, ps: 3.2 } :
                              { pe: 18, pb: 1.9, pfcf: 16, pocf: 14, ps: 2.4 }
  );

  const erp = Number.isFinite(cfg?.erp) ? clamp(cfg.erp, 0.03, 0.10) : 0.055;
  const erpFactor = clamp(0.055 / erp, 0.70, 1.25);

  return { preset, base, erp, erpFactor };
}

/* ---------------------------------------------------------
   QUALITY / RISK
--------------------------------------------------------- */

function computeQualityRiskAdjust(ctx){
  const revenueGrowth     = ctx.pct("REVENUE_GROWTH_YOY_1Y");
  const netIncomeGrowth   = ctx.pct("NET_INCOME_GROWTH_1Y");
  const epsGrowth4Y       = ctx.pct("EPS_GROWTH_CAGR_4Y");
  const grossMargin       = ctx.pct("GROSS_MARGIN_1Y");
  const opMargin          = ctx.pct("OPERATING_MARGIN_1Y");
  const profitMargin      = ctx.pct("PROFIT_MARGIN_1Y");
  const fcfMargin         = ctx.pct("FCF_MARGIN_1Y");
  const roe               = ctx.pct("ROE_1Y");
  const roa               = ctx.pct("ROA_1Y");
  const roic              = ctx.pct("ROIC_1Y");
  const sharesChange      = ctx.pct("SHARES_CHANGE_YOY_1Y");
  const beta              = ctx.num("BETA");
  const netCashDebt       = ctx.num("NET_CASH_DEBT_1Y");
  const totalDebt         = ctx.num("TOTAL_DEBT_1Y");
  const cashShort         = ctx.num("CASH_AND_SHORT_TERM_INVESTMENTS_1Y");
  const shortTermInvest   = ctx.num("SHORT_TERM_INVESTMENTS_1Y");
  const quickRatio        = ctx.num("QUICK_RATIO_1Y");
  const currentRatio      = ctx.num("CURRENT_RATIO_1Y");
  const interestCoverage  = ctx.num("INTEREST_COVERAGE_ZINSDECKUNG");

  const liquidityAnchor =
    Number.isFinite(cashShort) ? cashShort :
    Number.isFinite(shortTermInvest) ? shortTermInvest :
    NaN;

  let q = 1.0;

  if(Number.isFinite(revenueGrowth)){
    if(revenueGrowth >= 0.10) q += 0.05;
    else if(revenueGrowth >= 0.05) q += 0.03;
    else if(revenueGrowth < -0.05) q -= 0.05;
  }

  if(Number.isFinite(netIncomeGrowth)){
    if(netIncomeGrowth >= 0.10) q += 0.05;
    else if(netIncomeGrowth < -0.10) q -= 0.06;
  }

  if(Number.isFinite(epsGrowth4Y)){
    if(epsGrowth4Y >= 0.12) q += 0.07;
    else if(epsGrowth4Y >= 0.06) q += 0.04;
    else if(epsGrowth4Y < 0) q -= 0.08;
  }

  if(Number.isFinite(grossMargin)){
    if(grossMargin >= 0.50) q += 0.03;
    else if(grossMargin < 0.20) q -= 0.03;
  }

  if(Number.isFinite(opMargin)){
    if(opMargin >= 0.20) q += 0.05;
    else if(opMargin >= 0.10) q += 0.02;
    else if(opMargin < 0.05) q -= 0.06;
  }

  if(Number.isFinite(profitMargin)){
    if(profitMargin >= 0.15) q += 0.04;
    else if(profitMargin < 0.03) q -= 0.06;
  }

  if(Number.isFinite(fcfMargin)){
    if(fcfMargin >= 0.10) q += 0.05;
    else if(fcfMargin >= 0.05) q += 0.02;
    else if(fcfMargin < 0.02) q -= 0.05;
  }

  if(Number.isFinite(roic)){
    if(roic >= 0.15) q += 0.07;
    else if(roic >= 0.10) q += 0.04;
    else if(roic < 0.05) q -= 0.06;
  }

  if(Number.isFinite(roe)){
    if(roe >= 0.18) q += 0.04;
    else if(roe < 0.08) q -= 0.04;
  }

  if(Number.isFinite(roa)){
    if(roa >= 0.08) q += 0.03;
    else if(roa < 0.03) q -= 0.03;
  }

  if(Number.isFinite(sharesChange)){
    if(sharesChange <= -0.02) q += 0.04;
    else if(sharesChange >= 0.03) q -= 0.05;
  }

  q = clamp(q, 0.85, 1.22);

  let r = 1.0;

  if(Number.isFinite(beta)){
    if(beta >= 1.5) r -= 0.12;
    else if(beta >= 1.2) r -= 0.06;
  }

  if(Number.isFinite(quickRatio)){
    if(quickRatio < 1.0) r -= 0.04;
    if(quickRatio < 0.7) r -= 0.03;
  }

  if(Number.isFinite(currentRatio)){
    if(currentRatio < 1.0) r -= 0.03;
  }

  if(Number.isFinite(interestCoverage)){
    if(interestCoverage < 5) r -= 0.05;
    if(interestCoverage < 2.5) r -= 0.06;
  }

  if(Number.isFinite(totalDebt) && Number.isFinite(liquidityAnchor) && totalDebt > liquidityAnchor * 2){
    r -= 0.05;
  }

  if(Number.isFinite(netCashDebt)){
    if(netCashDebt < 0) r -= 0.03;
    if(netCashDebt < -0.25 * Math.max(1, Math.abs(totalDebt || 0))) r -= 0.03;
  }

  r = clamp(r, 0.78, 1.00);

  return {
    qualityFactor: q,
    riskFactor: r,
    totalFactor: clamp(q * r, 0.70, 1.25)
  };
}

/* ---------------------------------------------------------
   DCF HELPERS
--------------------------------------------------------- */

function chooseBaseCashflowForDcf(ctx){
  const fcf = ctx.num("FCF_1Y");
  const ocf = ctx.num("OPERATING_CASH_FLOW_1Y");
  const capex = ctx.num("CAPEX_CAPITAL_EXPENDITURES_1Y");

  const ownerEarnings =
    Number.isFinite(ocf) && Number.isFinite(capex)
      ? (ocf - Math.abs(capex))
      : NaN;

  if(finitePositive(fcf)){
    return { key: "FCF_1Y", value: fcf, ownerEarnings };
  }

  if(finitePositive(ownerEarnings)){
    return { key: "OWNER_EARNINGS", value: ownerEarnings, ownerEarnings };
  }

  if(finitePositive(ocf)){
    const conservative = ocf * 0.70;
    return { key: "OCF_PROXY", value: conservative, ownerEarnings };
  }

  return { key: "NONE", value: NaN, ownerEarnings };
}

function chooseGrowthForDcf(ctx){
  const revCagr = firstFinitePct(ctx, ["REVENUE_CAGR_4Y"]);
  const epsCagr = firstFinitePct(ctx, ["EPS_GROWTH_CAGR_4Y"]);
  const revYoy  = firstFinitePct(ctx, ["REVENUE_GROWTH_YOY_1Y"]);
  const niYoy   = firstFinitePct(ctx, ["NET_INCOME_GROWTH_1Y"]);

  const longGrowth = safeMedian([revCagr, epsCagr]);
  const shortGrowth = safeMedian([revYoy, niYoy]);

  let startGrowth = NaN;

  if(Number.isFinite(longGrowth) && Number.isFinite(shortGrowth)){
    startGrowth = (longGrowth * 0.65) + (shortGrowth * 0.35);
  } else {
    startGrowth = Number.isFinite(longGrowth) ? longGrowth : shortGrowth;
  }

  if(!Number.isFinite(startGrowth)){
    startGrowth = 0.04;
  }

  startGrowth = clamp(startGrowth, 0.00, 0.18);

  return {
    startGrowth,
    longGrowth,
    shortGrowth
  };
}

function buildDcfGrowthPath(startGrowth, terminalGrowth, years){
  const arr = [];
  const y = Math.max(1, years | 0);

  for(let i = 1; i <= y; i++){
    if(y === 1){
      arr.push(terminalGrowth);
      continue;
    }
    const t = (i - 1) / (y - 1);
    const g = startGrowth + (terminalGrowth - startGrowth) * t;
    arr.push(g);
  }

  return arr;
}

function computeCostOfEquity(ctx){
  const dcf = readDcfSettingsFromUI();
  const betaRaw = ctx.num("BETA");
  const beta = Number.isFinite(betaRaw) ? clamp(betaRaw, 0.6, 2.2) : 1.0;

  const rf = Number.isFinite(dcf.rf) ? dcf.rf : 0.035;
  const erp = Number.isFinite(dcf.erp) ? dcf.erp : 0.055;

  return clamp(rf + (beta * erp), 0.06, 0.18);
}

/* ---------------------------------------------------------
   METHOD 1 · DCF
--------------------------------------------------------- */
function computeFairValueDcfRangeBreakdown(ctx){
  const notes = [];

  const shares = ctx.num("SHARES_OUTSTANDING_DILUTED_1Y");
  const netCashDebt = ctx.num("NET_CASH_DEBT_1Y");
  const priceNow = firstFiniteNum(ctx, ["KURS_CLOSE_AKTUELL", "PRICE_NOW"]);

  if(!(Number.isFinite(shares) && shares > 0)){
    return {
      ok: false,
      reason: "DCF nicht möglich: Shares fehlen.",
      notes: ["Shares Outstanding (diluted) 1Y fehlt oder ist ungültig."]
    };
  }

  const baseCf = chooseBaseCashflowForDcf(ctx);
  if(!(Number.isFinite(baseCf.value) && baseCf.value > 0)){
    return {
      ok: false,
      reason: "DCF nicht möglich: kein positiver Basis-Cashflow.",
      notes: [
        "Kein positiver FCF verfügbar.",
        "Owner Earnings nicht positiv nutzbar.",
        "OCF nicht positiv nutzbar."
      ]
    };
  }

  const dcf = readDcfSettingsFromUI();
  const years = Math.max(1, Math.min(30, Number(dcf.years || 5)));
  const costOfEquity = computeCostOfEquity(ctx);
  const terminalGrowth = clamp(Number(dcf.gT || 0.02), 0.00, Math.min(0.04, costOfEquity - 0.01));

  const growthSel = chooseGrowthForDcf(ctx);
  const startGrowth = Math.max(terminalGrowth, growthSel.startGrowth);
  const growthPath = buildDcfGrowthPath(startGrowth, terminalGrowth, years);

  let cf = baseCf.value;
  let pvSum = 0;

  for(let i = 0; i < growthPath.length; i++){
    const g = growthPath[i];
    cf = cf * (1 + g);
    const yearNo = i + 1;
    pvSum += cf / Math.pow(1 + costOfEquity, yearNo);
  }

  const terminalCf = cf * (1 + terminalGrowth);
  if(!(terminalCf > 0) || !(costOfEquity > terminalGrowth)){
    return {
      ok: false,
      reason: "DCF nicht stabil berechenbar.",
      notes: ["Terminal Value unplausibel: Cost of Equity muss über Terminal Growth liegen."]
    };
  }

  const terminalValue = terminalCf / (costOfEquity - terminalGrowth);
  const pvTerminal = terminalValue / Math.pow(1 + costOfEquity, years);

  const enterpriseLike = pvSum + pvTerminal;
  const equityValue = enterpriseLike + (Number.isFinite(netCashDebt) ? netCashDebt : 0);
  const perShare = equityValue / shares;

  if(!(Number.isFinite(perShare) && perShare > 0)){
    return {
      ok: false,
      reason: "DCF ergab keinen sinnvollen Fair Value.",
      notes: ["DCF Equity Value pro Aktie ist nicht positiv."]
    };
  }

  // Ausreißer-Schutz
  if(!isReasonablePerShareValue(perShare, priceNow)){
    return {
      ok: false,
      reason: "DCF als Ausreißer verworfen.",
      notes: [
        `DCF per Share unplausibel: ${perShare.toLocaleString("de-DE", { maximumFractionDigits: 2 })}`
      ]
    };
  }

  const rawRange = {
    low: perShare * 0.85,
    base: perShare,
    high: perShare * 1.15
  };

  const range = sanitizeFairValueRange(rawRange, priceNow);

  if(!(Number.isFinite(range.base) && range.base > 0)){
    return {
      ok: false,
      reason: "DCF Range unplausibel.",
      notes: ["DCF wurde durch den Ausreißer-Schutz verworfen."]
    };
  }

  return {
    ok: true,
    key: "DCF",
    label: "DCF",
    range,
    inputs: {
      shares,
      netCashDebt,
      baseCashflow: baseCf.value,
      baseCashflowKey: baseCf.key,
      ownerEarnings: baseCf.ownerEarnings,
      years,
      costOfEquity,
      terminalGrowth,
      startGrowth,
      priceNow
    },
    notes: [
      `DCF Basis: ${baseCf.key}`,
      `Startwachstum: ${(startGrowth * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 })}%`,
      `Terminalwachstum: ${(terminalGrowth * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 })}%`,
      `Diskontsatz: ${(costOfEquity * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 })}%`
    ]
  };
}
/* ---------------------------------------------------------
   METHOD 2 · FUNDAMENTAL MULTIPLE RANGE
--------------------------------------------------------- */

function weightedAvg(items, valueKey){
  let sum = 0;
  let wSum = 0;

  for(const item of (items || [])){
    const v = Number(item?.[valueKey]);
    const w = Number(item?.weight);

    if(Number.isFinite(v) && Number.isFinite(w) && w > 0){
      sum += v * w;
      wSum += w;
    }
  }

  return wSum > 0 ? (sum / wSum) : NaN;
}

function getStandardCandidateWeights(ctx, candidates){
  const opMargin    = ctx.pct("OPERATING_MARGIN_1Y");
  const grossMargin = ctx.pct("GROSS_MARGIN_1Y");
  const roic        = ctx.pct("ROIC_1Y");
  const fcfMargin   = ctx.pct("FCF_MARGIN_1Y");
  const profitMargin = ctx.pct("PROFIT_MARGIN_1Y");

  const qualityStrong =
    (Number.isFinite(opMargin) && opMargin >= 0.15) &&
    (Number.isFinite(grossMargin) && grossMargin >= 0.35) &&
    (Number.isFinite(roic) && roic >= 0.12);

  const cyclicalWeak =
    (Number.isFinite(opMargin) && opMargin < 0.10) ||
    (Number.isFinite(fcfMargin) && fcfMargin < 0.05) ||
    (Number.isFinite(profitMargin) && profitMargin < 0.06);

  const baseWeights = {
    OWNER_EARNINGS: 0.18,
    FCF_MULT:       0.20,
    OCF_MULT:       0.12,
    SALES_PS:       0.10,
    EPS_PE:         0.30,
    BVPS_PB:        0.10
  };

  if(qualityStrong){
    baseWeights.OWNER_EARNINGS = 0.18;
    baseWeights.FCF_MULT = 0.22;
    baseWeights.OCF_MULT = 0.10;
    baseWeights.SALES_PS = 0.10;
    baseWeights.EPS_PE = 0.35;
    baseWeights.BVPS_PB = 0.05;
  }

  if(cyclicalWeak){
    baseWeights.OWNER_EARNINGS = 0.15;
    baseWeights.FCF_MULT = 0.18;
    baseWeights.OCF_MULT = 0.15;
    baseWeights.SALES_PS = 0.20;
    baseWeights.EPS_PE = 0.22;
    baseWeights.BVPS_PB = 0.10;
  }

  const withWeights = (candidates || []).map(c => ({
    ...c,
    weight: baseWeights[c.key] ?? 0.10
  }));

  const medianBase = safeMedian(withWeights.map(c => c.base));

  for(const c of withWeights){
    if(Number.isFinite(medianBase) && Number.isFinite(c.base) && medianBase > 0){
      const dist = Math.abs(c.base - medianBase) / medianBase;
      if(dist > 0.35){
        c.weight *= 0.5;
      }
    }
  }

  return withWeights;
}


function computeFairValueFundamentalRangeBreakdown(ctx){
  
  const notes = [];
  const candidates = [];
   
  const priceNow = firstFiniteNum(ctx, ["KURS_CLOSE_AKTUELL", "PRICE_NOW"]);
  const eps      = ctx.num("EPS_DILUTED_1Y");
  const bvps     = ctx.num("BOOK_VALUE_PER_SHARE_1Y");
  const shares   = ctx.num("SHARES_OUTSTANDING_DILUTED_1Y");
  const revenue  = ctx.num("REVENUE_1Y");
  const fcf      = ctx.num("FCF_1Y");
  const ocf      = ctx.num("OPERATING_CASH_FLOW_1Y");
  const capex    = ctx.num("CAPEX_CAPITAL_EXPENDITURES_1Y");
  const price    = firstFiniteNum(ctx, ["KURS_CLOSE_AKTUELL"]);
  const peNow    = ctx.num("PE_RATIO_1Y");
  const fwdPeNow = ctx.num("FORWARD_PE_1Y");
  const pbNow    = ctx.num("PB_RATIO_1Y");
  const psNow    = ctx.num("PS_RATIO_1Y");
  const pfcfNow  = ctx.num("P_FCF_RATIO_1Y");
  const pocfNow  = ctx.num("P_OCF_RATIO_1Y");

  const p = readValuationPresetFromUI();
  const adj = computeQualityRiskAdjust(ctx);

  let targetPE   = p.base.pe   * p.erpFactor * adj.totalFactor;
  let targetPB   = p.base.pb   * p.erpFactor * adj.totalFactor;
  let targetPFCF = p.base.pfcf * p.erpFactor * adj.totalFactor;
  let targetPOCF = p.base.pocf * p.erpFactor * adj.totalFactor;
  let targetPS   = p.base.ps   * p.erpFactor * adj.totalFactor;

  targetPE   = clamp(targetPE,   6, 32);
  targetPB   = clamp(targetPB, 0.5, 5.0);
  targetPFCF = clamp(targetPFCF, 6, 28);
  targetPOCF = clamp(targetPOCF, 6, 24);
  targetPS   = clamp(targetPS, 0.6, 6.0);

  const ownerEarnings = (
    Number.isFinite(ocf) && Number.isFinite(capex)
      ? (ocf - Math.abs(capex))
      : NaN
  );
  function addCandidate(key, label, baseValuePerShare, targetMultiple, meta = {}){
    if(!(Number.isFinite(baseValuePerShare) && baseValuePerShare > 0)) return;
    if(!(Number.isFinite(targetMultiple) && targetMultiple > 0)) return;

    const raw = {
      low:  baseValuePerShare * makeBandMultiple(targetMultiple, "low"),
      base: baseValuePerShare * makeBandMultiple(targetMultiple, "base"),
      high: baseValuePerShare * makeBandMultiple(targetMultiple, "high")
    };

    const range = sanitizeFairValueRange(raw, priceNow);

    if(!(Number.isFinite(range.base) && range.base > 0)) {
      notes.push(`${label} als Ausreißer verworfen.`);
      return;
    }

    candidates.push({
      key,
      label,
      low: range.low,
      base: range.base,
      high: range.high,
      ok: true,
      meta
    });
  }

  if(Number.isFinite(shares) && shares > 0){
    const oePerShare      = Number.isFinite(ownerEarnings) ? ownerEarnings / shares : NaN;
    const fcfPerShare     = Number.isFinite(fcf) ? fcf / shares : NaN;
    const ocfPerShare     = Number.isFinite(ocf) ? ocf / shares : NaN;
    const revenuePerShare = Number.isFinite(revenue) ? revenue / shares : NaN;

    if(finitePositive(oePerShare)){
      addCandidate(
        "OWNER_EARNINGS",
        "Owner Earnings / Share × P/FCF",
        oePerShare,
        targetPFCF,
        { oePerShare, targetPFCF, pfcfNow }
      );
    } else {
      notes.push("Owner Earnings/Share nicht nutzbar.");
    }

    if(finitePositive(fcfPerShare)){
      addCandidate(
        "FCF_MULT",
        "FCF / Share × P/FCF",
        fcfPerShare,
        targetPFCF,
        { fcfPerShare, targetPFCF, pfcfNow }
      );
    } else {
      notes.push("FCF/Share nicht nutzbar.");
    }

    if(finitePositive(ocfPerShare)){
      addCandidate(
        "OCF_MULT",
        "OCF / Share × P/OCF",
        ocfPerShare,
        targetPOCF,
        { ocfPerShare, targetPOCF, pocfNow }
      );
    } else {
      notes.push("OCF/Share nicht nutzbar.");
    }

    const profitMargin = ctx.pct("PROFIT_MARGIN_1Y");
    const grossMargin  = ctx.pct("GROSS_MARGIN_1Y");
    const fcfMargin    = ctx.pct("FCF_MARGIN_1Y");

    const allowSalesMethod =
      (Number.isFinite(profitMargin) && profitMargin > 0.05) ||
      (Number.isFinite(fcfMargin) && fcfMargin > 0.04) ||
      (Number.isFinite(grossMargin) && grossMargin > 0.25);

    if(allowSalesMethod && finitePositive(revenuePerShare)){
      addCandidate(
        "SALES_PS",
        "Revenue / Share × P/S",
        revenuePerShare,
        targetPS,
        { revenuePerShare, targetPS, psNow }
      );
    } else if(Number.isFinite(revenuePerShare) && revenuePerShare > 0){
      notes.push("P/S-Methode bewusst übersprungen: Margenqualität zu schwach oder unklar.");
    } else {
      notes.push("Revenue/Share nicht nutzbar.");
    }
  } else {
    notes.push("Shares fehlen → per-share Methoden nicht berechenbar.");
  }

  if(finitePositive(eps)){
    addCandidate(
      "EPS_PE",
      "EPS × PE",
      eps,
      targetPE,
      { eps, targetPE, peNow, fwdPeNow }
    );
  } else {
    notes.push("EPS nicht nutzbar.");
  }

  if(finitePositive(bvps)){
    addCandidate(
      "BVPS_PB",
      "BVPS × PB",
      bvps,
      targetPB,
      { bvps, targetPB, pbNow }
    );
  } else {
    notes.push("BVPS nicht nutzbar.");
  }

  if(candidates.length === 0 && finitePositive(price)){
    const fallbackFactor =
      p.preset === "defensive" ? 0.85 :
      p.preset === "aggressive" ? 1.10 :
      0.95;

    const base = price * fallbackFactor;
    const low  = base * 0.85;
    const high = base * 1.15;

    candidates.push({
      key: "LAST_RESORT_PRICE_ANCHOR",
      label: "Fallback Preis-Anker",
      low,
      base,
      high,
      ok: true,
      meta: { price, fallbackFactor, warning: true }
    });

    notes.push("Nur Fallback aktiv: keine ausreichenden Fundamentaldaten vorhanden, daher konservativer Preis-Anker genutzt.");
  }

    // Extra Schutz: absurde Kandidaten relativ zum aktuellen Kurs entfernen
  const filteredCandidates = candidates.filter(c => {
    if(!(c.ok && finitePositive(c.base))) return false;
    if(Number.isFinite(priceNow) && priceNow > 0){
      if(c.base > priceNow * 5.0) {
        notes.push(`${c.label} verworfen: zu hoch relativ zum aktuellen Kurs.`);
        return false;
      }
      if(c.base < priceNow * 0.20) {
        notes.push(`${c.label} verworfen: zu niedrig relativ zum aktuellen Kurs.`);
        return false;
      }
    }
    return true;
  });

  const good = filteredCandidates;

  if(good.length === 0){
    return {
      ok: false,
      reason: "Zu wenig Daten für Multiple-Fair-Value.",
      notes,
      inputs: {
        eps,
        bvps,
        shares,
        revenue,
        fcf,
        ocf,
        capex,
        ownerEarnings,
        price,
        peNow,
        fwdPeNow,
        pbNow,
        psNow,
        pfcfNow,
        pocfNow
      },
      targets: { targetPE, targetPB, targetPFCF, targetPOCF, targetPS },
      adjust: adj,
      candidates: []
    };
  }

const weighted = getStandardCandidateWeights(ctx, good);

const fairRange = sanitizeFairValueRange({
  low:  weightedAvg(weighted, "low"),
  base: weightedAvg(weighted, "base"),
  high: weightedAvg(weighted, "high")
}, priceNow);

const low  = fairRange.low;
const base = fairRange.base;
const high = fairRange.high;

if(!(Number.isFinite(base) && base > 0)){
  return {
    ok: false,
    reason: "Multiple-Fair-Value nach Plausibilitätsprüfung unbrauchbar.",
    notes,
    inputs: {
      eps,
      bvps,
      shares,
      revenue,
      fcf,
      ocf,
      capex,
      ownerEarnings,
      price,
      peNow,
      fwdPeNow,
      pbNow,
      psNow,
      pfcfNow,
      pocfNow,
      priceNow
    },
    targets: { targetPE, targetPB, targetPFCF, targetPOCF, targetPS },
    adjust: adj,
    candidates: weighted
  };
}

const confidence =
  weighted.length >= 4 ? "high" :
  weighted.length >= 2 ? "medium" :
  "low";

let methodUsed = weighted[0];
let bestWeight = -Infinity;
for(const c of weighted){
  if((c.weight || 0) > bestWeight){
    bestWeight = c.weight || 0;
    methodUsed = c;
  }
}

  return {
    ok: true,
    preset: p.preset,
    confidence,
    notes,
    range: { low, base, high },
    targets: { targetPE, targetPB, targetPFCF, targetPOCF, targetPS },
    adjust: adj,
    inputs: {
      eps,
      bvps,
      shares,
      revenue,
      fcf,
      ocf,
      capex,
      ownerEarnings,
      price,
      peNow,
      fwdPeNow,
      pbNow,
      psNow,
      pfcfNow,
      pocfNow
    },
    candidates: weighted,
    methodUsed: { key: methodUsed.key, label: methodUsed.label }
  };
}

/* ---------------------------------------------------------
   STANDARD AGGREGATION
--------------------------------------------------------- */

function computeFairValueStandardRangeBreakdown(ctx){
  const notes = [];

  const priceNow = firstFiniteNum(ctx, ["KURS_CLOSE_AKTUELL", "PRICE_NOW"]);

  const dcf = computeFairValueDcfRangeBreakdown(ctx);
  const fundamental = computeFairValueFundamentalRangeBreakdown(ctx);

  const methods = [];
  if(dcf?.ok) methods.push({
    key: "DCF",
    label: "DCF",
    low: dcf.range.low,
    base: dcf.range.base,
    high: dcf.range.high,
    meta: dcf.inputs || {}
  });

  if(fundamental?.ok) methods.push({
    key: "FUNDAMENTAL",
    label: "Fundamental Multiples",
    low: fundamental.range.low,
    base: fundamental.range.base,
    high: fundamental.range.high,
    meta: {
      confidence: fundamental.confidence,
      candidates: fundamental.candidates?.length || 0
    }
  });

  if(!methods.length){
    return {
      ok: false,
      reason: "Weder DCF noch Fundamental Fair Value konnten berechnet werden.",
      notes: [
        ...(Array.isArray(dcf?.notes) ? dcf.notes : []),
        ...(Array.isArray(fundamental?.notes) ? fundamental.notes : [])
      ],
      methods: []
    };
  }

const weightedMethods = methods.map(m => ({
  ...m,
  weight: m.key === "FUNDAMENTAL" ? 0.65 : 0.35
}));

const finalRange = sanitizeFairValueRange({
  low:  weightedAvg(weightedMethods, "low"),
  base: weightedAvg(weightedMethods, "base"),
  high: weightedAvg(weightedMethods, "high")
}, priceNow);

const low  = finalRange.low;
const base = finalRange.base;
const high = finalRange.high;

if(!(Number.isFinite(base) && base > 0)){
  return {
    ok: false,
    reason: "Finaler Fair Value nach Plausibilitätsprüfung unbrauchbar.",
    notes: [
      ...(Array.isArray(dcf?.notes) ? dcf.notes : []),
      ...(Array.isArray(fundamental?.notes) ? fundamental.notes : [])
    ],
    methods: weightedMethods
  };
}

let methodUsed = weightedMethods[0];
let bestWeight = -Infinity;
for(const m of weightedMethods){
  if((m.weight || 0) > bestWeight){
    bestWeight = m.weight || 0;
    methodUsed = m;
  }
}


  notes.push(...(Array.isArray(dcf?.notes) ? dcf.notes : []));
  notes.push(...(Array.isArray(fundamental?.notes) ? fundamental.notes : []));

  return {
    ok: true,
    preset: readValuationPresetFromUI().preset,
    confidence:
      methods.length >= 2 ? "high" : "medium",
    range: { low, base, high },
    methodUsed: { key: methodUsed.key, label: methodUsed.label },
    methods: weightedMethods,
    notes,
    adjust: fundamental?.adjust || computeQualityRiskAdjust(ctx),
    targets: fundamental?.targets || {},
    inputs: {
      ...(fundamental?.inputs || {}),
      dcfBase: dcf?.inputs?.baseCashflow,
      dcfBaseKey: dcf?.inputs?.baseCashflowKey,
      dcfYears: dcf?.inputs?.years,
      dcfDiscountRate: dcf?.inputs?.costOfEquity,
      dcfTerminalGrowth: dcf?.inputs?.terminalGrowth
    },
    candidates: [
      ...(Array.isArray(fundamental?.candidates) ? fundamental.candidates : [])
    ]
  };
}

function computeFairValueFundamentalBase(ctx){
  const r = computeFairValueFundamentalRangeBreakdown(ctx);
  return (r && r.ok && Number.isFinite(r.range?.base)) ? r.range.base : NaN;
}

function computeFairValueStandard(ctx){
  const r = computeFairValueStandardRangeBreakdown(ctx);
  return (r && r.ok && Number.isFinite(r.range?.base)) ? r.range.base : NaN;
}

/* ---------------------------------------------------------
   FAIR VALUE ENGINE
--------------------------------------------------------- */

function getFairValueEngine(modeOrKey){
  const modeObj =
    typeof modeOrKey === "string"
      ? (typeof getMode === "function" ? getMode(modeOrKey) : null)
      : (modeOrKey || (typeof getMode === "function" ? getMode() : null));

  const fallback = {
    compute: computeFairValueStandard,
    breakdown: computeFairValueStandardRangeBreakdown
  };

  if(!modeObj || !modeObj.fairValue) return fallback;

  return {
    compute:
      typeof modeObj.fairValue.compute === "function"
        ? modeObj.fairValue.compute
        : fallback.compute,

    breakdown:
      typeof modeObj.fairValue.breakdown === "function"
        ? modeObj.fairValue.breakdown
        : fallback.breakdown
  };
}

function computeFairValueForCurrentMode(ctx){
  const engine = getFairValueEngine();
  return engine.compute(ctx);
}

function computeFairValueRangeBreakdownForCurrentMode(ctx){
  const engine = getFairValueEngine();
  return engine.breakdown(ctx);
}
/* ---------------------------------------------------------
   MANUAL / OVERLAY / BUY BANDS
--------------------------------------------------------- */

function getManualFairAdjustedByPreset(manualFair){
  if(!Number.isFinite(manualFair) || manualFair <= 0) return NaN;

  const p = readValuationPresetFromUI();
  const normalBase = { pe: 18, pb: 1.9, pfcf: 16, pocf: 14, ps: 2.4 };

  const presetBaseFactor = (
    (p.base.pe   / normalBase.pe) +
    (p.base.pb   / normalBase.pb) +
    (p.base.pfcf / normalBase.pfcf) +
    (p.base.pocf / normalBase.pocf) +
    (p.base.ps   / normalBase.ps)
  ) / 5;

  const totalFactor = clamp(presetBaseFactor * p.erpFactor, 0.70, 1.30);
  return manualFair * totalFactor;
}

function makeBandMultiple(baseMultiple, band){
  if(band === "low") return baseMultiple * 0.80;
  if(band === "high") return baseMultiple * 1.20;
  return baseMultiple;
}

function computeBuyBandsFromFair(fair, bands){
  if(!Number.isFinite(fair) || fair <= 0) return null;
  return {
    strongBuyMax: fair * (bands.strongBuy ?? 0.75),
    buyMax:       fair * (bands.buy ?? 0.90),
    holdMax:      fair * (bands.hold ?? 1.10),
    expensiveMax: fair * (bands.expensive ?? 1.25)
  };
}

function computeBuyDecision(priceNow, fair, bands){
  if(!Number.isFinite(priceNow) || !Number.isFinite(fair) || !bands){
    return { label: "–", mode: "" };
  }

  if(priceNow <= bands.strongBuyMax) return { label: "Strong Buy", mode: "good" };
  if(priceNow <= bands.buyMax)       return { label: "Buy", mode: "good" };
  if(priceNow <= bands.holdMax)      return { label: "Hold", mode: "warn" };
  if(priceNow <= bands.expensiveMax) return { label: "Expensive", mode: "bad" };
  return { label: "Very Expensive", mode: "darkbad" };
}

function getFairValueFinal({ m, fairAuto }){
  const ov = nzNumInput(el("ovFair")?.value);
  const table = nzNum(mGet(m, "FAIR_VALUE"));

  if(Number.isFinite(ov) && ov > 0){
    const adjusted = getManualFairAdjustedByPreset(ov);
    return Number.isFinite(adjusted) && adjusted > 0 ? adjusted : ov;
  }

  if(Number.isFinite(table) && table > 0) return table;
  if(Number.isFinite(fairAuto) && fairAuto > 0) return fairAuto;
  return NaN;
}