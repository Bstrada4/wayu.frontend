'use client';
import Link from 'next/link';
import { useEffect,useState,type RefObject } from 'react';
import { ArrowRight,Check,Copy,Mail,ShieldCheck,X } from 'lucide-react';
import { premiumSlug } from './catalog';
import type { PromoState } from './actions';
type Props={dialogRef:RefObject<HTMLDialogElement|null>;state:PromoState;action:(form:FormData)=>void;pending:boolean;code:string};
export default function PromoDialog({dialogRef,state,action,pending,code}:Props) {
  const [copied,setCopied]=useState(false),[showForm,setShowForm]=useState(false);
  useEffect(()=>{setShowForm(false);setCopied(false);},[state]);
  const success=!showForm&&(Boolean(code)||state.emailStatus==='recent');
  return <dialog className="promo-dialog" ref={dialogRef} aria-labelledby="promo-title" onClick={e=>{if(e.target===e.currentTarget)e.currentTarget.close();}}><div className="promo-layout">
    <button className="close" aria-label="Cerrar promoción" onClick={()=>dialogRef.current?.close()}><X size={21}/></button>
    <div className="flyer"><img src="/images/modal.png" alt="Por estas Fiestas obtén 10% de descuento. Descubre el Set Parrillero PRM Wayu" width="1300" height="1800"/></div>
    <div className="promo-form">{success?<div className="success">
      <span className="success-icon">{code?<Check size={27}/>:<Mail size={27}/>}</span><div className="eyebrow red">QUE EMPIECE LA CELEBRACIÓN</div>
      <h2 id="promo-title">{code?<>Tu registro está listo.<br/>El asado te espera.</>:<>Revisa tu<br/>correo electrónico.</>}</h2>
      <p role="status">{state.message||'Tu código personal del 10% para el set PRM está listo. También puedes encontrarlo en el correo de tu registro.'}</p>
      {code&&<><div className="coupon"><strong>{code}</strong><button aria-label="Copiar código promocional" onClick={async()=>{try{await navigator.clipboard.writeText(code);setCopied(true);}catch{setCopied(false);}}}>{copied?<Check size={19}/>:<Copy size={19}/>}</button></div><span role="status" className="copy-status">{copied?'¡Código copiado!':'Tu código personal de Fiestas Patrias'}</span></>}
      <Link className="button dark" href={`/productos/${premiumSlug}`} onClick={()=>dialogRef.current?.close()}>Descubrir mi set premium <ArrowRight size={17}/></Link>
      {!code&&<button className="registration-retry" onClick={()=>setShowForm(true)}>Volver al formulario</button>}
      <small>Compra académica simulada. Código sin validez en la tienda oficial de Wayu.</small>
    </div>:<>
      <div className="eyebrow red">REGÍSTRATE Y CELEBRA LO NUESTRO</div><h2 id="promo-title">Tu próximo asado<br/>empieza con un <em>regalo.</em></h2>
      <p>Regístrate para recibir por correo tu código personal de <strong>10% OFF</strong> en el Set Premium Wayu de tabla, cuchillo y tenedor.</p>
      <form action={action}>
        <label htmlFor="full-name">Nombre completo<input id="full-name" name="name" placeholder="Tu nombre y apellido" autoComplete="name" minLength={5} maxLength={100} required/></label>
        <label htmlFor="phone">Celular<div className="phone-input"><span>PE +51</span><input id="phone" name="phone" type="tel" inputMode="tel" placeholder="987 654 321" autoComplete="tel-national" maxLength={18} required/></div></label>
        <label htmlFor="email">Correo electrónico<input id="email" name="email" type="email" placeholder="hola@tucorreo.com" autoComplete="email" maxLength={254} required/></label>
        <div className="registration-trap" aria-hidden="true"><label htmlFor="registration-website">Dejar este campo vacío<input id="registration-website" name="website" type="text" tabIndex={-1} autoComplete="off"/></label></div>
        <label className="consent"><input type="checkbox" name="consent" required/><span>Acepto registrar mi nombre, celular y correo en la base de datos de esta campaña y recibir mi código por correo. <Link href="/privacidad" onClick={()=>dialogRef.current?.close()}>Ver uso de mis datos.</Link></span></label>
        {state.error&&<p className="form-error" role="alert">{state.error}</p>}
        <button className="button dark" disabled={pending} type="submit">{pending?'Guardando y enviando…':'Registrarme y recibir mi código'}<ArrowRight size={18}/></button>
      </form><span className="promo-footnote"><ShieldCheck size={13}/> Registro para esta campaña · Compra académica simulada</span>
    </>}</div>
  </div></dialog>;
}
