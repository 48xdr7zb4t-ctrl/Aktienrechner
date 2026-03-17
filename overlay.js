"use strict";

function openNutzenOverlay(){
  const ov = el("nutzenOverlay");
  const bd = el("nutzenOverlayBackdrop");
  if(ov) ov.classList.add("isOpen");
  if(bd) bd.classList.add("isOpen");
}

function closeNutzenOverlay(){
  const ov = el("nutzenOverlay");
  const bd = el("nutzenOverlayBackdrop");
  if(ov) ov.classList.remove("isOpen");
  if(bd) bd.classList.remove("isOpen");
}



function wireOverlayBuyInputs(){
  const ovFair = el("ovFair");
  const sb = el("ovStrongBuyMult");
  const b  = el("ovBuyMult");
  const h  = el("ovHoldMult");
  const ex = el("ovExpensiveMult");
  const reset = el("ovBuyReset");

  if(!sb || !b || !h || !ex || !reset) return;

  if(wireOverlayBuyInputs._bound) return;
  wireOverlayBuyInputs._bound = true;

  const DEFAULT = window.NUTZEN_DEFAULT_BANDS || { strongBuy:0.75, buy:0.90, hold:1.10, expensive:1.25 };

  function normalizeBands(obj){
    let strongBuy = clamp(obj.strongBuy, 0.10, 2.00);
    let buy       = clamp(obj.buy,       0.10, 2.50);
    let hold      = clamp(obj.hold,      0.10, 3.00);
    let expensive = clamp(obj.expensive, 0.10, 4.00);

    // Reihenfolge erzwingen
    buy = Math.max(buy, strongBuy);
    hold = Math.max(hold, buy);
    expensive = Math.max(expensive, hold);

    return { strongBuy, buy, hold, expensive };
  }

  function syncInputsFromState(){
    const cur = NUTZEN_STATE.buyBands || DEFAULT;
    sb.value = String(cur.strongBuy ?? DEFAULT.strongBuy).replace(".", ",");
    b.value  = String(cur.buy       ?? DEFAULT.buy).replace(".", ",");
    h.value  = String(cur.hold      ?? DEFAULT.hold).replace(".", ",");
    ex.value = String(cur.expensive ?? DEFAULT.expensive).replace(".", ",");
  }

  function onAnyChange(){
    const next = normalizeBands({
      strongBuy: nzNumInput(sb.value),
      buy:       nzNumInput(b.value),
      hold:      nzNumInput(h.value),
      expensive: nzNumInput(ex.value),
    });

    if([next.strongBuy,next.buy,next.hold,next.expensive].some(x => !Number.isFinite(x))) return;

    NUTZEN_STATE.buyBands = next;

    // Inputs sauber “zurückschreiben” (z.B. wenn User Reihenfolge kaputt tippt)
    sb.value = String(next.strongBuy).replace(".", ",");
    b.value  = String(next.buy).replace(".", ",");
    h.value  = String(next.hold).replace(".", ",");
    ex.value = String(next.expensive).replace(".", ",");

    runAllCalcs();
  }

    sb.addEventListener("input", onAnyChange);
  b.addEventListener("input", onAnyChange);
  h.addEventListener("input", onAnyChange);
  ex.addEventListener("input", onAnyChange);

  reset.addEventListener("click", () => {
    NUTZEN_STATE.buyBands = { ...DEFAULT };
    syncInputsFromState();
    runAllCalcs();
  });

  syncInputsFromState();
}



function renderOverlayBuyFromMap(m, fairOverride){
  const ovRaw           = nzNumInput(el("ovFair")?.value);
  const fairFromOverlay = (Number.isFinite(ovRaw) && ovRaw > 0)
    ? getManualFairAdjustedByPreset(ovRaw)
    : NaN;

  const fairFromTable = nzNum(mGet(m, "FAIR_VALUE"));
  const priceNow      = nzNum(mGet(m, "KURS_CLOSE_AKTUELL"));

const fair = getFairValueFinal({
  m,
  fairAuto: fairOverride
});

  const bands = computeBuyBandsFromFair(fair, NUTZEN_STATE.buyBands);

  const fmt = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString("de-DE", { maximumFractionDigits: 2 })
      : "–";

  const decisionEl = el("nutzenOverlayBuyDecision");
  if(decisionEl){
    const dec = computeBuyDecision(priceNow, fair, bands);
    decisionEl.innerHTML = `<span class="dot ${dec.mode}"></span> Aktion: ${dec.label}`;
  }

  const setTxt = (id, txt) => {
    const node = el(id);
    if(node) node.textContent = txt;
  };

  setTxt("ovBoxFair",   fmt(fair));
  setTxt("ovBoxStrong", bands ? fmt(bands.strongBuyMax) : "–");
  setTxt("ovBoxBuy",    bands ? fmt(bands.buyMax) : "–");
  setTxt("ovBoxHold",   bands ? fmt(bands.holdMax) : "–");
  setTxt("ovBoxExp",    bands ? fmt(bands.expensiveMax) : "–");

  renderOverlayDividendBox(m);

  return { fair, priceNow, bands };
}





