"use strict";



function goPage(pageKey){
  const key = nzStr(pageKey) || "home";
  document.querySelectorAll(".page").forEach(node => {
    node.classList.remove("isActive");
  });

  const page = el("page-" + key);
  if(page){
    page.classList.add("isActive");
    window.NUTZEN_STATE.page = key;
  }
}



function renderFairPage(snapshotArg){
  const sum = el("fairSummary");
  const exp = el("fairExplain");
  if(!sum || !exp) return;

const snap = snapshotArg || (typeof buildAppSnapshot === "function" ? buildAppSnapshot() : null);
const ctx = snap?.ctx || buildNutzenCtxFromTableMap(tableToMap());
const modeKey = String((typeof getMode === "function" ? getMode()?.key : null) || window.NUTZEN_STATE?.sector || "standard");

const price = firstFiniteNum(ctx, ["KURS_CLOSE_AKTUELL"]);
const fv = snap?.fairBreakdown || computeFairValueRangeBreakdownForCurrentMode(ctx);

  const fmt2 = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString("de-DE", { maximumFractionDigits: 2 })
      : "–";

      const fmtRatio = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString("de-DE", { maximumFractionDigits: 2 })
    : "–";

  function buildTargetsText(targets){
    if(!targets || typeof targets !== "object") return "–";

    const parts = [
      Number.isFinite(targets.targetPE)   ? `PE=${fmt2(targets.targetPE)}` : null,
      Number.isFinite(targets.targetPB)   ? `PB=${fmt2(targets.targetPB)}` : null,
      Number.isFinite(targets.targetPFCF) ? `P/FCF=${fmt2(targets.targetPFCF)}` : null,
      Number.isFinite(targets.targetPOCF) ? `P/OCF=${fmt2(targets.targetPOCF)}` : null,
      Number.isFinite(targets.targetPS)   ? `P/S=${fmt2(targets.targetPS)}` : null
    ].filter(Boolean);

    return parts.length ? parts.join(" · ") : "–";
  }

  function buildInputsHtml(inputs){
    if(!inputs || typeof inputs !== "object"){
      return `<div class="muted">Keine Input-Daten verfügbar.</div>`;
    }

    const rows = [
      ["EPS", inputs.eps],
      ["BVPS", inputs.bvps],
      ["Shares", inputs.shares],
      ["FCF", inputs.fcf],
      ["OCF", inputs.ocf],
      ["CapEx", inputs.capex],
      ["Owner Earnings", inputs.ownerEarnings],
      ["Kurs aktuell", inputs.price],
      ["PE aktuell", inputs.peNow],
      ["Forward PE aktuell", inputs.fwdPeNow],
      ["PB aktuell", inputs.pbNow],
      ["P/S aktuell", inputs.psNow],
      ["P/FCF aktuell", inputs.pfcfNow],
      ["P/OCF aktuell", inputs.pocfNow]
    ].filter(([, value]) => Number.isFinite(value));

    if(!rows.length){
      return `<div class="muted">Keine verwertbaren Input-Daten vorhanden.</div>`;
    }

    return rows.map(([label, value]) => `
      <div class="whyLine"><b>${escapeHtml(label)}:</b> ${fmt2(value)}</div>
    `).join("");
  }
  
  function buildCandidatesHtml(candidates){
    if(!Array.isArray(candidates) || !candidates.length){
      return `<div class="muted">–</div>`;
    }

    return candidates.map(c => `
      <div class="whyLine">
        <b>${escapeHtml(c.label || "–")}:</b>
        low ${fmt2(c.low)} · base ${fmt2(c.base)} · high ${fmt2(c.high)}
        <span class="muted">(${escapeHtml(c.key || "–")})</span>
      </div>
    `).join("");
  }

  function buildNotesHtml(notes){
    if(!Array.isArray(notes) || !notes.length) return "";
    return `
      <div class="whyLine" style="margin-top:10px"><b>Hinweise:</b></div>
      ${notes.map(n => `<div class="whyLine muted">• ${escapeHtml(n)}</div>`).join("")}
    `;
  }

function buildMethodHint(){
  if(modeKey === "banks"){
    return "Reihenfolge: EPS → BVPS → TBVPS → letzter Notfall-Fallback.";
  }

  if(
    modeKey === "insurance" ||
    modeKey === "reits" ||
    modeKey === "utilities" ||
    modeKey === "assetManagers" ||
    modeKey === "oilGas" ||
    modeKey === "mining" ||
    modeKey === "pharmaHealthcare" ||
    modeKey === "telecom" ||
    modeKey === "semiconductors" ||
    modeKey === "bdcPrivateCredit" ||
    modeKey === "defense"
  ){
    return "Aktuell noch Standard-Fair-Value-Logik als Fallback / Basis aktiv.";
  }

  return "Reihenfolge: DCF + Owner Earnings/FCF/OCF → EPS → BVPS → letzter Notfall-Fallback.";
}


  if(!fv?.ok){
    sum.innerHTML = `<div class="muted">Fair Value nicht möglich: ${escapeHtml(fv?.reason || "–")}</div>`;
    exp.innerHTML = `
      <div class="muted">
        Es fehlen verwertbare Fundamentaldaten.
      </div>
      <div class="whyRoleBlock" style="margin-top:10px">
        ${buildInputsHtml(fv?.inputs)}
      </div>
    `;
    return;
  }

  const fair = fv.range?.base;
  const low = fv.range?.low;
  const high = fv.range?.high;

  const pf = (
    Number.isFinite(price) &&
    Number.isFinite(fair) &&
    fair > 0
  ) ? (price / fair) : NaN;

  let verdict = "–";
  let verdictMode = "muted";

  if(Number.isFinite(pf)){
    if(pf < 0.90){
      verdict = "Unterbewertet";
      verdictMode = "good";
    } else if(pf <= 1.10){
      verdict = "Fair bewertet";
      verdictMode = "warn";
    } else {
      verdict = "Überbewertet";
      verdictMode = "bad";
    }
  }
  sum.innerHTML = `
    <div class="whyRoleBlock" style="margin:0">
      <div class="whyLine"><b>Fair Value:</b> ${fmt2(fair)}</div>
      <div class="whyLine"><b>Range:</b> ${fmt2(low)} – ${fmt2(high)} (${escapeHtml(fv.confidence || "–")})</div>
      <div class="whyLine"><b>Kurs aktuell:</b> ${fmt2(price)}</div>
      <div class="whyLine">
        <b>Price / Fair:</b> ${fmtRatio(pf)} →
        <b class="${verdictMode}">${escapeHtml(verdict)}</b>
      </div>
      <div class="whyLine muted">
        Regel: &lt;0,90 unterbewertet · 0,90–1,10 fair · &gt;1,10 überbewertet
      </div>
    </div>
  `;

  exp.innerHTML = `
    <div class="whyRoleBlock" style="margin:0">
      <div class="whyLine"><b>Methode (nächste am Median):</b> ${escapeHtml(fv.methodUsed?.label || "–")}</div>
      <div class="whyLine"><b>Preset:</b> ${escapeHtml(fv.preset || "–")}</div>
      <div class="whyLine"><b>Targets:</b> ${buildTargetsText(fv.targets)}</div>
      <div class="whyLine">
        <b>Quality/Risk-Adjust:</b>
        Quality ${fmt2(fv.adjust?.qualityFactor)} ·
        Risk ${fmt2(fv.adjust?.riskFactor)} ·
        Total ${fmt2(fv.adjust?.totalFactor)}
      </div>

      <div class="whyLine" style="margin-top:10px"><b>Kandidaten:</b></div>
      ${buildCandidatesHtml(fv.candidates)}

      ${buildNotesHtml(fv.notes)}

      <div class="whyLine muted" style="margin-top:10px">
        ${escapeHtml(buildMethodHint())}
      </div>
    </div>
  `;
}


