'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, Flame, Truck, ShieldCheck, Package, Check, Plus } from 'lucide-react';
import { premiumProduct } from './product';
import { premiumSlug } from './catalog';
import { useStore } from './store-shell';
const money = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(n);
export default function Experience() {
 const { openPromo, addItem } = useStore();
 const [photo, setPhoto] = useState<string>(premiumProduct.images[0].src);
 const unitPrice = premiumProduct.priceInCents / 100;
 return (
<main>
      <section className="hero">
        <img className="hero-image" src="/images/hero.jpg" alt="Parrilla Wayu al aire libre, lista para compartir un asado" fetchPriority="high" />
        <div className="hero-shade"/>
        <div className="hero-content"><div className="eyebrow"><span className="flag">▌▌</span> EDICIÓN FIESTAS PATRIAS</div><h1>El fuego<br/>nos <em>une.</em></h1><p>Hay algo muy nuestro en reunirnos alrededor<br className="desktop"/> de una parrilla. Este julio, celebra con Wayu.</p><Link href={`/productos/${premiumSlug}`} className="button ivory">Enciende la celebración <ArrowUpRight size={19}/></Link><div className="hero-note"><span/> BUENA COMIDA. BUENA COMPAÑÍA. WAYU.</div></div>
        <div className="hero-side">PERÚ, SE CELEBRA EN LA MESA.</div>
        <div className="hero-bottom"><span>28 / 29 JULIO <span className="muted">— FIESTAS PATRIAS</span></span><Link href="#colecciones">DESCUBRE MÁS <ArrowRight size={15}/></Link></div>
        <div className="hero-stamp">CON ORGULLO<br/><strong>PERÚ</strong><span>CELEBRAMOS LO NUESTRO</span></div>
      </section>
      <div className="benefits"><span><Truck/> Envíos a todo el Perú</span><span><ShieldCheck/> Diseño que se siente. Calidad que dura.</span><span><Package/> El regalo para los que aman el asado</span></div>
      <section className="collections section" id="colecciones"><div className="section-heading"><div><div className="eyebrow red">EL ARTE DE COMPARTIR</div><h2>Tu mesa. Tus reglas.</h2></div><div className="collection-intro"><p>Del primer fuego al último brindis.<br/>Encuentra tu próxima tradición.</p><img src="/images/parrilleros-color.png" alt="Parrilleros, seámoslo siempre" width="1243" height="935" loading="lazy"/></div></div>
        <div className="collection-grid">{[{title:'Alrededor del fuego',sub:'PARRILLAS & ACCESORIOS',img:'grill.jpg',href:'parrilla'},{title:'Un corte por encima',sub:'CUCHILLOS & TABLAS',img:'premium-prm-1.jpg',href:'cuchillos'},{title:'Por los buenos momentos',sub:'BAR & MESA',img:'bar.jpg',href:'bar-y-cocktail'}].map((c,i)=><Link key={c.title} className="collection" href={`/colecciones/${c.href}`}><img src={`/images/${c.img}`} alt={c.title} loading="lazy"/><div className="collection-overlay"/><span className="collection-index">0{i+1}</span><div className="collection-caption"><small>{c.sub}</small><h3>{c.title}</h3></div><span className="round-arrow"><ArrowUpRight size={20}/></span></Link>)}</div>
      </section>
      <section className="premium section" id="premium"><div className="product-visual"><div className="product-label">EL FAVORITO DEL PARRILLERO</div><img className="main-product" src={photo} alt={premiumProduct.images.find(image => image.src === photo)?.alt || premiumProduct.name} loading="lazy"/><div className="thumbnails">{premiumProduct.images.map((image, index)=><button className={photo === image.src ? 'selected' : ''} key={image.src} aria-label={`Ver fotografía ${index + 1}: ${image.alt}`} aria-pressed={photo === image.src} onClick={()=>setPhoto(image.src)}><img src={image.src} alt={image.alt} loading="lazy"/></button>)}</div></div><div className="product-content"><div className="eyebrow red">UN GRAN ASADO EMPIEZA AQUÍ</div><h2>Para quien lleva<br/>el fuego dentro.</h2><h3>{premiumProduct.name}</h3><p>{premiumProduct.description}</p><div className="product-features">{premiumProduct.features.map(feature=><span key={feature}><Check size={15}/> {feature}</span>)}</div><div className="price">{money(unitPrice)} <span>Precio de referencia</span></div><Link className="product-source" href={`/productos/${premiumSlug}`}>Ver detalles del set <ArrowUpRight size={13}/></Link><button className="button dark" onClick={()=>addItem(premiumSlug)}>Agregar a mi bolsa <Plus size={18}/></button><button className="promo-link" onClick={openPromo}><Flame size={17}/> Celebra con 10% OFF. Desbloquea tu código <ArrowRight size={16}/></button><small className="product-disclaimer">Compra simulada · Proyecto académico. Sin pagos reales.</small></div></section>
      <section className="manifesto"><span className="eyebrow">NUESTRO MEJOR INGREDIENTE</span><h2>No es solo el asado.<br/>Es <em>con quién lo compartes.</em></h2><p>Por las sobremesas largas, las recetas de casa y los brindis por el Perú.</p><button className="button ivory" onClick={openPromo}>Hagamos de este julio algo especial <ArrowUpRight size={18}/></button><img className="manifesto-campaign" src="/images/parrilleros-white.png" alt="Parrilleros, seámoslo siempre" width="1406" height="1114" loading="lazy"/></section>
      <section className="faq section"><div><div className="eyebrow red">ANTES DE ENCENDER EL FUEGO</div><h2>Todo claro.<br/>Todo listo.</h2></div><div className="faq-list"><details><summary>¿Cómo obtengo mi código de Fiestas Patrias?<Plus size={18}/></summary><p>Abre la promoción y completa tu nombre, celular y correo. Al enviar los datos válidos verás tu código y podrás copiarlo.</p></details><details><summary>¿En qué producto puedo usar el descuento?<Plus size={18}/></summary><p>El 10% de esta demostración se aplica al set premium de tabla, cuchillo y tenedor PRM Wayu. Agrega el set a la bolsa e introduce el código para ver el precio promocional.</p></details><details><summary>¿Esta promoción es una oferta real de Wayu?<Plus size={18}/></summary><p>No. Esta web es un proyecto académico independiente. La promoción y la compra son simuladas; las imágenes pertenecen a Wayu. No guardamos los datos del formulario ni realizamos cobros.</p></details></div></section>
    </main>
 );
}
