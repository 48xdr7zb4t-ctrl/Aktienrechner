"use strict";

window.NUTZEN_DEFAULT_BANDS = {
  strongBuy: 0.75,
  buy: 0.90,
  hold: 1.10,
  expensive: 1.25
};

window.NUTZEN_STATE = window.NUTZEN_STATE || {
  page: "home",
  sector: "standard",
  cagrYear: 4,
  volYear: 10,
  presetKey: "",
  taxonomyExpanded: false,
  buyBands: { ...window.NUTZEN_DEFAULT_BANDS }
};

function buildAppSnapshot(){
  const m = tableToMap();
  const ctx = buildNutzenCtxFromTableMap(m);

  const fairBreakdown = computeFairValueRangeBreakdownForCurrentMode(ctx);
  const fairAuto =
    fairBreakdown?.ok && Number.isFinite(fairBreakdown?.range?.base)
      ? fairBreakdown.range.base
      : NaN;

  const roles = evalRolesForCurrentSector();
  const stress = evalStressForCurrentSector();

  return {
    map: m,
    ctx,
    roles,
    stress,
    fairBreakdown,
    fairAuto
  };
}



function runAllCalcs(){
  recalcAllCagrRowsInTable?.();

  const snap = buildAppSnapshot();

  const fairAuto =
    snap?.fairBreakdown?.ok && Number.isFinite(snap?.fairBreakdown?.range?.base)
      ? snap.fairBreakdown.range.base
      : (Number.isFinite(snap?.fairAuto) ? snap.fairAuto : NaN);

  snap.fairAuto = Number.isFinite(fairAuto) && fairAuto > 0 ? fairAuto : NaN;

  // WICHTIG: echten Fair Value in die sichtbare Tabellenzeile schreiben
  writeAutoFairValueToTable(snap.fairAuto);

  // Danach Map + ctx neu aus der echten Tabelle lesen,
  // damit Tabelle / Map / ctx / Overlay synchron sind
  snap.map = tableToMap();
  snap.ctx = buildNutzenCtxFromTableMap(snap.map);

  // Rollen + Stress mit frischem ctx neu berechnen
  snap.roles = evalRolesForCurrentSector();
  snap.stress = evalStressForCurrentSector();

  renderRolesFromEval(snap.roles);
  renderCategoriesOnRolesPage(snap.ctx, snap.roles);
  renderStress(snap.stress);
  renderOverlayBuyFromMap(snap.map, snap.fairAuto);
  renderFairPage(snap);

  renderOverlaySummary({
    rolesText: summarizeRolesAll(snap.roles),
    categoriesHtml: summarizeCategoriesAllHTML(snap.ctx, snap.roles),
    stressLabel: snap.stress?.label || "–",
    stressMode: snap.stress?.mode || "warn"
  });

  const dbg = el("nutzenDebug");
  if(dbg){
    dbg.textContent = JSON.stringify({
      headerset: window.NUTZEN_STATE?.sector || "standard",
      stress: snap.stress?.mode || "good",
      fairAuto: Number.isFinite(snap.fairAuto) ? snap.fairAuto : null,
      roles: Array.isArray(snap.roles?.combined)
        ? snap.roles.combined.filter(r => r.active).map(r => r.id)
        : []
    }, null, 2);
  }
}

function initApp(){
  renderSectorSelect?.();
  renderYearSelects?.();
  renderPresetSelects?.();
  renderNutzenTable?.();
  renderTaxonomyUI?.();

  wireSectorSelect?.();
  wireYearSelects?.();
  wirePresetSelects?.();
  wireExcelPaste?.();

  wireOverlayBuyInputs?.();
  wireDcfInputs?.();
  wireDcfInputsOverlay?.();
  wireOverlayDividendControls?.();
  wireCapitalAutoFormat?.();
  wirePercentAutoFormat?.();

  wireToolsFx?.();
  wireToolsCagr?.();
  wireToolsVola?.();
  wireDividendOptionGroups?.();
  wireToolsDividend?.();
  wireInterestOptionGroups?.();
  wireInterestCalculator?.();

  syncDcfMainToOverlay?.();
  runAllCalcs();
}

window.initApp = initApp;
window.runAllCalcs = runAllCalcs;
window.buildAppSnapshot = buildAppSnapshot;