function renderTaxonomyUI(){
  const tax = window.NUTZEN_TAXONOMY;
  const host = el("taxonomyRolesList");
  if(!tax || !host) return;

  const expanded = !!window.NUTZEN_STATE?.taxonomyExpanded;

  const previewRoles = Array.isArray(tax.getPreviewRoles?.())
    ? tax.getPreviewRoles()
    : [];

  const allRoles = Array.isArray(tax.getAllRoles?.())
    ? tax.getAllRoles()
    : [];

  const allCategories = Array.isArray(tax.getAllCategories?.())
    ? tax.getAllCategories()
    : [];

  const rolesToShow = expanded ? allRoles : previewRoles;

  const rolesHtml = rolesToShow.length
    ? rolesToShow.map(r => `
        <div class="whyRoleBlock" style="margin:0 0 10px 0">
          <div class="whyRoleTitle">${escapeHtml(r.label)}</div>
          <div class="muted" style="font-size:12px;margin-top:4px">
            ${escapeHtml(r.def || "")}
          </div>
        </div>
      `).join("")
    : `<div class="muted">Keine Rollen</div>`;

  const categoriesHtml = expanded
    ? `
      <div style="margin-top:14px">
        <div class="whyRoleTitle" style="margin-bottom:10px">Kategorien</div>
        ${
          allCategories.length
            ? allCategories.map(cat => `
                <div class="whyRoleBlock" style="margin:0 0 10px 0">
                  <div class="whyRoleTitle">${escapeHtml(cat.label || "–")}</div>
                  <div class="muted" style="font-size:12px;margin-top:4px">
                    ${escapeHtml(cat.def || "")}
                  </div>
                  <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px">
                    ${
                      Array.isArray(cat.options) && cat.options.length
                        ? cat.options.map(opt => `
                            <span class="chip isInactiveBlue">
                              <span class="dot"></span>
                              ${escapeHtml(opt.label || opt.id || "–")}
                            </span>
                          `).join("")
                        : `<span class="muted">Keine Optionen</span>`
                    }
                  </div>
                </div>
              `).join("")
            : `<div class="muted">Keine Kategorien</div>`
        }
      </div>
    `
    : "";

  const btnHtml = expanded
    ? `
      <div style="margin-top:10px">
        <button
          type="button"
          id="btnTaxonomyCollapse"
          class="btn"
        >
          Weniger anzeigen
        </button>
      </div>
    `
    : `
      <div style="margin-top:10px">
        <button
          type="button"
          id="btnTaxonomyExpand"
          class="btn"
        >
          Alle anzeigen
        </button>
      </div>
    `;

  host.innerHTML = `
    ${rolesHtml}
    ${btnHtml}
    ${categoriesHtml}
  `;

  const expandBtn = el("btnTaxonomyExpand");
  if(expandBtn){
    expandBtn.addEventListener("click", () => {
      window.NUTZEN_STATE.taxonomyExpanded = true;
      renderTaxonomyUI();
    });
  }

  const collapseBtn = el("btnTaxonomyCollapse");
  if(collapseBtn){
    collapseBtn.addEventListener("click", () => {
      window.NUTZEN_STATE.taxonomyExpanded = false;
      renderTaxonomyUI();
    });
  }
}