function wireDcfInputs(){
  if(wireDcfInputs._bound) return;

  const presetSel = el("ovDcfPreset");
  const rfEl  = el("ovRf");
  const erpEl = el("ovErp");
  const gtEl  = el("ovGt");
  const yEl   = el("ovYears");

  // Wenn die Elemente nicht existieren, quietly raus
  if(!presetSel || !rfEl || !erpEl || !gtEl || !yEl) {
    console.warn("DCF UI fehlt: prüfe IDs ovDcfPreset/ovRf/ovErp/ovGt/ovYears");
    return;
  }

  wireDcfInputs._bound = true;

  // Preset beim Laden anwenden (falls nicht custom)
  if(presetSel.value !== "custom") applyDcfPreset(presetSel.value);

  presetSel.addEventListener("change", () => {
    const val = presetSel.value;
    if(val !== "custom") applyDcfPreset(val);
    syncDcfMainToOverlay?.();  
    runAllCalcs();
  });

  // Wenn User manuell tippt -> preset auf custom setzen
  const onManual = () => {
    if(presetSel.value !== "custom") presetSel.value = "custom";
    syncDcfMainToOverlay?.(); 
    runAllCalcs();
  };

  rfEl.addEventListener("input", onManual);
  erpEl.addEventListener("input", onManual);
  gtEl.addEventListener("input", onManual);
  yEl.addEventListener("input",  onManual);
}


function syncDcfMainToOverlay(){
  const a = el("ovDcfPreset"), b = el("ovDcfPresetOv");
  const rf1 = el("ovRf"),      rf2 = el("ovRfOv");
  const e1  = el("ovErp"),     e2  = el("ovErpOv");
  const gt1 = el("ovGt"),      gt2 = el("ovGtOv");
  const y1  = el("ovYears"),   y2  = el("ovYearsOv");

  if(a && b)  b.value  = a.value;
  if(rf1 && rf2) rf2.value = rf1.value;
  if(e1 && e2)  e2.value  = e1.value;
  if(gt1 && gt2) gt2.value = gt1.value;
  if(y1 && y2)  y2.value  = y1.value;
}

function syncDcfOverlayToMain(){
  const a = el("ovDcfPreset"), b = el("ovDcfPresetOv");
  const rf1 = el("ovRf"),      rf2 = el("ovRfOv");
  const e1  = el("ovErp"),     e2  = el("ovErpOv");
  const gt1 = el("ovGt"),      gt2 = el("ovGtOv");
  const y1  = el("ovYears"),   y2  = el("ovYearsOv");

  if(a && b)  a.value  = b.value;
  if(rf1 && rf2) rf1.value = rf2.value;
  if(e1 && e2)  e1.value  = e2.value;
  if(gt1 && gt2) gt1.value = gt2.value;
  if(y1 && y2)  y1.value  = y2.value;
}


function wireDcfInputsOverlay(){
  if(wireDcfInputsOverlay._bound) return;

  const presetSel = el("ovDcfPresetOv");
  const rfEl  = el("ovRfOv");
  const erpEl = el("ovErpOv");
  const gtEl  = el("ovGtOv");
  const yEl   = el("ovYearsOv");

  if(!presetSel || !rfEl || !erpEl || !gtEl || !yEl) return;
  wireDcfInputsOverlay._bound = true;

  // initial sync
  syncDcfMainToOverlay();

  // Preset change: -> Main spiegeln -> Preset anwenden -> zurück spiegeln
  presetSel.addEventListener("change", () => {
    syncDcfOverlayToMain();

    if(presetSel.value !== "custom") {
      applyDcfPreset(presetSel.value);  // arbeitet auf MAIN IDs
    }

    syncDcfMainToOverlay();
    runAllCalcs();
  });

  // Manuelle Eingabe: overlay -> main, preset=custom, recalc
  const onManual = () => {
    syncDcfOverlayToMain();

    const mainPreset = el("ovDcfPreset");
    if(mainPreset) mainPreset.value = "custom";
    presetSel.value = "custom";

    runAllCalcs();
  };

  rfEl.addEventListener("input", onManual);
  erpEl.addEventListener("input", onManual);
  gtEl.addEventListener("input", onManual);
  yEl.addEventListener("input",  onManual);
}

