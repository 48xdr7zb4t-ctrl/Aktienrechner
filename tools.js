"use strict";


/* =========================================================
 Rechner/ Währung-, CAGR-, VOLA-
========================================================= */


     // Währungsrechner

function wireToolsFx(){
  const mode = el("fxMode");
  const rate = el("fxRate");
  const amt  = el("fxAmount");
  const lab  = el("fxAmountLabel");
  const out  = el("fxOut");
  const btn  = el("btnFxConvert");
  const refresh = el("btnFxRefresh");

  if(!mode || !rate || !amt || !lab || !out || !btn) return;
  if(wireToolsFx._bound) return;
  wireToolsFx._bound = true;

  const fmt2 = (n) => Number.isFinite(n)
    ? n.toLocaleString("de-DE", { maximumFractionDigits: 6 })
    : "–";

  function syncLabels(){
    if(mode.value === "USD_EUR"){
      lab.textContent = "Betrag (USD)";
      if(out.textContent === "–") out.textContent = "EUR: –";
    } else {
      lab.textContent = "Betrag (EUR)";
      if(out.textContent === "–") out.textContent = "USD: –";
    }
  }

  function convert(){
    const a = nzNumInput(amt.value);
    const r = nzNumInput(rate.value);
    if(!Number.isFinite(a) || !Number.isFinite(r)){
      out.textContent = "–";
      return;
    }
    const res = a * r;
    out.textContent = (mode.value === "USD_EUR")
      ? `EUR: ${fmt2(res)}`
      : `USD: ${fmt2(res)}`;
  }

  async function refreshRate(){
    if(!refresh || !rate) return;

    // Frankfurt API (EZB Referenzkurse): https://www.frankfurter.app/
    const from = (mode.value === "USD_EUR") ? "USD" : "EUR";
    const to   = (mode.value === "USD_EUR") ? "EUR" : "USD";

    refresh.disabled = true;
    const oldTxt = refresh.textContent;
    refresh.textContent = "Lade…";

    try{
      const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      const resp = await fetch(url, { cache: "no-store" });
      if(!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const r = data?.rates?.[to];

      if(!Number.isFinite(r)) throw new Error("Rate missing");

      // ins Input schreiben (DE Komma)
      rate.value = String(r).replace(".", ",");

      // optional: Output direkt aktualisieren, falls Betrag schon drin ist
      if(nzStr(amt.value).trim().length > 0) convert();

      // optional: kleines Feedback
      refresh.textContent = `Aktualisiert (${data?.date || "–"})`;
      setTimeout(() => { refresh.textContent = oldTxt; }, 1200);

    } catch(e){
      console.warn("FX refresh failed:", e);
      refresh.textContent = "Fehler";
      setTimeout(() => { refresh.textContent = oldTxt; }, 1200);
    } finally{
      refresh.disabled = false;
    }
  }

  mode.addEventListener("change", () => {
    out.textContent = "–";
    syncLabels();
  });

  btn.addEventListener("click", convert);
  refresh?.addEventListener("click", refreshRate);

  // Enter → Umrechnen
  amt.addEventListener("keydown", (e) => { if(e.key === "Enter") convert(); });
  rate.addEventListener("keydown", (e) => { if(e.key === "Enter") convert(); });

  syncLabels();
}




// CAGR Rechner 
function wireToolsCagr(){
  const modeEl = el("cagrMode");         // revenue/eps/dps
  const calcEl = el("cagrCalcMode");     // rate/end/start

  const sEl = el("cagrStart");
  const eEl = el("cagrEnd");
  const yEl = el("cagrYears");
  const rEl = el("cagrRate");

  const sLab = el("cagrStartLabel");
  const eLab = el("cagrEndLabel");
  const rLab = el("cagrRateLabel");

  const out = el("cagrOut");
  const meta = el("cagrMeta");
  const btn = el("btnCagrCalc");

  if(!modeEl || !calcEl || !sEl || !eEl || !yEl || !rEl || !sLab || !eLab || !rLab || !out || !meta || !btn) return;
  if(wireToolsCagr._bound) return;
  wireToolsCagr._bound = true;

  const labelByMode = (m) => {
    if(m === "eps") return { noun:"EPS", hint:"z.B. Gewinn je Aktie" };
    if(m === "dps") return { noun:"DPS", hint:"Dividend je Aktie" };
    return { noun:"Revenue", hint:"Umsatz (z.B. in Mio/Mrd)" };
  };

  const fmtNum = (n) => Number.isFinite(n)
    ? n.toLocaleString("de-DE", { maximumFractionDigits: 4 })
    : "–";

  const fmtPct = (x) => Number.isFinite(x)
    ? (x * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 }) + "%"
    : "–";

  function syncUI(){
    const m = modeEl.value;
    const { noun } = labelByMode(m);
    sLab.textContent = `Startwert (${noun})`;
    eLab.textContent = `Endwert (${noun})`;
    rLab.textContent = `CAGR (${noun}) %`;

    // je nach Berechnung: benötigte Felder aktivieren
    const calc = calcEl.value;

    // Standard: alles an, dann gezielt deaktivieren
    sEl.disabled = false;
    eEl.disabled = false;
    rEl.disabled = false;

    if(calc === "rate"){
      // Start+Ende+Jahre -> Rate (Rate wird ausgegeben, Eingabe optional)
      rEl.disabled = true;
      rEl.value = "";
    } else if(calc === "end"){
      // Start + Rate + Jahre -> Ende
      eEl.disabled = true;
      eEl.value = "";
    } else if(calc === "start"){
      // Ende + Rate + Jahre -> Start
      sEl.disabled = true;
      sEl.value = "";
    }
  }

  function calc(){
    const calcMode = calcEl.value;
    const years = nzNumInput(yEl.value);

    if(!(Number.isFinite(years) && years > 0)){
      out.textContent = "–";
      meta.textContent = "Bitte Jahre > 0 eingeben.";
      return;
    }

    // Rate als 0..1 (akzeptiert 12,5% oder 0,125)
    const rate01 = nzPct01(rEl.value);

    const start = nzNumInput(sEl.value);
    const end   = nzNumInput(eEl.value);

    if(calcMode === "rate"){
      if(!(Number.isFinite(start) && start > 0 && Number.isFinite(end) && end > 0)){
        out.textContent = "–";
        meta.textContent = "Für CAGR brauchst du Start > 0 und Ende > 0.";
        return;
      }
      const cagr = Math.pow(end / start, 1 / years) - 1;
      out.textContent = `CAGR: ${fmtPct(cagr)}`;
      meta.textContent = `Formel: (Ende/Start)^(1/Jahre) − 1 · Start=${fmtNum(start)} · Ende=${fmtNum(end)} · Jahre=${fmtNum(years)}`;
      return;
    }

if(!(Number.isFinite(rate01) && rate01 > -1)){
  out.textContent = "–";
  meta.textContent = "Bitte CAGR > -100% eingeben (z.B. 12,5%).";
  return;
}

    if(calcMode === "end"){
      if(!(Number.isFinite(start) && start > 0)){
        out.textContent = "–";
        meta.textContent = "Für Ende brauchst du Start > 0.";
        return;
      }
      const endVal = start * Math.pow(1 + rate01, years);
      out.textContent = `Endwert: ${fmtNum(endVal)}  (bei ${fmtPct(rate01)} p.a.)`;
      meta.textContent = `Formel: Ende = Start × (1+CAGR)^Jahre`;
      return;
    }

    if(calcMode === "start"){
      if(!(Number.isFinite(end) && end > 0)){
        out.textContent = "–";
        meta.textContent = "Für Start brauchst du Ende > 0.";
        return;
      }
      const startVal = end / Math.pow(1 + rate01, years);
      out.textContent = `Startwert: ${fmtNum(startVal)}  (bei ${fmtPct(rate01)} p.a.)`;
      meta.textContent = `Formel: Start = Ende ÷ (1+CAGR)^Jahre`;
      return;
    }
  }

  modeEl.addEventListener("change", syncUI);
  calcEl.addEventListener("change", syncUI);
  btn.addEventListener("click", calc);

  // Enter = berechnen (in allen Inputs)
  for(const inp of [sEl,eEl,yEl,rEl]){
    inp.addEventListener("keydown", (ev) => { if(ev.key === "Enter") calc(); });
  }

  syncUI();
}



     // VOLA rechenr

