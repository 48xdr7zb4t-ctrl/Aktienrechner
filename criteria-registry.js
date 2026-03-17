"use strict";

const CRITERIA = {
  REVENUE_1Y: {
    label: "Revenue 1Y",
    aliases: [
      "Revenue 1Y"
    ]
  },
  REVENUE_CAGR_4Y: {
    label: "Revenue (CAGR) 4Y",
    aliases: [
      "Revenue (CAGR) 4Y"
    ]
  },
  REVENUE_GROWTH_YOY_1Y: {
    label: "Revenue Growth (YoY) 1Y",
    aliases: [
      "Revenue Growth (YoY) 1Y"
    ]
  },
  NET_INCOME_1Y: {
    label: "Net Income 1Y",
    aliases: [
      "Net Income 1Y"
    ]
  },
  NET_INCOME_GROWTH_1Y: {
    label: "Net Income Growth 1Y",
    aliases: [
      "Net Income Growth 1Y"
    ]
  },
  SHARES_OUTSTANDING_DILUTED_1Y: {
    label: "Shares Outstanding (diluted) 1Y",
    aliases: [
      "Shares Outstanding (diluted) 1Y"
    ]
  },
  SHARES_CHANGE_YOY_1Y: {
    label: "Shares Change (YoY) 1Y",
    aliases: [
      "Shares Change (YoY) 1Y"
    ]
  },
  EPS_DILUTED_1Y: {
    label: "EPS (diluted) 1Y",
    aliases: [
      "EPS (diluted) 1Y"
    ]
  },
  EPS_GROWTH_CAGR_4Y: {
    label: "EPS growth (CAGR) 4Y",
    aliases: [
      "EPS growth (CAGR) 4Y",
      "EPS Growth (CAGR) 4Y"
    ]
  },
  FCF_1Y: {
    label: "FCF 1Y",
    aliases: [
      "FCF 1Y"
    ]
  },
  GROSS_MARGIN_1Y: {
    label: "Gross Margin 1Y",
    aliases: [
      "Gross Margin 1Y"
    ]
  },
  OPERATING_MARGIN_1Y: {
    label: "Operating Margin 1Y",
    aliases: [
      "Operating Margin 1Y"
    ]
  },
  PROFIT_MARGIN_1Y: {
    label: "Profit Margin 1Y",
    aliases: [
      "Profit Margin 1Y"
    ]
  },
  FCF_MARGIN_1Y: {
    label: "FCF Margin 1Y",
    aliases: [
      "FCF Margin 1Y"
    ]
  },
  EBITDA_1Y: {
    label: "EBITDA 1Y",
    aliases: [
      "EBITDA 1Y"
    ]
  },
  EBITDA_MARGIN_1Y: {
    label: "EBITDA Margin 1Y",
    aliases: [
      "EBITDA Margin 1Y"
    ]
  },
  SHORT_TERM_INVESTMENTS_1Y: {
    label: "Short-Term Investments 1Y",
    aliases: [
      "Short-Term Investments 1Y"
    ]
  },
  CASH_AND_SHORT_TERM_INVESTMENTS_1Y: {
    label: "Cash & Short-Term Investments 1Y",
    aliases: [
      "Cash & Short-Term Investments 1Y"
    ]
  },
  TOTAL_DEBT_1Y: {
    label: "Total Debt 1Y",
    aliases: [
      "Total Debt 1Y"
    ]
  },
  NET_CASH_DEBT_1Y: {
    label: "Net Cash (Debt) 1Y",
    aliases: [
      "Net Cash (Debt) 1Y",
      "Net Cash (debt) 1Y"
    ]
  },
  BOOK_VALUE_PER_SHARE_1Y: {
    label: "Book Value per Share 1Y",
    aliases: [
      "Book Value per Share 1Y"
    ]
  },
  OPERATING_CASH_FLOW_1Y: {
    label: "Operating Cash Flow 1Y",
    aliases: [
      "Operating Cash Flow 1Y"
    ]
  },
  CAPEX_CAPITAL_EXPENDITURES_1Y: {
    label: "CapEx (Capital Expenditures) 1Y",
    aliases: [
      "CapEx (Capital Expenditures) 1Y"
    ]
  },
  ENTERPRISE_VALUE_1Y: {
    label: "Enterprise Value 1Y",
    aliases: [
      "Enterprise Value 1Y"
    ]
  },
  PE_RATIO_1Y: {
    label: "PE Ratio 1Y",
    aliases: [
      "PE Ratio 1Y"
    ]
  },
  FORWARD_PE_1Y: {
    label: "Forward PE 1Y",
    aliases: [
      "Forward PE 1Y",
      "Forward PE Ratio 1Y"
    ]
  },
  PS_RATIO_1Y: {
    label: "PS Ratio 1Y",
    aliases: [
      "PS Ratio 1Y"
    ]
  },
  PB_RATIO_1Y: {
    label: "PB Ratio 1Y",
    aliases: [
      "PB Ratio 1Y"
    ]
  },
  P_FCF_RATIO_1Y: {
    label: "P/FCF Ratio 1Y",
    aliases: [
      "P/FCF Ratio 1Y",
      "P/ FCF Ratio 1Y"
    ]
  },
  P_OCF_RATIO_1Y: {
    label: "P/OCF Ratio 1Y",
    aliases: [
      "P/OCF Ratio 1Y",
      "P/ OCF Ratio 1Y"
    ]
  },
  EV_SALES_RATIO_1Y: {
    label: "EV/Sales Ratio 1Y",
    aliases: [
      "EV/Sales Ratio 1Y",
      "EV/ Sales Ratio 1Y"
    ]
  },
  EV_EBITDA_RATIO_1Y: {
    label: "EV/EBITDA Ratio 1Y",
    aliases: [
      "EV/EBITDA Ratio 1Y",
      "EV/ EBITDA Ratio 1Y"
    ]
  },
  QUICK_RATIO_1Y: {
    label: "Quick Ratio 1Y",
    aliases: [
      "Quick Ratio 1Y",
      "Quick Ratio"
    ]
  },
  CURRENT_RATIO_1Y: {
    label: "Current Ratio 1Y",
    aliases: [
      "Current Ratio 1Y",
      "Current Ratio"
    ]
  },
  ROE_1Y: {
    label: "ROE 1Y",
    aliases: [
      "ROE 1Y"
    ]
  },
  ROA_1Y: {
    label: "ROA 1Y",
    aliases: [
      "ROA 1Y"
    ]
  },
  ROIC_1Y: {
    label: "ROIC 1Y",
    aliases: [
      "ROIC 1Y"
    ]
  },
  EARNINGS_YIELD_1Y: {
    label: "Earnings Yield 1Y",
    aliases: [
      "Earnings Yield 1Y",
      "Earnings Yield",
      "Gewinnrendite 1Y"
    ]
  },
  FCF_YIELD_1Y: {
    label: "FCF Yield 1Y",
    aliases: [
      "FCF Yield 1Y",
      "FCF Yield",
      "Free Cash Flow Yield 1Y"
    ]
  },
INTEREST_COVERAGE_ZINSDECKUNG: {
  label: "Interest Coverage (Zinsdeckung)",
  aliases: [
    "Interest Coverage (Zinsdeckung)",
    "Interest Coverage 1Y (Zinsdeckung)",
    "Interest Coverage 1Y",
    "Interest Coverage"
  ]
},
  DIVIDEND_YIELD: {
    label: "Dividend Yield",
    aliases: [
      "Dividend Yield",
      "Dividend Yield 1Y"
    ]
  },
  PAYMENT_FREQUENCY: {
    label: "Payment Frequency",
    aliases: [
      "Payment Frequency",
      "Dividend Payment Frequency"
    ]
  },
  DIVIDEND_GROWTH_YEARS: {
    label: "Dividend Growth years",
    aliases: [
      "Dividend Growth years",
      "Dividend Growth Years"
    ]
  },
  ANNUAL_DIVIDEND: {
    label: "Annual Dividend",
    aliases: [
      "Annual Dividend",
      "Annual Dividend 1Y"
    ]
  },
  PAYOUT_RATIO: {
    label: "Payout Ratio",
    aliases: [
      "Payout Ratio",
      "Payout Ratio 1Y"
    ]
  },
  BUYBACK_YIELD: {
    label: "Buyback Yield",
    aliases: [
      "Buyback Yield"
    ]
  },
  DIVIDEND_GROWTH: {
    label: "Dividend Growth",
    aliases: [
      "Dividend Growth",
      "Dividend Growth 1Y"
    ]
  },
  SHAREHOLDER_YIELD: {
    label: "Shareholder Yield",
    aliases: [
      "Shareholder Yield"
    ]
  },
  VOLATILITAET_ANNUALISIERT_STD_ABW_10Y: {
    label: "Volatilität annualisiert (Std-Abw.) 10Y",
    aliases: [
      "Volatilität annualisiert (Std-Abw.) 10Y"
    ]
  },
  KURS_CLOSE_AKTUELL: {
    label: "Kurs close aktuell",
    aliases: [
      "Kurs close aktuell",
      "Kurs aktuell",
      "Current Price",
      "Price",
      "Close Price",
      "Closing Price",
      "Aktueller Kurs",
      "Kurs",
      "Last Price"
    ]
  },
  PRICE_CAGR_4Y: {
    label: "Kurs (CAGR) 4Y",
    aliases: [
      "Kurs (CAGR) 4Y"
    ]
  },
  MARKET_CAP: {
    label: "Marktkapitalisierung",
    aliases: [
      "Marktkapitalisierung",
      "Market Cap",
      "Market Capitalization",
      "MarketCap",
      "Markkapitaliserung",
      "Markt Cap"
    ]
  },
  BETA: {
    label: "Beta",
    aliases: [
      "Beta",
      "beta",
      "Beta (5Y)",
      "Beta 5Y",
      "Beta (5 Year)",
      "5Y Beta"
    ]
  },
  RANGE_52W: {
    label: "52-Week Range",
    aliases: [
      "52-Week Range"
    ]
  },
  FAIR_VALUE: {
    label: "Fairer Preis",
    aliases: [
      "Fairer Preis",
      "Fair Price",
      "Fair price",
      "Fair Value",
      "Fair Value Price",
      "Fairer Kurs",
      "Fairer Wert"
    ]
  },

  NET_INTEREST_INCOME_1Y: {
    label: "Net Interest Income 1Y",
    aliases: [
      "Net Interest Income 1Y"
    ]
  },
  NET_INTEREST_INCOME_GROWTH_1Y: {
    label: "Net Interest Income Growth 1Y",
    aliases: [
      "Net Interest Income Growth 1Y"
    ]
  },
  NON_INTEREST_INCOME_1Y: {
    label: "Non- Interest Income 1Y",
    aliases: [
      "Non- Interest Income 1Y"
    ]
  },
  NON_INTEREST_INCOME_GROWTH_1Y: {
    label: "Non- Interest Income Growth 1Y",
    aliases: [
      "Non- Interest Income Growth 1Y"
    ]
  },
  PROVISION_FUER_CREDIT_LOSSES_1Y: {
    label: "Provision für Credit Losses 1Y",
    aliases: [
      "Provision für Credit Losses 1Y"
    ]
  },
  PRETAX_INCOME_1Y: {
    label: "Pretax Income 1Y",
    aliases: [
      "Pretax Income 1Y"
    ]
  },
  GROSS_LOANS_1Y: {
    label: "Gross Loans 1Y",
    aliases: [
      "Gross Loans 1Y"
    ]
  },
  ALLOWANCE_FOR_LOAN_LOSSES_1Y: {
    label: "Allowance for Loan Losses 1Y",
    aliases: [
      "Allowance for Loan Losses 1Y"
    ]
  },
  TOTAL_DEPOSITS_1Y: {
    label: "Total Deposits 1Y",
    aliases: [
      "Total Deposits 1Y"
    ]
  },
  TANGIBLE_BOOK_VALUE_PER_SHARE_1Y: {
    label: "Tangible Book Value per Share 1Y",
    aliases: [
      "Tangible Book Value per Share 1Y",
      "Tangible Book Value Per Share 1Y"
    ]
  },
  ALLOWANCE_GROSS_LOANS_BERECHNET_1Y: {
    label: "Allowance / Gross Loans (berechnet) 1Y",
    aliases: [
      "Allowance / Gross Loans (berechnet) 1Y",
      "KPIs: Allowance / Gross Loans (berechnet) 1Y"
    ]
  },
  LOANS_DEPOSITS_BERECHNET_1Y: {
    label: "Loans / Deposits (berechnet) 1Y",
    aliases: [
      "Loans / Deposits (berechnet) 1Y"
    ]
  },
  P_TBV_RATIO_1Y: {
    label: "P/TBV Ratio 1Y",
    aliases: [
      "P/TBV Ratio 1Y",
      "P/ TBV Ratio 1Y"
    ]
  },

  PREMIUMS_AND_ANNUITY_REVENUE_1Y: {
    label: "Premiums & Annuity Revenue 1Y",
    aliases: [
      "Premiums & Annuity Revenue 1Y"
    ]
  },
  PREMIUMS_AND_ANNUITY_REVENUE_CAGR_4Y: {
    label: "Premiums & Annuity Revenue (CAGR) 4Y",
    aliases: [
      "Premiums & Annuity Revenue (CAGR) 4Y"
    ]
  },
  TOTAL_INTEREST_AND_DIVIDEND_INCOME_1Y: {
    label: "Total Interest & Dividend Income 1Y",
    aliases: [
      "Total Interest & Dividend Income 1Y"
    ]
  },
  TOTAL_REVENUE_1Y: {
    label: "Total Revenue 1Y",
    aliases: [
      "Total Revenue 1Y"
    ]
  },
  POLICY_BENEFITS_1Y: {
    label: "Policy Benefits 1Y",
    aliases: [
      "Policy Benefits 1Y"
    ]
  },
  TOTAL_OPERATING_EXPENSES_1Y: {
    label: "Total Operating Expenses 1Y",
    aliases: [
      "Total Operating Expenses 1Y"
    ]
  },
  OPERATING_INCOME_1Y: {
    label: "Operating Income 1Y",
    aliases: [
      "Operating Income 1Y"
    ]
  },
  INVESTMENTS_IN_DEBT_SECURITIES_1Y: {
    label: "Investments in Debt Securities 1Y",
    aliases: [
      "Investments in Debt Securities 1Y"
    ]
  },
  INVESTMENTS_IN_EQUITY_AND_PREFERRED_SECURITIES_1Y: {
    label: "Investments in Equity & Preferred Securities 1Y",
    aliases: [
      "Investments in Equity & Preferred Securities 1Y"
    ]
  },
  TOTAL_INVESTMENTS_1Y: {
    label: "Total Investments 1Y",
    aliases: [
      "Total Investments 1Y"
    ]
  },
  CASH_AND_EQUIVALENTS_1Y: {
    label: "Cash & Equivalents 1Y",
    aliases: [
      "Cash & Equivalents 1Y"
    ]
  },
  TOTAL_ASSETS_1Y: {
    label: "Total Assets 1Y",
    aliases: [
      "Total Assets 1Y"
    ]
  },
  INSURANCE_AND_ANNUITY_LIABILITIES_1Y: {
    label: "Insurance & Annuity Liabilities 1Y",
    aliases: [
      "Insurance & Annuity Liabilities 1Y"
    ]
  },
  UNPAID_CLAIMS_1Y: {
    label: "Unpaid Claims 1Y",
    aliases: [
      "Unpaid Claims 1Y"
    ]
  },
  REINSURANCE_PAYABLE_1Y: {
    label: "Reinsurance Payable 1Y",
    aliases: [
      "Reinsurance Payable 1Y"
    ]
  },
  LONG_TERM_DEBT_1Y: {
    label: "Long-Term Debt 1Y",
    aliases: [
      "Long-Term Debt 1Y",
      "Long- Term Debt 1Y"
    ]
  },
  TOTAL_LIABILITIES_1Y: {
    label: "Total Liabilities 1Y",
    aliases: [
      "Total Liabilities 1Y"
    ]
  },
  OPERATING_CASH_FLOW_GROWTH_1Y: {
    label: "Operating Cash Flow Growth 1Y",
    aliases: [
      "Operating Cash Flow Growth 1Y"
    ]
  },
  NET_CASH_FLOW_1Y: {
    label: "Net Cash Flow 1Y",
    aliases: [
      "Net Cash Flow 1Y"
    ]
  },
  EFFECTIVE_TAX_RATE: {
    label: "Effective Tax Rate",
    aliases: [
      "Effective Tax Rate"
    ]
  },

  TOTAL_REVENUE_CAGR_4Y: {
    label: "Total Revenue (CAGR) 4Y",
    aliases: [
      "Total Revenue (CAGR) 4Y"
    ]
  },
  FUNDS_FROM_OPERATIONS_FFO_1Y: {
    label: "Funds From Operations (FFO) 1Y",
    aliases: [
      "Funds From Operations (FFO) 1Y"
    ]
  },
  ADJUSTED_FUNDS_FROM_OPERATIONS_AFFO_1Y: {
    label: "Adjusted Funds From Operations (AFFO) 1Y",
    aliases: [
      "Adjusted Funds From Operations (AFFO) 1Y"
    ]
  },
  FFO_PAYOUT_RATIO_1Y: {
    label: "FFO Payout Ratio 1Y",
    aliases: [
      "FFO Payout Ratio 1Y"
    ]
  },
  SHAREHOLDERS_EQUITY_1Y: {
    label: "Shareholders Equity 1Y",
    aliases: [
      "Shareholders Equity 1Y"
    ]
  },
  DEBT_EQUITY_RATIO_1Y: {
    label: "Debt / Equity Ratio 1Y",
    aliases: [
      "Debt / Equity Ratio 1Y",
      "Debt/ Equity Ratio 1Y"
    ]
  },
  DEBT_EBITDA_RATIO_1Y: {
    label: "Debt / EBITDA Ratio 1Y",
    aliases: [
      "Debt / EBITDA Ratio 1Y"
    ]
  },
  NET_DEBT_EBITDA_RATIO_1Y: {
    label: "Net Debt/ EBITDA Ratio 1Y",
    aliases: [
      "Net Debt/ EBITDA Ratio 1Y",
      "Net Debt / EBITDA Ratio 1Y",
      "Net debt / EBITDA Ratio 1Y"
    ]
  },

  NON_REGULATED_REVENUE_1Y: {
    label: "Non-Regulated Revenue 1Y",
    aliases: [
      "Non-Regulated Revenue 1Y",
      "KPIs: Non-Regulated Revenue 1Y"
    ]
  },
  NON_REGULATED_REVENUE_GROWTH_1Y: {
    label: "Non-Regulated Revenue Growth 1Y",
    aliases: [
      "Non-Regulated Revenue Growth 1Y"
    ]
  },
  REGULATED_REVENUE_1Y: {
    label: "Regulated Revenue 1Y",
    aliases: [
      "Regulated Revenue 1Y"
    ]
  },
  REGULATED_REVENUE_GROWTH_1Y: {
    label: "Regulated Revenue Growth 1Y",
    aliases: [
      "Regulated Revenue Growth 1Y"
    ]
  },

  TOTAL_COMMON_SHAREHOLDERS_EQUITY_1Y: {
    label: "Total Common Shareholders Equity 1Y",
    aliases: [
      "Total Common Shareholders Equity 1Y"
    ]
  },
  PERFORMANCE_FEE_REVENUE_1Y: {
    label: "Performance Fee Revenue 1Y",
    aliases: [
      "Performance Fee Revenue 1Y",
      "KPIs: Performance Fee Revenue 1Y"
    ]
  },
  TECHNOLOGY_SERVICES_REVENUE_1Y: {
    label: "Technology Services Revenue 1Y",
    aliases: [
      "Technology Services Revenue 1Y"
    ]
  },
  EQUITY_AUM_1Y: {
    label: "Equity AUM 1Y",
    aliases: [
      "Equity AUM 1Y"
    ]
  },
  FIXED_INCOME_AUM_1Y: {
    label: "Fixed Income AUM 1Y",
    aliases: [
      "Fixed Income AUM 1Y"
    ]
  },
  MULTI_ASSET_CLASS_AUM_1Y: {
    label: "Multi Asset Class AUM 1Y",
    aliases: [
      "Multi Asset Class AUM 1Y"
    ]
  },
  ALTERNATIVES_AUM_1Y: {
    label: "Alternatives AUM 1Y",
    aliases: [
      "Alternatives AUM 1Y"
    ]
  },
  TOTAL_AUM_1Y: {
    label: "Total AUM 1Y",
    aliases: [
      "Total AUM 1Y"
    ]
  },
  TOTAL_AUM_GROWTH_1Y: {
    label: "Total AUM Growth 1Y",
    aliases: [
      "Total AUM Growth 1Y"
    ]
  },

  EV_EBIT_RATIO_1Y: {
    label: "EV/EBIT Ratio 1Y",
    aliases: [
      "EV/EBIT Ratio 1Y"
    ]
  },
  ROCE_1Y: {
    label: "ROCE 1Y",
    aliases: [
      "ROCE 1Y"
    ]
  },
  INTEGRATED_GAS_REVENUE_1Y: {
    label: "Integrated Gas Revenue 1Y",
    aliases: [
      "Integrated Gas Revenue 1Y",
      "KPIs: Integrated Gas Revenue 1Y"
    ]
  },
  INTEGRATED_GAS_REVENUE_GROWTH_1Y: {
    label: "Integrated Gas Revenue Growth 1Y",
    aliases: [
      "Integrated Gas Revenue Growth 1Y"
    ]
  },
  UPSTREAM_REVENUE_1Y: {
    label: "Upstream Revenue 1Y",
    aliases: [
      "Upstream Revenue 1Y"
    ]
  },
  UPSTREAM_REVENUE_GROWTH_1Y: {
    label: "Upstream Revenue Growth 1Y",
    aliases: [
      "Upstream Revenue Growth 1Y"
    ]
  },
  MARKETING_REVENUE_1Y: {
    label: "Marketing Revenue 1Y",
    aliases: [
      "Marketing Revenue 1Y"
    ]
  },
  MARKETING_REVENUE_GROWTH_1Y: {
    label: "Marketing Revenue Growth 1Y",
    aliases: [
      "Marketing Revenue Growth 1Y"
    ]
  },
  CHEMICALS_AND_PRODUCTS_REVENUE_1Y: {
    label: "Chemicals & Products Revenue 1Y",
    aliases: [
      "Chemicals & Products Revenue 1Y"
    ]
  },
  CHEMICALS_AND_PRODUCTS_REVENUE_GROWTH_1Y: {
    label: "Chemicals & Products Revenue Growth 1Y",
    aliases: [
      "Chemicals & Products Revenue Growth 1Y"
    ]
  },
  RENEWABLES_AND_ENERGY_SOLUTIONS_REVENUE_1Y: {
    label: "Renewables & Energy Solutions Revenue 1Y",
    aliases: [
      "Renewables & Energy Solutions Revenue 1Y"
    ]
  },
  RENEWABLES_AND_ENERGY_SOLUTIONS_REVENUE_GROWTH_1Y: {
    label: "Renewables & Energy Solutions Revenue Growth 1Y",
    aliases: [
      "Renewables & Energy Solutions Revenue Growth 1Y"
    ]
  },
  OIL_AND_GAS_PRODUCTION_AVAILABLE_FOR_SALE_BOE_D_1Y: {
    label: "Oil and Gas Production Available for Sale (boe/d) 1Y",
    aliases: [
      "Oil and Gas Production Available for Sale (boe/d) 1Y"
    ]
  },
  OIL_AND_GAS_PRODUCTION_AVAILABLE_FOR_SALE_BOE_D_GROWTH_1Y: {
    label: "Oil and Gas Production Available for Sale (boe/d) Growth 1Y",
    aliases: [
      "Oil and Gas Production Available for Sale (boe/d) Growth 1Y"
    ]
  },
  WORKING_CAPITAL: {
    label: "Working Capital",
    aliases: [
      "Working Capital",
      "Working Capital 1Y"
    ]
  },

  INVENTORY_1Y: {
    label: "Inventory 1Y",
    aliases: [
      "Inventory 1Y"
    ]
  },
  ASSET_TURNOVER_1Y: {
    label: "Asset Turnover 1Y",
    aliases: [
      "Asset Turnover 1Y"
    ]
  },

  COST_OF_REVENUE_1Y: {
    label: "Cost of Revenue 1Y",
    aliases: [
      "Cost of Revenue 1Y"
    ]
  },
  GROSS_PROFIT_1Y: {
    label: "Gross Profit 1Y",
    aliases: [
      "Gross Profit 1Y"
    ]
  },
  SELLING_GENERAL_AND_ADMINISTRATIVE_1Y: {
    label: "Selling, General & Administrative 1Y",
    aliases: [
      "Selling, General & Administrative 1Y"
    ]
  },
  RESEARCH_AND_DEVELOPMENT_1Y: {
    label: "Research & Development 1Y",
    aliases: [
      "Research & Development 1Y"
    ]
  },
  RD_INTENSITY_BERECHNET_1Y: {
    label: "R&D Intensity (berechnet) 1Y",
    aliases: [
      "R&D Intensity (berechnet) 1Y"
    ]
  },

  DEBT_FCF_1Y: {
    label: "Debt / FCF 1Y",
    aliases: [
      "Debt / FCF 1Y"
    ]
  },
  FCF_GROWTH_1Y: {
    label: "FCF Growth 1Y",
    aliases: [
      "FCF Growth 1Y"
    ]
  },
  INVENTORY_TURNOVER_1Y: {
    label: "Inventory Turnover 1Y",
    aliases: [
      "Inventory Turnover 1Y"
    ]
  },

  DEBT_FCF_RATIO_1Y: {
    label: "Debt / FCF Ratio 1Y",
    aliases: [
      "Debt / FCF Ratio 1Y"
    ]
  },
  TOTAL_BACKLOG_1Y: {
    label: "Total Backlog 1Y",
    aliases: [
      "Total Backlog 1Y"
    ]
  },
  TOTAL_BACKLOG_GROWTH_1Y: {
    label: "Total Backlog Growth 1Y",
    aliases: [
      "Total Backlog Growth 1Y"
    ]
  }
};

