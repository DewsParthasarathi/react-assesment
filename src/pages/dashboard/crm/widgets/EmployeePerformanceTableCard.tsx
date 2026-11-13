import React, { useState } from "react";
import type { EmployeePerformance } from "../../../../api/types";
import { Table, type TableColumn } from "../../../../components/ui/Table";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomImage from "../../../../components/ui/CustomImage";
import YearSelectionPopup from "../../../../components/ui/YearSelectionPopup";
import moreIcon from "../../../../assets/images/More.svg";
import member1 from "../../../../assets/images/member1.jpg";
import member2 from "../../../../assets/images/member2.jpg";
import member3 from "../../../../assets/images/member3.jpg";
import member4 from "../../../../assets/images/member4.jpg";
import member5 from "../../../../assets/images/member5.jpg";

interface EmployeePerformanceTableCardProps {
  employees?: EmployeePerformance[];
  years?: Record<string, EmployeePerformance[]>;
  availableYears?: string[];
}

export const EmployeePerformanceTableCard: React.FC<EmployeePerformanceTableCardProps> = ({
  employees,
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const items = (years && years[selectedYear]) ? years[selectedYear] : employees;

  if (!items) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getAvatar = (avatarName: string) => {
    switch (avatarName) {
      case "member1":
        return member1;
      case "member2":
        return member2;
      case "member3":
        return member3;
      case "member4":
        return member4;
      case "member5":
      default:
        return member5;
    }
  };

  const columns: TableColumn<EmployeePerformance>[] = [
    {
      id: "name",
      header: "NAME",
      headerClassName: "pb-2.5 font-medium text-fs13 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 align-middle",
      render: (emp) => (
        <div className="flex items-center gap-2.5">
          <CustomImage
            src={getAvatar(emp.avatar)}
            alt={emp.name}
            containerClassName="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full overflow-hidden shrink-0 flex items-center justify-center"
            className="w-full h-full object-cover block rounded-full"
          />
          <div className="flex flex-col justify-center">
            <p className="text-fs15 font-semibold text-[#32475c] leading-snug">{emp.name}</p>
            <p className="text-fs13 text-[#a5a3ae] leading-tight">{emp.role}</p>
          </div>
        </div>
      ),
    },
    {
      id: "project",
      header: "PROJECT",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs13 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center align-middle",
      render: (emp) => (
        <span
          className={`text-fs13 font-semibold px-2 py-0.5 rounded tracking-wide ${
            emp.projectBg || "bg-gray-100 text-gray-600"
          }`}
        >
          {emp.project}
        </span>
      ),
    },
    {
      id: "tasks",
      header: "TASKS",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs13 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center text-fs15 text-[#6f6b7d] font-medium align-middle",
      render: (emp) => emp.tasks,
    },
    {
      id: "progress",
      header: "PROGRESS",
      align: "center",
      headerClassName: "pb-2.5 font-medium text-center text-fs13 text-[#a5a3ae] uppercase tracking-wider",
      className: "py-2.5 text-center align-middle",
      render: (emp) => {
        const radius = 9;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (emp.progress / 100) * circumference;
        return (
          <div className="inline-flex items-center justify-center">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r={radius}
                stroke="#e8ebed"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="12"
                cy="12"
                r={radius}
                stroke={emp.progressColor || "#696cff"}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-fs23 font-medium text-[#444050]">Sales Analytics</h3>
        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          availableYears={availableYears}
        >
          <CustomButton
            variant="icon"
            className="!p-1 text-[#a5a3ae] hover:text-[#5d596c]"
            aria-label="More options"
          >
            <CustomImage src={moreIcon} alt="more" containerClassName="w-1 h-4" className="w-1 h-4 opacity-70" />
          </CustomButton>
        </YearSelectionPopup>
      </div>

      
      <Table
        columns={columns}
        data={items}
        keyExtractor={(emp) => emp.id}
        tableClassName="w-full text-left"
        headerRowClassName="border-b border-[#dbdade]/50 text-fs13 font-medium text-[#a5a3ae] uppercase tracking-wider"
        bodyClassName="divide-y divide-gray-50"
        bodyRowClassName="hover:bg-gray-50/50 transition-colors"
      />
    </div>
  );
};

export default EmployeePerformanceTableCard;
