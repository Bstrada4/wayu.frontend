export const PROMOTION = { codePrefix:'WAYU10-', codePattern:/^WAYU10-[A-F0-9]{16}$/, discountPercent:10, campaign:'fiestas-patrias-prm-10-v1', consentVersion:'promo-v1-2026-11-01', productSlug:'set-tabla-cuchillo-tenedor-prm-wayu' } as const;
export type RegistrationInput = { name:string; phone:string; email:string };
export type ParsedRegistration = { value:RegistrationInput; error?:never } | { error:string; value?:never };
export function parseRegistration(form:FormData):ParsedRegistration {
  const name=String(form.get('name')||'').trim().replace(/\s+/g,' ');
  const phone=String(form.get('phone')||'').replace(/[\s()-]/g,'');
  const email=String(form.get('email')||'').trim().toLowerCase();
  if(String(form.get('website')||'')) return {error:'No pudimos procesar el registro. Inténtalo de nuevo.'};
  if(name.length<5||name.length>100||name.split(' ').length<2||/[\x00-\x1f\x7f]/.test(name)) return {error:'Escribe tu nombre y al menos un apellido.'};
  if(!/^(?:\+?51)?9\d{8}$/.test(phone)) return {error:'Ingresa un celular peruano válido de 9 dígitos.'};
  if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||/[\x00-\x1f\x7f]/.test(email)) return {error:'Revisa tu correo electrónico.'};
  if(form.get('consent')!=='on') return {error:'Acepta el registro de tus datos y el envío del código por correo.'};
  return {value:{name,phone:`+51${phone.slice(-9)}`,email}};
}
