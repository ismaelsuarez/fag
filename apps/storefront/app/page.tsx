import { BranchSelector } from '../components/BranchSelector';
import { CartDrawer } from '../components/CartDrawer';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import Link from 'next/link';

export default function Page() {
  const { data } = useProducts();
  return (
    <main className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Storefront</h1>
        <div className="flex items-center gap-4">
          <BranchSelector />
          <CartDrawer />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((p: any) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </main>
  );
}


