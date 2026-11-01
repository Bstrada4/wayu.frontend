'use client';

import Link from 'next/link';
import { createContext, useActionState, useContext, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, X, Plus, Minus, Check, ShoppingBag, Menu, ChevronDown, Trash2 } from 'lucide-react';
import { unlockPromo, validateDiscountCode, type PromoState } from './actions';
import { premiumProduct } from './product';
import { PROMOTION } from './lib/promotion';
import PromoDialog from './promo-dialog';
import { findProduct, formatMoney, premiumSlug } from './catalog';

type CartLine = { slug: string; quantity: number };
type StoreContextValue = { addItem: (slug: string, quantity?: number) => void; openPromo: () => void };
const StoreContext = createContext<StoreContextValue | null>(null);
export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('The store must be used within StoreShell');
  return value;
}

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const promo = useRef<HTMLDialogElement>(null);
  const cart = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<PromoState, FormData>(unlockPromo, {});
  const [items, setItems] = useState<CartLine[]>([]);
  const [savedCode, setSavedCode] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [completed, setCompleted] = useState(false);
  const [menu, setMenu] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const promoCode = state.code || savedCode;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (findProduct(item.slug)?.priceInCents || 0) * item.quantity, 0);
  const eligibleSubtotal = items.filter(item => item.slug === premiumSlug).reduce((sum, item) => sum + item.quantity * premiumProduct.priceInCents, 0);
  const savings = discount ? Math.round(eligibleSubtotal * premiumProduct.discountPercent / 100) : 0;

  useEffect(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem('wayu-demo-store') || '{}');
      if (Array.isArray(data.items)) setItems(data.items.filter((item: CartLine) => findProduct(item.slug) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99));
      if (typeof data.code === 'string' && PROMOTION.codePattern.test(data.code)) {
        void validateDiscountCode(data.code).then(result=>{if(result.valid){setSavedCode(data.code);setDiscount(Boolean(data.discount));}});
      }
    } catch { /* The promotion also works when browser storage is unavailable. */ }
    if (window.location.pathname !== '/privacidad') promo.current?.showModal();
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) try { sessionStorage.setItem('wayu-demo-store', JSON.stringify({ items, code: promoCode, discount })); } catch { /* Browser storage may be disabled. */ }
  }, [items, promoCode, discount, loaded]);
  useEffect(() => {
    const sync = () => { document.body.style.overflow = document.querySelector('dialog[open]') ? 'hidden' : ''; };
    sync();
    const observer = new MutationObserver(sync);
    document.querySelectorAll('dialog').forEach(dialog => observer.observe(dialog, { attributes: true, attributeFilter: ['open'] }));
    return () => { observer.disconnect(); document.body.style.overflow = ''; };
  }, []);

  const openPromo = () => promo.current?.showModal();
  const closeOutside = (event: React.MouseEvent<HTMLDialogElement>) => { if (event.target === event.currentTarget) event.currentTarget.close(); };
  const addItem = (slug: string, quantity = 1) => {
    if (!findProduct(slug)) return;
    setItems(previous => {
      const existing = previous.find(item => item.slug === slug);
      return existing ? previous.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item) : [...previous, { slug, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
    setCompleted(false); setCartMessage(''); cart.current?.showModal();
  };
  const changeQuantity = (slug: string, delta: number) => {
    setItems(previous => previous.map(item => item.slug === slug ? { ...item, quantity: Math.min(99, item.quantity + delta) } : item).filter(item => item.quantity > 0));
    setCompleted(false); setCartMessage('');
  };

  return <StoreContext.Provider value={{ openPromo, addItem }}>
        <div className="announcement"><span>HECHO PARA COMPARTIR. HECHO PARA CELEBRAR.</span><button onClick={openPromo}>Fiestas Patrias · consigue tu 10% OFF <ArrowRight size={14} /></button></div>
    <header className="header">
      <Link href="/" aria-label="Wayu, inicio" className="brand"><img src="/images/logo.png" alt="WAYU" width="600" height="200" /></Link>
      <nav className={menu ? 'nav is-open' : 'nav'} aria-label="Navegación principal">
        <Link onClick={() => setMenu(false)} href="/colecciones/parrilla">Parrilla <ChevronDown size={12}/></Link><Link onClick={() => setMenu(false)} href="/colecciones/cuchillos">Cuchillos y tablas</Link><Link onClick={() => setMenu(false)} href="/colecciones/bar-y-cocktail">Bar & mesa</Link><Link className="nav-promo" href="/productos/set-tabla-cuchillo-tenedor-prm-wayu" onClick={() => setMenu(false)}>Especial Fiestas Patrias <span>●</span></Link>
      </nav>
      <div className="header-actions"><span className="country">PE / PEN</span><button className="bag" aria-label={`Abrir bolsa, ${itemCount} productos`} onClick={() => cart.current?.showModal()}><ShoppingBag size={21}/><span>{itemCount}</span></button><button className="menu-button" aria-label="Abrir menú" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div>
    </header>

    {children}
        <footer><div className="footer-top"><Link href="/" className="brand"><img src="/images/logo.png" alt="WAYU" width="600" height="200"/></Link><p>El fuego nos une.<br/>Los buenos momentos se quedan.</p><Link href="/colecciones">Explorar productos <ArrowUpRight size={17}/></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} · WAYU — PROPUESTA ACADÉMICA</span><span>Imágenes: wayu.com.pe · Promoción ficticia · Sin afiliación comercial</span><span>HECHO CON ORGULLO EN PERÚ <span className="peru-flag">▌▌</span></span></div></footer>
    <PromoDialog dialogRef={promo} state={state} action={action} pending={pending} code={promoCode}/>
    <dialog className="cart-dialog" ref={cart} onClick={closeOutside} aria-labelledby="cart-title">
      <div className="cart-content">
        <div className="cart-heading"><h2 id="cart-title">Tu bolsa <span>({itemCount})</span></h2><button aria-label="Cerrar bolsa" onClick={()=>cart.current?.close()}><X/></button></div>
        {completed ? <div className="order-success"><span className="success-icon"><Check size={28}/></span><div className="eyebrow red">GRACIAS POR COMPARTIR EL FUEGO</div><h2>¡Todo listo<br/>para celebrar!</h2><p>Tu compra simulada de {itemCount} {itemCount === 1 ? 'producto' : 'productos'} se completó.</p><strong className="order-total">{formatMoney(subtotal - savings)}</strong><p>No se ha realizado ningún cobro ni generado un pedido real.</p><button className="button dark" onClick={()=>{setItems([]);setCompleted(false);setCartMessage('');cart.current?.close();}}>Seguir explorando <ArrowRight size={17}/></button></div> : items.length === 0 ? <div className="empty-cart"><ShoppingBag size={45}/><h3>Un buen asado empieza aquí.</h3><p>Tu bolsa aún está vacía.</p><Link href="/colecciones" className="button dark" onClick={()=>cart.current?.close()}>Explorar productos <ArrowRight size={18}/></Link></div> : <>
          {items.map(item => {
            const product = findProduct(item.slug)!;
            return <div className="cart-item" key={item.slug}><Link href={`/productos/${item.slug}`} onClick={()=>cart.current?.close()}><img src={product.images[0].src} alt={product.images[0].alt}/></Link><div className="cart-item-info"><Link href={`/productos/${item.slug}`} onClick={()=>cart.current?.close()}><h3>{product.name}</h3></Link><p>{formatMoney(product.priceInCents)}</p>{item.slug === premiumSlug && <small>Elegible para el cupón de Fiestas Patrias</small>}<div className="cart-item-controls"><div className="quantity"><button aria-label={`Quitar una unidad de ${product.name}`} onClick={()=>changeQuantity(item.slug,-1)}><Minus size={14}/></button><span>{item.quantity}</span><button aria-label={`Añadir una unidad de ${product.name}`} onClick={()=>changeQuantity(item.slug,1)} disabled={item.quantity>=99}><Plus size={14}/></button></div><button className="remove-item" aria-label={`Eliminar ${product.name}`} onClick={()=>{setItems(previous=>previous.filter(line=>line.slug!==item.slug));setCartMessage('');}}><Trash2 size={15}/></button></div></div><span className="cart-line-total">{formatMoney(item.quantity*product.priceInCents)}</span></div>;
          })}
          <form className="coupon-form" onSubmit={async event=>{event.preventDefault();if(!eligibleSubtotal){setCartMessage('Agrega el set de tabla, cuchillo y tenedor PRM para usar este código.');return;}setCartMessage('Verificando tu código…');setDiscount(false);const result=await validateDiscountCode(coupon);if(result.valid){setSavedCode(coupon.trim().toUpperCase());setDiscount(true);setCartMessage('¡10% de descuento aplicado al set PRM!');}else{setCartMessage(result.error || 'No pudimos verificar el código.');}}}><label htmlFor="coupon">¿Tienes un código promocional?</label><div><input id="coupon" value={coupon} onChange={event=>setCoupon(event.target.value)} placeholder="Ingresa tu código" required/><button type="submit">Aplicar</button></div></form>
          <p className="cart-message" role="status">{cartMessage}</p>
          {!promoCode && <button className="cart-get-promo" onClick={()=>{cart.current?.close();openPromo();}}>Conseguir mi código de Fiestas Patrias <ArrowRight size={14}/></button>}
          <div className="totals"><p>Subtotal <span>{formatMoney(subtotal)}</span></p>{savings>0&&<p className="discount">Descuento 10% · Set PRM <span>− {formatMoney(savings)}</span></p>}<p>Envío <span>No aplica en esta demo</span></p><p className="total">Total <span>{formatMoney(subtotal-savings)}</span></p></div>
          <button className="button dark" onClick={()=>setCompleted(true)}>Finalizar compra simulada <ArrowRight size={18}/></button><p className="cart-disclaimer">Proyecto académico · Sin pagos ni pedidos reales.</p>
        </>}
      </div>
    </dialog>
  </StoreContext.Provider>;
}
