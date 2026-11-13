import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { RootState } from "../../../store";
import { DEFAULT_ECOMMERCE_WIDGETS } from "../../../store/slices/shuffleSlice";
import { useEcommerceDashboardQuery } from "../../../hooks/useEcommerceDashboardQuery";
import { CustomButton } from "../../../components/ui/CustomButton";
import CongratulationsCard from "./widgets/CongratulationsCard";
import NewVisitorsCard from "./widgets/NewVisitorsCard";
import ActivityCard from "./widgets/ActivityCard";
import SalesSmallCard from "./widgets/SalesSmallCard";
import ProfitSmallCard from "./widgets/ProfitSmallCard";
import TotalIncomeCard from "./widgets/TotalIncomeCard";
import ReportCard from "./widgets/ReportCard";
import ExpensesGaugeCard from "./widgets/ExpensesGaugeCard";
import TransactionsSmallCard from "./widgets/TransactionsSmallCard";
import PerformanceRadarCard from "./widgets/PerformanceRadarCard";
import ConversionRateCard from "./widgets/ConversionRateCard";
import SalesSummaryCard from "./widgets/SalesSummaryCard";
import ProfitTargetCard from "./widgets/ProfitTargetCard";
import ExpensesComparisonCard from "./widgets/ExpensesComparisonCard";
import ProductTransactionsTableCard from "./widgets/ProductTransactionsTableCard";
import TotalBalanceCard from "./widgets/TotalBalanceCard";

