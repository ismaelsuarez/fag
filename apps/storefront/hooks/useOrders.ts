"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: () => api<any[]>('/orders') });
}