function wireToolsVola(){
  const modeEl = el("volMode");       // 1/5/10
  const freqEl = el("volFreq");       // daily/weekly/monthly
  const typeEl = el("volInputType");  // prices/returns
  const dataEl = el("volData");
  const outEl  = el("volOut");
  const metaEl = el("volMeta");
  const btn    = el("btnVolCalc");

  if(!modeEl || !freqEl || !typeEl || !dataEl || !outEl || !metaEl || !btn) return;
  if(wireToolsVola._bound) return;
  wireToolsVola._bound = true;

  const ppyByFreq = { daily:252, weekly:52, monthly:12 };



  // ✅ nimm AdjClose wenn numerisch, sonst Close
  function pickAdjOrClose(parts){
    // Date=0 Open=1 High=2 Low=3 Close=4 AdjClose=5 Change=6 Volume=7
    if(parts.length >= 6){
      const adj = parseNumAny(parts[5]);
      if(Number.isFinite(adj)) return adj;
    }
    if(parts.length >= 5) return parseNumAny(parts[4]);
    return parseNumAny(parts[parts.length - 1]);
  }

  function pickChange(parts){
    if(parts.length >= 7) return parsePct01Any(parts[6]);
    return parsePct01Any(parts[parts.length - 1]);
  }


  function calc(){
    const years = Number(modeEl.value) || 1;
    const freq  = freqEl.value || "daily";
    const ppy   = ppyByFreq[freq] || 252;
    const inputType = typeEl.value || "prices";

    let lines = parseLines(dataEl.value);
    if(lines.length < 2){
      outEl.textContent = "Volatilität: –";
      metaEl.textContent = "Bitte Daten einfügen (mind. 2 Zeilen).";
      return;
    }

    // ✅ 1) Alles rauswerfen, was Header/Headline/Quatsch ist
    //    (Headline = Zeile ohne brauchbare Zahlen im Close/AdjClose/Change)
    const rows = [];
    for(const line of lines){
      const parts = splitRow(line);

      if(isHeader(parts)) continue;

      // versuche Date key (optional), aber nicht zwingend
      const dateKey = parseDateKey(parts[0]);

      // versuche numerische Felder
      const price = pickAdjOrClose(parts);
      const chg   = pickChange(parts);

      const hasUseful =
        Number.isFinite(price) || Number.isFinite(chg);

      // Wenn gar nichts numerisch ist -> das ist eine Überschrift/Noise -> ignorieren
      if(!hasUseful) continue;

      rows.push({ line, parts, dateKey, price, chg });
    }

    if(rows.length < 3){
      outEl.textContent = "Volatilität: –";
      metaEl.textContent = "Zu wenig gültige Datenzeilen (Hinweis: Header/Headlines werden ignoriert).";
      return;
    }

    // ✅ 2) Reihenfolge automatisch: wenn Datum erkennbar -> sortiere chronologisch
    //       sonst: falls vermutlich neueste oben -> reverse (heuristik)
    const withDates = rows.filter(r => Number.isFinite(r.dateKey));
    if(withDates.length >= 2){
      // sortiere nach dateKey, und nimm nur Zeilen mit Datum + den Rest hinten dran
      rows.sort((a,b) => {
        const ak = a.dateKey, bk = b.dateKey;
        const aOk = Number.isFinite(ak), bOk = Number.isFinite(bk);
        if(aOk && bOk) return ak - bk;
        if(aOk && !bOk) return -1;
        if(!aOk && bOk) return 1;
        return 0;
      });
    } else {
      // Heuristik: neueste oben ist häufig → umdrehen
      rows.reverse();
    }

    // ✅ 3) Renditen bauen
    let rets = [];

    if(inputType === "returns"){
  // Change% in log-returns umwandeln
  const chgs = rows.map(r => r.chg).filter(Number.isFinite);

  if(chgs.length >= 2){
    for(const ch of chgs){
      if(ch <= -1) continue;
      rets.push(Math.log(1 + ch));
    }
  } else {
    // fallback: aus Preisen log-returns
    const prices = rows.map(r => r.price).filter(Number.isFinite);
    for(let i=1;i<prices.length;i++){
      const p0 = prices[i-1], p1 = prices[i];
      if(!(p0 > 0 && p1 > 0)) continue;
      rets.push(Math.log(p1 / p0));
    }
  }
}
    
    else {
      // prices -> aus Preisen log-returns
      const prices = rows.map(r => r.price).filter(Number.isFinite);
      if(prices.length < 2){
        outEl.textContent = "Volatilität: –";
        metaEl.textContent = "Konnte keine Close/Adj. Close Werte lesen (TAB/Spalten prüfen).";
        return;
      }
      for(let i=1;i<prices.length;i++){
        const p0 = prices[i-1], p1 = prices[i];
        if(!(p0 > 0 && p1 > 0)) continue;
        rets.push(Math.log(p1 / p0));
      }
    }

    if(rets.length < 2){
      outEl.textContent = "Volatilität: –";
      metaEl.textContent = "Zu wenig gültige Renditen für die Berechnung.";
      return;
    }

    // ✅ 4) Fenster (years * ppy) – wenn weniger Daten da sind, nimm alles
    const need = Math.round(years * ppy);
    const used = (rets.length >= need) ? rets.slice(-need) : rets.slice();

    const sd = stdSample(used);
    const vol = sd * Math.sqrt(ppy);

    outEl.textContent = `Volatilität: ${fmtPct01(vol)}`;
    metaEl.textContent =
      `Zeilen erkannt: ${rows.length} · Renditen: ${rets.length} · genutzt: ${used.length}/${need} · ` +
      `Zeitraum: ${years}Y · Frequency: ${freq} (${ppy}/Jahr) · Art: ${inputType === "prices" ? "Kurs→log-Renditen" : "Renditen (Change% / Fallback)"}`;
  }

  btn.addEventListener("click", calc);
  dataEl.addEventListener("keydown", (e) => {
    if((e.ctrlKey || e.metaKey) && e.key === "Enter") calc();
  });
}


//Div und Zins Rechner 

function getGermanCapitalTaxConfig(taxOn, churchOn, churchRateKey){
  if(!taxOn){
    return {
      churchRate: 0,
      capitalTaxRate: 0,
      soliRate: 0,
      effectiveRate: 0
    };
  }

  const churchRate =
    churchOn
      ? (churchRateKey === "8" ? 0.08 : 0.09)
      : 0;

  // § 32d Abs. 1 EStG: ESt auf Kapitalerträge bei Kirchensteuerpflicht
  // e / (4 + k)   mit q = 0
  const capitalTaxRate =
    churchRate > 0
      ? (1 / (4 + churchRate))
      : 0.25;

  const soliRate = capitalTaxRate * 0.055;
  const churchTaxRate = capitalTaxRate * churchRate;
  const effectiveRate = capitalTaxRate + soliRate + churchTaxRate;

  return {
    churchRate,
    capitalTaxRate,
    soliRate,
    effectiveRate
  };
}