export const EcommerceDashboard: React.FC = () => {
  const [parentRef] = useAutoAnimate<HTMLDivElement>();
  const [widgetYears, setWidgetYears] = useState<Record<string, string>>({
    salesSmall: "2023",
    report: "2023",
    transactionsSmall: "2023",
    performance: "2023",
    conversionRate: "2023",
    salesSummary: "2023",
    totalBalance: "2023",
  });
  const { data, isLoading, isError, error, refetch } =
    useEcommerceDashboardQuery();

  const handleWidgetYearChange = (widgetKey: string, yr: string) => {
    setWidgetYears((prev) => ({ ...prev, [widgetKey]: yr }));
  };

  const getWidgetData = <T,>(widgetKey: string, baseData: T): T => {
    const yr = widgetYears[widgetKey] || "2023";
    if (yr === "2023" || !data?.years?.[yr]) {
      return baseData;
    }
    const yearOverride = data.years[yr] as Record<string, unknown>;
    return (yearOverride[widgetKey] as T) || baseData;
  };
  const ecommerceOrder = useSelector(
    (state: RootState) =>
      state.shuffle?.ecommerceOrder || DEFAULT_ECOMMERCE_WIDGETS
  );

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-4 h-44 bg-white rounded-[6px] border border-[#dbdade]/50" />
          <div className="col-span-12 xl:col-span-8 h-44 bg-white rounded-[6px] border border-[#dbdade]/50" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-4 h-64 bg-white rounded-[6px] border border-[#dbdade]/50" />
          <div className="col-span-12 xl:col-span-8 h-64 bg-white rounded-[6px] border border-[#dbdade]/50" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full p-8 bg-white rounded-[6px] border border-[#ea5455]/30 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-50 text-[#ea5455] flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-fs19 font-bold text-[#32475c] mb-1">
          Unable to Load E-commerce Dashboard Data
        </h3>
        <p className="text-fs15 text-[#6f6b7d] mb-4">
          {error?.message || "Could not retrieve e-commerce data from server."}
        </p>
        <CustomButton
          type="button"
          variant="primary"
          onClick={() => refetch()}
          className="!px-4 !py-2 !h-auto text-fs15 font-medium rounded-lg"
        >
          Try Again
        </CustomButton>
      </div>
    );
  }

  const availableYears = data.availableYears || ["2023", "2022"];

  const widgetMap: Record<string, React.ReactNode> = {
    congratulations: (
      <div key="congratulations" className="col-span-12 lg:col-span-4 h-full">
        <CongratulationsCard data={data.congratulations} />
      </div>
    ),
    newVisitorsActivity: (
      <div
        key="newVisitorsActivity"
        className="col-span-12 lg:col-span-8 h-full bg-white dark:bg-[#2b2c40] rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 dark:border-[#434968]/50 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#dbdade]/50 dark:divide-[#434968]/50"
      >
        <NewVisitorsCard data={data.newVisitors} isInsideSharedContainer />
        <ActivityCard data={data.activity} isInsideSharedContainer />
      </div>
    ),
    smallCardsGroup: (
      <div
        key="smallCardsGroup"
        className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-6"
      >
        <div className="grid grid-cols-2 gap-6 flex-1">
          <SalesSmallCard
            data={getWidgetData("salesSmall", data.salesSmall)}
            availableYears={availableYears}
            selectedYear={widgetYears.salesSmall || "2023"}
            onSelectYear={(yr) => handleWidgetYearChange("salesSmall", yr)}
          />
          <ProfitSmallCard data={data.profitSmall} />
        </div>
        <div className="grid grid-cols-2 gap-6 flex-1">
          <ExpensesGaugeCard data={data.expensesGauge} />
          <TransactionsSmallCard
            data={getWidgetData("transactionsSmall", data.transactionsSmall)}
            availableYears={availableYears}
            selectedYear={widgetYears.transactionsSmall || "2023"}
            onSelectYear={(yr) => handleWidgetYearChange("transactionsSmall", yr)}
          />
        </div>
      </div>
    ),
    totalIncomeReport: (
      <div
        key="totalIncomeReport"
        className="col-span-12 lg:col-span-8 h-full bg-white dark:bg-[#2b2c40] rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 dark:border-[#434968]/50 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#dbdade]/50 dark:divide-[#434968]/50"
      >
        <div className="lg:col-span-8 xl:col-span-8 h-full">
          <TotalIncomeCard data={data.totalIncome} isInsideSharedContainer />
        </div>
        <div className="lg:col-span-4 xl:col-span-4 h-full">
          <ReportCard
            data={getWidgetData("report", data.report)}
            availableYears={availableYears}
            selectedYear={widgetYears.report || "2023"}
            onSelectYear={(yr) => handleWidgetYearChange("report", yr)}
            isInsideSharedContainer
          />
        </div>
      </div>
    ),
    performanceRadar: (
      <div key="performanceRadar" className="col-span-12 lg:col-span-4 h-full">
        <PerformanceRadarCard
          data={getWidgetData("performance", data.performance)}
          availableYears={availableYears}
          selectedYear={widgetYears.performance || "2023"}
          onSelectYear={(yr) => handleWidgetYearChange("performance", yr)}
        />
      </div>
    ),
    conversionRate: (
      <div
        key="conversionRate"
        className="col-span-12 lg:col-span-4 h-full"
      >
        <ConversionRateCard
          data={getWidgetData("conversionRate", data.conversionRate)}
          availableYears={availableYears}
          selectedYear={widgetYears.conversionRate || "2023"}
          onSelectYear={(yr) => handleWidgetYearChange("conversionRate", yr)}
        />
      </div>
    ),
    salesProfitExpenses: (
      <div
        key="salesProfitExpenses"
        className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-6"
      >
        <div className="grid grid-cols-2 gap-6 flex-1">
          <SalesSummaryCard
            data={getWidgetData("salesSummary", data.salesSummary)}
            availableYears={availableYears}
            selectedYear={widgetYears.salesSummary || "2023"}
            onSelectYear={(yr) => handleWidgetYearChange("salesSummary", yr)}
          />
          <ProfitTargetCard data={data.profitTarget} />
        </div>
        <div className="flex-1">
          <ExpensesComparisonCard data={data.expensesComparison} />
        </div>
      </div>
    ),
    productTransactions: (
      <div
        key="productTransactions"
        className="col-span-12 lg:col-span-8 h-full"
      >
        <ProductTransactionsTableCard products={data.products} />
      </div>
    ),
    totalBalance: (
      <div key="totalBalance" className="col-span-12 lg:col-span-4 h-full">
        <TotalBalanceCard
          data={getWidgetData("totalBalance", data.totalBalance)}
          availableYears={availableYears}
          selectedYear={widgetYears.totalBalance || "2023"}
          onSelectYear={(yr) => handleWidgetYearChange("totalBalance", yr)}
        />
      </div>
    ),
  };

  return (
    <div className="w-full select-none">
      <div
        ref={parentRef}
        className="grid grid-cols-12 gap-6 [grid-auto-flow:dense] items-stretch"
      >
        {ecommerceOrder.map((id) => widgetMap[id])}
      </div>
    </div>
  );
};

export default EcommerceDashboard;
