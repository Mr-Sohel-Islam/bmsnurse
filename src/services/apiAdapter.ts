import type { ApiResponse, PaginatedResponse } from "@/types/api";

type AnyRecord = Record<string, unknown>;

const asRecord = (value: unknown): AnyRecord =>
  (value && typeof value === "object" ? (value as AnyRecord) : {}) as AnyRecord;

export const extractData = <T>(payload: unknown, key?: string): T => {
  const root = asRecord(payload);
  const data = asRecord(root.data);

  if (key) {
    if (key in data) return data[key] as T;
    if (key in root) return root[key] as T;
  }

  if (Object.keys(data).length > 0) return data as T;
  return root as T;
};

export const extractList = <T>(payload: unknown, key: string): T[] => {
  if (!key) {
    const root = asRecord(payload);
    const data = root.data;
    if (Array.isArray(data)) return data as T[];
  }
  const value = extractData<unknown>(payload, key);
  return Array.isArray(value) ? (value as T[]) : [];
};

export const extractPaginated = <T>(
  payload: unknown,
  key: string
): PaginatedResponse<T> => {
  const root = asRecord(payload);
  const data = asRecord(root.data);
  const rows = Array.isArray(data[key]) ? (data[key] as T[]) : [];
  const paginationRaw = asRecord(data.pagination);

  return {
    success: Boolean(root.success ?? true),
    data: rows,
    pagination: {
      page: Number(paginationRaw.page ?? 1),
      limit: Number(paginationRaw.limit ?? (rows.length || 20)),
      total: Number(paginationRaw.total ?? rows.length),
      pages: Number(paginationRaw.pages ?? 1),
    },
  };
};

export const toApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});
