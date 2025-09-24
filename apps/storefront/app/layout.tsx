import './globals.css';
import type { ReactNode } from 'react';
import { AppProviders } from './providers';

export const metadata = {
  title: 'Farmacia - Tienda Online',
  description: 'Compra medicamentos y productos de farmacia',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Farmacia - Tienda Online',
    description: 'Compra medicamentos y productos de farmacia',
    url: 'https://example.com',
    siteName: 'Farmacia',
    locale: 'es_AR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farmacia - Tienda Online',
    description: 'Compra medicamentos y productos de farmacia'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}