// Dividenden Rechner
function wireToolsDividend(){
  const rowsHost            = el("dividendRows");
  const addBtn              = el("btnDividendAddRow");
  const modeEl              = el("divCalcMode");
  const taxEl               = el("divTaxMode");
  const churchEl            = el("divChurchTax");
  const allowEl             = el("divAllowanceMode");
  const sumEl               = el("dividendSummary");
  const metaEl              = el("dividendMeta");

  const desiredWrapEl       = el("divDesiredWrap");
  const desiredTotalEl      = el("divDesiredTotal");
  const desiredSecondEl     = el("divDesiredAvgYield");
  const distributeBtn       = el("btnDividendDistribute");

  if(
    !rowsHost || !addBtn || !modeEl || !taxEl || !churchEl || !allowEl ||
    !sumEl || !metaEl || !desiredWrapEl || !desiredTotalEl || !desiredSecondEl || !distributeBtn
  ) return;

  if(wireToolsDividend._bound) return;
  wireToolsDividend._bound = true;

  function getCalcMode(){
    return modeEl?.dataset.value || "dividends";
  }

  function fmtMoney(n){
    return Number.isFinite(n)
      ? n.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + " €"
      : "–";
  }

  function fmtPct(n){
    return Number.isFinite(n)
      ? (n * 100).toLocaleString("de-DE", {
          maximumFractionDigits: 2
        }) + "%"
      : "–";
  }

  function getAllowance(){
    const mode = allowEl?.dataset.value || "off";
    if(mode === "single") return 1000;
    if(mode === "married") return 2000;
    return 0;
  }

function syncDividendTaxUi(){
  const taxOn = (taxEl?.dataset.value || "off") === "on";
  const churchOn = (churchEl?.dataset.value || "off") === "on";

  const churchTaxWrap = el("divChurchTaxWrap");
  const churchRateWrap = el("divChurchRateWrap");

  if(churchTaxWrap){
    churchTaxWrap.style.display = taxOn ? "" : "none";
  }

  if(churchRateWrap){
    churchRateWrap.style.display = (taxOn && churchOn) ? "" : "none";
  }
}

function getTaxRate(){
  const taxOn = (taxEl?.dataset.value || "off") === "on";
  const churchOn = (churchEl?.dataset.value || "off") === "on";
  const churchRateKey = el("divChurchRate")?.dataset.value || "9";

  return getGermanCapitalTaxConfig(taxOn, churchOn, churchRateKey).effectiveRate;
}

function syncDesiredUi(){
  const calcMode = getCalcMode();

  const totalLabelEl = el("divDesiredTotalLabel");
  const secondLabelEl = el("divDesiredSecondLabel");

  desiredWrapEl.style.display =
    (calcMode === "dividends" || calcMode === "capital" || calcMode === "yield")
      ? "flex"
      : "none";

  if(calcMode === "dividends"){
    if(totalLabelEl) totalLabelEl.textContent = "Zu verteilendes Gesamtkapital";
    if(secondLabelEl) secondLabelEl.textContent = "Gewünschte Dividendenrendite";
    desiredTotalEl.placeholder = "z. B. 50.000";
    desiredSecondEl.placeholder = "z. B. 3,5%";
    desiredTotalEl.classList.add("js-capital-autoformat");
    desiredSecondEl.classList.remove("js-capital-autoformat");
    desiredSecondEl.classList.add("js-percent-autoformat");
  } else if(calcMode === "capital"){
    const taxOn = (taxEl?.dataset.value || "off") === "on";
    if(totalLabelEl) totalLabelEl.textContent = taxOn
      ? "Gewünschte Netto-Gesamtdividende"
      : "Gewünschte Brutto-Gesamtdividende";
    if(secondLabelEl) secondLabelEl.textContent = "Gewünschte Gesamt-Rendite";
    desiredTotalEl.placeholder = "z. B. 2.000";
    desiredSecondEl.placeholder = "z. B. 3,5%";
    desiredTotalEl.classList.add("js-capital-autoformat");
    desiredSecondEl.classList.remove("js-capital-autoformat");
    desiredSecondEl.classList.add("js-percent-autoformat");
  } else if(calcMode === "yield"){
    const taxOn = (taxEl?.dataset.value || "off") === "on";
    if(totalLabelEl) totalLabelEl.textContent = taxOn
      ? "Gewünschte Netto-Gesamtdividende"
      : "Gewünschte Brutto-Gesamtdividende";
    if(secondLabelEl) secondLabelEl.textContent = "Gewünschtes Gesamtkapital";
    desiredTotalEl.placeholder = "z. B. 2.000";
    desiredSecondEl.placeholder = "z. B. 50.000";
    desiredTotalEl.classList.add("js-capital-autoformat");
    desiredSecondEl.classList.add("js-capital-autoformat");
    desiredSecondEl.classList.remove("js-percent-autoformat");
  } else {
    if(totalLabelEl) totalLabelEl.textContent = "Wert 1";
    if(secondLabelEl) secondLabelEl.textContent = "Wert 2";
    desiredTotalEl.placeholder = "";
    desiredSecondEl.placeholder = "";
    desiredSecondEl.classList.remove("js-capital-autoformat");
    desiredSecondEl.classList.remove("js-percent-autoformat");
  }

  wireCapitalAutoFormat?.();
  wirePercentAutoFormat?.();
}


  function createRow(data = {}){
    const defaultCompany = nzStr(data.company) || nzStr(el("nutzenTicker")?.value);

    const row = document.createElement("div");
    row.className = "dividendRow";
    row.style.marginBottom = "10px";

  row.innerHTML = `
  <div class="divRowInner" style="width:100%">
    <div class="field" style="min-width:100%; margin-bottom:10px;">
      <label style="margin-bottom:6px;">Unternehmen (optional)</label>
      <input
        type="text"
        class="divCompany"
        value="${escapeHtml(defaultCompany)}"
        placeholder="z. B. Allianz"
      >
    </div>

    <div class="row" style="gap:10px; flex-wrap:wrap;">
      <label class="field" style="min-width:180px">
        <span>Kapital</span>
        <input
          type="text"
          class="divCapital js-capital-autoformat"
          value="${escapeHtml(data.capital || "")}"
          placeholder="z. B. 10.000"
        >
      </label>

      <label class="field" style="min-width:180px">
        <span>Dividendenrendite</span>
<input
  type="text"
  class="divYield js-percent-autoformat"
  value="${escapeHtml(data.yield || "")}"
  placeholder="z. B. 3,5%"
>
      </label>

      <label class="field" style="min-width:180px">
        <span>Dividenden</span>
        <input
          type="text"
          class="divDividends js-capital-autoformat"
          value="${escapeHtml(data.dividends || "")}"
          placeholder="z. B. 350"
        >
      </label>

      <div class="row" style="align-items:end">
        <button type="button" class="btn btnDividendRemove">✕</button>
      </div>
    </div>
  </div>
`;


rowsHost.appendChild(row);
wireCapitalAutoFormat?.();
wirePercentAutoFormat?.();


    const companyEl   = row.querySelector(".divCompany");
    const capitalEl   = row.querySelector(".divCapital");
    const yieldEl     = row.querySelector(".divYield");
    const dividendsEl = row.querySelector(".divDividends");
    const removeBtn   = row.querySelector(".btnDividendRemove");

    function syncRow(){
      const calcMode = getCalcMode();

      const capital = nzNumInput(capitalEl.value);
      const yield01 = nzPct01(yieldEl.value);
      const divs    = nzNumInput(dividendsEl.value);

      capitalEl.disabled = false;
      yieldEl.disabled = false;
      dividendsEl.disabled = false;

      if(calcMode === "dividends"){
        dividendsEl.disabled = true;

        if(Number.isFinite(capital) && capital >= 0 && Number.isFinite(yield01) && yield01 >= 0){
          const result = capital * yield01;
          dividendsEl.value = result.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        } else {
          dividendsEl.value = "";
        }
      }

      if(calcMode === "capital"){
        capitalEl.disabled = true;

        if(Number.isFinite(divs) && divs >= 0 && Number.isFinite(yield01) && yield01 > 0){
          const result = divs / yield01;
          capitalEl.value = result.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        } else {
          capitalEl.value = "";
        }
      }

      if(calcMode === "yield"){
        yieldEl.disabled = true;

        if(Number.isFinite(capital) && capital > 0 && Number.isFinite(divs) && divs >= 0){
          const result = divs / capital;
          yieldEl.value = (result * 100).toLocaleString("de-DE", {
            maximumFractionDigits: 2
          }) + "%";
        } else {
          yieldEl.value = "";
        }
      }

      renderSummary();
    }

    for(const inp of [companyEl, capitalEl, yieldEl, dividendsEl]){
      inp.addEventListener("input", syncRow);
      inp.addEventListener("keydown", (e) => {
        if(e.key === "Enter") syncRow();
      });
    }

    removeBtn.addEventListener("click", () => {
      row.remove();
      renderSummary();
    });

    syncRow();
  }


function renderSummary(){
  const rows = Array.from(rowsHost.querySelectorAll(".dividendRow"));
  const calcMode = getCalcMode();

const desiredNetTotal  = nzNumInput(desiredTotalEl?.value);
const desiredSecondNum = nzNumInput(desiredSecondEl?.value); // yield = Kapital
const desiredSecondPct = nzPct01(desiredSecondEl?.value);    // capital = Rendite

// semantische Alias-Namen für bessere Lesbarkeit
const desiredCapitalTotal = desiredNetTotal;   // im Modus "dividends"
const desiredNetDividends = desiredNetTotal;   // im Modus "capital"/"yield"

  const allowance = getAllowance();
  const taxRate   = getTaxRate();

  let totalCapital = 0;
  let totalGrossDividends = 0;
  let weightedYieldNumerator = 0;

  const detailLines = [];

  for(const row of rows){
    const companyEl   = row.querySelector(".divCompany");
    const capitalEl   = row.querySelector(".divCapital");
    const yieldEl     = row.querySelector(".divYield");
    const dividendsEl = row.querySelector(".divDividends");

    const company = nzStr(companyEl?.value);
    const capital = nzNumInput(capitalEl?.value);
    const yield01 = nzPct01(yieldEl?.value);
    const divs    = nzNumInput(dividendsEl?.value);

    if(Number.isFinite(capital) && capital >= 0) totalCapital += capital;
    if(Number.isFinite(divs) && divs >= 0) totalGrossDividends += divs;

    if(Number.isFinite(capital) && capital > 0 && Number.isFinite(yield01) && yield01 >= 0){
      weightedYieldNumerator += capital * yield01;
    }

    if(company || Number.isFinite(capital) || Number.isFinite(yield01) || Number.isFinite(divs)){
      detailLines.push(
        `${company || "Position"}: Kapital ${fmtMoney(capital)} · Rendite ${fmtPct(yield01)} · Dividenden ${fmtMoney(divs)}`
      );
    }
  }

  let desiredGrossTotal = NaN;
  let usedAllowance = 0;

if(Number.isFinite(desiredNetTotal) && desiredNetTotal >= 0){
  if(taxRate <= 0){
    desiredGrossTotal = desiredNetTotal;
    usedAllowance = 0;
  } else {
    if(desiredNetTotal <= allowance){
      desiredGrossTotal = desiredNetTotal;
    } else {
      desiredGrossTotal = allowance + ((desiredNetTotal - allowance) / (1 - taxRate));
    }

    usedAllowance = Math.min(allowance, desiredGrossTotal);
  }
}


  if(
    calcMode === "capital" &&
    Number.isFinite(desiredGrossTotal) && desiredGrossTotal >= 0 &&
    Number.isFinite(desiredSecondPct) && desiredSecondPct > 0
  ){
    if(totalCapital <= 0){
      totalCapital = desiredGrossTotal / desiredSecondPct;
    }
    if(totalGrossDividends <= 0){
      totalGrossDividends = desiredGrossTotal;
    }
    if(weightedYieldNumerator <= 0){
      weightedYieldNumerator = totalCapital * desiredSecondPct;
    }
  }

  if(
    calcMode === "yield" &&
    Number.isFinite(desiredGrossTotal) && desiredGrossTotal >= 0 &&
    Number.isFinite(desiredSecondNum) && desiredSecondNum > 0
  ){
    if(totalCapital <= 0){
      totalCapital = desiredSecondNum;
    }
    if(totalGrossDividends <= 0){
      totalGrossDividends = desiredGrossTotal;
    }
    if(weightedYieldNumerator <= 0){
      weightedYieldNumerator = desiredGrossTotal;
    }
  }
if(
  calcMode === "dividends" &&
  Number.isFinite(desiredCapitalTotal) && desiredCapitalTotal > 0 &&
  Number.isFinite(desiredSecondPct) && desiredSecondPct > 0
){
  if(totalCapital <= 0){
    totalCapital = desiredCapitalTotal;
  }
  if(totalGrossDividends <= 0){
    totalGrossDividends = desiredCapitalTotal * desiredSecondPct;
  }
  if(weightedYieldNumerator <= 0){
    weightedYieldNumerator = totalCapital * desiredSecondPct;
  }
}

  const avgYield = totalCapital > 0
    ? (weightedYieldNumerator / totalCapital)
    : NaN;

  const taxableBase = Math.max(0, totalGrossDividends - allowance);
  const taxAmount = taxableBase * taxRate;
  const totalNetDividends = totalGrossDividends - taxAmount;

  const taxOn = (taxEl?.dataset.value || "off") === "on";
  const shownDividends = taxOn ? totalNetDividends : totalGrossDividends;
  const resultLabel = taxOn ? "Gesamte Netto-Dividenden" : "Gesamte Brutto-Dividenden";

  const desiredShownTotal =
    taxOn
      ? desiredNetTotal
      : desiredGrossTotal;

  const desiredShownLabel =
    taxOn
      ? "Gewünschte Netto-Gesamtdividende"
      : "Gewünschte Brutto-Gesamtdividende";

  sumEl.innerHTML = `
    <div class="whyRoleBlock" style="margin:0">
      <div class="whyLine"><b>${resultLabel}:</b> ${fmtMoney(shownDividends)}</div>
      <div class="whyLine"><b>Gesamtes investiertes Kapital:</b> ${fmtMoney(totalCapital)}</div>
      <div class="whyLine"><b>Durchschnittsrendite:</b> ${fmtPct(avgYield)}</div>

      ${taxOn
        ? `<div class="whyLine"><b>Steuern:</b> ${fmtMoney(taxAmount)}</div>`
        : ""
      }

      ${(calcMode === "capital" || calcMode === "yield")
        ? `<div class="whyLine"><b>${desiredShownLabel}:</b> ${fmtMoney(desiredShownTotal)}</div>`
        : ""
      }

      ${(calcMode === "capital" || calcMode === "yield") && taxOn
        ? `<div class="whyLine"><b>Benutzter Freibetrag:</b> ${fmtMoney(usedAllowance)}</div>`
        : ""
      }

      ${calcMode === "capital"
        ? `<div class="whyLine"><b>Gewünschte Gesamt-Rendite:</b> ${fmtPct(desiredSecondPct)}</div>`
        : ""
      }

      ${calcMode === "yield"
        ? `<div class="whyLine"><b>Gewünschtes Gesamtkapital:</b> ${fmtMoney(desiredSecondNum)}</div>`
        : ""
      }

${calcMode === "dividends"
  ? `<div class="whyLine"><b>Zu verteilendes Gesamtkapital:</b> ${fmtMoney(desiredCapitalTotal)}</div>`
  : ""
}

${calcMode === "dividends"
  ? `<div class="whyLine"><b>Gewünschte Brutto-Dividendenrendite:</b> ${fmtPct(desiredSecondPct)}</div>`
  : ""
}
    </div>
  `;

metaEl.innerHTML = `
  <div class="muted">
    ${
      taxOn
        ? `Freibetrag gesamt: ${fmtMoney(allowance)} · Steuerquote: ${fmtPct(taxRate)}`
        : `Steuern: aus`
    }
  </div>
  ${
    detailLines.length
      ? detailLines.map(x => `<div class="muted">• ${escapeHtml(x)}</div>`).join("")
      : `<div class="muted">Noch keine Positionen eingetragen.</div>`
  }
`;
}



  function rerenderDividendRows(){
    const rows = Array.from(rowsHost.querySelectorAll(".dividendRow"));
    for(const row of rows){
      const capitalEl = row.querySelector(".divCapital");
      const yieldEl = row.querySelector(".divYield");
      const divEl = row.querySelector(".divDividends");

      if(capitalEl) capitalEl.dispatchEvent(new Event("input"));
      if(yieldEl) yieldEl.dispatchEvent(new Event("input"));
      if(divEl) divEl.dispatchEvent(new Event("input"));
    }
    renderSummary();
  }
  
function distributeDesiredDividendsRandom(){
  const calcMode = getCalcMode();
  if(calcMode !== "dividends" && calcMode !== "capital" && calcMode !== "yield") return;

  const allowance = getAllowance();
  const taxRate = getTaxRate();

  let targetGrossTotal = NaN;
  let targetAvgYield = NaN;
  let targetCapital = NaN;

  if(calcMode === "dividends"){
    targetCapital = nzNumInput(desiredTotalEl.value);
    targetAvgYield = nzPct01(desiredSecondEl.value);

    if(!(Number.isFinite(targetCapital) && targetCapital > 0)){
      alert("Bitte ein gültiges Startkapital eingeben.");
      return;
    }

    if(!(Number.isFinite(targetAvgYield) && targetAvgYield > 0)){
      alert("Bitte eine gültige Dividendenrendite eingeben, z. B. 3,5%.");
      return;
    }

    targetGrossTotal = targetCapital * targetAvgYield;
  }

  if(calcMode === "capital"){
    const targetNetTotal = nzNumInput(desiredTotalEl.value);

    if(!(Number.isFinite(targetNetTotal) && targetNetTotal > 0)){
      alert("Bitte eine gültige gewünschte Gesamtdividende eingeben.");
      return;
    }

    if(taxRate <= 0){
      targetGrossTotal = targetNetTotal;
    } else if(targetNetTotal <= allowance){
      targetGrossTotal = targetNetTotal;
    } else {
      targetGrossTotal = allowance + ((targetNetTotal - allowance) / (1 - taxRate));
    }

    targetAvgYield = nzPct01(desiredSecondEl.value);

    if(!(Number.isFinite(targetAvgYield) && targetAvgYield > 0)){
      alert("Bitte eine gültige Gesamt-Rendite eingeben, z. B. 3,5%.");
      return;
    }

    targetCapital = targetGrossTotal / targetAvgYield;
  }

  if(calcMode === "yield"){
    const targetNetTotal = nzNumInput(desiredTotalEl.value);
    targetCapital = nzNumInput(desiredSecondEl.value);

    if(!(Number.isFinite(targetNetTotal) && targetNetTotal > 0)){
      alert("Bitte eine gültige gewünschte Gesamtdividende eingeben.");
      return;
    }

    if(!(Number.isFinite(targetCapital) && targetCapital > 0)){
      alert("Bitte ein gültiges Gesamtkapital eingeben.");
      return;
    }

    if(taxRate <= 0){
      targetGrossTotal = targetNetTotal;
    } else if(targetNetTotal <= allowance){
      targetGrossTotal = targetNetTotal;
    } else {
      targetGrossTotal = allowance + ((targetNetTotal - allowance) / (1 - taxRate));
    }

    targetAvgYield = targetGrossTotal / targetCapital;
  }

  const rows = Array.from(rowsHost.querySelectorAll(".dividendRow"));
  if(!rows.length){
    alert("Es gibt noch keine Zeilen.");
    return;
  }

  const capWeights = rows.map(() => Math.random());
  const capWeightSum = capWeights.reduce((a, b) => a + b, 0);

  let minYield;
  let maxYield;

  if(targetAvgYield <= 0.04){
    minYield = Math.max(0.005, targetAvgYield * 0.7);
    maxYield = targetAvgYield * 1.3;
  } else if(targetAvgYield <= 0.06){
    minYield = Math.max(0.01, targetAvgYield * 0.65);
    maxYield = targetAvgYield * 1.4;
  } else {
    minYield = Math.max(0.015, targetAvgYield * 0.55);
    maxYield = targetAvgYield * 1.6;
  }

  maxYield = Math.min(maxYield, 0.12);

  const yields = rows.map(() => {
    return minYield + Math.random() * (maxYield - minYield);
  });

  const avgRawYield = yields.reduce((a, b) => a + b, 0) / yields.length;
  let scaledYields = yields.map(y => y * (targetAvgYield / avgRawYield));
  scaledYields = scaledYields.map(y => Math.min(Math.max(y, minYield), maxYield));

  const avgScaled = scaledYields.reduce((a, b) => a + b, 0) / scaledYields.length;
  if(avgScaled > 0){
    scaledYields = scaledYields.map(y => y * (targetAvgYield / avgScaled));
    scaledYields = scaledYields.map(y => Math.min(Math.max(y, minYield), maxYield));
  }

  let assignedCapital = 0;

  rows.forEach((row, idx) => {
    const yieldEl = row.querySelector(".divYield");
    const divEl   = row.querySelector(".divDividends");
    const capEl   = row.querySelector(".divCapital");

    let capitalPart;

    if(idx === rows.length - 1){
      capitalPart = Math.max(0, targetCapital - assignedCapital);
    } else {
      capitalPart = targetCapital * (capWeights[idx] / capWeightSum);
      capitalPart = Math.round(capitalPart * 100) / 100;
      assignedCapital += capitalPart;
    }

    const yield01 = scaledYields[idx];
    const divPart = capitalPart * yield01;

    yieldEl.value = (yield01 * 100).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + "%";

    capEl.value = Number.isFinite(capitalPart)
      ? capitalPart.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : "";

    divEl.value = Number.isFinite(divPart)
      ? divPart.toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : "";
  });

  wireCapitalAutoFormat?.();
  wirePercentAutoFormat?.();
  renderSummary();
}



  addBtn.addEventListener("click", () => {
    createRow();
  });

  distributeBtn.addEventListener("click", distributeDesiredDividendsRandom);
  desiredTotalEl.addEventListener("input", renderSummary);
  desiredSecondEl.addEventListener("input", renderSummary);

  modeEl.addEventListener("divchange", () => {
    syncDesiredUi();
    rerenderDividendRows();
  });

taxEl.addEventListener("divchange", () => {
  syncDividendTaxUi();
  syncDesiredUi();
  renderSummary();
});

churchEl.addEventListener("divchange", () => {
  syncDividendTaxUi();
  renderSummary();
});

el("divChurchRate")?.addEventListener("divchange", renderSummary);
allowEl.addEventListener("divchange", renderSummary);


  desiredTotalEl.classList.add("js-capital-autoformat");
wireCapitalAutoFormat?.();
wirePercentAutoFormat?.();

  syncDividendTaxUi();
  syncDesiredUi();
  createRow();
}




