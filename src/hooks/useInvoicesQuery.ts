import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  batchDeleteInvoices,
  batchUpdateInvoiceStatus,
  createInvoice,
  deleteInvoice,
  fetchInvoiceById,
  fetchInvoices,
  updateInvoice,
} from "../api/invoiceApi";
import type { Invoice, InvoiceStatus } from "../api/types";

export const INVOICES_QUERY_KEY = "invoices";

export const useInvoicesQuery = () => {
  return useQuery<Invoice[], Error>({
    queryKey: [INVOICES_QUERY_KEY],
    queryFn: () => fetchInvoices(),
    staleTime: 1000 * 30,
  });
};

export const useInvoiceByIdQuery = (id?: string) => {
  return useQuery<Invoice, Error>({
    queryKey: [INVOICES_QUERY_KEY, id],
    queryFn: () => fetchInvoiceById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoice: Partial<Invoice>) => createInvoice(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};

export const useUpdateInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Invoice>;
    }) => updateInvoice(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};

export const useDeleteInvoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};

export const useBatchDeleteInvoicesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => batchDeleteInvoices(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};

export const useBatchUpdateInvoiceStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      status,
    }: {
      ids: string[];
      status: InvoiceStatus;
    }) => batchUpdateInvoiceStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVOICES_QUERY_KEY] });
    },
  });
};
