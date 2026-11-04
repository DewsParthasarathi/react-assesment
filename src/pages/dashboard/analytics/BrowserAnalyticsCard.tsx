import React, { useState } from "react";
import { Table, type TableColumn } from "../../../components/ui/Table";
import { Tabs, type TabItem } from "../../../components/ui/Tabs";
import { CustomImage } from "../../../components/ui/CustomImage";
import chromeIcon from "../../../assets/images/Chrome.svg";
import safariIcon from "../../../assets/images/Safari.svg";
import firefoxIcon from "../../../assets/images/Firefox_logo,_2019.svg";
import edgeIcon from "../../../assets/images/Edge.svg";
import operaIcon from "../../../assets/images/Opera_2015_icon.svg";
import braveIcon from "../../../assets/images/brave-logo.svg";

export type AnalyticsTab = "BROWSER" | "OPERATING SYSTEM" | "COUNTRY";

export interface AnalyticsRow {
  no: number;
  name: string;
  visits: string;
  percentage: string;
  width: number;
  barColor: string;
  icon?: string;
}

export const BrowserAnalyticsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("BROWSER");

  const browserRows: AnalyticsRow[] = [
    {
      no: 1,
      name: "Chrome",
      visits: "8.92k",
      percentage: "84.91%",
      width: 84.91,
      barColor: "bg-[#71dd37]",
      icon: chromeIcon,
    },
    {
      no: 2,
      name: "Safari",
      visits: "1.29k",
      percentage: "19.03%",
      width: 19.03,
      barColor: "bg-[#696cff]",
      icon: safariIcon,
    },
    {
      no: 3,
      name: "firefox",
      visits: "328",
      percentage: "3.26%",
      width: 15,
      barColor: "bg-[#03c3ec]",
      icon: firefoxIcon,
    },
    {
      no: 4,
      name: "Edge",
      visits: "142",
      percentage: "3.99%",
      width: 18,
      barColor: "bg-[#ffab00]",
      icon: edgeIcon,
    },
    {
      no: 5,
      name: "Opera",
      visits: "85",
      percentage: "2.12%",
      width: 12,
      barColor: "bg-[#ea5455]",
      icon: operaIcon,
    },
    {
      no: 6,
      name: "Brave",
      visits: "36",
      percentage: "1.06%",
      width: 8,
      barColor: "bg-[#00cfe8]",
      icon: braveIcon,
    },
  ];

  const osRows: AnalyticsRow[] = [
    {
      no: 1,
      name: "Windows",
      visits: "14.2k",
      percentage: "61.40%",
      width: 61.4,
      barColor: "bg-[#696cff]",
    },
    {
      no: 2,
      name: "macOS",
      visits: "4.8k",
      percentage: "21.20%",
      width: 21.2,
      barColor: "bg-[#03c3ec]",
    },
    {
      no: 3,
      name: "Linux",
      visits: "1.9k",
      percentage: "8.40%",
      width: 16,
      barColor: "bg-[#71dd37]",
    },
    {
      no: 4,
      name: "Android",
      visits: "1.2k",
      percentage: "5.30%",
      width: 14,
      barColor: "bg-[#ffab00]",
    },
    {
      no: 5,
      name: "iOS",
      visits: "890",
      percentage: "3.70%",
      width: 10,
      barColor: "bg-[#ea5455]",
    },
  ];

  const countryRows: AnalyticsRow[] = [
    {
      no: 1,
      name: "United States",
      visits: "12.4k",
      percentage: "48.20%",
      width: 48.2,
      barColor: "bg-[#696cff]",
    },
    {
      no: 2,
      name: "Brazil",
      visits: "4.2k",
      percentage: "16.50%",
      width: 22,
      barColor: "bg-[#71dd37]",
    },
    {
      no: 3,
      name: "India",
      visits: "3.8k",
      percentage: "14.90%",
      width: 20,
      barColor: "bg-[#ffab00]",
    },
    {
      no: 4,
      name: "Australia",
      visits: "2.1k",
      percentage: "8.20%",
      width: 15,
      barColor: "bg-[#03c3ec]",
    },
    {
      no: 5,
      name: "France",
      visits: "1.9k",
      percentage: "7.40%",
      width: 13,
      barColor: "bg-[#ea5455]",
    },
    {
      no: 6,
      name: "China",
      visits: "1.2k",
      percentage: "4.80%",
      width: 10,
      barColor: "bg-[#00cfe8]",
    },
  ];

  const getColumns = (tabName: AnalyticsTab): TableColumn<AnalyticsRow>[] => [
    {
      id: "no",
      header: "No.",
      accessorKey: "no",
      width: "40px",
      headerClassName: "w-10",
      className: "text-[#a5a3ae] font-medium",
    },
    {
      id: "name",
      header: tabName,
      headerClassName: "min-w-[120px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.icon && (
            <CustomImage
              src={row.icon}
              alt={row.name}
              containerClassName="w-5 h-5 shrink-0"
              className="w-full h-full object-contain"
            />
          )}
          <span className="font-semibold text-[#32475c]">{row.name}</span>
        </div>
      ),
    },
    {
      id: "visits",
      header: "Visits",
      accessorKey: "visits",
      align: "right",
      headerClassName: "text-right pr-6 w-20",
      className: "pr-6 font-medium text-[#6f6b7d]",
    },
    {
      id: "percentage",
      header: "Data In Percentage",
      headerClassName: "min-w-[180px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-36 h-2 rounded-full bg-[#f8f7fa] overflow-hidden border border-[#dbdade]/40">
            <div
              className={`h-full rounded-full ${row.barColor}`}
              style={{ width: `${row.width}%` }}
            />
          </div>
          <span className="text-fs12 font-semibold text-[#32475c] w-12 text-right">
            {row.percentage}
          </span>
        </div>
      ),
    },
  ];

  const tabItems: TabItem[] = [
    {
      id: "BROWSER",
      label: "BROWSER",
      content: (
        <Table<AnalyticsRow>
          columns={getColumns("BROWSER")}
          data={browserRows}
          keyExtractor={(row) => row.no}
        />
      ),
    },
    {
      id: "OPERATING SYSTEM",
      label: "OPERATING SYSTEM",
      content: (
        <Table<AnalyticsRow>
          columns={getColumns("OPERATING SYSTEM")}
          data={osRows}
          keyExtractor={(row) => row.no}
        />
      ),
    },
    {
      id: "COUNTRY",
      label: "COUNTRY",
      content: (
        <Table<AnalyticsRow>
          columns={getColumns("COUNTRY")}
          data={countryRows}
          keyExtractor={(row) => row.no}
        />
      ),
    },
  ];

  return (
    <div className="bg-white w-full rounded-[5px] p-4 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
      <Tabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as AnalyticsTab)}
        tabListClassName="flex items-center gap-1.5 p-1 bg-[#f8f7fa] rounded-lg w-fit mb-5"
        contentClassName="w-full"
      />
    </div>
  );
};

export default BrowserAnalyticsCard;
