import React, { useMemo, useState, useCallback } from "react";
import { useUsersQuery } from "../../hooks/useUsersQuery";
import { getMemberAvatar } from "../../utils/userAvatars";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { CustomTable, type TableColumn } from "../../components/ui/Table";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

import sessionIcon from "../../assets/images/Session.svg";
import paidUserIcon from "../../assets/images/Paid users.svg";
import activeUserIcon from "../../assets/images/Active users.svg";
import pendingUserIcon from "../../assets/images/Pending users.svg";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan: string;
  billing: string;
  status: "Active" | "Pending" | "Inactive";
}

const DEFAULT_PLANS = ["Enterprise", "Basic", "Team", "Company"];
const DEFAULT_BILLINGS = [
  "Auto Debit",
  "Manual - Cash",
  "Auto Debit",
  "Credit Card",
];
const DEFAULT_STATUSES: ("Active" | "Pending" | "Inactive")[] = [
  "Active",
  "Active",
  "Pending",
  "Active",
  "Inactive",
  "Active",
];

export const UserPage: React.FC = () => {
  const { data: rawUsers = [], isLoading, isError, error } = useUsersQuery();

  const [deletedUserIds, setDeletedUserIds] = useState<string[]>([]);

  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const baseUsers = useMemo<UserRecord[]>(() => {
    const mapped: UserRecord[] = rawUsers.map((u, index) => ({
      id: String(u.id),
      name: u.name || `User ${u.id}`,
      email: u.email || `user${u.id}@example.com`,
      role: u.role || (index === 0 ? "Administrator" : "Author"),
      avatar: u.avatar || `member${(index % 6) + 1}`,
      plan: u.plan || DEFAULT_PLANS[index % DEFAULT_PLANS.length],
      billing: u.billing || DEFAULT_BILLINGS[index % DEFAULT_BILLINGS.length],
      status: (u.status as "Active" | "Pending" | "Inactive") || DEFAULT_STATUSES[index % DEFAULT_STATUSES.length],
    }));

    if (mapped.length > 0 && mapped.length < 10) {
      const extraNames = [
        {
          name: "Jordan stevenson",
          email: "don85@johnson.com",
          role: "Editor",
          plan: "Enterprise",
          billing: "Auto Debit",
          status: "Inactive" as const,
        },
        {
          name: "Stephanie Burns",
          email: "brenda49@taylor.info",
          role: "Author",
          plan: "Team",
          billing: "Manual - Paypal",
          status: "Pending" as const,
        },
        {
          name: "Tony herrera",
          email: "smithfany@powers.com",
          role: "Maintainer",
          plan: "Enterprise",
          billing: "Manual - Cash",
          status: "Active" as const,
        },
        {
          name: "Kevin Patton",
          email: "brenda49@taylor.info",
          role: "SubScriber",
          plan: "Team",
          billing: "Auto Debit",
          status: "Inactive" as const,
        },
        {
          name: "Mrs. Julie Donovan MD",
          email: "smithfany@powers.com",
          role: "SubScriber",
          plan: "Enterprise",
          billing: "Auto Debit",
          status: "Pending" as const,
        },
        {
          name: "Tony herrera",
          email: "smithfany@powers.com",
          role: "Maintainer",
          plan: "Team",
          billing: "Manul - Credit Card",
          status: "Active" as const,
        },
      ];
      extraNames.forEach((extra, idx) => {
        mapped.push({
          id: String(mapped.length + 1),
          name: extra.name,
          email: extra.email,
          role: extra.role,
          avatar: `member${((idx + 2) % 6) + 1}`,
          plan: extra.plan,
          billing: extra.billing,
          status: extra.status,
        });
      });
    }

    return mapped;
  }, [rawUsers]);

  const activeUsers = useMemo(() => {
    return baseUsers.filter((u) => !deletedUserIds.includes(u.id));
  }, [baseUsers, deletedUserIds]);

  const filteredUsers = useMemo(() => {
    return activeUsers.filter((user) => {
      if (
        selectedRole !== "all" &&
        user.role.toLowerCase() !== selectedRole.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedPlan !== "all" &&
        user.plan.toLowerCase() !== selectedPlan.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedStatus !== "all" &&
        user.status.toLowerCase() !== selectedStatus.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesEmail = user.email.toLowerCase().includes(q);
        const matchesRole = user.role.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }, [activeUsers, selectedRole, selectedPlan, selectedStatus, searchQuery]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const currentRecords = filteredUsers.slice(startIndex, endIndex);
  const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord = endIndex;

  const handleDeleteUserClick = useCallback((user: UserRecord) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setOpenDropdownId(null);
  }, []);

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setDeletedUserIds((prev) => [...prev, userToDelete.id]);
      setUserToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const lower = role.toLowerCase();
    if (lower.includes("admin")) {
      return (
        <span className="w-7 h-7 rounded-full bg-[#f2e7fe] text-[#7367f0] flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </span>
      );
    }
    if (lower.includes("editor") || lower.includes("maintainer")) {
      return (
        <span className="w-7 h-7 rounded-full bg-[#e8fadf] text-[#71dd37] flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      );
    }
    if (lower.includes("author")) {
      return (
        <span className="w-7 h-7 rounded-full bg-[#dff7f9] text-[#00bad1] flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-[#e7e7ff] text-[#696cff] flex items-center justify-center shrink-0">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </span>
    );
  };

  const getStatusBadge = (status: UserRecord["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-fs11 font-bold tracking-wider uppercase bg-[#e8fadf] text-[#71dd37]">
            ACTIVE
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-fs11 font-bold tracking-wider uppercase bg-[#fff2d6] text-[#ffab00]">
            PENDING
          </span>
        );
      case "Inactive":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-fs11 font-bold tracking-wider uppercase bg-[#dbdade]/70 text-[#8592a3]">
            INACTIVE
          </span>
        );
    }
  };

  const tableColumns = useMemo<TableColumn<UserRecord>[]>(() => {
    return [
      {
        id: "user",
        header: "USER",
        headerClassName:
          "py-3.5 px-6 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-6",
        render: (user) => (
          <div className="flex items-center gap-3">
            <img
              src={getMemberAvatar(user.avatar || user.id)}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-fs14 font-medium text-[#5d596c] hover:text-[#696cff] transition cursor-pointer truncate">
                {user.name}
              </span>
              <span className="text-fs12 text-[#a5a3ae] truncate">
                {user.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "role",
        header: "ROLE",
        headerClassName:
          "py-3.5 px-4 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => (
          <div className="flex items-center gap-2.5">
            {getRoleIcon(user.role)}
            <span className="text-fs14 text-[#5d596c] font-normal">
              {user.role}
            </span>
          </div>
        ),
      },
      {
        id: "plan",
        header: "PLAN",
        headerClassName:
          "py-3.5 px-4 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => (
          <span className="text-fs14 text-[#6f6b7d] font-normal">
            {user.plan}
          </span>
        ),
      },
      {
        id: "billing",
        header: "BILLING",
        headerClassName:
          "py-3.5 px-4 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => (
          <span className="text-fs14 text-[#6f6b7d] font-normal">
            {user.billing}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName:
          "py-3.5 px-4 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => getStatusBadge(user.status),
      },
      {
        id: "actions",
        header: "ACTIONS",
        align: "center",
        headerClassName:
          "py-3.5 px-6 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider text-center w-24",
        className: "py-3.5 px-6 text-center w-24",
        render: (user) => {
          const isDropdownOpen = openDropdownId === user.id;
          return (
            <div className="relative inline-flex items-center justify-center">
              <CustomButton
                type="button"
                variant="icon"
                onClick={() =>
                  setOpenDropdownId(isDropdownOpen ? null : user.id)
                }
                className="p-1.5 text-[#a5a3ae] hover:text-[#5d596c] hover:bg-[#f5f5f9] rounded transition cursor-pointer"
                title="More options"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </CustomButton>

              {isDropdownOpen && (
                <div className="absolute right-0 top-8 z-30 w-36 bg-white rounded-[6px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#dbdade]/70 py-1 text-left">
                  <CustomButton
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDropdownId(null)}
                    className="w-full px-4 py-2 text-fs14 text-[#5d596c] hover:bg-[#f5f5f9] hover:text-[#696cff] transition flex items-center justify-start gap-2 cursor-pointer rounded-none"
                  >
                    <span>Edit User</span>
                  </CustomButton>
                  <CustomButton
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      handleDeleteUserClick(user);
                      setOpenDropdownId(null);
                    }}
                    className="w-full px-4 py-2 text-fs14 text-[#ea5455] hover:bg-[#ffebee] transition flex items-center justify-start gap-2 cursor-pointer rounded-none"
                  >
                    <span>Delete</span>
                  </CustomButton>
                </div>
              )}
            </div>
          );
        },
      },
    ];
  }, [openDropdownId, handleDeleteUserClick]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col min-w-0 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-[6px] border border-[#dbdade]/70"
            />
          ))}
        </div>
        <div className="h-96 bg-white rounded-[6px] border border-[#dbdade]/70" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-8 bg-white rounded-[6px] border border-[#ea5455]/30 text-center">
        <p className="text-[#ea5455] font-medium text-fs16 mb-2">
          Failed to load users: {error?.message || "Unknown error"}
        </p>
        <CustomButton
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Retry
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col min-w-0 space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 p-5 flex items-center justify-between">
          <div>
            <p className="text-fs13 text-[#a5a3ae] mb-1">Session</p>
            <div className="flex items-center gap-2">
              <span className="text-fs20 font-bold text-[#5d596c] tracking-tight">
                21,459
              </span>
              <span className="text-fs12 font-medium text-[#71dd37]">
                (+29%)
              </span>
            </div>
            <p className="text-fs12 text-[#a5a3ae] mt-1">Total Users</p>
          </div>
          <div className="w-10 h-10 rounded-[6px] bg-[#e7e7ff] text-[#696cff] flex items-center justify-center shrink-0">
            <img
              src={sessionIcon}
              alt="Session"
              className="w-5 h-5 object-contain"
            />
          </div>
        </div>

        <div className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 p-5 flex items-center justify-between">
          <div>
            <p className="text-fs13 text-[#a5a3ae] mb-1">Paid users</p>
            <div className="flex items-center gap-2">
              <span className="text-fs20 font-bold text-[#5d596c] tracking-tight">
                4.567
              </span>
              <span className="text-fs12 font-medium text-[#71dd37]">
                (+18%)
              </span>
            </div>
            <p className="text-fs12 text-[#a5a3ae] mt-1">Last week analytics</p>
          </div>
          <div className="w-10 h-10 rounded-[6px] bg-[#ffebee] text-[#ff4c51] flex items-center justify-center shrink-0">
            <img
              src={paidUserIcon}
              alt="Paid users"
              className="w-5 h-5 object-contain"
            />
          </div>
        </div>

        <div className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 p-5 flex items-center justify-between">
          <div>
            <p className="text-fs13 text-[#a5a3ae] mb-1">Active users</p>
            <div className="flex items-center gap-2">
              <span className="text-fs20 font-bold text-[#5d596c] tracking-tight">
                19,860
              </span>
              <span className="text-fs12 font-medium text-[#ea5455]">
                (-14%)
              </span>
            </div>
            <p className="text-fs12 text-[#a5a3ae] mt-1">Last week analytics</p>
          </div>
          <div className="w-10 h-10 rounded-[6px] bg-[#e8fadf] text-[#71dd37] flex items-center justify-center shrink-0">
            <img
              src={activeUserIcon}
              alt="Active users"
              className="w-5 h-5 object-contain"
            />
          </div>
        </div>

        <div className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 p-5 flex items-center justify-between">
          <div>
            <p className="text-fs13 text-[#a5a3ae] mb-1">Pending users</p>
            <div className="flex items-center gap-2">
              <span className="text-fs20 font-bold text-[#5d596c] tracking-tight">
                237
              </span>
              <span className="text-fs12 font-medium text-[#71dd37]">
                (+42%)
              </span>
            </div>
            <p className="text-fs12 text-[#a5a3ae] mt-1">Last year analytics</p>
          </div>
          <div className="w-10 h-10 rounded-[6px] bg-[#fff2d6] text-[#ffab00] flex items-center justify-center shrink-0">
            <img
              src={pendingUserIcon}
              alt="Pending users"
              className="w-5 h-5 object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 overflow-hidden">
        <div className="p-6 pb-5">
          <h2 className="text-fs18 font-medium text-[#5d596c] tracking-tight mb-4">
            Search Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomDropdown
              value={selectedRole}
              onChange={(val) => {
                setSelectedRole(String(val));
                setCurrentPage(1);
              }}
              sizeVariant="md"
              options={[
                { label: "Select Role", value: "all" },
                { label: "Administrator", value: "Administrator" },
                { label: "Author", value: "Author" },
                { label: "Editor", value: "Editor" },
                { label: "Maintainer", value: "Maintainer" },
                { label: "Subscriber", value: "Subscriber" },
              ]}
            />

            <CustomDropdown
              value={selectedPlan}
              onChange={(val) => {
                setSelectedPlan(String(val));
                setCurrentPage(1);
              }}
              sizeVariant="md"
              options={[
                { label: "Select Plan", value: "all" },
                { label: "Basic", value: "Basic" },
                { label: "Company", value: "Company" },
                { label: "Enterprise", value: "Enterprise" },
                { label: "Team", value: "Team" },
              ]}
            />

            <CustomDropdown
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(String(val));
                setCurrentPage(1);
              }}
              sizeVariant="md"
              options={[
                { label: "Select Status", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Pending", value: "Pending" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-[#dbdade]/50" />

        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <CustomButton
            type="button"
            variant="outline"
            size="md"
            className="!h-10 !px-5 uppercase tracking-wider text-fs13 font-medium text-[#6f6b7d] hover:bg-[#f8f7fa] border-[#dbdade] rounded-[6px]"
          >
            EXPORT
          </CustomButton>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-60">
              <CustomInput
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search User"
                sizeVariant="md"
                className="rounded-[6px] !px-3.5 !h-10 text-fs14"
              />
            </div>

            <CustomButton
              type="button"
              className="!h-10 !px-5 uppercase tracking-wider text-fs13 font-medium bg-[#696cff] hover:bg-[#5f61e6] text-white rounded-[6px] shadow-[0_2px_4px_rgba(105,108,255,0.4)] whitespace-nowrap cursor-pointer"
            >
              ADD USER
            </CustomButton>
          </div>
        </div>

        <CustomTable<UserRecord>
          columns={tableColumns}
          data={currentRecords}
          keyExtractor={(u) => u.id}
          className="w-full overflow-x-auto"
          tableClassName="w-full text-left border-collapse min-w-[850px]"
          headerRowClassName="bg-white border-y border-[#dbdade]/60 text-fs14 font-bold text-[#5d596c] uppercase tracking-wider"
          bodyClassName="divide-y divide-[#dbdade]/40"
          bodyRowClassName="hover:bg-[#fafafb]/70 transition"
          emptyText="No users found matching your filters."
        />

        <div className="p-4 md:px-6 md:py-3.5 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 border-t border-[#dbdade]/50 text-fs13 text-[#6f6b7d] bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <CustomDropdown
              value={pageSize}
              onChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
              sizeVariant="sm"
              containerClassName="w-20"
              options={[
                { label: "10", value: 10 },
                { label: "25", value: 25 },
                { label: "50", value: 50 },
              ]}
            />
          </div>

          <div className="text-fs13 text-[#6f6b7d] ml-4">
            {startRecord}-{endRecord} of {totalRecords}
          </div>

          <div className="flex items-center gap-1 ml-4 text-[#6f6b7d]">
            <CustomButton
              type="button"
              variant="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-[#f8f7fa] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Previous Page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </CustomButton>

            <CustomButton
              type="button"
              variant="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded hover:bg-[#f8f7fa] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              title="Next Page"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </CustomButton>
          </div>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        subtitle="This action cannot be undone."
        message={
          userToDelete ? (
            <span>
              Are you sure you want to delete user{" "}
              <strong className="text-[#32475c]">{userToDelete.name}</strong> (
              {userToDelete.email})?
            </span>
          ) : (
            "Are you sure you want to delete this user?"
          )
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
};

export default UserPage;
