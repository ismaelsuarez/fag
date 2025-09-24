"use client";
import { Button } from '@ui';

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="font-medium">{product.name}</div>
      <div className="text-sm text-muted-foreground">{product.slug}</div>
      <Button size="sm">Agregar</Button>
    </div>
  );
}


