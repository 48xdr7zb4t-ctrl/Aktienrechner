"use strict";

(function initNutzenTaxonomy(){
  // =========================
  // 1) ROLLEN
  // =========================
  const ROLES = [
    // GENERAL / STYLE
    { id:"div_income",              label:"Dividend Income",           def:"Fokus auf laufende Ausschüttungen und Ertrag." },
    { id:"div_growth",              label:"Dividend Growth",           def:"Dividende wächst nachhaltig und ist vernünftig gedeckt." },
    { id:"deep_value",              label:"Deep Value",                def:"Sehr günstig relativ zu Fundamentaldaten." },
    { id:"value",                   label:"Value",                     def:"Günstig bewertet bei soliden Fundamentaldaten." },
    { id:"growth",                  label:"Growth",                    def:"Überdurchschnittliches Umsatz-, Gewinn- oder Cashflowwachstum." },
    { id:"garp",                    label:"GARP",                      def:"Wachstum bei noch vernünftiger Bewertung." },
    { id:"quality_compounder",      label:"Quality Compounder",        def:"Hohe Qualität plus lange Reinvestitionsfähigkeit." },
    { id:"pricing_power",           label:"Pricing Power",             def:"Kann Preise durchsetzen ohne große Nachfrageverluste." },
    { id:"cyclical",                label:"Zykliker",                  def:"Geschäft ist klar konjunktur- oder rohstoffabhängig." },
    { id:"turnaround",              label:"Turnaround",                def:"These basiert auf operativer Wende oder Restrukturierung." },
    { id:"speculation",             label:"Spekulation",               def:"Hohe Unsicherheit, viele Annahmen, geringe Visibilität." },
    { id:"distressed",              label:"Krisenfall",                def:"Finanziell oder operativ klar kritisch." },

    // GENERAL / HEALTH
    { id:"balance_sheet_strong",    label:"Balance Sheet Strong",      def:"Sehr solide Bilanz, geringe Verschuldung, gute Liquidität." },
    { id:"leveraged",               label:"Schuldenlastig / Leveraged",def:"Erhöhte Verschuldung oder schwächere Stabilität." },
    { id:"healthy",                 label:"Gesund",                    def:"Solide Profitabilität, robuste Renditen und positive Cashflows." },
    { id:"cashflow_strong",         label:"Cashflow-stark",            def:"Starker operativer Cashflow und freier Cashflow." },
    { id:"weak_liquidity",          label:"Liquidität schwach",        def:"Kurzfristige Liquidität ist angespannt." },
    { id:"defensive",               label:"Defensiv",                  def:"Relativ geringe Zyklik und moderates Risiko." },
    { id:"stable_defensive",        label:"Stabil Defensiv",           def:"Defensiv plus stabile Margen, Cashflows und Volatilität." },
    { id:"crisis_resistant",        label:"Krisenfest",                def:"Sehr robuste Bilanz und belastbare Cashflows auch in Stressphasen." },

    // BANKS / CREDIT
    { id:"deposit_franchise",       label:"Deposit Franchise",         def:"Starke Einlagenbasis und solide Refinanzierung." },
    { id:"asset_sensitive",         label:"Asset Sensitive",           def:"Erträge reagieren stark auf Zinsumfeld." },
    { id:"credit_disciplined",      label:"Kreditdiszipliniert",       def:"Vorsichtiges Kreditbuch und solide Risikovorsorge." },
    { id:"capital_return_bank",     label:"Capital Return Bank",       def:"Bank mit starker Ausschüttungs- und Buyback-These." },

    // INSURANCE
    { id:"float_compounder",        label:"Float Compounder",          def:"Versicherer mit stark nutzbarem Float und vernünftiger Kapitalanlage." },
    { id:"underwriting_quality",    label:"Underwriting Quality",      def:"Diszipliniertes Underwriting und gute Schadendisziplin." },
    { id:"investment_lever",        label:"Investment Lever",          def:"Versicherer mit wesentlicher Ergebnissensitivität über Kapitalanlage." },

    // REITS / REAL ESTATE
    { id:"income_reit",             label:"Income REIT",               def:"Fokus auf laufende Ausschüttung über Mieterträge." },
    { id:"compounder_reit",         label:"Compounder REIT",           def:"REIT mit Reinvestitionsspielraum, AFFO-Wachstum und guter Kapitalallokation." },
    { id:"asset_value_play",        label:"Asset Value Play",          def:"Substanz- oder NAV-getriebene Investmentthese." },

    // UTILITIES / INFRA
    { id:"regulated_compounder",    label:"Regulated Compounder",      def:"Stark reguliertes, planbares und kapitalintensives Compounder-Modell." },
    { id:"yield_utility",           label:"Yield Utility",             def:"Versorger mit Fokus auf Ausschüttung und Stabilität." },
    { id:"infrastructure_defensive",label:"Infrastructure Defensive",  def:"Infrastrukturähnliches, robustes Geschäft mit hoher Planbarkeit." },

    // ASSET MANAGERS
    { id:"aum_compounder",          label:"AUM Compounder",            def:"Langfristiger Vermögenswachstumstreiber über AUM und Skalierung." },
    { id:"fee_franchise",           label:"Fee Franchise",             def:"Starke Gebührenbasis, skalierbares Modell, gute Margen." },
    { id:"market_beta_play",        label:"Market Beta Play",          def:"Geschäft hängt stark von Marktbewegung und AUM-Niveau ab." },

    // OIL / GAS / MINING
    { id:"commodity_cashflow",      label:"Commodity Cashflow",        def:"These basiert auf Rohstoffpreis, Volumen und Cashflow-Hebel." },
    { id:"resource_quality",        label:"Resource Quality",          def:"Hohe Qualität von Reserven, Assets oder Kostenposition." },
    { id:"capital_cycle_play",      label:"Capital Cycle Play",        def:"These profitiert vom Angebots-/Investitionszyklus." },

    // PHARMA / HEALTHCARE
    { id:"pipeline_growth",         label:"Pipeline Growth",           def:"Wachstum wird wesentlich durch Pipeline, Produkte oder Innovation getragen." },
    { id:"cash_cow_pharma",         label:"Cash-Cow Pharma",           def:"Starke Cashflows, etablierte Produkte, eher defensive Pharma-These." },
    { id:"patent_risk",             label:"Patent Risk",               def:"Erträge hängen relevant an Patentlaufzeiten oder Produktkonzentration." },

    // TELECOM
    { id:"yield_telco",             label:"Yield Telco",               def:"Telekom mit Fokus auf laufenden Cashflow und Dividende." },
    { id:"infrastructure_telco",    label:"Infrastructure Telco",      def:"Infrastrukturgetriebenes Telco-Modell mit hoher Visibilität." },
    { id:"mature_cashflow",         label:"Mature Cashflow",           def:"Reifes Geschäft mit begrenztem Wachstum, aber stabilen Cashflows." },

    // SEMIS
    { id:"semi_compounder",         label:"Semi Compounder",           def:"Halbleiter-Unternehmen mit strukturellem Wachstum und hoher Kapitalrendite." },
    { id:"semi_cycle",              label:"Semi Cycle",                def:"Stark zyklischer Halbleiter-Case über Nachfrage- und Lagerzyklen." },
    { id:"capex_leverage",          label:"CapEx Leverage",            def:"Ergebnis hängt stark an Auslastung, Investitionen und Operating Leverage." },

    // BDC / PRIVATE CREDIT
    { id:"credit_income",           label:"Credit Income",             def:"These basiert auf laufendem Zinseinkommen und Ausschüttung." },
    { id:"book_value_play",         label:"Book Value Play",           def:"Substanz- oder NAV/Buchwert-getriebene These." },
    { id:"spread_lender",           label:"Spread Lender",             def:"Ertragsmodell lebt vom Kreditspread und Underwriting." },

    // DEFENSE
    { id:"backlog_compounder",      label:"Backlog Compounder",        def:"Wachstum und Visibilität werden stark durch Auftragsbestand getragen." },
    { id:"program_execution",       label:"Program Execution",         def:"These hängt an sauberer Projekt-/Programm-Ausführung." },
    { id:"budget_defensive",        label:"Budget Defensive",          def:"Relativ defensiv durch staatliche Budgets und langfristige Programme." }
  ];

  // =========================
  // 2) KATEGORIEN
  // =========================
  const CATEGORIES = [
    {
      id:"market_style",
      label:"Market Style",
      def:"Stil-Tag zur groben Einordnung.",
      options:[
        { id:"style_deep_value",  label:"Deep Value" },
        { id:"style_value",       label:"Value" },
        { id:"style_growth",      label:"Growth" },
        { id:"style_garp",        label:"GARP" },
        { id:"style_quality",     label:"Quality" },
        { id:"style_dividend",    label:"Dividend" },
        { id:"style_turnaround",  label:"Turnaround" },
        { id:"style_distressed",  label:"Distressed" },
        { id:"style_speculation", label:"Speculation" },
        { id:"style_unknown",     label:"Unklar" }
      ]
    },
    {
      id:"business_model",
      label:"Geschäftsmodell / Erlösqualität",
      def:"Wie Umsätze entstehen und wie planbar sie sind.",
      options:[
        { id:"bm_recurring",   label:"Recurring / Abo" },
        { id:"bm_transaction", label:"Transaktion" },
        { id:"bm_project",     label:"Projektgeschäft" },
        { id:"bm_interest",    label:"Zinslastig" },
        { id:"bm_fee",         label:"Gebühren-/Provisionsstark" },
        { id:"bm_regulated",   label:"Reguliert" },
        { id:"bm_asset_based", label:"Asset-/Substanzbasiert" },
        { id:"bm_diversified", label:"Diversifiziert" },
        { id:"bm_strong",      label:"Ertragsstark" },
        { id:"bm_pressure",    label:"Ertragsdruck" },
        { id:"bm_unknown",     label:"Unklar" }
      ]
    },
    {
      id:"margin_profile",
      label:"Margenprofil",
      def:"Struktur und Stärke der Margen.",
      options:[
        { id:"mp_high",    label:"High" },
        { id:"mp_mid",     label:"Mid" },
        { id:"mp_low",     label:"Low" },
        { id:"mp_volatile",label:"Volatil" },
        { id:"mp_unknown", label:"Unklar" }
      ]
    },
    {
      id:"leverage",
      label:"Verschuldung",
      def:"Finanzierungs- und Refinanzierungsrisiko.",
      options:[
        { id:"lev_net_cash", label:"Net Cash" },
        { id:"lev_low",      label:"Low" },
        { id:"lev_mid",      label:"Moderate" },
        { id:"lev_high",     label:"High" },
        { id:"lev_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"cashflow_type",
      label:"Cashflow Typ",
      def:"Qualität und Verlässlichkeit des Cashflows.",
      options:[
        { id:"cf_cash_cow",      label:"Cash-Cow" },
        { id:"cf_stable",        label:"Cashflow-stabil" },
        { id:"cf_yield_strong",  label:"Cashflow-renditestark" },
        { id:"cf_fcf_positive",  label:"FCF-positiv" },
        { id:"cf_fcf_negative",  label:"FCF-negativ" },
        { id:"cf_volatile",      label:"Volatil" },
        { id:"cf_unknown",       label:"Unklar" }
      ]
    },
    {
      id:"cyclicality",
      label:"Zyklizität",
      def:"Wie stark das Geschäft am Zyklus hängt.",
      options:[
        { id:"cy_defensive", label:"Defensiv" },
        { id:"cy_mixed",     label:"Mittel" },
        { id:"cy_cyclical",  label:"Zyklisch" },
        { id:"cy_highly",    label:"Stark zyklisch" },
        { id:"cy_unknown",   label:"Unklar" }
      ]
    },
    {
      id:"moat",
      label:"Moat",
      def:"Wettbewerbsvorteil oder Franchise-Stärke.",
      options:[
        { id:"moat_strong",  label:"Stark" },
        { id:"moat_medium",  label:"Mittel" },
        { id:"moat_weak",    label:"Schwach" },
        { id:"moat_unknown", label:"Unklar" }
      ]
    },
    {
      id:"dividend_profile",
      label:"Dividendenprofil",
      def:"Ausschüttungsqualität und Ausschüttungsrisiko.",
      options:[
        { id:"div_none",          label:"Keine" },
        { id:"div_low_safe",      label:"Niedrig & sicher" },
        { id:"div_growing",       label:"Wachsend" },
        { id:"div_high_risky",    label:"Hoch & riskant" },
        { id:"div_high_yield",    label:"Hohe Rendite" },
        { id:"div_well_covered",  label:"Gut gedeckt" },
        { id:"div_risky",         label:"Riskant" },
        { id:"div_unknown",       label:"Unklar" }
      ]
    },
    {
      id:"profitability",
      label:"Profitabilität",
      def:"Wie stark und effizient das Geschäft verdient.",
      options:[
        { id:"prof_high",    label:"Hoch" },
        { id:"prof_solid",   label:"Solide" },
        { id:"prof_weak",    label:"Schwach" },
        { id:"prof_unknown", label:"Unklar" }
      ]
    },
    {
      id:"balance_sheet_liquidity",
      label:"Bilanz / Liquidität",
      def:"Bilanzstärke und kurzfristige Stabilität.",
      options:[
        { id:"bal_strong",   label:"Stark" },
        { id:"bal_solid",    label:"Solide" },
        { id:"bal_weak",     label:"Schwach" },
        { id:"bal_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"valuation",
      label:"Bewertung",
      def:"Wie günstig oder teuer die aktuelle Bewertung wirkt.",
      options:[
        { id:"val_cheap",     label:"Günstig" },
        { id:"val_fair",      label:"Fair / Mittel" },
        { id:"val_expensive", label:"Teuer" },
        { id:"val_unknown",   label:"Unklar" }
      ]
    },
    {
      id:"cap_size",
      label:"CapSize",
      def:"Unternehmensgröße als Risiko- und Liquiditätsfilter.",
      options:[
        { id:"cap_small",   label:"Small" },
        { id:"cap_mid",     label:"Mid" },
        { id:"cap_large",   label:"Large" },
        { id:"cap_mega",    label:"Mega" },
        { id:"cap_unknown", label:"Unklar" }
      ]
    },

    // BANKS / CREDIT
    {
      id:"credit_risk_asset_quality",
      label:"Kreditrisiko / Asset Quality",
      def:"Qualität des Kreditbuchs und Höhe der Vorsorge.",
      options:[
        { id:"cr_strong",   label:"Stark" },
        { id:"cr_solid",    label:"Solide" },
        { id:"cr_weak",     label:"Schwach" },
        { id:"cr_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"deposits_refinancing",
      label:"Einlagen / Refinanzierung",
      def:"Wie konservativ oder eng das Institut refinanziert ist.",
      options:[
        { id:"dep_base",         label:"Einlagenbasis vorhanden" },
        { id:"dep_conservative", label:"Konservativ refinanziert" },
        { id:"dep_balanced",     label:"Ausgewogen" },
        { id:"dep_tight",        label:"Enger finanziert" },
        { id:"dep_pressure",     label:"Refinanzierungsdruck" },
        { id:"dep_unknown",      label:"Unklar" }
      ]
    },
    {
      id:"capital_strength_book",
      label:"Kapitalstärke / Buchwertprofil",
      def:"Buchwert, Tangible Book und Bilanzrentabilität.",
      options:[
        { id:"cap_book_positive", label:"Buchwert positiv" },
        { id:"cap_tbv_positive",  label:"Tangible Buchwert positiv" },
        { id:"cap_strong",        label:"Kapitalstark" },
        { id:"cap_solid",         label:"Solide kapitalisiert" },
        { id:"cap_efficient",     label:"Bilanz effizient" },
        { id:"cap_weak_profit",   label:"Bilanz schwach rentabel" },
        { id:"cap_unknown",       label:"Unklar" }
      ]
    },

    // GROWTH / EARNINGS PROFILE
    {
      id:"growth_profile",
      label:"Wachstumsprofil",
      def:"Wachstum von Umsatz, Ertrag, Gewinn oder Cashflow.",
      options:[
        { id:"gp_nii_growth",    label:"Zinsüberschuss wächst" },
        { id:"gp_fee_growth",    label:"Fee Income wächst" },
        { id:"gp_rev_growth",    label:"Umsatz / Erträge wachsen" },
        { id:"gp_cf_growth",     label:"Cashflow wächst" },
        { id:"gp_income_growth", label:"Gewinnwachstum" },
        { id:"gp_multi_growth",  label:"Mehrjahreswachstum" },
        { id:"gp_shrinking",     label:"Schrumpfend" },
        { id:"gp_unknown",       label:"Unklar" }
      ]
    },

    // FRANCHISE / QUALITY
    {
      id:"franchise_moat",
      label:"Franchise / Moat",
      def:"Stärke der Marktstellung und Qualität der Ertragsbasis.",
      options:[
        { id:"fm_strong",  label:"Stark" },
        { id:"fm_medium",  label:"Mittel" },
        { id:"fm_weak",    label:"Schwach" },
        { id:"fm_unknown", label:"Unklar" }
      ]
    },
    {
      id:"balance_sheet_stability",
      label:"Bilanz / Stabilität",
      def:"Substanz, Liquidität, Reserven und Stabilität des Geschäftsmodells.",
      options:[
        { id:"bs_equity_positive",  label:"Eigenkapital positiv" },
        { id:"bs_tangible",         label:"Tangible Substanz vorhanden" },
        { id:"bs_deposits_covered", label:"Einlagen gut gedeckt" },
        { id:"bs_reserves_solid",   label:"Risikovorsorge solide" },
        { id:"bs_refi_tight",       label:"Refinanzierung angespannt" },
        { id:"bs_weak_substance",   label:"Schwache Substanz" },
        { id:"bs_unknown",          label:"Unklar" }
      ]
    },

    // INSURANCE
    {
      id:"underwriting_profile",
      label:"Underwriting / Schadenprofil",
      def:"Qualität des Underwritings und Schaden-/Kostenstruktur.",
      options:[
        { id:"uw_strong",   label:"Stark" },
        { id:"uw_solid",    label:"Solide" },
        { id:"uw_weak",     label:"Schwach" },
        { id:"uw_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"investment_profile",
      label:"Kapitalanlageprofil",
      def:"Struktur und Qualität der Investmentseite.",
      options:[
        { id:"ip_conservative", label:"Konservativ" },
        { id:"ip_balanced",     label:"Ausgewogen" },
        { id:"ip_risky",        label:"Risikoreicher" },
        { id:"ip_unknown",      label:"Unklar" }
      ]
    },

    // REITS
    {
      id:"real_estate_profile",
      label:"Immobilienprofil",
      def:"Immobiliencharakter, Substanz und Cashflow-Qualität.",
      options:[
        { id:"re_income",    label:"Income" },
        { id:"re_growth",    label:"Growth" },
        { id:"re_mixed",     label:"Mixed" },
        { id:"re_stressed",  label:"Stressed" },
        { id:"re_unknown",   label:"Unklar" }
      ]
    },
    {
      id:"payout_profile_reit",
      label:"AFFO / FFO Ausschüttung",
      def:"Qualität und Tragfähigkeit der REIT-Ausschüttung.",
      options:[
        { id:"reit_pay_safe",    label:"Sicher" },
        { id:"reit_pay_ok",      label:"Okay" },
        { id:"reit_pay_tight",   label:"Eng" },
        { id:"reit_pay_risky",   label:"Riskant" },
        { id:"reit_pay_unknown", label:"Unklar" }
      ]
    },

    // UTILITIES / INFRA
    {
      id:"regulation_mix",
      label:"Regulierung / Erlös-Mix",
      def:"Anteil regulierter und nicht-regulierter Erlöse.",
      options:[
        { id:"rm_regulated",   label:"Überwiegend reguliert" },
        { id:"rm_balanced",    label:"Gemischt" },
        { id:"rm_market",      label:"Marktpreisgetrieben" },
        { id:"rm_unknown",     label:"Unklar" }
      ]
    },
    {
      id:"capital_intensity",
      label:"Kapitalintensität",
      def:"Wie hoch CapEx-Bedarf und Asset-Schwere des Modells sind.",
      options:[
        { id:"ci_low",      label:"Niedrig" },
        { id:"ci_mid",      label:"Mittel" },
        { id:"ci_high",     label:"Hoch" },
        { id:"ci_unknown",  label:"Unklar" }
      ]
    },

    // ASSET MANAGERS
    {
      id:"aum_profile",
      label:"AUM Profil",
      def:"Qualität, Wachstum und Struktur des verwalteten Vermögens.",
      options:[
        { id:"aum_strong",   label:"Stark" },
        { id:"aum_solid",    label:"Solide" },
        { id:"aum_weak",     label:"Schwach" },
        { id:"aum_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"fee_mix",
      label:"Fee Mix",
      def:"Qualität der Gebührenbasis und Skalierbarkeit.",
      options:[
        { id:"fee_stable",    label:"Stabil" },
        { id:"fee_variable",  label:"Variabel" },
        { id:"fee_perf",      label:"Performance Fee-lastig" },
        { id:"fee_unknown",   label:"Unklar" }
      ]
    },

    // COMMODITIES / RESOURCES
    {
      id:"commodity_exposure",
      label:"Rohstoff-Exposure",
      def:"Wie stark Case und Bewertung am Rohstoffpreis hängen.",
      options:[
        { id:"com_low",      label:"Niedrig" },
        { id:"com_mid",      label:"Mittel" },
        { id:"com_high",     label:"Hoch" },
        { id:"com_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"cost_position",
      label:"Kostenposition",
      def:"Kostenprofil im Branchenvergleich.",
      options:[
        { id:"cost_low",      label:"Niedrigkosten" },
        { id:"cost_mid",      label:"Mittelfeld" },
        { id:"cost_high",     label:"Hochkosten" },
        { id:"cost_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"reserve_asset_quality",
      label:"Reserven / Asset Qualität",
      def:"Qualität von Reserven, Ressourcen oder Asset-Basis.",
      options:[
        { id:"raq_strong",   label:"Stark" },
        { id:"raq_solid",    label:"Solide" },
        { id:"raq_weak",     label:"Schwach" },
        { id:"raq_unknown",  label:"Unklar" }
      ]
    },

    // PHARMA / HEALTHCARE
    {
      id:"innovation_profile",
      label:"Innovation / Pipeline",
      def:"Pipeline-Stärke, F&E-Intensität und Produktqualität.",
      options:[
        { id:"inn_strong",   label:"Stark" },
        { id:"inn_solid",    label:"Solide" },
        { id:"inn_weak",     label:"Schwach" },
        { id:"inn_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"product_risk",
      label:"Produkt- / Patentrisiko",
      def:"Abhängigkeit von wenigen Produkten oder Patentabläufen.",
      options:[
        { id:"pr_low",      label:"Niedrig" },
        { id:"pr_mid",      label:"Mittel" },
        { id:"pr_high",     label:"Hoch" },
        { id:"pr_unknown",  label:"Unklar" }
      ]
    },

    // TELECOM
    {
      id:"network_infrastructure",
      label:"Netz / Infrastruktur",
      def:"Netzqualität, Asset-Basis und Stabilität der Infrastruktur.",
      options:[
        { id:"net_strong",   label:"Stark" },
        { id:"net_solid",    label:"Solide" },
        { id:"net_weak",     label:"Schwach" },
        { id:"net_unknown",  label:"Unklar" }
      ]
    },

    // SEMICONDUCTORS
    {
      id:"semi_positioning",
      label:"Halbleiter-Positionierung",
      def:"Position in Zyklus, Lieferkette und Wettbewerb.",
      options:[
        { id:"semi_structural", label:"Strukturelles Wachstum" },
        { id:"semi_balanced",   label:"Ausgewogen" },
        { id:"semi_cyclical",   label:"Zyklisch" },
        { id:"semi_unknown",    label:"Unklar" }
      ]
    },
    {
      id:"inventory_cycle",
      label:"Inventar / Zyklus",
      def:"Lager- und Nachfragezyklus im Halbleitergeschäft.",
      options:[
        { id:"inv_tailwind", label:"Rückenwind" },
        { id:"inv_normal",   label:"Normal" },
        { id:"inv_headwind", label:"Gegenwind" },
        { id:"inv_unknown",  label:"Unklar" }
      ]
    },

    // BDC / PRIVATE CREDIT
    {
      id:"credit_portfolio_quality",
      label:"Kreditportfolio Qualität",
      def:"Qualität, Diversifikation und Risiko des Portfolios.",
      options:[
        { id:"cpq_strong",   label:"Stark" },
        { id:"cpq_solid",    label:"Solide" },
        { id:"cpq_weak",     label:"Schwach" },
        { id:"cpq_unknown",  label:"Unklar" }
      ]
    },
    {
      id:"nav_book_profile",
      label:"NAV / Buchwertprofil",
      def:"Substanzqualität und Stabilität des Buchwerts.",
      options:[
        { id:"nav_strong",   label:"Stark" },
        { id:"nav_solid",    label:"Solide" },
        { id:"nav_weak",     label:"Schwach" },
        { id:"nav_unknown",  label:"Unklar" }
      ]
    },

    // DEFENSE
    {
      id:"backlog_visibility",
      label:"Backlog / Visibilität",
      def:"Wie stark Auftragsbestand und Langfristigkeit die Visibilität stützen.",
      options:[
        { id:"bv_high",      label:"Hoch" },
        { id:"bv_mid",       label:"Mittel" },
        { id:"bv_low",       label:"Niedrig" },
        { id:"bv_unknown",   label:"Unklar" }
      ]
    },
    {
      id:"program_risk",
      label:"Programm- / Ausführungsrisiko",
      def:"Risiko aus Projektverzug, Kostenüberschreitungen oder Ausführung.",
      options:[
        { id:"prog_low",      label:"Niedrig" },
        { id:"prog_mid",      label:"Mittel" },
        { id:"prog_high",     label:"Hoch" },
        { id:"prog_unknown",  label:"Unklar" }
      ]
    }
  ];

  const PREVIEW_ROLE_IDS = [
    "div_income",
    "div_growth",
    "deep_value",
    "value",
    "growth",
    "garp",
    "quality_compounder",
    "pricing_power",
    "cyclical",
    "turnaround",
    "speculation",
    "distressed"
  ];

  const MODE_ROLE_IDS = {
    standard: [
      "div_income",
      "div_growth",
      "deep_value",
      "value",
      "growth",
      "garp",
      "quality_compounder",
      "pricing_power",
      "cyclical",
      "turnaround",
      "speculation",
      "distressed",
      "balance_sheet_strong",
      "healthy",
      "cashflow_strong",
      "weak_liquidity",
      "defensive",
      "stable_defensive",
      "crisis_resistant"
    ],

    banks: [
      "div_income",
      "value",
      "deep_value",
      "turnaround",
      "speculation",
      "distressed",
      "deposit_franchise",
      "asset_sensitive",
      "credit_disciplined",
      "capital_return_bank",
      "balance_sheet_strong",
      "leveraged",
      "healthy",
      "defensive"
    ],

    insurance: [
      "div_income",
      "div_growth",
      "value",
      "quality_compounder",
      "float_compounder",
      "underwriting_quality",
      "investment_lever",
      "defensive",
      "stable_defensive",
      "crisis_resistant",
      "healthy",
      "balance_sheet_strong"
    ],

    reits: [
      "div_income",
      "value",
      "deep_value",
      "income_reit",
      "compounder_reit",
      "asset_value_play",
      "leveraged",
      "cashflow_strong",
      "defensive",
      "turnaround",
      "distressed"
    ],

    utilities: [
      "div_income",
      "div_growth",
      "yield_utility",
      "regulated_compounder",
      "infrastructure_defensive",
      "defensive",
      "stable_defensive",
      "crisis_resistant",
      "leveraged",
      "cashflow_strong"
    ],

    assetManagers: [
      "div_income",
      "value",
      "growth",
      "garp",
      "quality_compounder",
      "aum_compounder",
      "fee_franchise",
      "market_beta_play",
      "cashflow_strong",
      "healthy",
      "speculation"
    ],

    oilGas: [
      "div_income",
      "value",
      "deep_value",
      "cyclical",
      "commodity_cashflow",
      "resource_quality",
      "capital_cycle_play",
      "cashflow_strong",
      "leveraged",
      "turnaround",
      "speculation"
    ],

    mining: [
      "value",
      "deep_value",
      "cyclical",
      "commodity_cashflow",
      "resource_quality",
      "capital_cycle_play",
      "cashflow_strong",
      "leveraged",
      "turnaround",
      "speculation",
      "distressed"
    ],

    pharmaHealthcare: [
      "div_income",
      "div_growth",
      "growth",
      "garp",
      "quality_compounder",
      "pricing_power",
      "pipeline_growth",
      "cash_cow_pharma",
      "patent_risk",
      "defensive",
      "healthy",
      "cashflow_strong"
    ],

    telecom: [
      "div_income",
      "value",
      "yield_telco",
      "infrastructure_telco",
      "mature_cashflow",
      "cashflow_strong",
      "leveraged",
      "defensive",
      "stable_defensive"
    ],

    semiconductors: [
      "growth",
      "garp",
      "quality_compounder",
      "pricing_power",
      "semi_compounder",
      "semi_cycle",
      "capex_leverage",
      "cyclical",
      "cashflow_strong",
      "speculation"
    ],

    bdcPrivateCredit: [
      "div_income",
      "value",
      "book_value_play",
      "credit_income",
      "spread_lender",
      "balance_sheet_strong",
      "leveraged",
      "cashflow_strong",
      "speculation",
      "distressed"
    ],

    defense: [
      "value",
      "growth",
      "garp",
      "quality_compounder",
      "backlog_compounder",
      "program_execution",
      "budget_defensive",
      "cashflow_strong",
      "defensive",
      "stable_defensive",
      "healthy"
    ]
  };

  const MODE_CATEGORY_IDS = {
    standard: [
      "market_style",
      "business_model",
      "margin_profile",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "moat",
      "dividend_profile",
      "profitability",
      "balance_sheet_liquidity",
      "valuation",
      "cap_size",
      "growth_profile",
      "franchise_moat"
    ],

    banks: [
      "market_style",
      "business_model",
      "leverage",
      "profitability",
      "valuation",
      "cap_size",
      "credit_risk_asset_quality",
      "deposits_refinancing",
      "capital_strength_book",
      "growth_profile",
      "franchise_moat",
      "balance_sheet_stability",
      "dividend_profile"
    ],

    insurance: [
      "market_style",
      "business_model",
      "margin_profile",
      "leverage",
      "cashflow_type",
      "profitability",
      "balance_sheet_liquidity",
      "valuation",
      "cap_size",
      "underwriting_profile",
      "investment_profile",
      "growth_profile",
      "franchise_moat",
      "dividend_profile"
    ],

    reits: [
      "market_style",
      "business_model",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "dividend_profile",
      "valuation",
      "cap_size",
      "real_estate_profile",
      "payout_profile_reit",
      "balance_sheet_liquidity"
    ],

    utilities: [
      "market_style",
      "business_model",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "dividend_profile",
      "valuation",
      "cap_size",
      "regulation_mix",
      "capital_intensity",
      "balance_sheet_liquidity",
      "profitability"
    ],

    assetManagers: [
      "market_style",
      "business_model",
      "margin_profile",
      "cashflow_type",
      "profitability",
      "valuation",
      "cap_size",
      "aum_profile",
      "fee_mix",
      "growth_profile",
      "franchise_moat",
      "dividend_profile",
      "cyclicality"
    ],

    oilGas: [
      "market_style",
      "business_model",
      "margin_profile",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "valuation",
      "cap_size",
      "commodity_exposure",
      "cost_position",
      "reserve_asset_quality",
      "capital_intensity",
      "balance_sheet_liquidity",
      "dividend_profile"
    ],

    mining: [
      "market_style",
      "business_model",
      "margin_profile",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "valuation",
      "cap_size",
      "commodity_exposure",
      "cost_position",
      "reserve_asset_quality",
      "capital_intensity",
      "balance_sheet_liquidity",
      "dividend_profile"
    ],

    pharmaHealthcare: [
      "market_style",
      "business_model",
      "margin_profile",
      "cashflow_type",
      "moat",
      "profitability",
      "valuation",
      "cap_size",
      "innovation_profile",
      "product_risk",
      "growth_profile",
      "dividend_profile",
      "balance_sheet_liquidity"
    ],

    telecom: [
      "market_style",
      "business_model",
      "margin_profile",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "valuation",
      "cap_size",
      "network_infrastructure",
      "capital_intensity",
      "dividend_profile",
      "balance_sheet_liquidity"
    ],

    semiconductors: [
      "market_style",
      "business_model",
      "margin_profile",
      "leverage",
      "cashflow_type",
      "cyclicality",
      "moat",
      "profitability",
      "valuation",
      "cap_size",
      "semi_positioning",
      "inventory_cycle",
      "capital_intensity",
      "growth_profile"
    ],

    bdcPrivateCredit: [
      "market_style",
      "business_model",
      "leverage",
      "cashflow_type",
      "profitability",
      "valuation",
      "cap_size",
      "credit_portfolio_quality",
      "nav_book_profile",
      "growth_profile",
      "dividend_profile",
      "balance_sheet_stability"
    ],

    defense: [
      "market_style",
      "business_model",
      "margin_profile",
      "cashflow_type",
      "moat",
      "profitability",
      "valuation",
      "cap_size",
      "backlog_visibility",
      "program_risk",
      "growth_profile",
      "balance_sheet_liquidity"
    ]
  };

  function byId(list, id){
    return list.find(x => x.id === id) || null;
  }

  function pickByIds(list, ids){
    const src = Array.isArray(ids) ? ids : [];
    return src.map(id => byId(list, id)).filter(Boolean);
  }

  function normModeKey(modeKey){
    return String(modeKey || "standard").trim() || "standard";
  }

  window.NUTZEN_TAXONOMY = {
    roles: ROLES,
    categories: CATEGORIES,
    previewRoleIds: PREVIEW_ROLE_IDS,
    modeRoleIds: MODE_ROLE_IDS,
    modeCategoryIds: MODE_CATEGORY_IDS,

    getAllRoles(){
      return ROLES.slice();
    },

    getAllCategories(){
      return CATEGORIES.slice();
    },

    getPreviewRoles(){
      return PREVIEW_ROLE_IDS
        .map(id => byId(ROLES, id))
        .filter(Boolean);
    },

    getModeRoles(modeKey){
      const key = normModeKey(modeKey);
      const ids = MODE_ROLE_IDS[key] || MODE_ROLE_IDS.standard || [];
      return pickByIds(ROLES, ids);
    },

    getModeCategories(modeKey){
      const key = normModeKey(modeKey);
      const ids = MODE_CATEGORY_IDS[key] || MODE_CATEGORY_IDS.standard || [];
      return pickByIds(CATEGORIES, ids);
    },

    roleById(id){
      return byId(ROLES, id);
    },

    categoryById(id){
      return byId(CATEGORIES, id);
    },

    categoryOptionById(categoryId, optionId){
      const cat = byId(CATEGORIES, categoryId);
      if(!cat) return null;
      return (cat.options || []).find(o => o.id === optionId) || null;
    }
  };
})();