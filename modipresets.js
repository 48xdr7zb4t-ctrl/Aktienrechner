"use strict";

const MODE_PRESETS = {
  standard: [
    { key: "std_blank", label: "Standard – leer", values: {} },
    { key: "std_demo_1", label: "Standard – Preset 1", values: {} },
    { key: "std_demo_2", label: "Standard – Preset 2", values: {} }
  ],

  banks: [
    { key: "bank_blank", label: "Banks – leer", values: {} },
    { key: "bank_demo_1", label: "Banks – Preset 1", values: {} },
    { key: "bank_demo_2", label: "Banks – Preset 2", values: {} }
  ],

  insurance: [
    { key: "ins_blank", label: "Insurance – leer", values: {} },
    { key: "ins_demo_1", label: "Insurance – Preset 1", values: {} }
  ],

  reits: [
    { key: "reit_blank", label: "REITs – leer", values: {} },
    { key: "reit_demo_1", label: "REITs – Preset 1", values: {} }
  ],

  utilities: [
    { key: "util_blank", label: "Utilities – leer", values: {} },
    { key: "util_demo_1", label: "Utilities – Preset 1", values: {} }
  ],

  brokers: [
    { key: "broker_blank", label: "Brokers – leer", values: {} },
    { key: "broker_demo_1", label: "Brokers – Preset 1", values: {} }
  ],

  commodities: [
    { key: "comm_blank", label: "Commodities – leer", values: {} },
    { key: "comm_demo_1", label: "Commodities – Preset 1", values: {} }
  ]
};

function getModePresetDefs(modeKey){
  const key = String(modeKey || window.NUTZEN_STATE?.sector || "standard").trim();
  const defs = MODE_PRESETS[key];
  return Array.isArray(defs) && defs.length
    ? defs.slice()
    : (MODE_PRESETS.standard || []).slice();
}

function getModePresetByKey(modeKey, presetKey){
  const defs = getModePresetDefs(modeKey);
  const key = String(presetKey || "").trim();
  return defs.find(x => x.key === key) || defs[0] || null;
}

function renderModePresetOptions(selectEl, modeKey){
  if(!selectEl) return;

  const defs = getModePresetDefs(modeKey);
  const current = String(window.NUTZEN_STATE?.presetKey || "").trim();

  selectEl.innerHTML = "";

  for(const def of defs){
    const opt = document.createElement("option");
    opt.value = def.key;
    opt.textContent = def.label;
    selectEl.appendChild(opt);
  }

  const hasCurrent = defs.some(x => x.key === current);
  const nextKey = hasCurrent ? current : (defs[0]?.key || "");

  selectEl.value = nextKey;
  window.NUTZEN_STATE.presetKey = nextKey;
}



function applyModePresetToTable(presetKey, modeKey){
  const preset = getModePresetByKey(modeKey, presetKey);
  if(!preset) return;

  const tbody = typeof el === "function" ? el("nutzenTableBody") : null;
  if(!tbody) return;

  const values = preset.values && typeof preset.values === "object"
    ? preset.values
    : {};

  for(const tr of tbody.querySelectorAll("tr")){
    const labelTd = tr.querySelector("td[data-crit-id]");
    const valTd = tr.querySelector(".nutzenVal");
    const critId = String(labelTd?.getAttribute("data-crit-id") || "").trim();

    if(!critId || !valTd) continue;

    valTd.textContent =
      Object.prototype.hasOwnProperty.call(values, critId)
        ? (values[critId] == null ? "–" : String(values[critId]))
        : "–";
  }
}

window.NUTZEN_MODE_PRESETS = {
  defs: MODE_PRESETS,
  getModePresetDefs,
  getModePresetByKey,
  renderModePresetOptions,
  applyModePresetToTable
};