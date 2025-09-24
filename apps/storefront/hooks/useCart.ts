"use client";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useCart() {
  const qc = useQueryClient();
  const cart = useQuery({ queryKey: ['cart'], queryFn: () => api<any>('/cart') });
  const add = useMutation({
    mutationFn: (payload: { variantId: string; quantity: number }) =>
      api<any>('/cart/add', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] })
  });
  return { cart: cart.data, isLoading: cart.isLoading, addItem: add.mutateAsync };
}


