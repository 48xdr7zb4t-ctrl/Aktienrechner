"use strict";

function setTableValueByCritId(critId, value){
  const id = normalizeCritId(critId);
  if(!id) return false;

  const tbody =
    (typeof _getTbody === "function" ? _getTbody() : null) ||
    (typeof el === "function" ? el("nutzenTableBody") : null);

  if(!tbody) return false;

  const rows = tbody.querySelectorAll("tr");

  for(const tr of rows){
    const labelTd = tr.querySelector("td[data-crit-id]");
    const rawId = labelTd?.getAttribute("data-crit-id");
    const rowId = normalizeCritId(rawId);

    if(rowId !== id) continue;

    const valTd = tr.querySelector(".nutzenVal");
    if(!valTd) return false;

    valTd.textContent =
      Number.isFinite(value) && value > 0
        ? value.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        : "–";

    delete valTd.dataset.cagrSource;
    delete valTd.dataset.cagrYears;

    return true;
  }

  return false;
}

function writeAutoFairValueToTable(fairValue){
  const normalized =
    Number.isFinite(fairValue) && fairValue > 0
      ? fairValue
      : NaN;

  return setTableValueByCritId("FAIR_VALUE", normalized);
}
function tableToMap(opts = {}){
  const { keepMissing = true, dropEmpty = false } = opts;

  const tbody = _getTbody();
  const map = new Map();
  if(!tbody) return map;

  const rows = tbody.querySelectorAll("tr");

  for(const tr of rows){
    const labelTd = tr.querySelector("td[data-crit-id]");
    const rawId = labelTd?.getAttribute("data-crit-id");
    const id = normalizeCritId(rawId);
    if(!id) continue;

    recalcSingleCagrCell(tr);

    const raw = _readRowValue(tr);
    const miss = isMissingValue(raw);

    if(dropEmpty && miss) continue;

    map.set(id, (keepMissing || !miss) ? normalizeRawText(raw) : "");
  }

  return map;
}