function renderRolesFromEval(roleBuckets){
  const activeEl   = el("nutzenRolesActive");
  const whyBase    = el("nutzenRoleWhyBase");
  const whyHealth  = el("nutzenRoleWhyHealth");

  const base = Array.isArray(roleBuckets?.base) ? roleBuckets.base : [];
  const health = Array.isArray(roleBuckets?.health) ? roleBuckets.health : [];
  const combined = Array.isArray(roleBuckets?.combined) ? roleBuckets.combined : [];

  function renderRoleBlock(r, bucketLabel){
    const checks = Array.isArray(r.checks) ? r.checks : [];

    const okChecks = checks.filter(c => c.ok);
    const failChecks = checks.filter(c => !c.ok && !c.missing);
    const missingChecks = checks.filter(c => c.missing);

    return `
      <div class="whyRoleBlock">
        <div class="whyRoleHead">
          <div>
            <div class="whyRoleTitle">${escapeHtml(r.label)}</div>
            <div class="muted" style="font-size:12px;margin-top:4px">
              ${escapeHtml(bucketLabel)} · Score ${Math.round(r.score || 0)} · ${r.active ? "AKTIV" : "inaktiv"}
            </div>
          </div>
          <div class="whyRoleMeta">${Math.round(r.score || 0)}</div>
        </div>

        <div class="muted" style="font-size:12px;margin-bottom:6px">Erfüllt</div>
        ${
          okChecks.length
            ? okChecks.map(c => `
                <div class="whyLine" style="color:#b8f1cc">
                  ✓ ${escapeHtml(c.label)} <span class="muted">(${escapeHtml(c.value || "–")})</span>
                </div>
              `).join("")
            : `<div class="whyLine muted">–</div>`
        }

        <div class="muted" style="font-size:12px;margin:10px 0 6px">Nicht erfüllt</div>
        ${
          failChecks.length
            ? failChecks.map(c => `
                <div class="whyLine" style="color:#ffb3b3">
                  ✗ ${escapeHtml(c.label)} <span class="muted">(${escapeHtml(c.value || "–")})</span>
                </div>
              `).join("")
            : `<div class="whyLine muted">–</div>`
        }

        <div class="muted" style="font-size:12px;margin:10px 0 6px">Missing</div>
        ${
          missingChecks.length
            ? missingChecks.map(c => `
                <div class="whyLine" style="color:#ffd98a">
                  ? ${escapeHtml(c.label)}
                </div>
              `).join("")
            : `<div class="whyLine muted">–</div>`
        }
      </div>
    `;
  }


  if(activeEl){
  const active = combined.filter(r => r.active);

  activeEl.innerHTML = active.length
    ? active.map(r => `
        <div class="miniCard" style="min-width:160px">
          <div class="miniLabel">Aktive Rolle</div>
          <div class="miniValue">${escapeHtml(r.label)}</div>
          <div class="miniSub">Score: ${Math.round(r.score || 0)}</div>
        </div>
      `).join("")
    : `<div class="muted">Keine aktiven Rollen</div>`;
}


  if(whyBase){
    whyBase.innerHTML = base.length
      ? base.map(r => renderRoleBlock(r, "Base")).join("")
      : `<div class="muted">Keine Base-Rollen</div>`;
  }

  if(whyHealth){
    whyHealth.innerHTML = health.length
      ? health.map(r => renderRoleBlock(r, "Health")).join("")
      : `<div class="muted">Keine Health-Rollen</div>`;
  }
}

