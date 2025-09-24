"use client";
import { useState } from 'react';
import { Button } from '@ui';
import { api } from '../../lib/api';

export default function CheckoutPage() {
  const [age, setAge] = useState<number | ''>('');
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const [result, setResult] = useState<any>(null);

  const validate = async () => {
    const payload = {
      items: [],
      prescriptionId: prescriptionUrl ? 'mock-id' : undefined,
      age: typeof age === 'number' ? age : 0
    };
    const res = await api('/checkout/validate', { method: 'POST', body: JSON.stringify(payload) });
    setResult(res);
  };

  const pay = async () => {
    const res = await api<{ id: string; init_point: string }>(
      '/payments/mp/preference',
      { method: 'POST', body: JSON.stringify({ orderId: 'mock-order', amount: 1000 }) }
    );
    window.location.href = res.init_point + '&back_urls.success=/checkout/success&back_urls.failure=/checkout/failure';
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="w-40">Edad</label>
          <input className="border px-2 py-1 rounded" value={age} onChange={(e) => setAge(Number(e.target.value) || '')} />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-40">URL receta (opcional)</label>
          <input className="border px-2 py-1 rounded flex-1" value={prescriptionUrl} onChange={(e) => setPrescriptionUrl(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={validate}>Validar</Button>
        <Button onClick={pay} variant="secondary">Pagar</Button>
      </div>
      {result && <pre className="text-sm bg-muted p-3 rounded-md">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}


