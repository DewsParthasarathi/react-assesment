import axiosClient from "./axiosClient";
import type { Invoice, InvoiceStatus } from "./types";

/**
 * Retrieves all invoices.
 */
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const response = await axiosClient.get<Invoice[]>("/invoices");
  return response.data;
};

/**
 * Retrieves a single invoice by its ID.
 */
export const fetchInvoiceById = async (id: string): Promise<Invoice> => {
  const response = await axiosClient.get<Invoice>(`/invoices/${id}`);
  return response.data;
};

/**
 * Creates a new invoice.
 */
export const createInvoice = async (
  invoice: Partial<Invoice>,
): Promise<Invoice> => {
  const response = await axiosClient.post<Invoice>("/invoices", invoice);
  return response.data;
};

/**
 * Updates an invoice by ID.
 */
export const updateInvoice = async (
  id: string,
  updates: Partial<Invoice>,
): Promise<Invoice> => {
  const response = await axiosClient.put<Invoice>(`/invoices/${id}`, updates);
  return response.data;
};

/**
 * Deletes a single invoice by ID.
 */
export const deleteInvoice = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/invoices/${id}`,
  );
  return response.data;
};

/**
 * Deletes multiple invoices in batch.
 */
export const batchDeleteInvoices = async (
  ids: string[],
): Promise<{ success: boolean; deletedCount: number }> => {
  const response = await axiosClient.post<{
    success: boolean;
    deletedCount: number;
  }>("/invoices/batch-delete", { ids });
  return response.data;
};

/**
 * Updates status of multiple invoices in batch.
 */
export const batchUpdateInvoiceStatus = async (
  ids: string[],
  status: InvoiceStatus,
): Promise<{ success: boolean; updatedCount: number }> => {
  const response = await axiosClient.post<{
    success: boolean;
    updatedCount: number;
  }>("/invoices/batch-status", { ids, status });
  return response.data;
};

