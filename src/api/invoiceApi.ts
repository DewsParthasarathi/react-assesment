import axiosClient from "./axiosClient";
import type { Invoice, InvoiceStatus } from "./types";

export const fetchInvoices = async (): Promise<Invoice[]> => {
  const response = await axiosClient.get<Invoice[]>("/invoices");
  return response.data;
};

export const fetchInvoiceById = async (id: string): Promise<Invoice> => {
  const response = await axiosClient.get<Invoice>(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (
  invoice: Partial<Invoice>,
): Promise<Invoice> => {
  const response = await axiosClient.post<Invoice>("/invoices", invoice);
  return response.data;
};

export const updateInvoice = async (
  id: string,
  updates: Partial<Invoice>,
): Promise<Invoice> => {
  const response = await axiosClient.put<Invoice>(`/invoices/${id}`, updates);
  return response.data;
};

export const deleteInvoice = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await axiosClient.delete<{ success: boolean }>(
    `/invoices/${id}`,
  );
  return response.data;
};

export const batchDeleteInvoices = async (
  ids: string[],
): Promise<{ success: boolean; deletedCount: number }> => {
  const response = await axiosClient.post<{
    success: boolean;
    deletedCount: number;
  }>("/invoices/batch-delete", { ids });
  return response.data;
};

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
