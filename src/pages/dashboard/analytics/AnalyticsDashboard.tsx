import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useDashboardQuery } from "../../../hooks/useDashboardQuery";
import { WelcomeCard } from "./WelcomeCard";
import { OrderCard } from "./OrderCard";
import { SalesCard } from "./SalesCard";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { PaymentsCard } from "./PaymentsCard";
import { RevenueCard } from "./RevenueCard";
import { ProfitReportCard } from "./ProfitReportCard";
import { OrderStatisticsCard } from "./OrderStatisticsCard";
import { IncomeChartCard } from "./IncomeChartCard";
import { TransactionsCard } from "./TransactionsCard";
import { ActivityTimelineCard } from "./ActivityTimelineCard";
import { BrowserAnalyticsCard } from "./BrowserAnalyticsCard";

export const AnalyticsDashboard: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userId = currentUser?.id || "1";

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardQuery(userId);

  if (isLoading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 h-48 bg-white rounded-[5px] border border-[#dbdade]/50" />
          <div className="col-span-12 lg:col-span-4 h-48 bg-white rounded-[5px] border border-[#dbdade]/50" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 h-80 bg-white rounded-[5px] border border-[#dbdade]/50" />
          <div className="col-span-12 lg:col-span-4 h-80 bg-white rounded-[5px] border border-[#dbdade]/50" />
        </div>
      </div>
    );
  }

  // Error State with retry action
  if (isError || !profile) {
    return (
      <div className="w-full p-8 bg-white rounded-[5px] border border-[#ea5455]/30 text-center">
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
          Unable to Load Dashboard Data
        </h3>
        <p className="text-fs14 text-[#6f6b7d] mb-4">
          {error?.message ||
            "Could not retrieve the user dashboard profile from API."}
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

  return (
    <div className="w-full space-y-6">
      {/* ROW 1: Welcome Greeting Card (8 cols) + Order & Sales Summary Cards (4 cols) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <WelcomeCard
            greeting={profile.welcomeGreeting}
            description={profile.welcomeDescription}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="grid grid-cols-2 gap-6 h-full">
            <OrderCard value={profile.orders?.value || "276K"} />
            <SalesCard
              value={profile.sales?.value || "$4,679"}
              growth={profile.sales?.growth || "28.14%"}
              years={profile.sales?.years}
              availableYears={profile.availableYears}
            />
          </div>
        </div>
      </div>

      {/* ROW 2: Total Revenue & Growth Widget (8 cols) + Payments, Revenue, Profit Report (4 cols) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col">
          <TotalRevenueCard
            data={profile.totalRevenue}
            growth={profile.totalRevenue?.growthIndicator || "78%"}
            companyGrowth={
              profile.totalRevenue?.companyGrowth || "62% Company Growth"
            }
            value2023={profile.totalRevenue?.value || "$32.5k"}
            value2022="$28.4k"
            availableYears={profile.availableYears}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 gap-6">
            <PaymentsCard
              value={profile.payments?.value || "$4,679"}
              change={profile.payments?.change || "-14.82%"}
              changeDirection={profile.payments?.changeDirection}
              years={profile.payments?.years}
              availableYears={profile.availableYears}
            />
            <RevenueCard value="425K" />
          </div>
          <ProfitReportCard
            year={`Year ${profile.profitReport?.year || "2023"}`}
            growth={profile.profitReport?.growth || "14.82%"}
            value={profile.profitReport?.profitValue || "$84,686k"}
          />
        </div>
      </div>

      {/* ROW 3: Order Statistics (4 cols) + Income / Expenses / Profit (4 cols) + Transactions (4 cols) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <OrderStatisticsCard
            years={profile.orderStatisticsYears}
            availableYears={profile.availableYears}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <IncomeChartCard />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <TransactionsCard
            transactions={profile.transactions}
            years={profile.transactionsYears}
            availableYears={profile.availableYears}
          />
        </div>
      </div>

      {/* ROW 4: Activity Timeline (5 cols) + Browser Analytics (7 cols) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <ActivityTimelineCard
            activities={profile.activities}
            years={profile.activitiesYears}
            availableYears={profile.availableYears}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <BrowserAnalyticsCard />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