function wireOverlayDividendControls(){
  if(wireOverlayDividendControls._bound) return;
  wireOverlayDividendControls._bound = true;

  const capEl = el("ovCapital");
  const yEl   = el("ovDivYield");
  const clrEl = el("ovDivYieldClear");

  if(!capEl || !yEl || !clrEl) return;

  const onAny = () => runAllCalcs();

  capEl.addEventListener("input", onAny);
  yEl.addEventListener("input", onAny);

  clrEl.addEventListener("click", () => {
    yEl.value = "";      // Reset -> wieder auto aus Tabelle
    runAllCalcs();
  });
}

function renderOverlayDividendBox(m){
  const capEl = el("ovCapital");
  const yEl   = el("ovDivYield");
  const aEl   = el("ovDivAnnual");
   const pEl   = el("ovPriceNow"); 
   const fEl   = el("ovDivFreq"); 
  if(!capEl || !yEl || !aEl) return;

  const ctx = buildNutzenCtxFromTableMap(m);

  const fairBreakdown = computeFairValueRangeBreakdownForCurrentMode(ctx);
const fairAuto =
  fairBreakdown?.ok && Number.isFinite(fairBreakdown?.range?.base)
    ? fairBreakdown.range.base
    : NaN;

// Auto-Fair-Value in Tabelle/Map zurückschreiben
if(Number.isFinite(fairAuto) && fairAuto > 0){
  if(typeof mSet === "function"){
    mSet(m, "FAIR_VALUE", fairAuto);
  } else {
    m["FAIR_VALUE"] = fairAuto;
  }
} else {
  if(typeof mSet === "function"){
    mSet(m, "FAIR_VALUE", "");
  } else {
    delete m["FAIR_VALUE"];
  }
}
    if(pEl){
    const price = ctx.num("KURS_CLOSE_AKTUELL");
    pEl.value = Number.isFinite(price)
      ? price.toLocaleString("de-DE", { maximumFractionDigits: 2 })
      : "–";
  }

  if(fEl){
  const freq = ctx.str("PAYMENT_FREQUENCY");
  fEl.value = (freq && freq.trim().length) ? freq : "–";
}

  // Kapital
  const cap = parseIntLooseDE(capEl.value);

  // Yield Priorität:
  // 1) User-Override (ovDivYield) -> nimmt "3,5" oder "3,5%" oder "0,035"
  // 2) Auto aus Tabelle: DIV_YIELD (0..1 via ctx.pct)
  let y01 = NaN;

  const manualRaw = nzStr(yEl.value).trim();
  if(manualRaw){
    // nzPct01 akzeptiert "3,5%" und "0,035"
    y01 = nzPct01(manualRaw);
  } else {
    y01 = ctx.pct("DIVIDEND_YIELD");
  }

  // Wenn auto genutzt und Feld leer: optional anzeigen, was auto ist
  if(!manualRaw && Number.isFinite(y01) && document.activeElement !== yEl){
    yEl.value = (y01 * 100).toLocaleString("de-DE",{maximumFractionDigits:2}) + "%";
  }

  // Annual Dividend = Kapital * Yield
  if(Number.isFinite(cap) && cap > 0 && Number.isFinite(y01) && y01 >= 0){
    aEl.value = (cap * y01).toLocaleString("de-DE",{maximumFractionDigits:2});
  } else {
    aEl.value = "–";
  }
}

function wireCapitalAutoFormat(){
  function formatDEIntFromDigits(digits){
    if(!digits) return "";
    digits = digits.replace(/^0+(?=\d)/, "");
    const n = Number(digits);
    if(!Number.isFinite(n)) return "";
    return n.toLocaleString("de-DE");
  }

  function onlyDigits(s){
    return String(s || "").replace(/[^\d]/g, "");
  }

  function countDigitsLeftOfCaret(str, caretPos){
    const left = str.slice(0, Math.max(0, caretPos));
    return (left.match(/\d/g) || []).length;
  }

  function caretPosFromDigitsCount(formatted, digitsCount){
    if(digitsCount <= 0) return 0;
    let seen = 0;
    for(let i = 0; i < formatted.length; i++){
      if(/\d/.test(formatted[i])) seen++;
      if(seen >= digitsCount) return i + 1;
    }
    return formatted.length;
  }

  function bind(inp){
    if(!inp || inp.dataset.capitalAutoBound === "1") return;
    inp.dataset.capitalAutoBound = "1";

    inp.addEventListener("input", () => {
      const raw = inp.value;
      const caret = inp.selectionStart ?? raw.length;

      const digitsLeft = countDigitsLeftOfCaret(raw, caret);
      const digits = onlyDigits(raw);
      const formatted = formatDEIntFromDigits(digits);

      inp.value = formatted;

      const newPos = caretPosFromDigitsCount(formatted, digitsLeft);
      try{
        inp.setSelectionRange(newPos, newPos);
      } catch(_e){}
    });
  }

  document.querySelectorAll(".js-capital-autoformat").forEach(bind);
}

