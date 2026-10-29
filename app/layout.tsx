import type { Metadata } from 'next';
import './globals.css';
import StoreShell from './store-shell';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'WAYU · El fuego nos une | Fiestas Patrias', description: 'Celebra lo nuestro alrededor del fuego. Descubre el set premium Wayu y una promoción especial de Fiestas Patrias. Proyecto académico.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es-PE"><body><StoreShell>{children}</StoreShell></body></html>; }