function wireDividendOptionGroups(){
  if(wireDividendOptionGroups._bound) return;
  wireDividendOptionGroups._bound = true;

const groups = [
  "divCalcMode",
  "divTaxMode",
  "divChurchTax",
  "divChurchRate",
  "divAllowanceMode"
];

  for(const id of groups){
    const host = el(id);
    if(!host) continue;

    host.addEventListener("click", (e) => {
      const btn = e.target.closest(".divOptionBtn");
      if(!btn) return;

      host.querySelectorAll(".divOptionBtn").forEach(x => x.classList.remove("isActive"));
      btn.classList.add("isActive");
      host.dataset.value = btn.dataset.value || "";
      host.dispatchEvent(new CustomEvent("divchange"));
    });

    const active = host.querySelector(".divOptionBtn.isActive");
    host.dataset.value = active?.dataset.value || "";
  }
}
// zinsrechner

/* =========================
   ZINSRECHNER
========================= */

function fmtMoneyDE(v){
  if(!Number.isFinite(v)) return "–";
  return v.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " €";
}

function fmtPctDE(v){
  if(!Number.isFinite(v)) return "–";
  return v.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " %";
}
function getInterestEffectiveStartDate(inp){
  const mode = inp?.startDateMode || "today";

  if(mode === "custom"){
    const raw = String(inp?.startDateRaw || "").trim();
    if(raw){
      const d = new Date(raw + "T00:00:00");
      if(!Number.isNaN(d.getTime())) return d;
    }
  }

  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDaysSafe(date, days){
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

function addMonthsSafe(date, months){
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYearsSafe(date, years){
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function diffCalendarYMD(startDate, endDate){
  let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const target = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  let years = 0;
  let months = 0;

  while(true){
    const next = addYearsSafe(cursor, 1);
    if(next <= target){
      cursor = next;
      years++;
    } else {
      break;
    }
  }

  while(true){
    const next = addMonthsSafe(cursor, 1);
    if(next <= target){
      cursor = next;
      months++;
    } else {
      break;
    }
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round((target - cursor) / msPerDay);

  return { years, months, days };
}



function fmtCalendarDurationDE(parts){
  if(!parts) return "–";

  const out = [];
  if(parts.years > 0) out.push(`${parts.years} Jahr${parts.years === 1 ? "" : "e"}`);
  if(parts.months > 0) out.push(`${parts.months} Monat${parts.months === 1 ? "" : "e"}`);
  if(parts.days > 0 || out.length === 0) out.push(`${parts.days} Tag${parts.days === 1 ? "" : "e"}`);
  return out.join(" ");
}

function computeCapitalOutcomeToDate(startCapital, ratePct, startDateInput, endDateInput, inp){
  const startDate = new Date(startDateInput.getFullYear(), startDateInput.getMonth(), startDateInput.getDate());
  const endDate = new Date(endDateInput.getFullYear(), endDateInput.getMonth(), endDateInput.getDate());

  if(!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) return null;
  if(!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) return null;
  if(endDate < startDate) return null;
  if(!Number.isFinite(startCapital) || !Number.isFinite(ratePct) || startCapital < 0 || ratePct <= -100) return null;

  const taxRate = getInterestTaxRate(inp);
  const taxOn = !!inp?.taxOn;
  const taxTiming = inp?.taxTiming || "yearly";
  const monthlyContribution = normalizeMonthlyContribution(inp?.monthlyContribution);

  const compoundFrequency = inp?.compoundFrequency || "yearly";
  const compoundMonths =
    compoundFrequency === "monthly" ? 1 :
    compoundFrequency === "quarterly" ? 3 :
    12;

  const periodicRate =
    compoundFrequency === "monthly" ? (ratePct / 100) / 12 :
    compoundFrequency === "quarterly" ? (ratePct / 100) / 4 :
    (ratePct / 100);

  const taxMonths =
    taxTiming === "monthly" ? 1 :
    taxTiming === "quarterly" ? 3 :
    12;

  let grossCapital = startCapital;
  let netCapital = startCapital;

  let totalContributions = 0;
  let totalContributionsNet = 0;
  let totalTax = 0;
  let taxableInterestSinceLastTax = 0;

  let nextContributionDate = addMonthsSafe(startDate, 1);
  let nextCompoundDate = addMonthsSafe(startDate, compoundMonths);
  let nextTaxDate = (taxTiming === "end") ? null : addMonthsSafe(startDate, taxMonths);

  function sameDay(a, b){
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  while(true){
    let nextEvent = null;

    for(const candidate of [nextContributionDate, nextCompoundDate, nextTaxDate]){
      if(!candidate) continue;
      if(candidate > endDate) continue;
      if(!nextEvent || candidate < nextEvent) nextEvent = candidate;
    }

    if(!nextEvent) break;

    if(nextContributionDate && sameDay(nextEvent, nextContributionDate)){
      grossCapital += monthlyContribution;
      netCapital += monthlyContribution;
      totalContributions += monthlyContribution;
      totalContributionsNet += monthlyContribution;
      nextContributionDate = addMonthsSafe(nextContributionDate, 1);
    }

    if(nextCompoundDate && sameDay(nextEvent, nextCompoundDate)){
      const grossInterest = grossCapital * periodicRate;
      grossCapital += grossInterest;

      const netInterest = netCapital * periodicRate;
      netCapital += netInterest;
      taxableInterestSinceLastTax += netInterest;

      nextCompoundDate = addMonthsSafe(nextCompoundDate, compoundMonths);
    }

    if(nextTaxDate && sameDay(nextEvent, nextTaxDate)){
      const taxThisPeriod = Math.max(0, taxableInterestSinceLastTax) * taxRate;
      netCapital -= taxThisPeriod;
      totalTax += taxThisPeriod;
      taxableInterestSinceLastTax = 0;

      nextTaxDate = addMonthsSafe(nextTaxDate, taxMonths);
    }
  }

  const grossEnd = grossCapital;
  const totalInvested = startCapital + totalContributions;
  const totalInterestGross = grossEnd - totalInvested;

  if(!taxOn){
    return {
      grossEnd,
      netEnd: grossEnd,
      totalInvested,
      totalContributions,
      totalInterestGross,
      totalInterestNet: totalInterestGross,
      totalTax: 0
    };
  }

  if(taxTiming === "end"){
    const totalTaxEnd = Math.max(0, totalInterestGross) * taxRate;
    const netEnd = grossEnd - totalTaxEnd;

    return {
      grossEnd,
      netEnd,
      totalInvested,
      totalContributions,
      totalInterestGross,
      totalInterestNet: netEnd - totalInvested,
      totalTax: totalTaxEnd
    };
  }

  return {
    grossEnd,
    netEnd: netCapital,
    totalInvested,
    totalContributions,
    totalInterestGross,
    totalInterestNet: netCapital - (startCapital + totalContributionsNet),
    totalTax
  };
}

function solveYearsForTargetExact(startCapital, ratePct, targetCapital, inp, useNet){
  if(!Number.isFinite(startCapital) || !Number.isFinite(ratePct) || !Number.isFinite(targetCapital)) return null;
  if(startCapital < 0 || targetCapital <= 0 || ratePct <= -100) return null;

  const startDate = getInterestEffectiveStartDate(inp);

  function valueAtDays(days){
    const endDate = addDaysSafe(startDate, days);
    const res = computeCapitalOutcomeToDate(startCapital, ratePct, startDate, endDate, inp);
    if(!res) return NaN;
    return useNet ? res.netEnd : res.grossEnd;
  }

  const startVal = valueAtDays(0);
  if(!Number.isFinite(startVal)) return null;
  if(startVal >= targetCapital){
    return {
      startDate,
      endDate: startDate,
      parts: { years: 0, months: 0, days: 0 },
      daysTotal: 0
    };
  }

  let lo = 0;
  let hi = 365;
  let hiVal = valueAtDays(hi);
  let guard = 0;

  while(Number.isFinite(hiVal) && hiVal < targetCapital && hi < 3652500 && guard < 200){
    hi *= 2;
    hiVal = valueAtDays(hi);
    guard++;
  }

  if(!Number.isFinite(hiVal) || hiVal < targetCapital) return null;

  while(lo + 1 < hi){
    const mid = Math.floor((lo + hi) / 2);
    const val = valueAtDays(mid);

    if(!Number.isFinite(val)) return null;
    if(val >= targetCapital) hi = mid;
    else lo = mid;
  }

  const endDate = addDaysSafe(startDate, hi);
  const parts = diffCalendarYMD(startDate, endDate);

  return {
    startDate,
    endDate,
    parts,
    daysTotal: hi
  };
}
function fmtYearsDE(v, startDate){
  if(!Number.isFinite(v) || v < 0) return "–";

  const base = startDate instanceof Date && !Number.isNaN(startDate.getTime())
    ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    : (() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      })();

  const totalDays = Math.round(v * 365.2425);
  const endDate = addDaysSafe(base, totalDays);
  const diff = diffCalendarYMD(base, endDate);

  const parts = [];

  if(diff.years > 0) parts.push(`${diff.years} Jahr${diff.years === 1 ? "" : "e"}`);
  if(diff.months > 0) parts.push(`${diff.months} Monat${diff.months === 1 ? "" : "e"}`);
  if(diff.days > 0 || parts.length === 0) parts.push(`${diff.days} Tag${diff.days === 1 ? "" : "e"}`);

  return parts.join(" ");
}


function readInterestInputsFromUI(){
  return {
    mode: el("interestCalcMode")?.dataset.value || "capital",
    compoundFrequency: el("interestCompoundFrequency")?.dataset.value || "yearly",
    taxOn: (el("interestTaxMode")?.dataset.value || "off") === "on",
    churchTaxOn: (el("interestChurchTaxMode")?.dataset.value || "off") === "on",
    churchTaxRateKey: el("interestChurchRateMode")?.dataset.value || "9",
    taxTiming: el("interestTaxTiming")?.dataset.value || "yearly",

    startDateMode: el("interestStartDateMode")?.dataset.value || "today",
    startDateRaw: el("interestStartDate")?.value || "",

    startCapital: nzNumInput(el("interestStartCapital")?.value),
    monthlyContribution: nzNumInput(el("interestMonthlyContribution")?.value),
    ratePct: nzNumInput(el("interestRate")?.value),
    years: nzNumInput(el("interestYears")?.value),
    targetCapital: nzNumInput(el("interestTargetCapital")?.value)
  };
}

function getInterestTaxRate(inp){
  return getGermanCapitalTaxConfig(
    !!inp?.taxOn,
    !!inp?.churchTaxOn,
    inp?.churchTaxRateKey || "9"
  ).effectiveRate;
}

function normalizeMonthlyContribution(v){
  if(!Number.isFinite(v)) return 0;
  return Math.max(0, v);
}



function computeCapitalOutcome(startCapital, ratePct, years, inp){
  if(!Number.isFinite(startCapital) || !Number.isFinite(ratePct) || !Number.isFinite(years)) return null;
  if(startCapital < 0 || years < 0) return null;
  if(ratePct <= -100) return null;

  const taxRate = getInterestTaxRate(inp);
  const taxOn = !!inp?.taxOn;
  const taxTiming = inp?.taxTiming || "yearly";
  const monthlyContribution = normalizeMonthlyContribution(inp?.monthlyContribution);

const compoundFrequency = inp?.compoundFrequency || "yearly";
const annualRate = ratePct / 100;

const compoundEveryMonths =
  compoundFrequency === "monthly" ? 1 :
  compoundFrequency === "quarterly" ? 3 :
  12;

function applyDiscreteGrowth(capital, monthsStep){
  if(!(Number.isFinite(capital) && Number.isFinite(monthsStep) && monthsStep >= 0)) return NaN;

  if(monthsStep <= 0) return capital;

  const fullMonths = Math.floor(monthsStep);
  const restMonths = monthsStep - fullMonths;

  let c = capital;

  // volle Monate: Zins nur dann, wenn ein kompletter Zinsblock endet
  for(let i = 1; i <= fullMonths; i++){
    if(i % compoundEveryMonths === 0){
      if(compoundFrequency === "monthly"){
        c *= (1 + annualRate / 12);
      } else if(compoundFrequency === "quarterly"){
        c *= (1 + annualRate / 4);
      } else {
        c *= (1 + annualRate);
      }
    }
  }

  // Restmonat nur bei monthly sinnvoll verzinsen
  if(restMonths > 0 && compoundFrequency === "monthly"){
    c *= Math.pow(1 + annualRate / 12, restMonths);
  }

  return c;
}

  const totalMonthsExact = years * 12;
  const fullMonths = Math.floor(totalMonthsExact);
  const restMonth = totalMonthsExact - fullMonths;

  let grossCapital = startCapital;
  let totalContributions = 0;

  for(let m = 1; m <= fullMonths; m++){
    const before = grossCapital;
    grossCapital = applyDiscreteGrowth(before, 1);
    grossCapital += monthlyContribution;
    totalContributions += monthlyContribution;
  }

  if(restMonth > 0){
    grossCapital = applyDiscreteGrowth(grossCapital, restMonth);
    const partialContribution = monthlyContribution * restMonth;
    grossCapital += partialContribution;
    totalContributions += partialContribution;
  }

  const grossEnd = grossCapital;
  if(!Number.isFinite(grossEnd)) return null;

  const totalInvested = startCapital + totalContributions;
  const totalInterestGross = grossEnd - totalInvested;

  if(!taxOn){
    return {
      grossEnd,
      netEnd: grossEnd,
      totalInvested,
      totalContributions,
      totalInterestGross,
      totalInterestNet: totalInterestGross,
      totalTax: 0
    };
  }

  if(taxTiming === "end"){
    const totalTax = Math.max(0, totalInterestGross) * taxRate;
    const netEnd = grossEnd - totalTax;

    return {
      grossEnd,
      netEnd,
      totalInvested,
      totalContributions,
      totalInterestGross,
      totalInterestNet: netEnd - totalInvested,
      totalTax
    };
  }

  const taxMonths =
    taxTiming === "monthly" ? 1 :
    taxTiming === "quarterly" ? 3 :
    12;

  let netCapital = startCapital;
  let totalTax = 0;
  let totalContributionsNet = 0;

  let remainingMonths = totalMonthsExact;

  while(remainingMonths > 1e-12){
    const stepMonths = Math.min(taxMonths, remainingMonths);
    const fullStepMonths = Math.floor(stepMonths);
    const restStepMonth = stepMonths - fullStepMonths;

    const before = netCapital;

    for(let m = 1; m <= fullStepMonths; m++){
      netCapital = applyDiscreteGrowth(netCapital, 1);
      netCapital += monthlyContribution;
      totalContributionsNet += monthlyContribution;
    }

    if(restStepMonth > 0){
      netCapital = applyDiscreteGrowth(netCapital, restStepMonth);
      const partialContribution = monthlyContribution * restStepMonth;
      netCapital += partialContribution;
      totalContributionsNet += partialContribution;
    }

    const investedBeforeStep = before + (
      fullStepMonths * monthlyContribution + monthlyContribution * restStepMonth
    );

    const interestThisPeriod = netCapital - investedBeforeStep;
    const taxThisPeriod = Math.max(0, interestThisPeriod) * taxRate;

    netCapital -= taxThisPeriod;
    totalTax += taxThisPeriod;

    remainingMonths -= stepMonths;
  }

  return {
    grossEnd,
    netEnd: netCapital,
    totalInvested,
    totalContributions,
    totalInterestGross,
    totalInterestNet: netCapital - (startCapital + totalContributionsNet),
    totalTax
  };
}

function solveRateForTarget(startCapital, targetCapital, years, inp, useNet){
  if(!Number.isFinite(startCapital) || !Number.isFinite(targetCapital) || !Number.isFinite(years)) return NaN;
  if(startCapital < 0 || targetCapital <= 0 || years <= 0) return NaN;

  let lo = -99.9999;
  let hi = 100;

  function valueAt(ratePct){
    const res = computeCapitalOutcome(startCapital, ratePct, years, inp);
    if(!res) return NaN;
    return useNet ? res.netEnd : res.grossEnd;
  }

  let loVal = valueAt(lo);
  let hiVal = valueAt(hi);

  let guard = 0;
  while(Number.isFinite(hiVal) && hiVal < targetCapital && hi < 100000 && guard < 120){
    hi *= 2;
    hiVal = valueAt(hi);
    guard++;
  }

  if(!Number.isFinite(loVal) || !Number.isFinite(hiVal)) return NaN;
  if(loVal > targetCapital) return NaN;
  if(hiVal < targetCapital) return NaN;

  for(let i = 0; i < 180; i++){
    const mid = (lo + hi) / 2;
    const val = valueAt(mid);

    if(!Number.isFinite(val)) return NaN;
    if(val >= targetCapital) hi = mid;
    else lo = mid;
  }

  return (lo + hi) / 2;
}

function solveYearsForTarget(startCapital, ratePct, targetCapital, inp, useNet){
  if(!Number.isFinite(startCapital) || !Number.isFinite(ratePct) || !Number.isFinite(targetCapital)) return NaN;
  if(startCapital < 0 || targetCapital <= 0) return NaN;
  if(ratePct <= -100) return NaN;

  let lo = 0;
  let hi = 100;

  function valueAt(years){
    const res = computeCapitalOutcome(startCapital, ratePct, years, inp);
    if(!res) return NaN;
    return useNet ? res.netEnd : res.grossEnd;
  }

  let loVal = valueAt(lo);
  if(!Number.isFinite(loVal)) return NaN;
  if(loVal >= targetCapital) return 0;

  let hiVal = valueAt(hi);
  let guard = 0;

  while(Number.isFinite(hiVal) && hiVal < targetCapital && hi < 10000 && guard < 120){
    hi *= 2;
    hiVal = valueAt(hi);
    guard++;
  }

  if(!Number.isFinite(hiVal) || hiVal < targetCapital) return NaN;

  for(let i = 0; i < 180; i++){
    const mid = (lo + hi) / 2;
    const val = valueAt(mid);

    if(!Number.isFinite(val)) return NaN;
    if(val >= targetCapital) hi = mid;
    else lo = mid;
  }

  return (lo + hi) / 2;
}

function solveStartCapitalForTarget(ratePct, years, targetCapital, inp, useNet){
  if(!Number.isFinite(ratePct) || !Number.isFinite(years) || !Number.isFinite(targetCapital)) return NaN;
  if(targetCapital <= 0 || years < 0) return NaN;
  if(ratePct <= -100) return NaN;

  if(years === 0){
    return Math.max(0, targetCapital - normalizeMonthlyContribution(inp?.monthlyContribution) * 0);
  }

  let lo = 0;
  let hi = Math.max(targetCapital, 1);

  function valueAt(startCapital){
    const res = computeCapitalOutcome(startCapital, ratePct, years, inp);
    if(!res) return NaN;
    return useNet ? res.netEnd : res.grossEnd;
  }

  let hiVal = valueAt(hi);
  let guard = 0;

  while(Number.isFinite(hiVal) && hiVal < targetCapital && hi < 1e15 && guard < 120){
    hi *= 2;
    hiVal = valueAt(hi);
    guard++;
  }

  if(!Number.isFinite(hiVal) || hiVal < targetCapital) return NaN;

  for(let i = 0; i < 180; i++){
    const mid = (lo + hi) / 2;
    const val = valueAt(mid);

    if(!Number.isFinite(val)) return NaN;
    if(val >= targetCapital) hi = mid;
    else lo = mid;
  }

  return (lo + hi) / 2;
}







function computeInterestResult(inp){
  const mode = inp.mode;
  const taxOn = !!inp.taxOn;

  if(mode === "capital"){
    const res = computeCapitalOutcome(inp.startCapital, inp.ratePct, inp.years, inp);
    if(!res) return null;

    return {
      mainLabel: taxOn ? "Netto-Endkapital" : "Brutto-Endkapital",
      mainValue: fmtMoneyDE(taxOn ? res.netEnd : res.grossEnd),

      label1: "Monatliche Sparrate",
      value1: fmtMoneyDE(inp.monthlyContribution || 0),

      label2: taxOn ? "Netto-Zinsen gesamt" : "Brutto-Zinsen gesamt",
      value2: fmtMoneyDE(taxOn ? res.totalInterestNet : res.totalInterestGross),

      label3: "Gesamt eingezahlt",
      value3: fmtMoneyDE(res.totalInvested),

      label4: taxOn ? "Steuern gesamt" : "Steuermodus",
      value4: taxOn ? fmtMoneyDE(res.totalTax) : "Ohne Steuern",

      hint: "Berechnet aus Startkapital, monatlicher Sparrate, Zinssatz, Verzinsung und Laufzeit."
    };
  }

  if(mode === "rate"){
    const grossRate = solveRateForTarget(inp.startCapital, inp.targetCapital, inp.years, inp, false);
    const netRate = solveRateForTarget(inp.startCapital, inp.targetCapital, inp.years, inp, true);

    return {
      mainLabel: taxOn ? "Benötigter Netto-Zins" : "Benötigter Brutto-Zins",
      mainValue: fmtPctDE(taxOn ? netRate : grossRate),

      label1: "Monatliche Sparrate",
      value1: fmtMoneyDE(inp.monthlyContribution || 0),

      label2: "Zielkapital",
      value2: fmtMoneyDE(inp.targetCapital),

      label3: "Laufzeit",
      value3: fmtYearsDE(inp.years, getInterestEffectiveStartDate(inp)),

      label4: "Steuermodus",
      value4: taxOn ? "Mit Steuern" : "Ohne Steuern",

      hint: "Die monatliche Sparrate wird bei der benötigten Zinsberechnung berücksichtigt."
    };
  }

if(mode === "years"){
  const grossYearsExact = solveYearsForTargetExact(inp.startCapital, inp.ratePct, inp.targetCapital, inp, false);
  const netYearsExact = solveYearsForTargetExact(inp.startCapital, inp.ratePct, inp.targetCapital, inp, true);

  const shown = taxOn ? netYearsExact : grossYearsExact;

  return {
    mainLabel: taxOn ? "Benötigte Netto-Zeit" : "Benötigte Brutto-Zeit",
    mainValue: shown ? fmtCalendarDurationDE(shown.parts) : "–",

    label1: "Monatliche Sparrate",
    value1: fmtMoneyDE(inp.monthlyContribution || 0),

    label2: "Zielkapital",
    value2: fmtMoneyDE(inp.targetCapital),

    label3: "Zinssatz",
    value3: fmtPctDE(inp.ratePct),

    label4: "Ziel-Datum",
    value4: shown
      ? shown.endDate.toLocaleDateString("de-DE", { day:"2-digit", month:"2-digit", year:"numeric" })
      : "–",

    hint: "Kalenderexakt ausgehend vom gewählten Startdatum berechnet."
  };
}

  if(mode === "target"){
    const grossStart = solveStartCapitalForTarget(inp.ratePct, inp.years, inp.targetCapital, inp, false);
    const netStart = solveStartCapitalForTarget(inp.ratePct, inp.years, inp.targetCapital, inp, true);

    return {
      mainLabel: taxOn ? "Benötigtes Netto-Startkapital" : "Benötigtes Brutto-Startkapital",
      mainValue: fmtMoneyDE(taxOn ? netStart : grossStart),

      label1: "Monatliche Sparrate",
      value1: fmtMoneyDE(inp.monthlyContribution || 0),

      label2: "Zielkapital",
      value2: fmtMoneyDE(inp.targetCapital),

      label3: "Zinssatz",
      value3: fmtPctDE(inp.ratePct),

      label4: "Steuermodus",
      value4: taxOn ? "Mit Steuern" : "Ohne Steuern",

      hint: "Die monatliche Sparrate wird bei der Berechnung des nötigen Startkapitals berücksichtigt."
    };
  }

  return null;
}

function renderInterestResult(result){
  const mainLabelEl = el("interestMainResultLabel");
  const mainValueEl = el("interestMainResult");

  const label1El = el("interestLabel1");
  const label2El = el("interestLabel2");
  const label3El = el("interestLabel3");
  const label4El = el("interestLabel4");

  const value1El = el("interestGrossEnd");
  const value2El = el("interestNetEnd");
  const value3El = el("interestTotalInterest");
  const value4El = el("interestTotalTax");

  const hintEl = el("interestResultHint");

  if(!mainLabelEl || !mainValueEl || !label1El || !label2El || !label3El || !label4El || !value1El || !value2El || !value3El || !value4El || !hintEl){
    return;
  }

  if(!result){
    mainLabelEl.textContent = "Ergebnis";
    mainValueEl.textContent = "–";

    label1El.textContent = "Wert 1";
    label2El.textContent = "Wert 2";
    label3El.textContent = "Wert 3";
    label4El.textContent = "Wert 4";

    value1El.textContent = "–";
    value2El.textContent = "–";
    value3El.textContent = "–";
    value4El.textContent = "–";
    hintEl.textContent = "Bitte gültige Werte eingeben.";
    return;
  }

  mainLabelEl.textContent = result.mainLabel || "Ergebnis";
  mainValueEl.textContent = result.mainValue || "–";

  label1El.textContent = result.label1 || "–";
  label2El.textContent = result.label2 || "–";
  label3El.textContent = result.label3 || "–";
  label4El.textContent = result.label4 || "–";

  value1El.textContent = result.value1 || "–";
  value2El.textContent = result.value2 || "–";
  value3El.textContent = result.value3 || "–";
  value4El.textContent = result.value4 || "–";

  hintEl.textContent = result.hint || "–";
}
function updateInterestFieldVisibility(){
  const mode = el("interestCalcMode")?.dataset.value || "capital";
  const taxOn = (el("interestTaxMode")?.dataset.value || "off") === "on";
  const churchOn = (el("interestChurchTaxMode")?.dataset.value || "off") === "on";
  const startDateMode = el("interestStartDateMode")?.dataset.value || "today";

  const fieldStart = el("interestFieldStart");
  const fieldStartDate = el("interestFieldStartDate");
  const startDateModeHost = el("interestStartDateMode");
  const startDateModeBox = startDateModeHost?.closest(".divCtrlBox");

  const fieldRate = el("interestFieldRate");
  const fieldYears = el("interestFieldYears");
  const fieldTarget = el("interestFieldTarget");

  const fieldChurch = el("interestFieldChurchTax");
  const fieldChurchRate = el("interestFieldChurchRate");
  const fieldTaxTiming = el("interestFieldTaxTiming");
  const fieldCompoundingFrequency = el("interestFieldCompoundingFrequency");

  if(fieldStart) fieldStart.style.display = "";
  if(fieldRate) fieldRate.style.display = "";
  if(fieldYears) fieldYears.style.display = "";
  if(fieldTarget) fieldTarget.style.display = "";
  if(fieldCompoundingFrequency) fieldCompoundingFrequency.style.display = "";

  if(mode === "capital" && fieldTarget) fieldTarget.style.display = "none";
  if(mode === "rate" && fieldRate) fieldRate.style.display = "none";
  if(mode === "years" && fieldYears) fieldYears.style.display = "none";
  if(mode === "target" && fieldStart) fieldStart.style.display = "none";

  const showStartDateControls = (mode === "years");

  if(startDateModeBox){
    startDateModeBox.style.display = showStartDateControls ? "" : "none";
  }

  if(fieldStartDate){
    fieldStartDate.style.display =
      (showStartDateControls && startDateMode === "custom") ? "" : "none";
  }

  if(fieldChurch) fieldChurch.style.display = taxOn ? "" : "none";
  if(fieldChurchRate) fieldChurchRate.style.display = (taxOn && churchOn) ? "" : "none";
  if(fieldTaxTiming) fieldTaxTiming.style.display = taxOn ? "" : "none";
}

function runInterestCalculator(){
  const inp = readInterestInputsFromUI();
  const result = computeInterestResult(inp);
  renderInterestResult(result);
}

function wireInterestInputsRealtime(){
[
  "interestStartCapital",
  "interestMonthlyContribution",
  "interestRate",
  "interestYears",
  "interestTargetCapital"
].forEach(id => {
    const node = el(id);
    if(!node) return;

    node.addEventListener("input", runInterestCalculator);
    node.addEventListener("keydown", (e) => {
      if(e.key === "Enter") runInterestCalculator();
    });
  });
}

function wireInterestOptionGroups(){
  if(wireInterestOptionGroups._bound) return;
  wireInterestOptionGroups._bound = true;

  const groups = [
  "interestCalcMode",
  "interestCompoundFrequency",
  "interestTaxMode",
  "interestChurchTaxMode",
  "interestChurchRateMode",
  "interestTaxTiming",
  "interestStartDateMode"
];

  for(const id of groups){
    const host = el(id);
    if(!host) continue;

    host.addEventListener("click", (e) => {
      const btn = e.target.closest(".divOptionBtn");
      if(!btn) return;

      host.querySelectorAll(".divOptionBtn").forEach(x => x.classList.remove("isActive"));
      btn.classList.add("isActive");
      host.dataset.value = btn.dataset.value || "";
      host.dispatchEvent(new CustomEvent("divchange"));
    });

    const active = host.querySelector(".divOptionBtn.isActive");
    host.dataset.value = active?.dataset.value || "";
  }
}

function wireInterestCalculator(){
  if(wireInterestCalculator._bound) return;
  wireInterestCalculator._bound = true;

  const calcModeEl = el("interestCalcMode");
  const compoundFrequencyEl = el("interestCompoundFrequency");
  const taxEl = el("interestTaxMode");
  const churchEl = el("interestChurchTaxMode");
  const timingEl = el("interestTaxTiming");
  const churchRateEl = el("interestChurchRateMode");
  const startDateModeEl = el("interestStartDateMode");
const startDateEl = el("interestStartDate");

if(startDateEl && !startDateEl.value){
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  startDateEl.value = `${yyyy}-${mm}-${dd}`;
}

  calcModeEl?.addEventListener("divchange", () => {
    updateInterestFieldVisibility();
    runInterestCalculator();
  });

  compoundFrequencyEl?.addEventListener("divchange", runInterestCalculator);

  startDateModeEl?.addEventListener("divchange", () => {
  updateInterestFieldVisibility();
  runInterestCalculator();
});

startDateEl?.addEventListener("input", runInterestCalculator);
startDateEl?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") runInterestCalculator();
});

  taxEl?.addEventListener("divchange", () => {
    updateInterestFieldVisibility();
    runInterestCalculator();
  });

  churchEl?.addEventListener("divchange", () => {
  updateInterestFieldVisibility();
  runInterestCalculator();
});
  timingEl?.addEventListener("divchange", runInterestCalculator);
  churchRateEl?.addEventListener("divchange", runInterestCalculator);

  wireInterestInputsRealtime();
  wireCapitalAutoFormat?.();
  wirePercentAutoFormat?.();
  updateInterestFieldVisibility();
  runInterestCalculator();
}
