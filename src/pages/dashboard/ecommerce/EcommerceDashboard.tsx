import React, { useState } from "react";
import useEcommerceDashboardQuery from "../../../hooks/useEcommerceDashboardQuery";
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
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const { data, isLoading, isError, error, refetch } =
    useEcommerceDashboardQuery(selectedYear);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        {/* Row 1 skeleton */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-4 h-44 bg-white rounded-[6px] border border-[#dbdade]/50" />
          <div className="col-span-12 xl:col-span-8 h-44 bg-white rounded-[6px] border border-[#dbdade]/50" />
        </div>
        {/* Row 2 skeleton */}
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
        <h3 className="text-fs18 font-bold text-[#32475c] mb-1">
          Unable to Load E-commerce Dashboard Data
        </h3>
        <p className="text-fs14 text-[#6f6b7d] mb-4">
          {error?.message || "Could not retrieve e-commerce data from server."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#696cff] text-white text-fs14 font-medium rounded-lg hover:bg-[#5f61e6] transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const availableYears = data.availableYears || ["2023", "2022"];

  return (
    <div className="w-full px-4 sm:px-6 py-4 space-y-6 pb-10 select-none">
      {/* ROW 1: Congratulations Card (4 cols) + Shared (New Visitors & Activity) Card (8 cols) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 xl:col-span-4 h-full">
          <CongratulationsCard data={data.congratulations} />
        </div>
        <div className="col-span-12 xl:col-span-8 h-full bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#dbdade]/50">
          <NewVisitorsCard data={data.newVisitors} isInsideSharedContainer />
          <ActivityCard data={data.activity} isInsideSharedContainer />
        </div>
      </div>

      {/* ROW 2: Sales & Profit (2x2 subgrid, 4 cols) + Shared (Total Income & Report) Card (8 cols) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Sub-grid 2x2 for Sales, Profit, Expenses, Transactions */}
        <div className="col-span-12 xl:col-span-4 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-6 flex-1">
            <SalesSmallCard
              data={data.salesSmall}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
            <ProfitSmallCard data={data.profitSmall} />
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1">
            <ExpensesGaugeCard data={data.expensesGauge} />
            <TransactionsSmallCard
              data={data.transactionsSmall}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
          </div>
        </div>

        {/* Shared Total Income & Report Card */}
        <div className="col-span-12 xl:col-span-8 h-full bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/50 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#dbdade]/50">
          <div className="lg:col-span-8 xl:col-span-8 h-full">
            <TotalIncomeCard data={data.totalIncome} isInsideSharedContainer />
          </div>
          <div className="lg:col-span-4 xl:col-span-4 h-full">
            <ReportCard
              data={data.report}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
              isInsideSharedContainer
            />
          </div>
        </div>
      </div>

      {/* ROW 3: Performance (4 cols) + Conversion Rate (4 cols) + Right stack (Sales, Profit target, Expenses bar) (4 cols) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Performance Radar card */}
        <div className="col-span-12 xl:col-span-4 h-full">
          <PerformanceRadarCard
            data={data.performance}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        </div>

        {/* Conversion Rate card */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-4 h-full">
          <ConversionRateCard
            data={data.conversionRate}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        </div>

        {/* Right Stack: Sales summary + Profit target (row) and Expenses bar chart (row) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-4 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-6 flex-1">
            <SalesSummaryCard
              data={data.salesSummary}
              availableYears={availableYears}
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
            <ProfitTargetCard data={data.profitTarget} />
          </div>
          <div className="flex-1">
            <ExpensesComparisonCard data={data.expensesComparison} />
          </div>
        </div>
      </div>

      {/* ROW 4: Product Transactions Table (8 cols) + Total Balance (4 cols) */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 xl:col-span-8 h-full">
          <ProductTransactionsTableCard products={data.products} />
        </div>
        <div className="col-span-12 xl:col-span-4 h-full">
          <TotalBalanceCard
            data={data.totalBalance}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        </div>
      </div>
    </div>
  );
};

export default EcommerceDashboard;