function wirePercentAutoFormat(){
  function normalizePercentInput(raw){
    let s = String(raw || "").trim();

    if(!s) return "";

    s = s.replace(/\s+/g, "");
    s = s.replace(/%/g, "");
    s = s.replace(/\./g, "");
    s = s.replace(",", ".");

    const n = Number(s);
    if(!Number.isFinite(n)) return "";

    return n.toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }) + "%";
  }

  function bind(inp){
    if(!inp || inp.dataset.percentAutoBound === "1") return;
    inp.dataset.percentAutoBound = "1";

    inp.addEventListener("blur", () => {
      const v = normalizePercentInput(inp.value);
      inp.value = v;
    });

    inp.addEventListener("keydown", (e) => {
      if(e.key !== "Enter") return;
      const v = normalizePercentInput(inp.value);
      inp.value = v;
    });
  }

  document.querySelectorAll(".js-percent-autoformat").forEach(bind);
}


function summarizeRolesAll(roleBuckets){
  const combined = Array.isArray(roleBuckets?.combined) ? roleBuckets.combined : [];
  const active = combined.filter(r => r.active).map(r => r.label);
  return active.length ? active.join(" · ") : "Keine aktiven Rollen";
}

function summarizeCategoriesAllHTML(ctxArg, rolesArg){
const ctx = ctxArg || buildNutzenCtxFromTableMap(tableToMap());
const roles = rolesArg || evalRolesForCurrentSector();
  const modeObj = typeof getMode === "function" ? getMode() : null;
  const tax = window.NUTZEN_TAXONOMY;

  if(!tax) return `<div class="muted">Keine Kategorien</div>`;

  const catFn =
    modeObj?.categories?.evaluate ||
    modeObj?.categories ||
    window.buildStandardCategories;

  const cats = typeof catFn === "function"
    ? (catFn(ctx, roles) || {})
    : {};

  const defs = tax.getModeCategories?.(window.NUTZEN_STATE?.sector || "standard") || [];
  if(!defs.length) return `<div class="muted">Keine Kategorien</div>`;

  return defs.map(cat => {
    const rawValue = cats?.[cat.id];

    const ids = Array.isArray(rawValue)
      ? rawValue.map(id => nzStr(id)).filter(Boolean)
      : (nzStr(rawValue) ? [nzStr(rawValue)] : []);

    const labels = ids.length
      ? ids.map(id => cat.options?.find(o => o.id === id)?.label || id)
      : ["Unklar"];

    return `
      <div class="ovCatBlock">
        <div class="ovCatTitle">${escapeHtml(cat.label || "–")}</div>
        <div class="ovCatValue">${escapeHtml(labels.join(" · "))}</div>
      </div>
    `;
  }).join("");
}


function renderOverlaySummary({ rolesText, categoriesHtml, stressLabel, stressMode } = {}){
  const rolesEl = el("nutzenOverlayRolesExplain");
  const stressEl = el("nutzenOverlayStressExplain");
  const catsEl = el("nutzenOverlayCategoriesExplain");

  function sevNorm(sev){
    const s = nzStr(sev).toLowerCase();
    if(s === "darkbad") return "darkbad";
    if(s === "bad") return "bad";
    if(s === "warn") return "warn";
    if(s === "good") return "good";
    return "warn";
  }

  function sevColor(sev){
    const s = sevNorm(sev);
    if(s === "darkbad") return "#8B0000";
    if(s === "bad") return "#FF0000";
    if(s === "warn") return "#ffd166";
    return "#2ecc71";
  }

  if(rolesEl){
    rolesEl.textContent = rolesText || "Keine aktiven Rollen";
  }

  if(stressEl){
    const sev = sevNorm(stressMode);
    const color = sevColor(sev);
    const label = nzStr(stressLabel) || "–";

    stressEl.innerHTML = `
      <span class="chip" style="display:inline-flex;align-items:center;gap:8px;">
        <span style="
          display:inline-block;
          width:10px;
          height:10px;
          border-radius:50%;
          background:${color};
          box-shadow:0 0 0 1px rgba(17, 10, 221, 0.38) inset;
        "></span>
        <span>${escapeHtml(label)}</span>
      </span>
    `;
  }

  if(catsEl){
    catsEl.innerHTML = categoriesHtml || `<div class="muted">Keine Kategorien</div>`;
  }
}


