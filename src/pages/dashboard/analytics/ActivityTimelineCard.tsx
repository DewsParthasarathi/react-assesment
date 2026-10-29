// import React from "react";

// export const ActivityTimelineCard: React.FC = () => {
//   const activities = [
//     {
//       id: 1,
//       title: "12 Invoice have been paid",
//       time: "12 min ago",
//       description: "Invoice have been paid to the company",
//       color: "#696cff",
//       isLast: false,
//     },
//     {
//       id: 2,
//       title: "Client Meeting",
//       time: "45 min ago",
//       description: "Project meeting with john @10:15am",
//       color: "#ffab00",
//       isLast: false,
//     },
//     {
//       id: 3,
//       title: "Create a new project for client",
//       time: "2 days ago",
//       description: "5 teams members in a project",
//       color: "#03c3ec",
//       isLast: true,
//     },
//   ];

//   return (
//     <div className="bg-white rounded-[5px] p-6 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col justify-between h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between pb-3">
//         <h3 className="text-fs16 font-semibold text-[#32475c]">
//           Activity Timeline
//         </h3>
//         <button
//           type="button"
//           aria-label="Options"
//           className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
//         >
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
//           </svg>
//         </button>
//       </div>

//       {/* Timeline Items */}
//       <div className="mt-2 space-y-6">
//         {activities.map((item) => (
//           <div key={item.id} className="relative pl-6">
//             {/* Connecting Vertical Line */}
//             {!item.isLast && (
//               <span
//                 className="absolute left-[5px] top-3 bottom-[-24px] w-[2px] bg-[#ebeef0]"
//                 aria-hidden="true"
//               />
//             )}

//             {/* Circular Marker Dot */}
//             <span
//               className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white shadow-xs"
//               style={{ backgroundColor: item.color }}
//               aria-hidden="true"
//             />

//             <div className="flex flex-wrap items-center justify-between gap-2">
//               <h4 className="text-fs14 font-semibold text-[#32475c]">
//                 {item.title}
//               </h4>
//               <span className="text-fs12 text-[#a5a3ae]">{item.time}</span>
//             </div>
//             <p className="text-fs13 text-[#6f6b7d] mt-1 leading-relaxed">
//               {item.description}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ActivityTimelineCard;
import React, { useState } from "react";
import YearSelectionPopup from "../../../components/ui/YearSelectionPopup";
import type { MemberActivity } from "../../../api/types";

interface ActivityTimelineCardProps {
  activities?: MemberActivity[];
  years?: Record<string, MemberActivity[]>;
  availableYears?: string[];
}

export const ActivityTimelineCard: React.FC<ActivityTimelineCardProps> = ({
  activities: initialActivities,
  years,
  availableYears = ["2023", "2022"],
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");

  const defaultActivities: MemberActivity[] = [
    {
      id: 1,
      title: "12 Invoice have been paid",
      timeLabel: "12 min ago",
      description: "Invoices have been paid to the company",
      statusColor: "#696cff",
    },
    {
      id: 2,
      title: "Client Meeting",
      timeLabel: "45 min ago",
      description: "Project meeting with client @10:15am",
      statusColor: "#ff9f43",
    },
    {
      id: 3,
      title: "Create a new project for client",
      timeLabel: "2 days ago",
      description: "5 team members assigned",
      statusColor: "#00cfe8",
    },
  ];

  const rawActivities = (years && years[selectedYear]) ? years[selectedYear] : (initialActivities || defaultActivities);

  const activities = rawActivities.map((item, idx) => ({
    id: item.id,
    title: item.title,
    time: item.timeLabel,
    description: item.description,
    color: item.statusColor || "#696cff",
    isLast: idx === rawActivities.length - 1,
  }));

  return (
    <div className="bg-white rounded-[5px] p-4 border border-[#dbdade]/50 shadow-[0_2px_6px_rgba(47,43,61,0.06)] flex flex-col h-full min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-fs22 font-medium text-[#444050]">
          Activity Timeline
        </h3>
        <YearSelectionPopup
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          availableYears={availableYears}
        >
          <button
            type="button"
            aria-label="Options"
            className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </YearSelectionPopup>
      </div>

      {/* Timeline Items */}
      <div className="mt-3 flex-1 flex flex-col">
        {activities.map((item) => (
          <div key={item.id} className="relative pl-9 flex-1">
            {/* Connecting Vertical Line */}
            {!item.isLast && (
              <span
                className="absolute left-[5px] top-4 -bottom-1 w-[2px] bg-[#dbdade]/70"
                aria-hidden="true"
              />
            )}

            {/* Circular Marker Dot */}
            <span
              className="absolute left-0 top-1.5 w-3 h-3 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 0 3px ${item.color}33`,
              }}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-fs18 font-medium text-[#444050]">
                {item.title}
              </h4>
              <span className="text-fs14 font-normal text-[#a5a3ae] mt-1">
                {item.time}
              </span>
            </div>
            <p className="text-fs16 font-normal text-[#6f6b7d] mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimelineCard;
