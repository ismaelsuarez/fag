"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type BranchContextValue = { branchId: string | null; setBranchId: (id: string | null) => void };
const BranchContext = createContext<BranchContextValue>({ branchId: null, setBranchId: () => {} });

export function useBranch() {
  return useContext(BranchContext);
}

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [branchId, setBranchId] = useState<string | null>(null);

  useEffect(() => {
    const v = localStorage.getItem('branchId');
    if (v) setBranchId(v);
  }, []);

  const value = useMemo(() => ({ branchId, setBranchId: (id: string | null) => {
    setBranchId(id);
    if (id) localStorage.setItem('branchId', id);
    else localStorage.removeItem('branchId');
  } }), [branchId]);

  return (
    <QueryClientProvider client={queryClient}>
      <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
    </QueryClientProvider>
  );
}


