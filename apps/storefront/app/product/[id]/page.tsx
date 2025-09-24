"use client";
import { useParams } from 'next/navigation';
import { useProduct } from '../../../hooks/useProduct';
import { useBranch } from '../../providers';
import { useStock } from '../../../hooks/useStock';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data } = useProduct(id);
  const { branchId } = useBranch();
  const variantId = data?.variants?.[0]?.id as string | undefined;
  const { data: stock } = useStock(variantId, branchId);

  if (!data) return null;
  return (
    <main className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <div className="text-sm text-muted-foreground">Sucursal: {branchId ?? 'Todas'}</div>
      <div className="text-sm">Stock: {stock ? stock.total : '...'}</div>
    </main>
  );
}