const STANDARD_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "ENTERPRISE_VALUE_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PS_RATIO_1Y",
  "PB_RATIO_1Y",
  "P_FCF_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_SALES_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "QUICK_RATIO_1Y",
  "CURRENT_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "ROIC_1Y",
  "EARNINGS_YIELD_1Y",
  "FCF_YIELD_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const BANKS_CRITERIA_IDS = [
  "NET_INTEREST_INCOME_1Y",
  "NET_INTEREST_INCOME_GROWTH_1Y",
  "NON_INTEREST_INCOME_1Y",
  "NON_INTEREST_INCOME_GROWTH_1Y",
  "PROVISION_FUER_CREDIT_LOSSES_1Y",
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "PROFIT_MARGIN_1Y",
  "GROSS_LOANS_1Y",
  "ALLOWANCE_FOR_LOAN_LOSSES_1Y",
  "TOTAL_DEPOSITS_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "TANGIBLE_BOOK_VALUE_PER_SHARE_1Y",
  "ALLOWANCE_GROSS_LOANS_BERECHNET_1Y",
  "LOANS_DEPOSITS_BERECHNET_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PB_RATIO_1Y",
  "P_TBV_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "EARNINGS_YIELD_1Y",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const INSURANCE_CRITERIA_IDS = [
  "PREMIUMS_AND_ANNUITY_REVENUE_1Y",
  "PREMIUMS_AND_ANNUITY_REVENUE_CAGR_4Y",
  "TOTAL_INTEREST_AND_DIVIDEND_INCOME_1Y",
  "TOTAL_REVENUE_1Y",
  "REVENUE_GROWTH_YOY_1Y",
  "POLICY_BENEFITS_1Y",
  "TOTAL_OPERATING_EXPENSES_1Y",
  "OPERATING_INCOME_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "INVESTMENTS_IN_DEBT_SECURITIES_1Y",
  "INVESTMENTS_IN_EQUITY_AND_PREFERRED_SECURITIES_1Y",
  "TOTAL_INVESTMENTS_1Y",
  "CASH_AND_EQUIVALENTS_1Y",
  "TOTAL_ASSETS_1Y",
  "INSURANCE_AND_ANNUITY_LIABILITIES_1Y",
  "UNPAID_CLAIMS_1Y",
  "REINSURANCE_PAYABLE_1Y",
  "LONG_TERM_DEBT_1Y",
  "TOTAL_LIABILITIES_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "TANGIBLE_BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "OPERATING_CASH_FLOW_GROWTH_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "NET_CASH_FLOW_1Y",
  "PE_RATIO_1Y",
  "PB_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "EFFECTIVE_TAX_RATE",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const REITS_CRITERIA_IDS = [
  "TOTAL_REVENUE_1Y",
  "TOTAL_REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "OPERATING_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "EBITDA_1Y",
  "FUNDS_FROM_OPERATIONS_FFO_1Y",
  "ADJUSTED_FUNDS_FROM_OPERATIONS_AFFO_1Y",
  "FFO_PAYOUT_RATIO_1Y",
  "CASH_AND_EQUIVALENTS_1Y",
  "TOTAL_ASSETS_1Y",
  "LONG_TERM_DEBT_1Y",
  "SHAREHOLDERS_EQUITY_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "TANGIBLE_BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "PB_RATIO_1Y",
  "P_TBV_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "DEBT_EBITDA_RATIO_1Y",
  "NET_DEBT_EBITDA_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const UTILITIES_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "OPERATING_INCOME_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "ENTERPRISE_VALUE_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PB_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_SALES_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "DEBT_EBITDA_RATIO_1Y",
  "NET_DEBT_EBITDA_RATIO_1Y",
  "EARNINGS_YIELD_1Y",
  "NON_REGULATED_REVENUE_1Y",
  "NON_REGULATED_REVENUE_GROWTH_1Y",
  "REGULATED_REVENUE_1Y",
  "REGULATED_REVENUE_GROWTH_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const ASSET_MANAGERS_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "OPERATING_INCOME_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_COMMON_SHAREHOLDERS_EQUITY_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "OPERATING_CASH_FLOW_GROWTH_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "NET_CASH_FLOW_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PB_RATIO_1Y",
  "P_FCF_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "ROIC_1Y",
  "EARNINGS_YIELD_1Y",
  "FCF_YIELD_1Y",
  "PERFORMANCE_FEE_REVENUE_1Y",
  "TECHNOLOGY_SERVICES_REVENUE_1Y",
  "EQUITY_AUM_1Y",
  "FIXED_INCOME_AUM_1Y",
  "MULTI_ASSET_CLASS_AUM_1Y",
  "ALTERNATIVES_AUM_1Y",
  "TOTAL_AUM_1Y",
  "TOTAL_AUM_GROWTH_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const OIL_GAS_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "P_FCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "EV_EBIT_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "DEBT_EBITDA_RATIO_1Y",
  "NET_DEBT_EBITDA_RATIO_1Y",
  "QUICK_RATIO_1Y",
  "CURRENT_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "ROIC_1Y",
  "ROCE_1Y",
  "EARNINGS_YIELD_1Y",
  "FCF_YIELD_1Y",
  "INTEGRATED_GAS_REVENUE_1Y",
  "INTEGRATED_GAS_REVENUE_GROWTH_1Y",
  "UPSTREAM_REVENUE_1Y",
  "UPSTREAM_REVENUE_GROWTH_1Y",
  "MARKETING_REVENUE_1Y",
  "MARKETING_REVENUE_GROWTH_1Y",
  "CHEMICALS_AND_PRODUCTS_REVENUE_1Y",
  "CHEMICALS_AND_PRODUCTS_REVENUE_GROWTH_1Y",
  "RENEWABLES_AND_ENERGY_SOLUTIONS_REVENUE_1Y",
  "RENEWABLES_AND_ENERGY_SOLUTIONS_REVENUE_GROWTH_1Y",
  "OIL_AND_GAS_PRODUCTION_AVAILABLE_FOR_SALE_BOE_D_1Y",
  "OIL_AND_GAS_PRODUCTION_AVAILABLE_FOR_SALE_BOE_D_GROWTH_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "WORKING_CAPITAL",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const MINING_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "INVENTORY_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "NET_CASH_FLOW_1Y",
  "ENTERPRISE_VALUE_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PB_RATIO_1Y",
  "P_FCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "EV_EBIT_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "DEBT_EBITDA_RATIO_1Y",
  "NET_DEBT_EBITDA_RATIO_1Y",
  "ASSET_TURNOVER_1Y",
  "QUICK_RATIO_1Y",
  "CURRENT_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "ROIC_1Y",
  "ROCE_1Y",
  "EARNINGS_YIELD_1Y",
  "FCF_YIELD_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "WORKING_CAPITAL",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const PHARMA_HEALTHCARE_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "COST_OF_REVENUE_1Y",
  "GROSS_PROFIT_1Y",
  "SELLING_GENERAL_AND_ADMINISTRATIVE_1Y",
  "RESEARCH_AND_DEVELOPMENT_1Y",
  "RD_INTENSITY_BERECHNET_1Y",
  "OPERATING_INCOME_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PS_RATIO_1Y",
  "PB_RATIO_1Y",
  "P_FCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "QUICK_RATIO_1Y",
  "CURRENT_RATIO_1Y",
  "ROE_1Y",
  "ROIC_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const TELECOM_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "OPERATING_INCOME_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "NET_INCOME_GROWTH_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PS_RATIO_1Y",
  "PB_RATIO_1Y",
  "P_FCF_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "DEBT_FCF_1Y",
  "NET_DEBT_EBITDA_RATIO_1Y",
  "QUICK_RATIO_1Y",
  "CURRENT_RATIO_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const SEMICONDUCTOR_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "GROSS_PROFIT_1Y",
  "RESEARCH_AND_DEVELOPMENT_1Y",
  "OPERATING_INCOME_1Y",
  "PRETAX_INCOME_1Y",
  "NET_INCOME_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "EBITDA_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "OPERATING_CASH_FLOW_GROWTH_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "FCF_GROWTH_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PS_RATIO_1Y",
  "PB_RATIO_1Y",
  "P_FCF_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_SALES_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "DEBT_EBITDA_RATIO_1Y",
  "DEBT_FCF_1Y",
  "ASSET_TURNOVER_1Y",
  "INVENTORY_TURNOVER_1Y",
  "QUICK_RATIO_1Y",
  "CURRENT_RATIO_1Y",
  "ROE_1Y",
  "ROIC_1Y",
  "ROCE_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const BDC_PRIVATE_CREDIT_CRITERIA_IDS = [
  "NET_INTEREST_INCOME_1Y",
  "NET_INTEREST_INCOME_GROWTH_1Y",
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "NET_INCOME_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "PROFIT_MARGIN_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "TANGIBLE_BOOK_VALUE_PER_SHARE_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "PB_RATIO_1Y",
  "P_TBV_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "ROE_1Y",
  "ROA_1Y",
  "EARNINGS_YIELD_1Y",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