function buildNutzenCtxFromTableMap(m){
  const map =
    (m instanceof Map)
      ? m
      : (m && typeof m.entries === "function" && typeof m.get === "function")
        ? m
        : new Map(Object.entries(m || {}));

  const pctLooseSet =
    (typeof window !== "undefined" && window.PCT_LOOSE_IDS instanceof Set)
      ? window.PCT_LOOSE_IDS
      : (typeof PCT_LOOSE_IDS !== "undefined" && PCT_LOOSE_IDS instanceof Set)
        ? PCT_LOOSE_IDS
        : new Set();

  function resolveId(id){
    const rawId =
      typeof normalizeCritId === "function"
        ? normalizeCritId(id)
        : String(id || "").trim();

    if(typeof window !== "undefined" && typeof window.getDynamicCriteriaId === "function"){
      const dyn = window.getDynamicCriteriaId(rawId);
      return typeof normalizeCritId === "function" ? normalizeCritId(dyn) : String(dyn || "").trim();
    }

    return rawId;
  }

  function normalizeText(v){
    if(typeof normalizeRawText === "function"){
      return normalizeRawText(v);
    }
    return v == null ? "" : String(v).trim();
  }

  function raw(id){
    const key = resolveId(id);
    const value =
      typeof map.get === "function"
        ? map.get(key)
        : mGet?.(map, key);
    return normalizeText(value);
  }

  function isMissing(v){
    if(typeof isMissingValue === "function"){
      return isMissingValue(v);
    }
    const s = String(v ?? "").trim().toLowerCase();
    return !s || s === "–" || s === "-" || s === "na" || s === "n/a";
  }

  function missing(id){
    return isMissing(raw(id));
  }

  function hasValue(id){
    return !missing(id);
  }

  function isRangeLike(v){
    const s = String(v ?? "").trim();
    if(!s) return false;

    // Alles mit Bereich/Spanne/Mischwerten verwerfen
    if(/\s-\s/.test(s)) return true;
    if(/^-?\s*!?\-?\d[\d.,]*%?\s*-\s*!?\-?\d[\d.,]*%?$/i.test(s)) return true;
    if(/^\d[\d.,]*%?\s*-\s*!?\-?\d[\d.,]*%?$/i.test(s)) return true;

    return false;
  }

  function parseNumberById(id, value){
    const s0 = String(value ?? "").trim();
    if(isMissing(s0)) return NaN;
    if(isRangeLike(s0)) return NaN;

    let s = s0.replace(/\u00A0/g, " ").trim();

    // Spezialformat !-40,60
    s = s.replace(/^!-/g, "-");

    // Suffixe
    let mult = 1;
    if(/[Bb]$/.test(s)){
      mult = 1e9;
      s = s.slice(0, -1).trim();
    } else if(/[Mm]$/.test(s)){
      mult = 1e6;
      s = s.slice(0, -1).trim();
    } else if(/[Tt]$/.test(s)){
      mult = 1e12;
      s = s.slice(0, -1).trim();
    }

    s = s.replace(/%/g, "");

    // StockAnalysis-Logik:
    // normale Financial-Werte oft mit Tausender-Komma
    // kleine Werte wie 0,47 / 3,04 als Dezimal
    if(s.includes(",") && s.includes(".")){
      // gemischt: Kommas raus, Punkt bleibt decimal
      s = s.replace(/,/g, "");
    } else if(s.includes(",")){
      const parts = s.split(",");

      if(parts.length > 2){
        // 3,809,054
        s = parts.join("");
      } else if(parts.length === 2){
        const left = parts[0] || "";
        const right = parts[1] || "";

        const leftDigits = left.replace(/[^\d-]/g, "");
        const rightDigits = right.replace(/[^\d]/g, "");
        const leftAbs = Math.abs(Number(leftDigits || "0"));

        const looksThousands =
          rightDigits.length === 3 &&
          leftDigits !== "" &&
          leftAbs >= 1;

        if(looksThousands){
          s = left + right;
        } else {
          s = left + "." + right;
        }
      }
    }

    s = s.replace(/[^\d.+-]/g, "");

    const n = Number(s);
    return Number.isFinite(n) ? n * mult : NaN;
  }

  function parsePct01ById(id, value){
    const s0 = String(value ?? "").trim();
    if(isMissing(s0)) return NaN;
    if(isRangeLike(s0)) return NaN;

    let s = s0.replace(/\u00A0/g, " ").trim();
    s = s.replace(/^!-/g, "-");

    const hasPct = s.includes("%");
    s = s.replace(/%/g, "");

    if(s.includes(",") && s.includes(".")){
      s = s.replace(/\./g, "");
      s = s.replace(/,/g, ".");
    } else if(s.includes(",")){
      s = s.replace(/,/g, ".");
    }

    s = s.replace(/[^\d.+-]/g, "");

    const n = Number(s);
    if(!Number.isFinite(n)) return NaN;

    if(hasPct) return n / 100;
    if(Math.abs(n) <= 1) return n;
    return n / 100;
  }

  function num(id){
    const key = resolveId(id);
    const r = raw(key);
    if(isMissing(r)) return NaN;
    return parseNumberById(key, r);
  }

  function pct(id){
    const key = resolveId(id);
    const r = raw(key);
    if(isMissing(r)) return NaN;

    if(pctLooseSet.has(key)){
      if(typeof pct01Loose === "function"){
        const v = pct01Loose(r);
        return Number.isFinite(v) ? v : NaN;
      }
      if(typeof parsePctLoose01 === "function"){
        const v = parsePctLoose01(r);
        return Number.isFinite(v) ? v : NaN;
      }
    }

    if(typeof nzPct01 === "function"){
      const v = nzPct01(r);
      if(Number.isFinite(v)) return v;
    }

    return parsePct01ById(key, r);
  }

  function str(id){
    const r = raw(id);
    return isMissing(r) ? "" : r;
  }

  function boo(id){
    const r = raw(id);
    if(isMissing(r)) return null;

    if(typeof nzBool === "function"){
      return nzBool(r);
    }

    const s = r.trim().toLowerCase();
    if(["ja", "yes", "true", "1"].includes(s)) return true;
    if(["nein", "no", "false", "0"].includes(s)) return false;
    return null;
  }

  function range(id){
    const r = raw(id);
    if(isMissing(r)) return null;

    if(typeof parseRangeLoose === "function"){
      const parsed = parseRangeLoose(r);
      return parsed && Number.isFinite(parsed.low) && Number.isFinite(parsed.high)
        ? parsed
        : null;
    }

    return null;
  }

  function chk(label, ok, miss = false){
    return {
      label: String(label || ""),
      ok: !!ok,
      missing: !!miss
    };
  }

  return {
    m: map,
    raw,
    missing,
    hasValue,
    num,
    pct,
    str,
    boo,
    range,
    chk
  };
}


