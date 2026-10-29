'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { categories, products } from './catalog';
import ProductCard from './product-card';

export default function CatalogView({ categorySlug }: { categorySlug?: string }) {
  const category = categories.find(item=>item.slug===categorySlug);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const matching = products.filter(product=>(!categorySlug || product.category===categorySlug) && product.name.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')));
  const visible = [...matching].sort((a,b)=>sort==='price-low'?a.priceInCents-b.priceInCents:sort==='price-high'?b.priceInCents-a.priceInCents:sort==='name'?a.name.localeCompare(b.name,'es'):0);
  return <main>
    <section className={`catalog-hero ${categorySlug ? `catalog-hero-${categorySlug}` : ''}`}>
      <div className="catalog-hero-copy"><div className="breadcrumbs"><Link href="/">Inicio</Link><span>/</span>{category?<><Link href="/colecciones">Colecciones</Link><span>/</span><span>{category.name}</span></>:<span>Colecciones</span>}</div><div className="eyebrow red">EL ARTE DE COMPARTIR</div><h1>{category?.title || 'Todo para tu próximo encuentro.'}</h1><p>{category?.description || 'Del primer fuego al último brindis. Explora nuestra selección de parrillas, cuchillos y piezas para la mesa.'}</p><span className="catalog-count">{products.filter(product=>!categorySlug||product.category===categorySlug).length} productos para descubrir</span></div>
      <img src={category?.image || '/images/hero.jpg'} alt={category?.name || 'Parrilla lista para compartir un asado'} fetchPriority="high"/>
    </section>
    <section className="section catalog-section">
      <nav className="category-tabs" aria-label="Filtrar por colección"><Link href="/colecciones" className={!categorySlug?'active':''} aria-current={!categorySlug?'page':undefined}>Todos los productos</Link>{categories.map(item=><Link key={item.slug} href={`/colecciones/${item.slug}`} className={categorySlug===item.slug?'active':''} aria-current={categorySlug===item.slug?'page':undefined}>{item.name}</Link>)}</nav>
      <div className="catalog-tools"><label className="catalog-search"><Search size={17}/><input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Buscar en esta colección" aria-label="Buscar productos"/></label><span role="status">{visible.length} {visible.length===1?'producto':'productos'}</span><label className="catalog-sort">Ordenar por<select value={sort} onChange={event=>setSort(event.target.value)}><option value="featured">Destacados</option><option value="price-low">Precio: menor a mayor</option><option value="price-high">Precio: mayor a menor</option><option value="name">Nombre: A–Z</option></select></label></div>
      {visible.length ? <div className="catalog-grid">{visible.map(product=><ProductCard key={product.slug} product={product}/>)}</div> : <div className="catalog-empty"><Search size={35}/><h2>No encontramos ese producto.</h2><p>Prueba con otro nombre o explora todos los productos de esta colección.</p><button className="button dark" onClick={()=>setSearch('')}>Limpiar búsqueda <ArrowRight size={17}/></button></div>}
      <p className="catalog-note">Selección para un proyecto académico. Precios de referencia; compras simuladas sin cobros.</p>
    </section>
  </main>;
}
