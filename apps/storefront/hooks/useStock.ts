"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useStock(variantId?: string, branchId?: string | null) {
  return useQuery({
    queryKey: ['stock', variantId, branchId],
    queryFn: () => api<any>(`/catalog/stock/${variantId}${branchId ? `?branchId=${branchId}` : ''}`),
    enabled: !!variantId
  });
}


