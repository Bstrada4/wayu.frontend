'use server';
import { parseRegistration, PROMOTION } from './lib/promotion';
import { createPromotionRpc, createRegistrationDependencies } from './lib/registration-runtime';
import { registerPromotion, type RegistrationResult } from './lib/registration-service';
export type PromoState = RegistrationResult;
export async function unlockPromo(_: PromoState, form: FormData): Promise<PromoState> {
  const parsed = parseRegistration(form);
  if (parsed.error) return { error: parsed.error };
  let dependencies;
  try { dependencies = createRegistrationDependencies(); }
  catch { return { error: 'El registro aún no está disponible. Estamos terminando la conexión de la base de datos y el correo. Inténtalo más tarde.' }; }
  return registerPromotion(parsed.value!, dependencies);
}
export async function validateDiscountCode(code:string):Promise<{valid:boolean;error?:string}> {
  const normalized=code.trim().toUpperCase();
  if(!PROMOTION.codePattern.test(normalized))return {valid:false,error:'Código no válido. Regístrate para recibir tu código personal.'};
  try{const valid=await createPromotionRpc()<boolean>('validate_wayu_discount',{p_code:normalized});return valid?{valid:true}:{valid:false,error:'El código no está activo o no existe. Revisa el correo de tu registro.'};}
  catch{return {valid:false,error:'No pudimos verificar el código. Inténtalo de nuevo en unos minutos.'};}
}