function renderCategoriesOnRolesPage(ctxArg, rolesArg){
  const box = el("nutzenCategoriesBox");
  if(!box) return;

  const tax = window.NUTZEN_TAXONOMY;
  if(!tax){
    box.innerHTML = `<div class="muted">Keine Taxonomy</div>`;
    return;
  }

  const ctx = ctxArg || buildNutzenCtxFromTableMap(tableToMap());
  const roles = rolesArg || evalRolesForCurrentSector();

  const modeObj = getMode?.(window.NUTZEN_STATE?.sector || "standard");
  const catFn =
    modeObj?.categories?.evaluate ||
    modeObj?.categories ||
    window.buildStandardCategories;

  const cats = typeof catFn === "function"
    ? catFn(ctx, roles)
    : {};

  const defs = tax.getModeCategories?.(window.NUTZEN_STATE?.sector || "standard") || [];

  if(!defs.length){
    box.innerHTML = `<div class="muted">Keine Kategorien</div>`;
    return;
  }

  box.innerHTML = defs.map(cat => {
    const rawValue = cats?.[cat.id];

    const activeIds = Array.isArray(rawValue)
      ? rawValue.map(v => nzStr(v)).filter(Boolean)
      : (nzStr(rawValue) ? [nzStr(rawValue)] : []);

    const options = Array.isArray(cat.options) ? cat.options : [];

    const activeText = activeIds.length
      ? activeIds
          .map(id => options.find(opt => opt?.id === id)?.label || id)
          .join(" · ")
      : "Unklar";

    const optsHtml = options.length
      ? options.map(opt => {
          const optId = nzStr(opt?.id);
          const optLabel = nzStr(opt?.label || optId || "–");
          const isActive = activeIds.includes(optId);

          return `
            <span class="chip ${isActive ? "isActiveGreen" : "isInactiveBlue"}">
              <span class="dot ${isActive ? "good" : ""}"></span>
              ${escapeHtml(optLabel)}
            </span>
          `;
        }).join("")
      : `<span class="muted">Keine Optionen</span>`;

    return `
      <div class="whyRoleBlock">
        <div class="whyRoleTitle">${escapeHtml(cat.label || "–")}</div>

        <div class="muted" style="font-size:12px;margin-top:4px">
          ${escapeHtml(cat.def || "")}
        </div>

        <div style="margin-top:10px">
          <span class="chip isActiveGreen">
            <span class="dot good"></span>
            Aktiv: ${escapeHtml(activeText)}
          </span>
        </div>

        <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:10px">
          ${optsHtml}
        </div>
      </div>
    `;
  }).join("");
}