const DEFENSE_CRITERIA_IDS = [
  "REVENUE_1Y",
  "REVENUE_CAGR_4Y",
  "REVENUE_GROWTH_YOY_1Y",
  "NET_INCOME_1Y",
  "SHARES_OUTSTANDING_DILUTED_1Y",
  "SHARES_CHANGE_YOY_1Y",
  "EPS_DILUTED_1Y",
  "EPS_GROWTH_CAGR_4Y",
  "FCF_1Y",
  "GROSS_MARGIN_1Y",
  "OPERATING_MARGIN_1Y",
  "PROFIT_MARGIN_1Y",
  "FCF_MARGIN_1Y",
  "EBITDA_1Y",
  "SHORT_TERM_INVESTMENTS_1Y",
  "CASH_AND_SHORT_TERM_INVESTMENTS_1Y",
  "TOTAL_DEBT_1Y",
  "NET_CASH_DEBT_1Y",
  "BOOK_VALUE_PER_SHARE_1Y",
  "OPERATING_CASH_FLOW_1Y",
  "CAPEX_CAPITAL_EXPENDITURES_1Y",
  "ENTERPRISE_VALUE_1Y",
  "PE_RATIO_1Y",
  "FORWARD_PE_1Y",
  "P_FCF_RATIO_1Y",
  "P_OCF_RATIO_1Y",
  "EV_EBITDA_RATIO_1Y",
  "DEBT_EQUITY_RATIO_1Y",
  "DEBT_FCF_RATIO_1Y",
  "NET_DEBT_EBITDA_RATIO_1Y",
  "ROE_1Y",
  "ROIC_1Y",
  "EARNINGS_YIELD_1Y",
  "FCF_YIELD_1Y",
  "TOTAL_BACKLOG_1Y",
  "TOTAL_BACKLOG_GROWTH_1Y",
  "INTEREST_COVERAGE_ZINSDECKUNG",
  "WORKING_CAPITAL",
  "DIVIDEND_YIELD",
  "PAYMENT_FREQUENCY",
  "DIVIDEND_GROWTH_YEARS",
  "ANNUAL_DIVIDEND",
  "PAYOUT_RATIO",
  "BUYBACK_YIELD",
  "DIVIDEND_GROWTH",
  "SHAREHOLDER_YIELD",
  "VOLATILITAET_ANNUALISIERT_STD_ABW_10Y",
  "KURS_CLOSE_AKTUELL",
  "PRICE_CAGR_4Y",
  "MARKET_CAP",
  "BETA",
  "RANGE_52W",
  "FAIR_VALUE"
];

