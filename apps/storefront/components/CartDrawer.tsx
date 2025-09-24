"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@ui';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>Carrito</Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/20">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-semibold">Tu carrito</div>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cerrar</Button>
            </div>
            <div className="text-sm text-muted-foreground">(pendiente integrar)</div>
            <div className="flex gap-2">
              <Link href="/cart"><Button variant="outline">Ver carrito</Button></Link>
              <Link href="/checkout"><Button>Ir al checkout</Button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


