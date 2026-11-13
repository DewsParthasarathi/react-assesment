import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Invoice, InvoiceStatus } from "../../api/types";
import { CustomButton } from "../../components/ui/CustomButton";
import { CustomCheckbox } from "../../components/ui/CustomCheckbox";
import { CustomInput } from "../../components/ui/CustomInput";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { CustomTable, type TableColumn } from "../../components/ui/Table";
import { AnchoredPortal } from "../../components/ui/FloatingPortal";
import {
  useBatchDeleteInvoicesMutation,
  useBatchUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
  useInvoicesQuery,
} from "../../hooks/useInvoicesQuery";
import { getMemberAvatar } from "../../utils/userAvatars";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import InvoiceStatusIcon from "./components/InvoiceStatusIcon";

const formatDateDisplay = (dateStr?: string): string => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
};

export const InvoiceListPage: React.FC = () => {
  const navigate = useNavigate();

  // TanStack Query
  const { data: invoices = [], isLoading, isError, error } = useInvoicesQuery();
  const deleteMutation = useDeleteInvoiceMutation();
  const batchDeleteMutation = useBatchDeleteInvoicesMutation();
  const batchStatusMutation = useBatchUpdateInvoiceStatusMutation();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selection & Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [activeMenuInvoiceId, setActiveMenuInvoiceId] = useState<string | null>(null);

  // Pagination State
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    invoiceId?: string;
    invoiceNumber?: string;
    isMultiple?: boolean;
    count?: number;
  }>({ isOpen: false });

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Status Filter
      if (statusFilter !== "all") {
        if (inv.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // 2. Date Filter
      if (dateFilter) {
        if (!inv.issueDate.includes(dateFilter)) {
          return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = inv.invoiceNumber.toLowerCase().includes(query) || inv.id.includes(query);
        const matchesClient = inv.clientName.toLowerCase().includes(query);
        const matchesEmail = inv.clientEmail.toLowerCase().includes(query);
        if (!matchesId && !matchesClient && !matchesEmail) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, statusFilter, dateFilter, searchQuery]);

  // Paginated Data
  const totalRecords = filteredInvoices.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * rowsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvoices, validCurrentPage, rowsPerPage]);

  const startRecord = totalRecords === 0 ? 0 : (validCurrentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(validCurrentPage * rowsPerPage, totalRecords);

  // Row Selection Handlers
  const isAllSelected =
    paginatedInvoices.length > 0 &&
    paginatedInvoices.every((inv) => selectedIds.includes(inv.id));

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      const pageIds = paginatedInvoices.map((inv) => inv.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedInvoices.map((inv) => inv.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  }, [isAllSelected, paginatedInvoices]);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  // Delete Action Handlers
  const handleOpenSingleDelete = (inv: Invoice) => {
    setDeleteModalState({
      isOpen: true,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      isMultiple: false,
    });
  };

  const handleOpenBatchDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalState({
      isOpen: true,
      isMultiple: true,
      count: selectedIds.length,
    });
    setIsActionsDropdownOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.isMultiple) {
      batchDeleteMutation.mutate(selectedIds, {
        onSuccess: () => {
          setSelectedIds([]);
          setDeleteModalState({ isOpen: false });
        },
      });
    } else if (deleteModalState.invoiceId) {
      deleteMutation.mutate(deleteModalState.invoiceId, {
        onSuccess: () => {
          setSelectedIds((prev) =>
            prev.filter((id) => id !== deleteModalState.invoiceId),
          );
          setDeleteModalState({ isOpen: false });
        },
      });
    }
  };

  // Batch Status Update Handler
  const handleBatchStatus = (newStatus: InvoiceStatus) => {
    if (selectedIds.length === 0) return;
    batchStatusMutation.mutate(
      { ids: selectedIds, status: newStatus },
      {
        onSuccess: () => {
          setSelectedIds([]);
          setIsActionsDropdownOpen(false);
        },
      },
    );
  };

  // Reusable CustomTable columns definition
  const tableColumns = useMemo<TableColumn<Invoice>[]>(() => {
    return [
      {
        id: "select",
        header: (
          <CustomCheckbox
            checked={isAllSelected}
            onChange={handleSelectAll}
            aria-label="Select all invoices"
          />
        ),
        width: "48px",
        align: "center",
        headerClassName: "py-3.5 px-4 w-12 text-center",
        className: "py-3.5 px-4 text-center",
        render: (inv) => (
          <CustomCheckbox
            checked={selectedIds.includes(inv.id)}
            onChange={() => handleSelectRow(inv.id)}
            aria-label={`Select invoice ${inv.invoiceNumber}`}
          />
        ),
      },
      {
        id: "id",
        header: "#ID",
        headerClassName: "py-3.5 px-4 font-semibold text-fs14",
        className: "py-3.5 px-4 font-medium",
        render: (inv) => (
          <button
            type="button"
            onClick={() => navigate(`/apps/invoice/preview?id=${inv.id}`)}
            className="text-[#696cff] hover:underline font-medium cursor-pointer"
          >
            {inv.invoiceNumber}
          </button>
        ),
      },
      {
        id: "status-icon",
        header: (
          <svg
            className="w-4 h-4 mx-auto text-[#6f6b7d]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        ),
        width: "48px",
        align: "center",
        headerClassName: "py-3.5 px-3 w-12 text-center",
        className: "py-3.5 px-3 text-center",
        render: (inv) => (
          <div className="flex items-center justify-center">
            <InvoiceStatusIcon status={inv.status} />
          </div>
        ),
      },
      {
        id: "client",
        header: "CLIENT",
        headerClassName: "py-3.5 px-4 min-w-[220px]",
        className: "py-3.5 px-4",
        render: (inv) => (
          <div className="flex items-center gap-3">
            <img
              src={getMemberAvatar(inv.clientAvatar)}
              alt={inv.clientName}
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#dbdade]/60"
            />
            <div className="flex flex-col min-w-0">
              <span
                onClick={() => navigate(`/apps/invoice/preview?id=${inv.id}`)}
                className="text-fs16 font-medium text-[#5d596c] hover:text-[#696cff] transition truncate cursor-pointer"
              >
                {inv.clientName}
              </span>
              <span className="text-fs14 text-[#a5a3ae] truncate">
                {inv.clientEmail}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "total",
        header: "TOTAL",
        headerClassName: "py-3.5 px-4 min-w-[100px]",
        className: "py-3.5 px-4 text-[#6f6b7d] font-normal whitespace-nowrap",
        render: (inv) => `$ ${inv.total}`,
      },
      {
        id: "issueDate",
        header: "ISSUE DATE",
        headerClassName: "py-3.5 px-4 min-w-[130px]",
        className: "py-3.5 px-4 text-[#6f6b7d] font-normal whitespace-nowrap",
        render: (inv) => formatDateDisplay(inv.issueDate),
      },
      {
        id: "balance",
        header: "BALANCE",
        headerClassName: "py-3.5 px-4 min-w-[110px]",
        className: "py-3.5 px-4 whitespace-nowrap",
        render: (inv) => {
          const isPaid =
            inv.balance === 0 || inv.status.toLowerCase() === "paid";
          return isPaid ? (
            <span className="bg-[#e8fadf] text-[#71dd37] text-fs13 font-semibold uppercase px-2 py-0.5 rounded-[4px] inline-block tracking-wide">
              PAID
            </span>
          ) : (
            <span className="text-[#6f6b7d] font-normal">$ {inv.balance}</span>
          );
        },
      },
      {
        id: "actions",
        header: "ACTIONS",
        align: "center",
        headerClassName: "py-3.5 px-4 text-center w-28",
        className: "py-3.5 px-4 text-center",
        render: (inv) => {
          const isMenuOpen = activeMenuInvoiceId === inv.id;
          return (
            <div className="relative inline-flex items-center justify-center gap-1.5 text-[#a5a3ae]">
              <CustomButton
                type="button"
                variant="icon"
                title="Delete"
                onClick={() => handleOpenSingleDelete(inv)}
                className="p-1 hover:text-[#ff4c51] transition cursor-pointer"
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
                    strokeWidth={1.8}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </CustomButton>

              <CustomButton
                type="button"
                variant="icon"
                title="Preview Invoice"
                onClick={() => navigate(`/apps/invoice/preview?id=${inv.id}`)}
                className="p-1 hover:text-[#696cff] transition cursor-pointer"
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
                    strokeWidth={1.8}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </CustomButton>

              <AnchoredPortal
                isOpen={isMenuOpen}
                onClose={() => setActiveMenuInvoiceId(null)}
                align="right"
                offset={4}
                wrapperClassName="relative inline-block"
                trigger={
                  <CustomButton
                    type="button"
                    variant="icon"
                    title="More Options"
                    onClick={() =>
                      setActiveMenuInvoiceId((prev) =>
                        prev === inv.id ? null : inv.id,
                      )
                    }
                    className="p-1 hover:text-[#5d596c] transition cursor-pointer"
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
                        d="M12 5v.01M12 12v.01M12 19v.01"
                      />
                    </svg>
                  </CustomButton>
                }
              >
                <div className="w-36 bg-white rounded-[6px] shadow-[0_4px_16px_rgba(165,163,174,0.3)] border border-[#dbdade]/70 py-1.5 text-left animate-fade-in">
                  <CustomButton
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setActiveMenuInvoiceId(null);
                      navigate(`/apps/invoice/edit?id=${inv.id}`);
                    }}
                    className="w-full px-3 py-1.5 text-fs15 text-[#5d596c] hover:bg-[#f8f7fa] flex items-center justify-start gap-2 cursor-pointer rounded-none"
                  >
                    <span>Edit</span>
                  </CustomButton>
                  <CustomButton
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setActiveMenuInvoiceId(null);
                      navigate(`/apps/invoice/preview?id=${inv.id}`);
                    }}
                    className="w-full px-3 py-1.5 text-fs15 text-[#5d596c] hover:bg-[#f8f7fa] flex items-center justify-start gap-2 cursor-pointer rounded-none"
                  >
                    <span>Download</span>
                  </CustomButton>
                </div>
              </AnchoredPortal>
            </div>
          );
        },
      },
    ];
  }, [
    isAllSelected,
    selectedIds,
    activeMenuInvoiceId,
    handleSelectAll,
    handleSelectRow,
    navigate,
  ]);

  return (
    <div className="w-full flex-1 flex flex-col min-w-0 space-y-6">
      {/* 1. FILTERS SECTION CARD (Matching reference image) */}
      <section className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 p-6">
        <h2 className="text-fs20 font-medium text-[#5d596c] tracking-tight mb-4">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice Status Filter using CustomDropdown */}
          <CustomDropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(String(val));
              setCurrentPage(1);
            }}
            sizeVariant="md"
            options={[
              { label: "Invoice Status", value: "all" },
              { label: "Paid", value: "Paid" },
              { label: "Pending", value: "Pending" },
              { label: "Overdue", value: "Overdue" },
              { label: "Draft", value: "Draft" },
              { label: "Cancelled", value: "Cancelled" },
              { label: "Downloaded", value: "Downloaded" },
              { label: "Sent", value: "Sent" },
            ]}
          />

          {/* Invoice Date Filter */}
          <div className="relative">
            <CustomInput
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Invoice Date"
              sizeVariant="md"
              className="rounded-[6px] !px-3.5"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter("")}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-fs14 text-[#a5a3ae] hover:text-[#5d596c] cursor-pointer"
                title="Clear date"
              >
                âœ•
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. INVOICE TABLE SECTION CARD */}
      <section className="bg-white rounded-[6px] shadow-[0_2px_4px_rgba(165,163,174,0.1)] border border-[#dbdade]/70 overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dbdade]/50">
          {/* Left: Actions Dropdown */}
          <AnchoredPortal
            isOpen={isActionsDropdownOpen}
            onClose={() => setIsActionsDropdownOpen(false)}
            align="left"
            offset={6}
            wrapperClassName="relative inline-flex"
            trigger={
              <button
                type="button"
                onClick={() => setIsActionsDropdownOpen((prev) => !prev)}
                className="h-10 px-4 border border-[#dbdade] rounded-[6px] text-fs16 font-medium text-[#6f6b7d] hover:border-[#696cff] hover:text-[#696cff] transition flex items-center gap-2 bg-white cursor-pointer select-none"
              >
                <span>Actions</span>
                <svg className="w-3.5 h-3.5 text-[#a5a3ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            }
          >
            <div className="w-48 bg-white rounded-[6px] shadow-[0_4px_16px_rgba(165,163,174,0.3)] border border-[#dbdade]/70 py-1.5 animate-fade-in">
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleOpenBatchDelete}
                className="w-full text-left px-4 py-2 text-fs15 text-[#ff4c51] hover:bg-[#ffe5e5]/50 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => handleBatchStatus("Paid")}
                className="w-full text-left px-4 py-2 text-fs15 text-[#5d596c] hover:bg-[#f8f7fa] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#71dd37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Mark as Paid</span>
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => handleBatchStatus("Pending")}
                className="w-full text-left px-4 py-2 text-fs15 text-[#5d596c] hover:bg-[#f8f7fa] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#ffab00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
                <span>Mark as Pending</span>
              </button>
            </div>
          </AnchoredPortal>

          {/* Right: Search & Create Invoice Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <CustomInput
                type="text"
                placeholder="Search Invoice"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                sizeVariant="md"
                containerClassName="w-56 md:w-64"
                className="rounded-[6px] !px-3.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fs14 text-[#a5a3ae] hover:text-[#5d596c] cursor-pointer"
                >
                  âœ•
                </button>
              )}
            </div>

            <CustomButton
              variant="primary"
              onClick={() => navigate("/apps/invoice/add")}
              className="!h-10 px-5 uppercase tracking-wide font-medium text-fs15 md:text-fs16 rounded-[6px] shadow-[0_2px_4px_rgba(105,108,255,0.4)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>CREATE INVOICE</span>
            </CustomButton>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center text-[#696cff] font-medium text-fs16 animate-pulse">
            Loading invoices from database...
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-12 text-center text-[#ff4c51] font-medium text-fs16">
            Failed to load invoices: {error?.message || "Unknown error"}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredInvoices.length === 0 && (
          <div className="p-16 text-center text-[#a5a3ae] flex flex-col items-center justify-center gap-2">
            <svg className="w-12 h-12 text-[#dbdade]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-fs17 font-medium text-[#5d596c]">No invoices found</p>
            <p className="text-fs15 text-[#a5a3ae]">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Main Table using reusable CustomTable */}
        {!isLoading && !isError && filteredInvoices.length > 0 && (
          <CustomTable<Invoice>
            columns={tableColumns}
            data={paginatedInvoices}
            keyExtractor={(inv) => inv.id}
            className="w-full overflow-x-auto"
            tableClassName="w-full text-left border-collapse"
            headerRowClassName="border-b border-[#dbdade]/60 text-fs14 font-medium text-[#5d596c] tracking-wider uppercase bg-[#fafafb]/70"
            bodyClassName="divide-y divide-[#dbdade]/40 text-fs16"
            bodyRowClassName={(inv) =>
              selectedIds.includes(inv.id)
                ? "bg-[#ecebfd]/30 hover:bg-[#ecebfd]/40 transition"
                : "bg-white hover:bg-[#f8f7fa] transition"
            }
            emptyText="No invoices found"
          />
        )}

        {/* 3. PAGINATION TOOLBAR using CustomDropdown & CustomButton */}
        {!isLoading && !isError && filteredInvoices.length > 0 && (
          <div className="p-4 md:px-6 md:py-3.5 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-4 border-t border-[#dbdade]/50 text-fs15 text-[#6f6b7d] bg-white">
            {/* Rows Per Page Selector using CustomDropdown */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <CustomDropdown
                value={rowsPerPage}
                onChange={(val) => {
                  setRowsPerPage(Number(val));
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

            {/* Record Range Counter */}
            <div className="text-fs15 text-[#6f6b7d]">
              {startRecord}-{endRecord} of {totalRecords}
            </div>

            {/* Prev / Next Controls using CustomButton */}
            <div className="flex items-center gap-1 text-[#6f6b7d]">
              <CustomButton
                type="button"
                variant="icon"
                disabled={validCurrentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1 rounded hover:bg-[#f8f7fa] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </CustomButton>

              <CustomButton
                type="button"
                variant="icon"
                disabled={validCurrentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1 rounded hover:bg-[#f8f7fa] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </CustomButton>
            </div>
          </div>
        )}
      </section>

      {/* 4. DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.isMultiple ? "Delete Selected Invoices" : "Delete Invoice"}
        subtitle="This action cannot be undone."
        message={
          deleteModalState.isMultiple ? (
            <>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-[#5d596c]">{deleteModalState.count} selected invoices</span>?
            </>
          ) : (
            <>
              Are you sure you want to permanently delete invoice{" "}
              <span className="font-semibold text-[#5d596c]">{deleteModalState.invoiceNumber}</span>?
            </>
          )
        }
        confirmText="Delete"
        variant="danger"
        icon="trash"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false })}
        isLoading={deleteMutation.isPending || batchDeleteMutation.isPending}
      />
    </div>
  );
};

export default InvoiceListPage;
