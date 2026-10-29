import Link from 'next/link';
export default function NotFound() { return <main className="catalog-empty section"><div className="eyebrow red">404 · SE NOS APAGÓ ESTA BRASA</div><h1>No encontramos esta página.</h1><p>Encuentra tu próximo favorito en nuestras colecciones.</p><Link href="/colecciones" className="button dark">Explorar productos →</Link></main>; }
