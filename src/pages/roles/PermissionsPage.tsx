import React, { useState, useMemo, useCallback } from "react";
import {
  usePermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "../../hooks/usePermissionsQuery";
import type { Permission } from "../../api/types";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { CustomCheckbox } from "../../components/ui/CustomCheckbox";
import { CustomModal } from "../../components/ui/CustomModal";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { CustomTable, type TableColumn } from "../../components/ui/Table";

const AVAILABLE_ROLES = [
  { id: "Administrator", label: "Administrator", badgeText: "ADMINSTRATOR" },
  { id: "Manager", label: "Manager", badgeText: "MANAGER" },
  { id: "Users", label: "Users", badgeText: "USERS" },
  { id: "Support", label: "Support", badgeText: "SUPPORT" },
];

const CATEGORIES: Array<"Basic" | "Professional" | "Business"> = [
  "Basic",
  "Professional",
  "Business",
];

const getRoleBadgeInfo = (role: string) => {
  const lower = role.toLowerCase();
  if (lower.includes("manager")) {
    return {
      badgeStyle: "bg-[#fff1e3] text-[#ff9f43]",
      displayText: "MANAGER",
    };
  }
  if (lower.includes("user")) {
    return { badgeStyle: "bg-[#e8fadf] text-[#28c76f]", displayText: "USERS" };
  }
  if (lower.includes("support")) {
    return {
      badgeStyle: "bg-[#dcf6f8] text-[#00cfe8]",
      displayText: "SUPPORT",
    };
  }
  if (lower.includes("admin")) {
    return {
      badgeStyle: "bg-[#ecebfd] text-[#7367f0]",
      displayText: "ADMINSTRATOR",
    };
  }
  return {
    badgeStyle: "bg-[#ebebed] text-[#6f6b7d]",
    displayText: role.toUpperCase(),
  };
};

const renderRoleBadges = (rolesList: string[] = []) => {
  if (!rolesList || rolesList.length === 0) {
    return <span className="text-[#a5a3ae] text-fs13">-</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {rolesList.map((role) => {
        const { badgeStyle, displayText } = getRoleBadgeInfo(role);

        return (
          <span
            key={role}
            className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-fs11 font-semibold tracking-wider uppercase select-none ${badgeStyle}`}
          >
            {displayText}
          </span>
        );
      })}
    </div>
  );
};

export const PermissionsPage: React.FC = () => {
  const { data: permissions = [], isLoading } = usePermissionsQuery();

  const createPermissionMutation = useCreatePermissionMutation();
  const updatePermissionMutation = useUpdatePermissionMutation();
  const deletePermissionMutation = useDeletePermissionMutation();

  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerm, setEditingPerm] = useState<Permission | null>(null);
  const [permToDelete, setPermToDelete] = useState<Permission | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRoles, setFormRoles] = useState<string[]>([]);
  const [formCategory, setFormCategory] = useState<
    "Basic" | "Professional" | "Business"
  >("Basic");
  const [formIsCore, setFormIsCore] = useState(false);
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setEditingPerm(null);
    setFormName("");
    setFormRoles(["Administrator"]);
    setFormCategory("Basic");
    setFormIsCore(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (perm: Permission) => {
    setEditingPerm(perm);
    setFormName(perm.name);
    setFormRoles(perm.assignedTo || []);
    setFormCategory(perm.category || "Basic");
    setFormIsCore(Boolean(perm.isCore));
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerm(null);
    setFormName("");
    setFormRoles([]);
    setFormError("");
  };

  const handleToggleRole = (roleName: string) => {
    setFormRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName],
    );
  };

  const handleSavePermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Permission name is required.");
      return;
    }
    if (formRoles.length === 0) {
      setFormError("Please select at least one role.");
      return;
    }

    try {
      if (editingPerm) {
        await updatePermissionMutation.mutateAsync({
          id: editingPerm.id,
          updates: {
            name: formName.trim(),
            assignedTo: formRoles,
            category: formCategory,
            isCore: formIsCore,
          },
        });
      } else {
        await createPermissionMutation.mutateAsync({
          name: formName.trim(),
          assignedTo: formRoles,
          category: formCategory,
          isCore: formIsCore,
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save permission:", err);
      setFormError("An error occurred while saving. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!permToDelete) return;
    try {
      await deletePermissionMutation.mutateAsync(permToDelete.id);
      setPermToDelete(null);
    } catch (err) {
      console.error("Failed to delete permission:", err);
    }
  };

  // Filtered permissions based on search
  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    const query = searchQuery.toLowerCase().trim();
    return permissions.filter((perm) => {
      const nameMatch = perm.name.toLowerCase().includes(query);
      const rolesMatch = perm.assignedTo?.some((r) =>
        r.toLowerCase().includes(query),
      );
      const catMatch = perm.category?.toLowerCase().includes(query);
      return nameMatch || rolesMatch || catMatch;
    });
  }, [permissions, searchQuery]);

  // Paginated records
  const totalRecords = filteredPermissions.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPermissions.slice(start, start + pageSize);
  }, [filteredPermissions, currentPage, pageSize]);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    if (filteredPermissions.length === 0) return;
    const headers = [
      "Name",
      "Assigned To",
      "Created Date",
      "Category",
      "Core Permission",
    ];
    const rows = filteredPermissions.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${(p.assignedTo || []).join(", ")}"`,
      `"${p.createdDate || ""}"`,
      `"${p.category || ""}"`,
      `"${p.isCore ? "Yes" : "No"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `permission_list_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredPermissions]);

  // Table Columns definition
  const tableColumns: TableColumn<Permission>[] = useMemo(
    () => [
      {
        id: "name",
        header: "NAME",
        headerClassName:
          "pl-6 pr-4 py-4 text-[13px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "pl-6 pr-4 !py-[10px]",
        render: (perm) => (
          <span className="text-fs18 font-normal text-[#a5a3ae] leading-normal">
            {perm.name}
          </span>
        ),
      },
      {
        id: "assignedTo",
        header: "ASSIGNED TO",
        headerClassName:
          "px-4 py-4 text-[13px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "px-4 !py-[10px]",
        render: (perm) => renderRoleBadges(perm.assignedTo),
      },
      {
        id: "createdDate",
        header: "CREATED DATE",
        headerClassName:
          "px-4 py-4 text-[13px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "px-4 !py-[10px]",
        render: (perm) => (
          <span className="text-fs17 font-normal text-[#a5a3ae] whitespace-nowrap">
            {perm.createdDate}
          </span>
        ),
      },
      {
        id: "actions",
        header: "ACTIONS",
        headerClassName:
          "pl-4 pr-6 py-4 text-[13px] font-semibold text-[#5d596c] uppercase tracking-wider",
        className: "pl-4 pr-6 !py-[10px]",
        render: (perm) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenEdit(perm)}
              className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-0.5"
              title="Edit Permission"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setPermToDelete(perm)}
              className="text-[#a5a3ae] hover:text-[#5d596c] transition cursor-pointer p-0.5"
              title="Delete Permission"
            >
              <svg
                className="w-[18px] h-[18px]"
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
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="w-full flex-1 flex flex-col min-w-0 space-y-6">
      {/* 1. Page Header */}
      <div>
        <h2 className="text-[22px] font-semibold text-[#5d596c] tracking-tight">
          Permission List
        </h2>
        <p className="text-fs14 text-[#6f6b7d] mt-1">
          Each category (Basic,Professional,and Business) includes the four
          predefined roles shown below.
        </p>
      </div>

      {/* 2. Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#dbdade]/60 overflow-hidden flex flex-col">
        {/* Toolbar: Export, Search User, Add Permission */}
        <div className="p-4 md:p-6 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Left: Export Button */}
          <div>
            <CustomButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="!h-[38px] px-4 border border-[#dbdade] text-[#a5a3ae] hover:text-[#5d596c] hover:border-[#a5a3ae] font-semibold text-xs tracking-wider uppercase rounded-md bg-transparent"
            >
              EXPORT
            </CustomButton>
          </div>

          {/* Right: Search User Input + Add Permission Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <CustomInput
                type="text"
                placeholder="Search User"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                sizeVariant="sm"
                className="!h-[38px] text-fs14"
              />
            </div>

            <CustomButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenAdd}
              className="!h-[38px] px-4 !bg-[#7367F0] hover:!bg-[#685dd8] text-white font-medium text-xs tracking-wider uppercase rounded-md shadow-sm whitespace-nowrap"
            >
              ADD PERMISSION
            </CustomButton>
          </div>
        </div>

        {/* 3. Permission Table */}
        <CustomTable<Permission>
          columns={tableColumns}
          data={currentRecords}
          keyExtractor={(p) => p.id}
          className="w-full overflow-x-auto"
          tableClassName="w-full text-left border-collapse min-w-[750px]"
          headerRowClassName="bg-white border-y border-[#dbdade]/60 text-[13px] font-semibold text-[#5d596c] uppercase tracking-wider"
          bodyClassName="divide-y divide-[#dbdade]/40"
          bodyRowClassName="hover:bg-[#fafafb]/70 transition min-h-[64px]"
          emptyText={
            isLoading
              ? "Loading permissions..."
              : "No permissions found matching your criteria."
          }
        />

        {/* 4. Pagination matching reference UI */}
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
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 25, label: "25" },
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
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`p-1.5 rounded transition ${
                currentPage <= 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#f5f5f9] text-[#5d596c] cursor-pointer"
              }`}
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
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`p-1.5 rounded transition ${
                currentPage >= totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-[#f5f5f9] text-[#5d596c] cursor-pointer"
              }`}
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
      </div>

      {/* 5. Add / Edit Permission Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="md"
        title={editingPerm ? "Edit Permission" : "Add Permission"}
        subtitle="Permissions you may use and assign to your users."
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              className="px-5 py-2 text-fs14 rounded-md"
            >
              Discard
            </CustomButton>
            <CustomButton
              type="button"
              variant="primary"
              onClick={handleSavePermission}
              isLoading={
                createPermissionMutation.isPending ||
                updatePermissionMutation.isPending
              }
              className="px-6 py-2 !bg-[#7367F0] hover:!bg-[#685dd8] text-white text-fs14 font-medium rounded-md shadow-sm"
            >
              {editingPerm ? "Update" : "Submit"}
            </CustomButton>
          </div>
        }
      >
        <form onSubmit={handleSavePermission} className="space-y-4 pt-1">
          {formError && (
            <div className="p-3 bg-[#ffebee] text-[#ea5455] text-fs13 rounded-md border border-[#ea5455]/30">
              {formError}
            </div>
          )}

          <div>
            <CustomInput
              label="Permission Name"
              type="text"
              placeholder="Enter a permission name (e.g. Management Billing)"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (formError) setFormError("");
              }}
              required
              sizeVariant="md"
            />
          </div>

          <div>
            <label className="block text-fs13 font-medium text-[#5d596c] mb-2">
              Assigned To
            </label>
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-md border border-[#dbdade]/70 bg-[#fafafb]">
              {AVAILABLE_ROLES.map((r) => (
                <CustomCheckbox
                  key={r.id}
                  id={`role-check-${r.id}`}
                  label={r.label}
                  checked={formRoles.includes(r.id)}
                  onChange={() => handleToggleRole(r.id)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-fs13 font-medium text-[#5d596c] mb-1.5">
                Category
              </label>
              <CustomDropdown
                value={formCategory}
                onChange={(val) =>
                  setFormCategory(val as "Basic" | "Professional" | "Business")
                }
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                sizeVariant="md"
                className="w-full"
              />
            </div>

            <div className="flex items-center pt-6">
              <CustomCheckbox
                id="is-core-perm"
                label="Set as Core Permission"
                checked={formIsCore}
                onChange={(e) => setFormIsCore(e.target.checked)}
              />
            </div>
          </div>
        </form>
      </CustomModal>

      {/* 6. Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(permToDelete)}
        title="Delete Permission"
        subtitle="Are you sure you want to delete this permission?"
        message={
          permToDelete
            ? `Are you sure you want to delete "${permToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        variant="danger"
        icon="trash"
        isLoading={deletePermissionMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPermToDelete(null)}
      />
    </div>
  );
};

export default PermissionsPage;