/* =========================
   Parsing Helpers
========================= */

function stripLeadingCalcMarkers(v){
  return String(v ?? "").replace(/^[!"`]+/, "").trim();
}

function normalizeCritId(v){
  return String(v ?? "").trim().toUpperCase();
}

function normalizeRawText(v){
  const raw = (typeof _nzText === "function")
    ? _nzText(v)
    : String(v ?? "").replace(/\u00a0/g, " ").trim();

  return stripLeadingCalcMarkers(raw);
}

function isMissingValue(v){
  if(typeof isMissing === "function") return isMissing(v);

  const s = String(v ?? "").trim().toLowerCase();
  return s === "" || s === "-" || s === "–" || s === "n/a" || s === "na";
}


function parseNumLoose(v){
  if(typeof _numParse === "function"){
    const n = _numParse(v);
    if(Number.isFinite(n)) return n;
  }

  if(typeof nzNumWithSuffix === "function"){
    const n = nzNumWithSuffix(v);
    if(Number.isFinite(n)) return n;
  }

  if(typeof nzNum === "function"){
    const n = nzNum(v);
    if(Number.isFinite(n)) return n;
  }

  let s = String(v ?? "")
    .replace(/\u00a0/g, " ")
    .trim();

  if(!s) return NaN;

  s = s.replace(/\s/g, "");

  // deutsches Format 1.234,56 -> 1234.56
  if(/^-?\d{1,3}(\.\d{3})*(,\d+)?$/.test(s)){
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    // sonst einfach Komma als Dezimaltrenner
    s = s.replace(",", ".");
  }

  const cleaned = s.replace(/[^0-9eE.+\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}


function parsePctLoose01(v){
  if(typeof _pctParse01 === "function"){
    const n = _pctParse01(v);
    if(Number.isFinite(n)) return n;
  }

  const raw = String(v ?? "").trim();
  if(!raw) return NaN;

  const hasPct = raw.includes("%");
  const n = parseNumLoose(raw.replace("%", ""));
  if(!Number.isFinite(n)) return NaN;

  return hasPct ? n / 100 : (Math.abs(n) > 1 ? n / 100 : n);
}

function parseRangeLoose(v){
  const raw = normalizeRawText(v);
  if(!raw) return null;

  const m = raw.match(/^\s*(-?\d+(?:[.,]\d+)?)\s*[–—]\s*(-?\d+(?:[.,]\d+)?)\s*$/);
  if(!m) return null;

  const low = parseNumLoose(m[1]);
  const high = parseNumLoose(m[2]);

  if(!Number.isFinite(low) || !Number.isFinite(high)) return null;

  return {
    low: Math.min(low, high),
    high: Math.max(low, high)
  };
}

function isCagrCritId(id){
  const key = normalizeCritId(id);
  return /_CAGR_\d+Y$/.test(key);
}

function parseYearRangeLoose(v){
  const raw = normalizeRawText(v);
  if(!raw) return null;

  const m = raw.match(/\b(19|20)\d{2}\s*[-–—]\s*((19|20)\d{2})\b/);
  if(!m) return null;

  const startYear = Number(m[0].split(/[-–—]/)[0].trim());
  const endYear = Number(m[2]);

  if(!Number.isFinite(startYear) || !Number.isFinite(endYear) || endYear <= startYear){
    return null;
  }

  return {
    startYear,
    endYear,
    years: endYear - startYear,
    points: (endYear - startYear) + 1
  };
}

function parseCagrSourceLoose(v){
  const raw = normalizeRawText(v);
  if(!raw) return null;

  const yearInfo = parseYearRangeLoose(raw);

  // Alle Zahlen finden
  const nums = raw.match(/-?\d+(?:[.,]\d+)?/g) || [];
  if(nums.length < 2) return null;

  const allParsed = nums
    .map(token => parseNumLoose(token))
    .filter(n => Number.isFinite(n));

  if(allParsed.length < 2) return null;

  let startValue = NaN;
  let endValue = NaN;

  if(yearInfo){
    // erste 2 Zahlen als Werte, Jahresbereich wird separat gelesen
    startValue = allParsed[0];
    endValue = allParsed[1];
  } else {
    startValue = allParsed[0];
    endValue = allParsed[1];
  }

  if(!Number.isFinite(startValue) || !Number.isFinite(endValue)) return null;
  if(startValue <= 0 || endValue < 0) return null;

  return {
    startValue,
    endValue,
    yearInfo
  };
}


function computeCagrPctFromValues(startValue, endValue, years){
  const start = Number(startValue);
  const end = Number(endValue);
  const y = Number(years);

  if(!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(y)) return NaN;
  if(start <= 0 || end < 0 || y <= 0) return NaN;

  return (Math.pow(end / start, 1 / y) - 1) * 100;
}

function formatPctDe(v){
  const n = Number(v);
  if(!Number.isFinite(n)) return "–";
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + "%";
}

function getSelectedCagrYearsSafe(){
  const n = Number(window.NUTZEN_STATE?.cagrYear);
  return Number.isFinite(n) && n > 0 ? n : 4;
}

function recalcSingleCagrCell(tr){
  if(!tr) return;

  const labelTd = tr.querySelector("td[data-crit-id]");
  const valTd = tr.querySelector(".nutzenVal");
  if(!labelTd || !valTd) return;

  const critId = normalizeCritId(labelTd.getAttribute("data-crit-id"));
  if(!isCagrCritId(critId)) return;

  const sourceRaw = normalizeRawText(valTd.dataset.cagrSource || valTd.textContent);
  if(!sourceRaw || isMissingValue(sourceRaw)) return;

  // Falls schon Prozentwert eingegeben wurde -> NICHT neu berechnen
  if(sourceRaw.includes("%")){
    valTd.textContent = sourceRaw;
    valTd.dataset.cagrSource = sourceRaw;
    delete valTd.dataset.cagrYears;
    return;
  }

  const parsed = parseCagrSourceLoose(sourceRaw);

  // Falls keine 2 Werte erkannt wurden -> nichts ändern
  if(!parsed) return;

  const years = parsed.yearInfo?.years || getSelectedCagrYearsSafe();
  const pct = computeCagrPctFromValues(parsed.startValue, parsed.endValue, years);
  if(!Number.isFinite(pct)) return;

  valTd.dataset.cagrSource = sourceRaw;
  valTd.dataset.cagrYears = String(years);
  valTd.textContent = formatPctDe(pct);
}


function recalcAllCagrRowsInTable(){
  const tbody = _getTbody();
  if(!tbody) return;

  const rows = tbody.querySelectorAll("tr");
  for(const tr of rows){
    recalcSingleCagrCell(tr);
  }
}

function wireExcelPaste(){
  const ta = el("excelPaste");
  const btnParse = el("btnParseExcel");
  const btnClear = el("btnClearExcel");
  const tbody = el("nutzenTableBody");

  if(!ta || !btnParse || !btnClear || !tbody) return;
  if(wireExcelPaste._bound) return;
  wireExcelPaste._bound = true;

  function parseExcelToRows(raw){
    const text = String(raw || "").trim();
    if(!text) return [];

    return text
      .split(/\r?\n/)
      .map(line => line.split("\t"))
      .filter(row => row.length >= 1);
  }



function applyParsedRows(rows){
  if(!rows.length) return;

  const trs = Array.from(tbody.querySelectorAll("tr"));
  if(!trs.length) return;

  const firstRow = rows[0] || [];
  const looksLikeHeaderValueTable =
    firstRow.length >= 2 &&
    (
      (normKey(firstRow[0]) === "header" && normKey(firstRow[1]) === "wert") ||
      (normKey(firstRow[0]) === "header" && normKey(firstRow[1]) === "value")
    );

  // 1) FALL A: echte Header/Wert-Tabelle -> per Mapping schreiben
  if(looksLikeHeaderValueTable){
    const byCritId = new Map();

    for(const tr of trs){
      const labelTd = tr.querySelector("td[data-crit-id]");
      const valTd = tr.querySelector(".nutzenVal");
      const critId = labelTd?.getAttribute("data-crit-id");
      if(critId && valTd) byCritId.set(critId, valTd);
    }

    for(const row of rows.slice(1)){
      const headerText = nzStr(row[0]);
      const valueText  = nzStr(row[1]);

      if(!headerText) continue;

      const critId = critIdFromHeaderTextSafe(headerText);
      if(!critId) continue;

      const tdVal = byCritId.get(critId);
      if(!tdVal) continue;

      const normalized = normalizeRawText(valueText) || "–";
      tdVal.textContent = normalized;

      if(isCagrCritId(critId)){
        tdVal.dataset.cagrSource = normalized;
        recalcSingleCagrCell(tdVal.closest("tr"));
      } else {
        delete tdVal.dataset.cagrSource;
        delete tdVal.dataset.cagrYears;
      }
    }

    return;
  }

  // 2) FALL B: normales Excel-Paste ohne Header-Mapping -> wieder zeilenbasiert
  for(let i = 0; i < trs.length; i++){
    const tr = trs[i];
    const tdVal = tr.querySelector(".nutzenVal");
    if(!tdVal) continue;

    const row = rows[i];
    if(!row) break;

    // Wenn 2 Spalten vorhanden: nimm Spalte 2 als Wert
    if(row.length >= 2){
      const normalized = normalizeRawText(nzStr(row[1])) || "–";
      tdVal.textContent = normalized;

      const critId = normalizeCritId(tr.querySelector("td[data-crit-id]")?.getAttribute("data-crit-id"));
      if(isCagrCritId(critId)){
        tdVal.dataset.cagrSource = normalized;
        recalcSingleCagrCell(tr);
      } else {
        delete tdVal.dataset.cagrSource;
        delete tdVal.dataset.cagrYears;
      }
    } else {
      const normalized = normalizeRawText(nzStr(row[0])) || "–";
      tdVal.textContent = normalized;

      const critId = normalizeCritId(tr.querySelector("td[data-crit-id]")?.getAttribute("data-crit-id"));
      if(isCagrCritId(critId)){
        tdVal.dataset.cagrSource = normalized;
        recalcSingleCagrCell(tr);
      } else {
        delete tdVal.dataset.cagrSource;
        delete tdVal.dataset.cagrYears;
      }
    }
  }
}




  btnParse.addEventListener("click", () => {
    const rows = parseExcelToRows(ta.value);
    applyParsedRows(rows);
    runAllCalcs?.();
  });

  btnClear.addEventListener("click", () => {
    ta.value = "";
    tbody.querySelectorAll(".nutzenVal").forEach(td => {
      td.textContent = "–";
    });
    runAllCalcs?.();
  });
}





window.tableToMap = tableToMap;
window.buildNutzenCtxFromTableMap = buildNutzenCtxFromTableMap;



