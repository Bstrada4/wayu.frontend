'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Flame, Minus, Plus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { categories, formatMoney, premiumSlug, products, type Product } from './catalog';
import ProductCard from './product-card';
import { useStore } from './store-shell';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, openPromo } = useStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const category = categories.find(item=>item.slug===product.category)!;
  const related = products.filter(item=>item.slug!==product.slug).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category)).slice(0,3);
  return <main className="product-page">
    <div className="breadcrumbs product-breadcrumbs"><Link href="/">Inicio</Link><span>/</span><Link href={`/colecciones/${category.slug}`}>{category.name}</Link><span>/</span><span>{product.name}</span></div>
    <section className="product-detail section">
      <div className="detail-gallery"><div className="detail-photo">{product.badge&&<span className="catalog-badge">{product.badge}</span>}<img src={product.images[imageIndex].src} alt={product.images[imageIndex].alt} fetchPriority="high"/></div><div className="detail-thumbnails">{product.images.map((image,index)=><button key={image.src} aria-label={`Ver fotografía ${index+1}: ${image.alt}`} aria-pressed={index===imageIndex} onClick={()=>setImageIndex(index)}><img src={image.src} alt={image.alt}/></button>)}</div></div>
      <div className="detail-info"><Link className="eyebrow red" href={`/colecciones/${category.slug}`}>{category.name}</Link><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="detail-price">{formatMoney(product.priceInCents)}<span>Precio de referencia · Demo académica</span></div>{product.slug===premiumSlug&&<div className="detail-offer"><Flame size={23}/><div><strong>Fiestas Patrias se celebra con 10% OFF</strong><p>Tu set a {formatMoney(Math.round(product.priceInCents*.9))} con el código promocional.</p><button onClick={openPromo}>Desbloquear mi código <ArrowRight size={14}/></button></div></div>}<div className="detail-buy"><div className="detail-quantity"><button aria-label="Reducir cantidad" disabled={quantity===1} onClick={()=>setQuantity(value=>value-1)}><Minus size={16}/></button><span aria-live="polite">{quantity}</span><button aria-label="Aumentar cantidad" disabled={quantity===99} onClick={()=>setQuantity(value=>value+1)}><Plus size={16}/></button></div><button className="button dark" onClick={()=>addItem(product.slug,quantity)}>Agregar a mi bolsa <ShoppingBag size={18}/></button></div><div className="detail-assurance"><ShieldCheck size={16}/> Compra simulada. No se realizan cobros.</div>
      <div className="detail-specs"><details open><summary>Características del producto <Plus size={16}/></summary><ul>{product.features.map(feature=><li key={feature}><Check size={15}/>{feature}</li>)}</ul></details><details><summary>Sobre esta compra <Plus size={16}/></summary><p>Esta es una web académica. Puedes agregar productos, combinar cantidades y aplicar el cupón del set PRM. No se solicitan datos de pago ni se generan pedidos o envíos reales.</p></details><details><summary>Promoción de Fiestas Patrias <Plus size={16}/></summary><p>El código ofrece un 10% de descuento solo en el Set Tabla, Cuchillo y Tenedor PRM Wayu. Los demás productos mantienen su precio de referencia. La oferta es una simulación académica.</p></details></div></div>
    </section>
    <section className="related-products section"><div className="section-heading"><div><span className="eyebrow red">PARA COMPLETAR EL ENCUENTRO</span><h2>Mejor en compañía.</h2></div><Link href={`/colecciones/${category.slug}`}>Ver la colección <ArrowRight size={17}/></Link></div><div className="catalog-grid related-grid">{related.map(item=><ProductCard product={item} key={item.slug}/>)}</div><Link className="back-collection" href="/colecciones"><ArrowLeft size={15}/> Volver a todos los productos</Link></section>
  </main>;
}
