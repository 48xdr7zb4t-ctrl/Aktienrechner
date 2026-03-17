"use strict";

function evalRolesForCurrentSector(){
  const ctx = buildNutzenCtxFromTableMap(tableToMap());
  const modeObj = typeof getMode === "function" ? getMode() : null;
  const engines = window.NUTZEN_ENGINES?.getEngines(modeObj);

  const base = Array.isArray(engines?.roles?.base?.(ctx)) ? engines.roles.base(ctx) : [];
  const health = Array.isArray(engines?.roles?.health?.(ctx)) ? engines.roles.health(ctx) : [];

  const combined = typeof combineRoleBuckets === "function"
    ? combineRoleBuckets(base, health)
    : [...base, ...health];

  return { base, health, combined };
}

(function initNutzenDefaultEngines(){
  const isFn = (f) => typeof f === "function";
  const arr = (x) => Array.isArray(x) ? x : [];

  function getStandardMode(){
    return typeof getMode === "function" ? getMode("standard") : null;
  }

  function normalizeEngines(modeObj){
    const standardMode = getStandardMode() || {};
    const mode = modeObj || standardMode;

    return {
      roles: {
        base(ctx){
          const fn = isFn(mode?.roles?.base) ? mode.roles.base : standardMode?.roles?.base;
          return arr(fn?.(ctx));
        },
        health(ctx){
          const fn = isFn(mode?.roles?.health) ? mode.roles.health : standardMode?.roles?.health;
          return arr(fn?.(ctx));
        }
      },

      categories: {
        evaluate(ctx, roleBuckets){
          const fn = isFn(mode?.categories?.evaluate)
            ? mode.categories.evaluate
            : standardMode?.categories?.evaluate;

          const out = fn?.(ctx, roleBuckets);
          return out && typeof out === "object" ? out : {};
        }
      },

      stress: {
        base(ctx){
          const fn = isFn(mode?.stress?.base) ? mode.stress.base : standardMode?.stress?.base;
          return arr(fn?.(ctx));
        },
        health(ctx){
          const fn = isFn(mode?.stress?.health) ? mode.stress.health : standardMode?.stress?.health;
          return arr(fn?.(ctx));
        }
      }
    };
  }

  function getEngines(modeOrKey){
    const modeObj =
      typeof modeOrKey === "string"
        ? (typeof getMode === "function" ? getMode(modeOrKey) : null)
        : modeOrKey;

    return normalizeEngines(modeObj);
  }

  window.NUTZEN_ENGINES = {
    getEngines,
    normalizeEngines
  };
})();