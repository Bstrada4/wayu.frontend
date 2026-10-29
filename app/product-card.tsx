'use client';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { categories, formatMoney, type Product } from './catalog';
import { useStore } from './store-shell';
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useStore();
  return <article className="catalog-card">
    <Link href={`/productos/${product.slug}`} className="catalog-card-image" aria-label={`Ver ${product.name}`}>
      {product.badge && <span className="catalog-badge">{product.badge}</span>}
      <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy"/>
      <span className="card-discover">Ver producto <ArrowUpRight size={16}/></span>
    </Link>
    <div className="catalog-card-content"><small>{categories.find(category=>category.slug===product.category)?.name}</small><Link href={`/productos/${product.slug}`}><h3>{product.name}</h3></Link><div className="catalog-card-bottom"><strong>{formatMoney(product.priceInCents)}</strong><button aria-label={`Agregar ${product.name} a mi bolsa`} onClick={()=>addItem(product.slug)}><Plus size={18}/></button></div></div>
  </article>;
}
