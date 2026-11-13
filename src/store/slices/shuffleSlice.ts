import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DashboardType = "analytics" | "crm" | "ecommerce";

export const DEFAULT_ANALYTICS_WIDGETS = [
  "welcome",
  "orderSales",
  "totalRevenue",
  "paymentsRevenueProfit",
  "orderStatistics",
  "incomeChart",
  "transactions",
  "activityTimeline",
  "browserAnalytics",
];

export const DEFAULT_CRM_WIDGETS = [
  "customerRatings",
  "overviewSalesActivity",
  "sessionsOrderLeads",
  "topProductsBySales",
  "topProductsByVolume",
  "earningReport",
  "salesAnalyticsHeatmap",
  "salesByCountries",
  "salesStatus",
  "employeePerformance",
  "customerTransactions",
];

export const DEFAULT_ECOMMERCE_WIDGETS = [
  "congratulations",
  "newVisitorsActivity",
  "smallCardsGroup",
  "totalIncomeReport",
  "performanceRadar",
  "conversionRate",
  "salesProfitExpenses",
  "productTransactions",
  "totalBalance",
];

function shuffleArray<T>(array: T[]): T[] {
  if (array.length <= 1) return [...array];
  let result: T[];
  let tries = 0;
  do {
    result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    tries++;
  } while (tries < 10 && result.every((val, idx) => val === array[idx]));
  return result;
}

interface ShuffleState {
  analyticsOrder: string[];
  crmOrder: string[];
  ecommerceOrder: string[];
}

const initialState: ShuffleState = {
  analyticsOrder: DEFAULT_ANALYTICS_WIDGETS,
  crmOrder: DEFAULT_CRM_WIDGETS,
  ecommerceOrder: DEFAULT_ECOMMERCE_WIDGETS,
};

export const shuffleSlice = createSlice({
  name: "shuffle",
  initialState,
  reducers: {
    shuffleDashboard: (state, action: PayloadAction<DashboardType>) => {
      if (action.payload === "analytics") {
        state.analyticsOrder = shuffleArray(state.analyticsOrder);
      } else if (action.payload === "crm") {
        state.crmOrder = shuffleArray(state.crmOrder);
      } else if (action.payload === "ecommerce") {
        state.ecommerceOrder = shuffleArray(state.ecommerceOrder);
      }
    },
    resetDashboardOrder: (state, action: PayloadAction<DashboardType>) => {
      if (action.payload === "analytics") {
        state.analyticsOrder = DEFAULT_ANALYTICS_WIDGETS;
      } else if (action.payload === "crm") {
        state.crmOrder = DEFAULT_CRM_WIDGETS;
      } else if (action.payload === "ecommerce") {
        state.ecommerceOrder = DEFAULT_ECOMMERCE_WIDGETS;
      }
    },
  },
});

export const { shuffleDashboard, resetDashboardOrder } = shuffleSlice.actions;
export default shuffleSlice.reducer;
