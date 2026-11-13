import React from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { RootState } from "../../../store";
import { DEFAULT_CRM_WIDGETS } from "../../../store/slices/shuffleSlice";
import { useCrmDashboardQuery } from "../../../hooks/useCrmDashboardQuery";
import CustomerRatingsCard from "./widgets/CustomerRatingsCard";
import OverviewSalesActivityCard from "./widgets/OverviewSalesActivityCard";
import SessionsCard from "./widgets/SessionsCard";
import OrderSummaryCard from "./widgets/OrderSummaryCard";
import GeneratedLeadsCard from "./widgets/GeneratedLeadsCard";
import TopProductsBySalesCard from "./widgets/TopProductsBySalesCard";
import TopProductsByVolumeCard from "./widgets/TopProductsByVolumeCard";
import EarningReportCard from "./widgets/EarningReportCard";
import SalesAnalyticsHeatmapCard from "./widgets/SalesAnalyticsHeatmapCard";
import SalesByCountriesCard from "./widgets/SalesByCountriesCard";
import SalesStatusCard from "./widgets/SalesStatusCard";
import EmployeePerformanceTableCard from "./widgets/EmployeePerformanceTableCard";
import CustomerTransactionsTableCard from "./widgets/CustomerTransactionsTableCard";

export const CRMDashboard: React.FC = () => {
  const [parentRef] = useAutoAnimate<HTMLDivElement>();
  const { data } = useCrmDashboardQuery();
  const crmOrder = useSelector(
    (state: RootState) => state.shuffle?.crmOrder || DEFAULT_CRM_WIDGETS
  );

  const widgetMap: Record<string, React.ReactNode> = {
    customerRatings: (
      <div key="customerRatings" className="col-span-12 lg:col-span-4 h-full">
        <CustomerRatingsCard
          data={data?.customerRatings}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    overviewSalesActivity: (
      <div key="overviewSalesActivity" className="col-span-12 lg:col-span-4 h-full">
        <OverviewSalesActivityCard
          data={data?.overviewSalesActivity}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    sessionsOrderLeads: (
      <div key="sessionsOrderLeads" className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full justify-between">
        <div className="grid grid-cols-2 gap-6 flex-1">
          <SessionsCard data={data?.sessions} />
          <OrderSummaryCard
            data={data?.order}
            availableYears={data?.availableYears}
          />
        </div>
        <div className="flex-1">
          <GeneratedLeadsCard data={data?.generatedLeads} />
        </div>
      </div>
    ),
    topProductsBySales: (
      <div key="topProductsBySales" className="col-span-12 lg:col-span-4 h-full">
        <TopProductsBySalesCard
          products={data?.topProductsBySales}
          years={data?.topProductsBySalesYears}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    topProductsByVolume: (
      <div key="topProductsByVolume" className="col-span-12 lg:col-span-4 h-full">
        <TopProductsByVolumeCard
          products={data?.topProductsByVolume}
          years={data?.topProductsByVolumeYears}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    earningReport: (
      <div key="earningReport" className="col-span-12 lg:col-span-4 h-full">
        <EarningReportCard
          data={data?.earningReport}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    salesAnalyticsHeatmap: (
      <div key="salesAnalyticsHeatmap" className="col-span-12 lg:col-span-4 h-full">
        <SalesAnalyticsHeatmapCard data={data?.salesAnalytics} />
      </div>
    ),
    salesByCountries: (
      <div key="salesByCountries" className="col-span-12 lg:col-span-4 h-full">
        <SalesByCountriesCard
          countries={data?.salesByCountries}
          years={data?.salesByCountriesYears}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    salesStatus: (
      <div key="salesStatus" className="col-span-12 lg:col-span-4 h-full">
        <SalesStatusCard
          data={data?.salesStatus}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    employeePerformance: (
      <div key="employeePerformance" className="col-span-12 lg:col-span-4 h-full">
        <EmployeePerformanceTableCard
          employees={data?.employeePerformance}
          years={data?.employeePerformanceYears}
          availableYears={data?.availableYears}
        />
      </div>
    ),
    customerTransactions: (
      <div key="customerTransactions" className="col-span-12 lg:col-span-8 h-full">
        <CustomerTransactionsTableCard
          transactions={data?.customerTransactions}
        />
      </div>
    ),
  };

  return (
    <div className="w-full">
      <div ref={parentRef} className="grid grid-cols-12 gap-6 [grid-auto-flow:dense] items-stretch">
        {crmOrder.map((id) => widgetMap[id])}
      </div>
    </div>
  );
};

export default CRMDashboard;
