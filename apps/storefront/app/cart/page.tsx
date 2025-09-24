"use client";
import Link from 'next/link';
import { Button } from '@ui';
import { useCart } from '../../hooks/useCart';

export default function CartPage() {
  const { cart, isLoading } = useCart();
  if (isLoading) return null;
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Carrito</h1>
      <pre className="text-sm bg-muted p-3 rounded-md">{JSON.stringify(cart, null, 2)}</pre>
      <Link href="/checkout"><Button>Ir al checkout</Button></Link>
    </main>
  );
}