function renderStress(st){
  const dotEl = el("stressPageDot");
  const labelEl = el("stressPageLabel");
  const whyNowEl = el("stressWhyNow");
  const legendEl = el("stressLegendAll");

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
    if(s === "darkbad") return "#ff4d4f";
    if(s === "bad") return "#ff9f43";
    if(s === "warn") return "#ffd166";
    return "#2ecc71";
  }

  function dotHtml(sev){
    const color = sevColor(sev);
    return `
      <span
        style="
          display:inline-block;
          width:10px;
          height:10px;
          min-width:10px;
          min-height:10px;
          border-radius:50%;
          background:${color};
          box-shadow:0 0 0 1px rgba(255,255,255,.12) inset;
          vertical-align:middle;
          margin-right:8px;
          flex:0 0 10px;
        "
      ></span>
    `;
  }

  if(dotEl){
    const topColor = sevColor(st?.mode || "good");
    dotEl.className = "dot";
    dotEl.style.background = topColor;
    dotEl.style.boxShadow = "0 0 0 1px rgba(255,255,255,.12) inset";
  }

  if(labelEl){
    labelEl.textContent = `Stress: ${st?.label || "–"}`;
  }

  if(whyNowEl){
    const triggers = [
      ...(Array.isArray(st?.baseTriggers) ? st.baseTriggers.map(t => ({ ...t, bucket: "Base" })) : []),
      ...(Array.isArray(st?.healthTriggers) ? st.healthTriggers.map(t => ({ ...t, bucket: "Health" })) : [])
    ];

    if(!triggers.length){
      whyNowEl.innerHTML = `<div class="muted">Keine Stress-Trigger aktiv</div>`;
    } else {
      whyNowEl.innerHTML = triggers.map(t => {
        const sev = sevNorm(t.sev);
        const color = sevColor(sev);

        return `
          <div class="whyNowBlock" style="border:1px solid rgba(255,255,255,.08);">
            <div class="whyNowHead">
              <div class="whyNowLeft" style="display:flex;align-items:center;gap:0;">
                ${dotHtml(sev)}
                <div class="whyNowTitle" style="color:${color};">
                  ${escapeHtml(t.label || "–")}
                </div>
              </div>
              <div class="whyNowMeta">
                ${escapeHtml(t.bucket || "–")} · ${escapeHtml(t.value || "–")}
              </div>
            </div>

            <div class="whyNowBody">
              <div class="trigLine"><b>Severity:</b> ${escapeHtml(sev)}</div>
              <div class="trigLine"><b>Score:</b> ${escapeHtml(String(t.score ?? "–"))}</div>
              <div class="trigLine"><b>Wert:</b> ${escapeHtml(t.value || "–")}</div>
              <div class="trigLine"><b>Erklärung:</b> ${escapeHtml(t.explain || "–")}</div>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  if(legendEl){
    const legendItems = [
  {
    sev: "good",
    title: "Niedriger Stress",
    hint: "Solide und stabil",
    text: "Das Unternehmen wirkt insgesamt robust. Bilanz, Liquidität, Profitabilität und Cashflows zeigen aktuell keine auffälligen Schwächen. Es gibt aus den vorhandenen Daten keinen Hinweis auf akuten finanziellen oder operativen Stress."
  },
  {
    sev: "warn",
    title: "Mittlerer Stress",
    hint: "Einige Schwachstellen",
    text: "Das Unternehmen hat erkennbare Schwächen oder einzelne Warnsignale. Noch kein Krisenfall, aber nicht mehr völlig sorgenfrei. Man sollte Profitabilität, Verschuldung, Liquidität oder Wachstum genauer im Blick behalten."
  },
  {
    sev: "bad",
    title: "Hoher Stress",
    hint: "Deutlich angeschlagen",
    text: "Mehrere wichtige Kennzahlen sind problematisch. Das Unternehmen steht klar unter Druck und ist operativ oder finanziell spürbar geschwächt. Das ist mehr als nur eine kleine Schwächephase und kann in Richtung Krise gehen."
  },
  {
    sev: "darkbad",
    title: "Sehr hoher Stress",
    hint: "Krisennah",
    text: "Das Unternehmen zeigt schwere Warnsignale und wirkt wie ein echter Krisenfall oder kurz davor. Typisch wären stark negative Ergebnisse, sehr schwache Liquidität, kritische Zinsdeckung oder klarer Bilanzdruck. Hier besteht erhöhtes Insolvenz- oder Restrukturierungsrisiko."
  }
];


    legendEl.innerHTML = legendItems.map(item => `
      <div class="whyStressBlock">
        <div class="whyStressHead">
          <div class="whyStressTitle" style="display:flex;align-items:center;">
            ${dotHtml(item.sev)}
            <span>${escapeHtml(item.title)}</span>
          </div>
          <div class="whyStressHint">${escapeHtml(item.hint)}</div>
        </div>

        <div class="whyStressBody">
          <div class="trigLine">${escapeHtml(item.text)}</div>
        </div>
      </div>
    `).join("");
  }
}


function renderNutzenTable(){
  const tbody = el("nutzenTableBody");
  if(!tbody) return;

  const oldMap = tableToMap({ keepMissing:true, dropEmpty:false });
  const ids = getCurrentCriteriaIds();
  if(!Array.isArray(ids) || !ids.length){
  tbody.innerHTML = `
    <tr>
      <td colspan="3" class="muted">Für diesen Modus sind noch keine Criteria definiert.</td>
    </tr>
  `;
  return;
}

  tbody.innerHTML = "";

  for(const id of ids){
    const tr = document.createElement("tr");

    const tdLabel = document.createElement("td");
    tdLabel.setAttribute("data-crit-id", id);
    tdLabel.textContent = typeof window.getCriteriaLabel === "function"
  ? window.getCriteriaLabel(id)
  : id;

    const tdVal = document.createElement("td");
    tdVal.className = "nutzenVal";
    tdVal.contentEditable = "true";
    tdVal.spellcheck = false;
    tdVal.textContent = oldMap.has(id)
  ? (normalizeRawText(oldMap.get(id)) || "–")
  : "–";

    const tdNote = document.createElement("td");
    tdNote.className = "muted";
    tdNote.textContent = id;

    tr.appendChild(tdLabel);
    tr.appendChild(tdVal);
    tr.appendChild(tdNote);
    tbody.appendChild(tr);
  }
}