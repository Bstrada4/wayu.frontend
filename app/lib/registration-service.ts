import { randomBytes } from 'node:crypto';
import { buildDiscountEmail } from './discount-email';
import { PROMOTION,type RegistrationInput } from './promotion';
export type RegistrationResult={code?:string;error?:string;message?:string;emailStatus?:'sent'|'recent'};
type Reservation={registration_id:string;recipient_name:string|null;recipient_email:string|null;issued_code:string|null;delivery_token:string|null;outcome:'ready'|'busy'|'cooldown'|'rate_limited'|'inactive'};
export type RegistrationDependencies={rpc:<T>(name:string,args:Record<string,unknown>)=>Promise<T>;sendMail:(mail:{to:string;subject:string;text:string;html:string})=>Promise<string>;siteUrl:string;generateCode?:()=>string;report?:(event:string)=>void};
export async function registerPromotion(input:RegistrationInput,deps:RegistrationDependencies):Promise<RegistrationResult> {
  const report=deps.report||(()=>{});
  let row:Reservation;
  try {
    const rows=await deps.rpc<Reservation[]>('register_wayu_promotion',{p_full_name:input.name,p_phone:input.phone,p_email:input.email,p_discount_code:deps.generateCode?.()||`${PROMOTION.codePrefix}${randomBytes(8).toString('hex').toUpperCase()}`});
    if(!rows[0])throw new Error('No reservation');row=rows[0];
  }catch{report('registration_storage_failed');return {error:'No pudimos guardar tu registro. Inténtalo nuevamente en unos minutos.'};}
  if(row.outcome==='cooldown')return {emailStatus:'recent',message:'Si este correo ya fue registrado, el código está en tu bandeja de entrada. Revisa también spam. Puedes solicitar otro envío después de un minuto.'};
  if(row.outcome==='busy')return {error:'Estamos procesando un envío para este correo. Espera dos minutos antes de intentarlo de nuevo.'};
  if(row.outcome==='rate_limited')return {error:'Se alcanzó el límite temporal de envíos. Inténtalo más tarde.'};
  if(row.outcome==='inactive')return {error:'Este registro no tiene una promoción activa. Escríbenos para recibir ayuda.'};
  if(!row.recipient_name||!row.recipient_email||!row.issued_code||!row.delivery_token)return {error:'No pudimos preparar tu código. Inténtalo más tarde.'};
  const email=buildDiscountEmail({name:row.recipient_name,code:row.issued_code,siteUrl:deps.siteUrl});
  let messageId:string;
  try{messageId=await deps.sendMail({to:row.recipient_email,...email});}
  catch{
    report('registration_email_failed');
    try{await deps.rpc('complete_wayu_promotion_email',{p_registration_id:row.registration_id,p_delivery_token:row.delivery_token,p_sent:false,p_message_id:null,p_error:'smtp_delivery_failed'});}catch{report('registration_email_status_failed');}
    return {error:'Guardamos tu registro, pero no pudimos enviar el correo. Intenta registrarte de nuevo más tarde: conservaremos tu mismo código.'};
  }
  try{const updated=await deps.rpc<boolean>('complete_wayu_promotion_email',{p_registration_id:row.registration_id,p_delivery_token:row.delivery_token,p_sent:true,p_message_id:messageId,p_error:null});if(!updated)report('registration_email_status_failed');}catch{report('registration_email_status_failed');}
  return {code:row.issued_code,emailStatus:'sent',message:'Enviamos tu código al correo con el que te registraste. Revisa también la carpeta de spam.'};
}
