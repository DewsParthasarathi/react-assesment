import React, { useState, useMemo, useCallback } from "react";
import {
  useRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from "../../hooks/useRolesQuery";
import { useUsersQuery } from "../../hooks/useUsersQuery";
import type { Role, RolePermission, User } from "../../api/types";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { CustomCheckbox } from "../../components/ui/CustomCheckbox";
import { CustomModal } from "../../components/ui/CustomModal";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { CustomTable, type TableColumn } from "../../components/ui/Table";
import { CustomImage } from "../../components/ui/CustomImage";
import { getMemberAvatar } from "../../utils/userAvatars";

import addRoleIllustration from "../../assets/images/add-role-illustration-light.png";

const PERMISSION_MODULES = [
  "User Management",
  "Content Management",
  "Disputes Management",
  "Database Management",
  "Financial Management",
  "Reporting",
  "API Control",
  "Repository",
  "Payroll",
];

const DEFAULT_PLANS = ["all", "Enterprise", "Team", "Basic", "Company"];

export const RolesPage: React.FC = () => {
  const { data: roles = [] } = useRolesQuery();
  const { data: rawUsers = [] } = useUsersQuery();

  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation();
  const deleteRoleMutation = useDeleteRoleMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(
    null,
  );

  const [roleName, setRoleName] = useState("");
  const [permissionsState, setPermissionsState] = useState<
    Record<string, { read: boolean; write: boolean; create: boolean }>
  >({});

  const initPermissions = useCallback(
    (existingPermissions?: RolePermission[]) => {
      const state: Record<
        string,
        { read: boolean; write: boolean; create: boolean }
      > = {};
      PERMISSION_MODULES.forEach((mod) => {
        const found = existingPermissions?.find((p) => p.module === mod);
        state[mod] = {
          read: found?.read ?? false,
          write: found?.write ?? false,
          create: found?.create ?? false,
        };
      });
      setPermissionsState(state);
    },
    [],
  );

  const handleOpenAdd = () => {
    setEditingRole(null);
    setRoleName("");
    initPermissions();
    setIsRoleModalOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    initPermissions(role.permissions);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingRole(null);
    setRoleName("");
  };

  const isAllSelected = useMemo(() => {
    return PERMISSION_MODULES.every((mod) => {
      const p = permissionsState[mod];
      return p && p.read && p.write && p.create;
    });
  }, [permissionsState]);

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const nextState: Record<
      string,
      { read: boolean; write: boolean; create: boolean }
    > = {};
    PERMISSION_MODULES.forEach((mod) => {
      nextState[mod] = { read: checked, write: checked, create: checked };
    });
    setPermissionsState(nextState);
  };

  const handleTogglePermission = (
    module: string,
    type: "read" | "write" | "create",
  ) => {
    setPermissionsState((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [type]: !prev[module]?.[type],
      },
    }));
  };

  const handleSaveRole = async () => {
    if (!roleName.trim()) return;

    const formattedPermissions: RolePermission[] = PERMISSION_MODULES.map(
      (mod) => ({
        module: mod,
        read: Boolean(permissionsState[mod]?.read),
        write: Boolean(permissionsState[mod]?.write),
        create: Boolean(permissionsState[mod]?.create),
      }),
    );

    if (editingRole) {
      await updateRoleMutation.mutateAsync({
        id: editingRole.id,
        updates: {
          name: roleName.trim(),
          permissions: formattedPermissions,
        },
      });
    } else {
      await createRoleMutation.mutateAsync({
        name: roleName.trim(),
        totalUsers: 0,
        assignedUsers: [],
        permissions: formattedPermissions,
      });
    }

    handleCloseRoleModal();
  };

  const handleConfirmDelete = (role: Role) => {
    setRoleToDelete(role);
  };

  const handleExecuteDelete = async () => {
    if (!roleToDelete) return;
    await deleteRoleMutation.mutateAsync(roleToDelete.id);
    setRoleToDelete(null);
  };

  const usersList = useMemo<User[]>(() => {
    return rawUsers.map((u, index) => ({
      ...u,
      username: u.username || u.email,
      email: u.email,
      plan: u.plan || (index % 2 === 0 ? "Enterprise" : "Team"),
      billing: u.billing || "Auto Debit",
      status:
        u.status ||
        (index % 3 === 0 ? "Active" : index % 3 === 1 ? "Pending" : "Inactive"),
    }));
  }, [rawUsers]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      if (
        selectedPlan !== "all" &&
        user.plan?.toLowerCase() !== selectedPlan.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = user.name?.toLowerCase().includes(q);
        const matchesEmail = user.email?.toLowerCase().includes(q);
        const matchesUsername = user.username?.toLowerCase().includes(q);
        const matchesRole = user.role?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesUsername && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }, [usersList, selectedPlan, searchQuery]);

  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const getRoleIcon = (roleNameStr: string = "") => {
    const lower = roleNameStr.toLowerCase();
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

  const getStatusBadge = (status?: User["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-fs12 font-bold tracking-wider uppercase bg-[#e8fadf] text-[#71dd37]">
            ACTIVE
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-fs12 font-bold tracking-wider uppercase bg-[#fff2d6] text-[#ffab00]">
            PENDING
          </span>
        );
      case "Inactive":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-fs12 font-bold tracking-wider uppercase bg-[#dbdade]/70 text-[#8592a3]">
            INACTIVE
          </span>
        );
    }
  };

  const tableColumns = useMemo<TableColumn<User>[]>(() => {
    return [
      {
        id: "user",
        header: "USER",
        headerClassName:
          "py-3.5 px-6 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-6",
        render: (user) => (
          <div className="flex items-center gap-3">
            <CustomImage
              src={getMemberAvatar(user.avatar || user.id)}
              alt={user.name}
              containerClassName="w-9 h-9 rounded-full shrink-0 overflow-hidden"
              className="w-full h-full"
              objectFit="cover"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-fs15 font-medium text-[#5d596c] hover:text-[#696cff] transition cursor-pointer truncate">
                {user.name}
              </span>
              <span className="text-fs13 text-[#a5a3ae] truncate">
                {user.username || user.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "email",
        header: "EMAIL",
        headerClassName:
          "py-3.5 px-4 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => (
          <span className="text-fs15 text-[#6f6b7d] font-normal truncate">
            {user.email}
          </span>
        ),
      },
      {
        id: "role",
        header: "ROLE",
        headerClassName:
          "py-3.5 px-4 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => (
          <div className="flex items-center gap-2.5">
            {getRoleIcon(user.role)}
            <span className="text-fs15 text-[#5d596c] font-normal">
              {user.role}
            </span>
          </div>
        ),
      },
      {
        id: "plan",
        header: "PLAN",
        headerClassName:
          "py-3.5 px-4 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => (
          <span className="text-fs15 text-[#6f6b7d] font-normal">
            {user.plan}
          </span>
        ),
      },
      {
        id: "status",
        header: "STATUS",
        headerClassName:
          "py-3.5 px-4 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider",
        className: "py-3.5 px-4",
        render: (user) => getStatusBadge(user.status),
      },
      {
        id: "actions",
        header: "ACTIONS",
        align: "center",
        headerClassName:
          "py-3.5 px-6 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider text-center w-24",
        className: "py-3.5 px-6 text-center w-24",
        render: (user) => (
          <CustomButton
            type="button"
            variant="icon"
            onClick={() => setSelectedUserForView(user)}
            className="p-1.5 text-[#a5a3ae] hover:text-[#696cff] transition cursor-pointer"
            title="View Details"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </CustomButton>
        ),
      },
    ];
  }, []);

  const planDropdownOptions = useMemo(() => {
    return DEFAULT_PLANS.map((plan) => ({
      value: plan,
      label: plan === "all" ? "Select Plan" : plan,
    }));
  }, []);

  return (
    <div className="w-full space-y-6 pb-12">
      <div>
        <h1 className="text-fs23 font-medium text-[#5d596c] tracking-tight">
          Roles List
        </h1>
        <p className="text-fs15 text-[#a5a3ae] leading-relaxed mt-1">
          A role provides to Predefined menus and features so that depending on
          the assigned role,an administrator can have accessto what he needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const assigned = role.assignedUsers || [];
          const count = role.totalUsers || assigned.length;
          const displayAvatars = assigned.slice(0, 4);
          const remainingCount = count > 4 ? count - 3 : 0;

          return (
            <div
              key={role.id}
              className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 py-5 px-3 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-fs14 text-[#a5a3ae]">
                  Total {count} users
                </span>
                <div className="flex items-center">
                  {displayAvatars.map((u, i) => (
                    <CustomImage
                      key={u.id || i}
                      src={getMemberAvatar(u.avatar || `member${(i % 6) + 1}`)}
                      alt={u.name}
                      title={u.name}
                      containerClassName="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 shadow-sm shrink-0 overflow-hidden"
                      className="w-full h-full"
                      objectFit="cover"
                    />
                  ))}
                  {remainingCount > 0 && (
                    <div className="w-8 h-8 rounded-full bg-[#f1f0f2] text-[#6f6b7d] text-fs13 font-medium flex items-center justify-center -ml-2 border-2 border-white shrink-0 shadow-sm">
                      +{remainingCount}
                    </div>
                  )}
                </div>
              </div>

              <div className="my-1">
                <h2 className="text-fs19 font-medium text-[#5d596c] tracking-tight">
                  {role.name}
                </h2>
              </div>

              <div className="flex items-center justify-between pt-1">
                <CustomButton
                  variant="ghost"
                  onClick={() => handleOpenEdit(role)}
                  className="!p-0 text-fs15 font-normal text-[#696cff] hover:underline cursor-pointer"
                >
                  Edit Role
                </CustomButton>

                {role.name !== "Administrator" && (
                  <CustomButton
                    variant="icon"
                    onClick={() => handleConfirmDelete(role)}
                    title="Delete Role"
                    className="p-1 text-[#a5a3ae] hover:text-[#ff4c51] transition"
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
                        strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </CustomButton>
                )}
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 p-5 flex items-center justify-between">
          <CustomImage
            src={addRoleIllustration}
            alt="Add Role"
            containerClassName="h-28 shrink-0 flex items-center"
            className="h-28 w-auto"
            objectFit="contain"
          />
          <div className="flex flex-col items-end text-right pl-4">
            <CustomButton
              variant="primary"
              onClick={handleOpenAdd}
              className="uppercase font-medium px-4 !py-2 !h-auto text-fs14 shadow-[0_2px_4px_rgba(105,108,255,0.4)]"
            >
              ADD ROLE
            </CustomButton>
            <p className="text-fs13 text-[#a5a3ae] mt-2">
              Add role,if it doesn't exist
            </p>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-5 pb-4">
          <div className="w-full sm:w-64">
            <CustomInput
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-44">
            <CustomDropdown
              value={selectedPlan}
              onChange={(val) => {
                setSelectedPlan(String(val));
                setCurrentPage(1);
              }}
              options={planDropdownOptions}
              placeholder="Select Plan"
              sizeVariant="md"
            />
          </div>
        </div>

        <CustomTable<User>
          columns={tableColumns}
          data={currentRecords}
          keyExtractor={(u) => u.id}
          className="w-full overflow-x-auto"
          tableClassName="w-full text-left border-collapse min-w-[850px]"
          headerRowClassName="bg-white border-y border-[#dbdade]/60 text-fs15 font-bold text-[#5d596c] uppercase tracking-wider"
          bodyClassName="divide-y divide-[#dbdade]/40"
          bodyRowClassName="hover:bg-[#fafafb]/70 transition"
          emptyText="No users found matching your search."
        />

        <div className="p-4 md:px-6 md:py-3.5 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 border-t border-[#dbdade]/50 text-fs14 text-[#6f6b7d] bg-white">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <CustomDropdown
              value={pageSize}
              onChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
              sizeVariant="sm"
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 50, label: "50" },
              ]}
              containerClassName="w-16"
            />
          </div>

          <div>
            <span>
              {totalRecords === 0
                ? "0-0 of 0"
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                    currentPage * pageSize,
                    totalRecords,
                  )} of ${totalRecords}`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <CustomButton
              type="button"
              variant="icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded hover:bg-[#f5f5f9] text-[#6f6b7d] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
              className="p-1.5 rounded hover:bg-[#f5f5f9] text-[#6f6b7d] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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

      <CustomModal
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        size="xl"
        title={editingRole ? "Edit Role" : "Add Role"}
        subtitle="Set Role Permissions"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            {editingRole && editingRole.name !== "Administrator" && (
              <CustomButton
                variant="danger"
                onClick={() => {
                  setIsRoleModalOpen(false);
                  handleConfirmDelete(editingRole);
                }}
                className="mr-auto"
              >
                Delete Role
              </CustomButton>
            )}
            <CustomButton variant="outline" onClick={handleCloseRoleModal}>
              Cancel
            </CustomButton>
            <CustomButton
              variant="primary"
              onClick={handleSaveRole}
              disabled={
                !roleName.trim() ||
                createRoleMutation.isPending ||
                updateRoleMutation.isPending
              }
            >
              {createRoleMutation.isPending || updateRoleMutation.isPending
                ? "Saving..."
                : editingRole
                  ? "Update Role"
                  : "Submit"}
            </CustomButton>
          </div>
        }
      >
        <div className="space-y-6">
          <CustomInput
            label="Role Name"
            placeholder="Enter a role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />

          <div>
            <h3 className="text-fs17 font-medium text-[#5d596c] mb-3">
              Role Permissions
            </h3>

            <div className="overflow-x-auto border border-[#dbdade]/70 rounded-[6px]">
              <table className="w-full text-left text-fs15 border-collapse">
                <thead>
                  <tr className="bg-[#f8f7fa] border-b border-[#dbdade]/70">
                    <th className="p-3.5 text-[#5d596c] font-semibold">
                      Administrator Access
                    </th>
                    <th colSpan={3} className="p-3.5 text-right">
                      <CustomCheckbox
                        label="Select All"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        labelClassName="font-medium text-[#5d596c]"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dbdade]/50">
                  {PERMISSION_MODULES.map((module) => {
                    const perm = permissionsState[module] || {
                      read: false,
                      write: false,
                      create: false,
                    };
                    return (
                      <tr
                        key={module}
                        className="hover:bg-[#fafafb]/70 transition"
                      >
                        <td className="p-3.5 font-medium text-[#5d596c] min-w-[200px]">
                          {module}
                        </td>
                        <td className="p-3.5 text-center">
                          <CustomCheckbox
                            label="Read"
                            checked={perm.read}
                            onChange={() =>
                              handleTogglePermission(module, "read")
                            }
                          />
                        </td>
                        <td className="p-3.5 text-center">
                          <CustomCheckbox
                            label="Write"
                            checked={perm.write}
                            onChange={() =>
                              handleTogglePermission(module, "write")
                            }
                          />
                        </td>
                        <td className="p-3.5 text-center">
                          <CustomCheckbox
                            label="Create"
                            checked={perm.create}
                            onChange={() =>
                              handleTogglePermission(module, "create")
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CustomModal>

      <ConfirmationModal
        isOpen={Boolean(roleToDelete)}
        title="Delete Role"
        subtitle="Are you sure you want to delete this role?"
        message={`This will permanently delete the role "${roleToDelete?.name}". Any users assigned to this role should be reassigned.`}
        variant="danger"
        isDeleting={deleteRoleMutation.isPending}
        onConfirm={handleExecuteDelete}
        onCancel={() => setRoleToDelete(null)}
      />

      <CustomModal
        isOpen={Boolean(selectedUserForView)}
        onClose={() => setSelectedUserForView(null)}
        size="md"
        title="User Details"
        subtitle="User profile and role assignment"
        footer={
          <div className="flex justify-end w-full">
            <CustomButton
              variant="outline"
              onClick={() => setSelectedUserForView(null)}
            >
              Close
            </CustomButton>
          </div>
        }
      >
        {selectedUserForView && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#fafafb] border border-[#dbdade]/60">
              <CustomImage
                src={getMemberAvatar(
                  selectedUserForView.avatar || selectedUserForView.id,
                )}
                alt={selectedUserForView.name}
                containerClassName="w-14 h-14 rounded-full shrink-0 overflow-hidden"
                className="w-full h-full"
                objectFit="cover"
              />
              <div>
                <h4 className="text-fs17 font-semibold text-[#5d596c]">
                  {selectedUserForView.name}
                </h4>
                <p className="text-fs14 text-[#a5a3ae]">
                  {selectedUserForView.username || selectedUserForView.email}
                </p>
                <div className="mt-1">
                  {getStatusBadge(selectedUserForView.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-fs15">
              <div className="p-3 rounded border border-[#dbdade]/50">
                <span className="text-fs13 text-[#a5a3ae] block">Role</span>
                <span className="font-medium text-[#5d596c]">
                  {selectedUserForView.role}
                </span>
              </div>
              <div className="p-3 rounded border border-[#dbdade]/50">
                <span className="text-fs13 text-[#a5a3ae] block">Plan</span>
                <span className="font-medium text-[#5d596c]">
                  {selectedUserForView.plan || "Enterprise"}
                </span>
              </div>
              <div className="p-3 rounded border border-[#dbdade]/50">
                <span className="text-fs13 text-[#a5a3ae] block">Email</span>
                <span className="font-medium text-[#5d596c] truncate block">
                  {selectedUserForView.email}
                </span>
              </div>
              <div className="p-3 rounded border border-[#dbdade]/50">
                <span className="text-fs13 text-[#a5a3ae] block">Billing</span>
                <span className="font-medium text-[#5d596c]">
                  {selectedUserForView.billing || "Auto Debit"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default RolesPage;
