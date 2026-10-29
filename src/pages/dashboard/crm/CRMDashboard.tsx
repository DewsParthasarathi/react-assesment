import React, { useState } from "react";
import useCrmDashboardQuery from "../../../hooks/useCrmDashboardQuery";
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
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const { data } = useCrmDashboardQuery(selectedYear);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="h-full">
          <CustomerRatingsCard
            data={data?.customerRatings}
            availableYears={data?.availableYears}
          />
        </div>

        <div className="h-full">
          <OverviewSalesActivityCard
            data={data?.overviewSalesActivity}
            availableYears={data?.availableYears}
          />
        </div>

        <div className="flex flex-col gap-6 h-full justify-between">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="h-full">
          <TopProductsBySalesCard
            products={data?.topProductsBySales}
            years={data?.topProductsBySalesYears}
            availableYears={data?.availableYears}
          />
        </div>

        <div className="h-full">
          <TopProductsByVolumeCard
            products={data?.topProductsByVolume}
            years={data?.topProductsByVolumeYears}
            availableYears={data?.availableYears}
          />
        </div>

        <div className="h-full">
          <EarningReportCard
            data={data?.earningReport}
            availableYears={data?.availableYears}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="h-full">
          <SalesAnalyticsHeatmapCard
            data={data?.salesAnalytics}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>

        <div className="h-full">
          <SalesByCountriesCard
            countries={data?.salesByCountries}
            years={data?.salesByCountriesYears}
            availableYears={data?.availableYears}
          />
        </div>
        <div className="h-full">
          <SalesStatusCard
            data={data?.salesStatus}
            availableYears={data?.availableYears}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 h-full">
          <EmployeePerformanceTableCard
            employees={data?.employeePerformance}
            years={data?.employeePerformanceYears}
            availableYears={data?.availableYears}
          />
        </div>

        <div className="lg:col-span-7 h-full">
          <CustomerTransactionsTableCard
            transactions={data?.customerTransactions}
          />
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