window.NUTZEN_CRITERIA_BY_SECTOR = {
  standard: STANDARD_CRITERIA_IDS.slice(),
  banks: BANKS_CRITERIA_IDS.slice(),
  insurance: INSURANCE_CRITERIA_IDS.slice(),
  reits: REITS_CRITERIA_IDS.slice(),
  utilities: UTILITIES_CRITERIA_IDS.slice(),
  assetManagers: ASSET_MANAGERS_CRITERIA_IDS.slice(),
  oilGas: OIL_GAS_CRITERIA_IDS.slice(),
  mining: MINING_CRITERIA_IDS.slice(),
  pharmaHealthcare: PHARMA_HEALTHCARE_CRITERIA_IDS.slice(),
  telecom: TELECOM_CRITERIA_IDS.slice(),
  semiconductors: SEMICONDUCTOR_CRITERIA_IDS.slice(),
  bdcPrivateCredit: BDC_PRIVATE_CREDIT_CRITERIA_IDS.slice(),
  defense: DEFENSE_CRITERIA_IDS.slice()
};

function getCriteriaLabel(id){
  return window.CRITERIA?.[id]?.label || String(id || "");
}

window.CRITERIA = CRITERIA;
window.STANDARD_CRITERIA_IDS = STANDARD_CRITERIA_IDS;
window.BANKS_CRITERIA_IDS = BANKS_CRITERIA_IDS;
window.INSURANCE_CRITERIA_IDS = INSURANCE_CRITERIA_IDS;
window.REITS_CRITERIA_IDS = REITS_CRITERIA_IDS;
window.UTILITIES_CRITERIA_IDS = UTILITIES_CRITERIA_IDS;
window.ASSET_MANAGERS_CRITERIA_IDS = ASSET_MANAGERS_CRITERIA_IDS;
window.OIL_GAS_CRITERIA_IDS = OIL_GAS_CRITERIA_IDS;
window.MINING_CRITERIA_IDS = MINING_CRITERIA_IDS;
window.PHARMA_HEALTHCARE_CRITERIA_IDS = PHARMA_HEALTHCARE_CRITERIA_IDS;
window.TELECOM_CRITERIA_IDS = TELECOM_CRITERIA_IDS;
window.SEMICONDUCTOR_CRITERIA_IDS = SEMICONDUCTOR_CRITERIA_IDS;
window.BDC_PRIVATE_CREDIT_CRITERIA_IDS = BDC_PRIVATE_CREDIT_CRITERIA_IDS;
window.DEFENSE_CRITERIA_IDS = DEFENSE_CRITERIA_IDS;
window.getCriteriaLabel = getCriteriaLabel;