"use strict";

const monthMap = {
  jan:0, january:0,
  feb:1, february:1,
  mar:2, march:2,
  apr:3, april:3,
  may:4,
  jun:5, june:5,
  jul:6, july:6,
  aug:7, august:7,
  sep:8, sept:8, september:8,
  oct:9, october:9,
  nov:10, november:10,
  dec:11, december:11,
};


// DOM
function el(id){
  return document.getElementById(id);
}

function fillSelect(selectEl, items, currentValue){
  if(!selectEl) return;
  selectEl.innerHTML = "";

  for(const item of items){
    const opt = document.createElement("option");
    if(typeof item === "object"){
      opt.value = String(item.value);
      opt.textContent = item.label;
    } else {
      opt.value = String(item);
      opt.textContent = String(item);
    }
    selectEl.appendChild(opt);
  }

  if(currentValue != null){
    selectEl.value = String(currentValue);
  }
}

function escapeHtml(v){
  return nzStr(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// String / Missing / Normalize

function nzStr(v){
  return String(v ?? "").trim();
}

function isMissing(v){
  const s = nzStr(v).toLowerCase();
  return s === "" || s === "-" || s === "–" || s === "n/a" || s === "na";
}


function normKey(v){
  return nzStr(v)
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/[()]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


function _nzText(v){
  // normalisiert NBSP + trim
  return String(v ?? "").replace(/\u00a0/g, " ").trim();
}


// Numbers / Percent / Parse
function nzNumInput(v){
  let s = String(v ?? "")
    .replace(/\u00a0/g, " ")
    .trim();

  if(!s || s === "-" || s === "–") return NaN;

  s = s.replace(/[^\d,.\-]/g, "");

  if(!s) return NaN;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  if(hasComma && hasDot){
    s = s.replace(/\./g, "");
    s = s.replace(",", ".");
  } else if(hasComma){
    s = s.replace(",", ".");
  } else if(hasDot){
    const dotCount = (s.match(/\./g) || []).length;

    if(dotCount > 1){
      s = s.replace(/\./g, "");
    } else {
      const parts = s.split(".");
      if(parts.length === 2 && parts[1].length === 3 && parts[0].length >= 1){
        s = parts[0] + parts[1];
      }
    }
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}



function nzNumWithSuffix(v){
  const raw = nzStr(v)
    .replace(/\u00a0/g, " ")
    .trim();

  if(!raw || raw === "-" || raw === "–") return NaN;

  const s = raw.replace(/\s/g, "").replace(",", ".");
  const m = s.match(/^([+\-]?\d+(?:\.\d+)?)([kKmMbBtT])?$/);

  if(!m){
    return nzNumInput(raw);
  }

  const base = Number(m[1]);
  if(!Number.isFinite(base)) return NaN;

  const suffix = (m[2] || "").toUpperCase();

  const mult =
    suffix === "K" ? 1e3 :
    suffix === "M" ? 1e6 :
    suffix === "B" ? 1e9 :
    suffix === "T" ? 1e12 :
    1;

  return base * mult;
}

function nzNum(v){
  return nzNumInput(v);
}

function nzPct01(v){
  const raw = nzStr(v);
  if(!raw) return NaN;
  const hasPct = raw.includes("%");
  const n = nzNumInput(raw.replace("%", ""));
  if(!Number.isFinite(n)) return NaN;
  return hasPct ? n / 100 : (Math.abs(n) > 1 ? n / 100 : n);
}

function _numParse(v){
  if(typeof nzNumWithSuffix === "function") return nzNumWithSuffix(v);
  if(typeof nzNum === "function") return nzNum(v);
  if(typeof parseNum === "function") return parseNum(v);

  const s = _nzText(v).replace(/\s/g,"").replace(",",".").replace(/%/g,"");
  const cleaned = s.replace(/[^0-9eE.\-+]/g,"");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function _pctParse01(v){
  // bevorzugt: pct01Loose (du nutzt das für "35% / 28% ..." etc.)
  if(typeof pct01Loose === "function") return pct01Loose(v);

  // fallback: nzPct01, sonst simple
  if(typeof nzPct01 === "function") return nzPct01(v);

  const n = _numParse(v);
  if(!Number.isFinite(n)) return NaN;
  return (Math.abs(n) > 1.5) ? (n/100) : n; // 12 => 0.12
}

function parseNumAny(v){
    let s = String(v ?? "").trim();
    if(!s || s === "-" || s.toLowerCase() === "n/a") return NaN;

    // Entferne Spaces
    s = s.replace(/\s+/g, "");

    // Wenn sowohl , als auch . vorkommen -> meistens: , Tausender, . Dezimal
    if(s.includes(",") && s.includes(".")){
      s = s.replace(/,/g, "");
    } else {
      // nur Komma -> Dezimal-Komma
      if(s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
      // nur Punkt -> ok
      // nur Tausender-Punkt (6.075.302) -> wenn mehr als 1 Punkt und kein Komma: remove all dots
      if(!s.includes(",") && (s.match(/\./g)||[]).length > 1) s = s.replace(/\./g, "");
    }

    // alles außer Zahl/Minus/Punkt entfernen
    s = s.replace(/[^0-9.\-]/g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function parsePct01Any(v){
    let s = String(v ?? "").trim();
    if(!s || s === "-" || s.toLowerCase() === "n/a") return NaN;

    const hasPct = s.includes("%");
    // mache aus "3,14%" -> "3.14%"
    s = s.replace(/\s+/g, "");
    if(s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
    // entferne tausender-commas falls jemand "1,234.56%" schreibt
    if(s.includes(",") && s.includes(".")) s = s.replace(/,/g, "");
    s = s.replace(/%/g, "");
    s = s.replace(/[^0-9.\-]/g, "");

    const n = Number(s);
    if(!Number.isFinite(n)) return NaN;
    return hasPct ? (n/100) : n; // ohne %: schon dezimal erwartet
  }



// Format

function fmtDE(n, opts = {}){
  const max = Number.isFinite(opts.max) ? opts.max : 2;
  return Number.isFinite(n)
    ? n.toLocaleString("de-DE", { maximumFractionDigits: max })
    : "–";
}

function formatRuleValue(value, mode = "num"){
  if(mode === "str") return nzStr(value) || "–";
  if(!Number.isFinite(value)) return "–";

  if(mode === "pct"){
    return (value * 100).toLocaleString("de-DE", {
      maximumFractionDigits: 2
    }) + "%";
  }

  return value.toLocaleString("de-DE", {
    maximumFractionDigits: 2
  });
}

  function fmtPct01(x){
    return Number.isFinite(x)
      ? (x * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 }) + "%"
      : "–";
  }

// Math / arrays

function clamp(x, min, max){
  return Math.max(min, Math.min(max, x));
}

function medianFinite(arr){
  const a = (arr || []).filter(Number.isFinite).sort((x,y)=>x-y);
  if(a.length === 0) return NaN;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}


  function stdSample(arr){
    const a = arr.filter(Number.isFinite);
    const n = a.length;
    if(n < 2) return NaN;
    const mean = a.reduce((p,c)=>p+c,0) / n;
    let ss = 0;
    for(const x of a) ss += (x - mean) * (x - mean);
    return Math.sqrt(ss / (n - 1));
  }

// Data helpers

function mGet(m, key){
  if(!(m instanceof Map)) return "";
  return m.get(key);
}


function combineRoleBuckets(baseRoles, healthRoles){
  const base = Array.isArray(baseRoles) ? baseRoles : [];
  const health = Array.isArray(healthRoles) ? healthRoles : [];

  const byId = new Map();

  for(const r of [...base, ...health]){
    if(!r?.id) continue;

    if(!byId.has(r.id)){
      byId.set(r.id, {
        id: r.id,
        label: r.label || r.id,
        score: Number.isFinite(r.score) ? r.score : 0,
        active: !!r.active,
        why: Array.isArray(r.why) ? [...r.why] : [],
        fromBase: false,
        fromHealth: false
      });
    }

    const cur = byId.get(r.id);
    cur.score = Math.max(cur.score, Number.isFinite(r.score) ? r.score : 0);
    cur.active = cur.active || !!r.active;
    if(Array.isArray(r.why)) cur.why.push(...r.why);
  }

  for(const r of base){
    if(r?.id && byId.has(r.id)) byId.get(r.id).fromBase = true;
  }

  for(const r of health){
    if(r?.id && byId.has(r.id)) byId.get(r.id).fromHealth = true;
  }

  return Array.from(byId.values()).sort((a,b) => b.score - a.score);
}

// Table low-level helpers


function _getTbody(){
  return document.getElementById("nutzenTableBody");
}

function _readRowValue(tr){
  // Priorität: td.nutzenVal (contenteditable)
  const valTd = tr.querySelector("td.nutzenVal");
  if(valTd) return _nzText(valTd.textContent);

  // Fallback: input/textarea
  const inp = tr.querySelector("input, textarea");
  if(inp) return _nzText(inp.value);

  // Fallback: zweite Spalte (Wert)
  const tds = tr.querySelectorAll("td");
  if(tds.length >= 2) return _nzText(tds[1].textContent);

  return "";
}

// Optional generic parsing helpers

  function parseLines(raw){
    const s = String(raw || "").replace(/\r/g, "").trim();
    if(!s) return [];
    return s.split("\n").map(l => l.trim()).filter(Boolean);
  }

    function splitRow(line){
    if(line.includes("\t")) return line.split("\t").map(x => x.trim());
    return line.split(/\s{2,}/).map(x => x.trim());
  }

    function normTok(x){
    return String(x||"").toLowerCase().replace(/\./g,"").replace(/\s+/g,"").trim();
  }

    function isHeader(parts){
    if(!parts || parts.length < 2) return false;
    const t0 = normTok(parts[0]);
    const hasDate = (t0 === "date");
    const hasClose = parts.some(p => normTok(p) === "close" || normTok(p) === "adjclose");
    const hasOpen  = parts.some(p => normTok(p) === "open");
    return hasDate && hasClose && hasOpen;
  }

    function parseDateKey(dateStr){
    const s = String(dateStr||"").trim();
    if(!s) return NaN;

    // Year-only: "2026"
    if(/^\d{4}$/.test(s)) return Date.UTC(Number(s), 0, 1);

    // "Feb 27, 2026"
    const m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
    if(m){
      const mon = monthMap[m[1].toLowerCase()];
      if(mon == null) return NaN;
      const day = Number(m[2]);
      const year = Number(m[3]);
      return Date.UTC(year, mon, day);
    }

    // "2026-02-27" (falls mal so)
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(iso){
      return Date.UTC(Number(iso[1]), Number(iso[2])-1, Number(iso[3]));
    }

    return NaN;
  }

// Optional mapper
function critIdFromHeaderTextSafe(headerText){
  // 1) Primär: vorhandene strikte Implementierung nutzen (wenn sie NICHT diese Funktion ist)
  if (typeof window !== "undefined"
      && typeof window.critIdFromHeaderText === "function"
      && window.critIdFromHeaderText !== critIdFromHeaderTextSafe) {
    const id = window.critIdFromHeaderText(headerText);
    if (id) return id;
  }

  // 2) Fallback: Alias/Label-Match über CRITERIA aus window oder global
  const hk = normKey(headerText);

  const criteria =
    (typeof window !== "undefined" && window.CRITERIA) ? window.CRITERIA :
    (typeof CRITERIA !== "undefined" ? CRITERIA : null);

  if (!criteria) return null;

  for (const [id, def] of Object.entries(criteria)) {
    const aliases = (def && Array.isArray(def.aliases) && def.aliases.length)
      ? def.aliases
      : (def && def.label ? [def.label] : []);

    for (const a of aliases) {
      if (normKey(a) === hk) return id;
    }
  }
  return null;
}

// Rechner-Helfer 

function readPctInput(id, fallbackPct){
  const n = nzNumInput(el(id)?.value);
  return Number.isFinite(n) ? n : fallbackPct;
}

function parseIntLooseDE(v){
  const s = nzStr(v).replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : NaN;
}

