"use client";
import { useBranch } from '../app/providers';

export function BranchSelector() {
  const { branchId, setBranchId } = useBranch();
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Sucursal:</label>
      <select
        className="border rounded px-2 py-1"
        value={branchId ?? ''}
        onChange={(e) => setBranchId(e.target.value || null)}
      >
        <option value="">Todas</option>
        <option value="branch-1">Sucursal 1</option>
        <option value="branch-2">Sucursal 2</option>
      </select>
    </div>
  );
}


