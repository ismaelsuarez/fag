"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useProduct(id?: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => api<any>(`/catalog/products/${id}`), enabled: !!id });
}


