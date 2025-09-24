"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: () => api<any[]>('/catalog/products') });
}


