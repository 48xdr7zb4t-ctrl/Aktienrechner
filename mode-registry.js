"use strict";

const STANDARD_MODE_KEY = "standard";

const DEFAULT_YEAR_CONFIG = {
  cagr: [1, 2, 3, 4],
  vol: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

(function initNutzenModeRegistry(){
  const REG = new Map();

  function cleanYearList(arr, fallback){
    const src = Array.isArray(arr) && arr.length ? arr : fallback;
    const out = src
      .map(Number)
      .filter(n => Number.isFinite(n) && n > 0);

    return Array.from(new Set(out)).sort((a, b) => a - b);
  }

  function normalizeYear(yearCfg){
    const src = yearCfg || {};

    const cagr = cleanYearList(src.cagr, DEFAULT_YEAR_CONFIG.cagr);
    const vol  = cleanYearList(src.vol, DEFAULT_YEAR_CONFIG.vol);

    return {
      cagr: cagr.length ? cagr : DEFAULT_YEAR_CONFIG.cagr.slice(),
      vol: vol.length ? vol : DEFAULT_YEAR_CONFIG.vol.slice()
    };
  }

  function getWinFn(name){
    return (typeof name === "string" && typeof window[name] === "function")
      ? window[name]
      : null;
  }

  function getWinArr(name){
    return Array.isArray(window[name]) ? window[name].slice() : [];
  }

  function getSectorCriteriaIdsByKey(modeKey){
    const map = {
      standard: "STANDARD_CRITERIA_IDS",
      banks: "BANKS_CRITERIA_IDS",
      insurance: "INSURANCE_CRITERIA_IDS",
      reits: "REITS_CRITERIA_IDS",
      utilities: "UTILITIES_CRITERIA_IDS",
      assetManagers: "ASSET_MANAGERS_CRITERIA_IDS",
      oilGas: "OIL_GAS_CRITERIA_IDS",
      mining: "MINING_CRITERIA_IDS",
      pharmaHealthcare: "PHARMA_HEALTHCARE_CRITERIA_IDS",
      telecom: "TELECOM_CRITERIA_IDS",
      semiconductors: "SEMICONDUCTOR_CRITERIA_IDS",
      bdcPrivateCredit: "BDC_PRIVATE_CREDIT_CRITERIA_IDS",
      defense: "DEFENSE_CRITERIA_IDS"
    };

    const arrName = map[String(modeKey || "").trim()];
    return arrName ? getWinArr(arrName) : [];
  }

  function getModeHookNames(modeKey){
    const names = {
      standard: {
        rolesBase: "scoreStandardRolesBase",
        rolesHealth: "scoreStandardRolesHealth",
        categoriesEvaluate: "buildStandardCategories",
        stressBase: "scoreStandardStressBase",
        stressHealth: "scoreStandardStressHealth",
        fairValueCompute: "computeFairValueStandard",
        fairValueBreakdown: "computeFairValueFundamentalRangeBreakdown"
      },
      banks: {
        rolesBase: "scoreBanksRolesBase",
        rolesHealth: "scoreBanksRolesHealth",
        categoriesEvaluate: "buildBanksCategories",
        stressBase: "scoreBanksStressBase",
        stressHealth: "scoreBanksStressHealth",
        fairValueCompute: "computeFairValueBanks",
        fairValueBreakdown: "computeFairValueBanksRangeBreakdown"
      },
      insurance: {
        rolesBase: "scoreInsuranceRolesBase",
        rolesHealth: "scoreInsuranceRolesHealth",
        categoriesEvaluate: "buildInsuranceCategories",
        stressBase: "scoreInsuranceStressBase",
        stressHealth: "scoreInsuranceStressHealth",
        fairValueCompute: "computeFairValueInsurance",
        fairValueBreakdown: "computeFairValueInsuranceRangeBreakdown"
      },
      reits: {
        rolesBase: "scoreReitsRolesBase",
        rolesHealth: "scoreReitsRolesHealth",
        categoriesEvaluate: "buildReitsCategories",
        stressBase: "scoreReitsStressBase",
        stressHealth: "scoreReitsStressHealth",
        fairValueCompute: "computeFairValueReits",
        fairValueBreakdown: "computeFairValueReitsRangeBreakdown"
      },
      utilities: {
        rolesBase: "scoreUtilitiesRolesBase",
        rolesHealth: "scoreUtilitiesRolesHealth",
        categoriesEvaluate: "buildUtilitiesCategories",
        stressBase: "scoreUtilitiesStressBase",
        stressHealth: "scoreUtilitiesStressHealth",
        fairValueCompute: "computeFairValueUtilities",
        fairValueBreakdown: "computeFairValueUtilitiesRangeBreakdown"
      },
      assetManagers: {
        rolesBase: "scoreAssetManagersRolesBase",
        rolesHealth: "scoreAssetManagersRolesHealth",
        categoriesEvaluate: "buildAssetManagersCategories",
        stressBase: "scoreAssetManagersStressBase",
        stressHealth: "scoreAssetManagersStressHealth",
        fairValueCompute: "computeFairValueAssetManagers",
        fairValueBreakdown: "computeFairValueAssetManagersRangeBreakdown"
      },
      oilGas: {
        rolesBase: "scoreOilGasRolesBase",
        rolesHealth: "scoreOilGasRolesHealth",
        categoriesEvaluate: "buildOilGasCategories",
        stressBase: "scoreOilGasStressBase",
        stressHealth: "scoreOilGasStressHealth",
        fairValueCompute: "computeFairValueOilGas",
        fairValueBreakdown: "computeFairValueOilGasRangeBreakdown"
      },
      mining: {
        rolesBase: "scoreMiningRolesBase",
        rolesHealth: "scoreMiningRolesHealth",
        categoriesEvaluate: "buildMiningCategories",
        stressBase: "scoreMiningStressBase",
        stressHealth: "scoreMiningStressHealth",
        fairValueCompute: "computeFairValueMining",
        fairValueBreakdown: "computeFairValueMiningRangeBreakdown"
      },
      pharmaHealthcare: {
        rolesBase: "scorePharmaHealthcareRolesBase",
        rolesHealth: "scorePharmaHealthcareRolesHealth",
        categoriesEvaluate: "buildPharmaHealthcareCategories",
        stressBase: "scorePharmaHealthcareStressBase",
        stressHealth: "scorePharmaHealthcareStressHealth",
        fairValueCompute: "computeFairValuePharmaHealthcare",
        fairValueBreakdown: "computeFairValuePharmaHealthcareRangeBreakdown"
      },
      telecom: {
        rolesBase: "scoreTelecomRolesBase",
        rolesHealth: "scoreTelecomRolesHealth",
        categoriesEvaluate: "buildTelecomCategories",
        stressBase: "scoreTelecomStressBase",
        stressHealth: "scoreTelecomStressHealth",
        fairValueCompute: "computeFairValueTelecom",
        fairValueBreakdown: "computeFairValueTelecomRangeBreakdown"
      },
      semiconductors: {
        rolesBase: "scoreSemiconductorsRolesBase",
        rolesHealth: "scoreSemiconductorsRolesHealth",
        categoriesEvaluate: "buildSemiconductorsCategories",
        stressBase: "scoreSemiconductorsStressBase",
        stressHealth: "scoreSemiconductorsStressHealth",
        fairValueCompute: "computeFairValueSemiconductors",
        fairValueBreakdown: "computeFairValueSemiconductorsRangeBreakdown"
      },
      bdcPrivateCredit: {
        rolesBase: "scoreBdcPrivateCreditRolesBase",
        rolesHealth: "scoreBdcPrivateCreditRolesHealth",
        categoriesEvaluate: "buildBdcPrivateCreditCategories",
        stressBase: "scoreBdcPrivateCreditStressBase",
        stressHealth: "scoreBdcPrivateCreditStressHealth",
        fairValueCompute: "computeFairValueBdcPrivateCredit",
        fairValueBreakdown: "computeFairValueBdcPrivateCreditRangeBreakdown"
      },
      defense: {
        rolesBase: "scoreDefenseRolesBase",
        rolesHealth: "scoreDefenseRolesHealth",
        categoriesEvaluate: "buildDefenseCategories",
        stressBase: "scoreDefenseStressBase",
        stressHealth: "scoreDefenseStressHealth",
        fairValueCompute: "computeFairValueDefense",
        fairValueBreakdown: "computeFairValueDefenseRangeBreakdown"
      }
    };

    return names[String(modeKey || "").trim()] || null;
  }

  function resolveModeHooks(modeKey){
    const hookNames = getModeHookNames(modeKey) || {};

    return {
      roles: {
        base: getWinFn(hookNames.rolesBase),
        health: getWinFn(hookNames.rolesHealth)
      },
      categories: {
        evaluate: getWinFn(hookNames.categoriesEvaluate)
      },
      stress: {
        base: getWinFn(hookNames.stressBase),
        health: getWinFn(hookNames.stressHealth)
      },
      fairValue: {
        compute: getWinFn(hookNames.fairValueCompute),
        breakdown: getWinFn(hookNames.fairValueBreakdown)
      }
    };
  }

  function makeMode(key, cfg = {}){
    const hooks = resolveModeHooks(key);

    return {
      key,
      label: String(cfg.label || key),
      year: normalizeYear(cfg.year),

      criteriaIds:
        typeof cfg.criteriaIds === "function"
          ? cfg.criteriaIds
          : () => getSectorCriteriaIdsByKey(key),

      roles: {
        base: cfg?.roles?.base || hooks.roles.base || null,
        health: cfg?.roles?.health || hooks.roles.health || null
      },

      categories: {
        evaluate: cfg?.categories?.evaluate || hooks.categories.evaluate || null
      },

      stress: {
        base: cfg?.stress?.base || hooks.stress.base || null,
        health: cfg?.stress?.health || hooks.stress.health || null
      },

      fairValue: {
        compute: cfg?.fairValue?.compute || hooks.fairValue.compute || null,
        breakdown: cfg?.fairValue?.breakdown || hooks.fairValue.breakdown || null
      },

      presets:
        typeof cfg.presets === "function"
          ? cfg.presets
          : () => (window.NUTZEN_MODE_PRESETS?.getModePresetDefs?.(key) || [])
    };
  }

  function registerMode(key, cfg){
    const k = String(key || "").trim();
    if(!k) throw new Error("registerMode(key): key fehlt");
    const mode = makeMode(k, cfg);
    REG.set(k, mode);
    return mode;
  }

  function getModeKey(){
    const key = String(window.NUTZEN_STATE?.sector || STANDARD_MODE_KEY).trim();
    return key || STANDARD_MODE_KEY;
  }

  function getMode(keyOpt){
    const key = String(keyOpt || getModeKey()).trim() || STANDARD_MODE_KEY;
    return REG.get(key) || REG.get(STANDARD_MODE_KEY) || null;
  }

  function listModes(){
    return Array.from(REG.values()).map(m => ({
      key: m.key,
      label: m.label
    }));
  }

  function renderModeSelectOptions(selectEl){
    if(!selectEl) return;

    const items = listModes();
    const cur = getModeKey();

    selectEl.innerHTML = "";

    for(const item of items){
      const opt = document.createElement("option");
      opt.value = item.key;
      opt.textContent = item.label;
      selectEl.appendChild(opt);
    }

    selectEl.value = items.some(x => x.key === cur) ? cur : STANDARD_MODE_KEY;
  }

  window.NUTZEN_MODES = {
    registerMode,
    getMode,
    getModeKey,
    listModes,
    renderModeSelectOptions,
    _REG: REG
  };

  registerMode("standard", {
    label: "Standard"
  });

  registerMode("banks", {
    label: "Banken"
  });

  registerMode("insurance", {
    label: "Versicherer"
  });

  registerMode("reits", {
    label: "REITs Immobilien"
  });

  registerMode("utilities", {
    label: "Versorger"
  });

  registerMode("assetManagers", {
    label: "Asset Manager"
  });

  registerMode("oilGas", {
    label: "Öl & Gas"
  });

  registerMode("mining", {
    label: "Rohstoff Mining"
  });

  registerMode("pharmaHealthcare", {
    label: "Pharma Healthcare"
  });

  registerMode("telecom", {
    label: "Telekom"
  });

  registerMode("semiconductors", {
    label: "Halbleiter"
  });

  registerMode("bdcPrivateCredit", {
    label: "BDC Private Credit"
  });

  registerMode("defense", {
    label: "Defense"
  });

  window.registerMode = registerMode;
  window.getMode = getMode;
  window.getModeKey = getModeKey;
})();

function renderSectorSelect(){
  const sels = [el("nutzenHeaderSet"), el("nutzenHeaderSetTable")].filter(Boolean);
  if(!sels.length) return;

  for(const sel of sels){
    window.NUTZEN_MODES?.renderModeSelectOptions(sel);
  }
}

function renderYearSelects(){
  const mode = typeof getMode === "function" ? getMode() : null;
  const cagrYears = Array.isArray(mode?.year?.cagr) && mode.year.cagr.length ? mode.year.cagr : [1, 2, 3, 4];
  const volYears  = Array.isArray(mode?.year?.vol) && mode.year.vol.length ? mode.year.vol : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const nextCagr = cagrYears.includes(Number(window.NUTZEN_STATE?.cagrYear))
    ? Number(window.NUTZEN_STATE.cagrYear)
    : cagrYears[0];

  const nextVol = volYears.includes(Number(window.NUTZEN_STATE?.volYear))
    ? Number(window.NUTZEN_STATE.volYear)
    : volYears[0];

  window.NUTZEN_STATE.cagrYear = nextCagr;
  window.NUTZEN_STATE.volYear = nextVol;

  fillSelect(el("nutzenCagrYear"), cagrYears, nextCagr);
  fillSelect(el("nutzenCagrYearTable"), cagrYears, nextCagr);

  fillSelect(el("nutzenVolYear"), volYears, nextVol);
  fillSelect(el("nutzenVolYearTable"), volYears, nextVol);
}

function renderPresetSelects(){
  const sels = [el("nutzenPreset"), el("nutzenPresetTable")].filter(Boolean);
  if(!sels.length) return;

  const modeKey = typeof getModeKey === "function"
    ? getModeKey()
    : (window.NUTZEN_STATE?.sector || STANDARD_MODE_KEY);

  for(const sel of sels){
    window.NUTZEN_MODE_PRESETS?.renderModePresetOptions?.(sel, modeKey);
  }
}

function wirePresetSelects(){
  const sels = [el("nutzenPreset"), el("nutzenPresetTable")].filter(Boolean);
  if(!sels.length || wirePresetSelects._bound) return;
  wirePresetSelects._bound = true;

  for(const sel of sels){
    sel.addEventListener("change", () => {
      for(const other of sels) other.value = sel.value;

      window.NUTZEN_STATE.presetKey = sel.value || "";

      const modeKey = typeof getModeKey === "function"
        ? getModeKey()
        : (window.NUTZEN_STATE?.sector || STANDARD_MODE_KEY);

      window.NUTZEN_MODE_PRESETS?.applyModePresetToTable?.(sel.value, modeKey);
      runAllCalcs?.();
    });
  }
}

function wireSectorSelect(){
  const sels = [el("nutzenHeaderSet"), el("nutzenHeaderSetTable")].filter(Boolean);
  if(!sels.length || wireSectorSelect._bound) return;
  wireSectorSelect._bound = true;

  for(const sel of sels){
    sel.addEventListener("change", () => {
      for(const other of sels) other.value = sel.value;

      window.NUTZEN_STATE.sector = sel.value || STANDARD_MODE_KEY;
      window.NUTZEN_STATE.presetKey = "";

      renderYearSelects?.();
      renderNutzenTable?.();
      renderPresetSelects?.();
      renderTaxonomyUI?.();
      runAllCalcs?.();
    });
  }
}

function wireYearSelects(){
  const cagrSels = [el("nutzenCagrYear"), el("nutzenCagrYearTable")].filter(Boolean);
  const volSels  = [el("nutzenVolYear"), el("nutzenVolYearTable")].filter(Boolean);

  if(!wireYearSelects._boundCagr){
    wireYearSelects._boundCagr = true;

    for(const sel of cagrSels){
      sel.addEventListener("change", () => {
        for(const other of cagrSels) other.value = sel.value;
        window.NUTZEN_STATE.cagrYear = Number(sel.value) || 4;
        renderNutzenTable?.();
        runAllCalcs?.();
      });
    }
  }

  if(!wireYearSelects._boundVol){
    wireYearSelects._boundVol = true;

    for(const sel of volSels){
      sel.addEventListener("change", () => {
        for(const other of volSels) other.value = sel.value;
        window.NUTZEN_STATE.volYear = Number(sel.value) || 10;
        renderNutzenTable?.();
        runAllCalcs?.();
      });
    }
  }
}

function getYearAdjustedCriteriaIds(ids){
  const src = Array.isArray(ids) ? ids : [];
  const volYear = Number(window.NUTZEN_STATE?.volYear) || 10;
  const cagrYear = Number(window.NUTZEN_STATE?.cagrYear) || 4;

  return src.map((id) => {
    const key = String(id || "").trim().toUpperCase();

    if(/^VOLATILITAET_ANNUALISIERT_STD_ABW_\d+Y$/.test(key)){
      return key.replace(/_\d+Y$/, `_${volYear}Y`);
    }

    if(/_CAGR_\d+Y$/.test(key)){
      return key.replace(/_CAGR_\d+Y$/, `_CAGR_${cagrYear}Y`);
    }

    return key;
  });
}

function getCurrentCriteriaIds(){
  const mode = (typeof getMode === "function") ? getMode() : null;
  let ids = [];

  if(typeof mode?.criteriaIds === "function"){
    const modeIds = mode.criteriaIds();
    if(Array.isArray(modeIds)) ids = modeIds.slice();
  }

  return getYearAdjustedCriteriaIds(ids);
}

function getDynamicCriteriaId(id){
  return getYearAdjustedCriteriaIds([id])[0];
}

window.getDynamicCriteriaId = getDynamicCriteriaId;
window.getYearAdjustedCriteriaIds = getYearAdjustedCriteriaIds;
window.getCurrentCriteriaIds = getCurrentCriteriaIds;