"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '../../../hooks/useProducts';
import { ProductCard } from '../../../components/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) ?? '';
  const { data } = useProducts();
  const list = (data ?? []).filter((p: any) => String(p.slug).includes(slug));
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Categoría: {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p: any) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </main>
  );
}


