import 'server-only';
import nodemailer from 'nodemailer';
import type { RegistrationDependencies } from './registration-service';
function required(name:string){const value=process.env[name]?.trim();if(!value)throw new Error(`Missing server configuration: ${name}`);return value;}
export function createPromotionRpc():RegistrationDependencies['rpc'] {
  const url=new URL(required('SUPABASE_URL'));
  if(url.protocol!=='https:')throw new Error('Supabase requires HTTPS');
  const key=required('SUPABASE_SERVICE_ROLE_KEY');
  if(!key.startsWith('sb_secret_')){try{const p=JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString());if(p.role!=='service_role')throw new Error('Invalid role');}catch{throw new Error('A server-only Supabase service role key is required');}}
  return async<T,>(name:string,args:Record<string,unknown>):Promise<T>=>{
    const headers:Record<string,string>={apikey:key,'Content-Type':'application/json'};
    if(!key.startsWith('sb_secret_'))headers.Authorization=`Bearer ${key}`;
    const response=await fetch(new URL(`/rest/v1/rpc/${name}`,url),{method:'POST',headers,body:JSON.stringify(args),cache:'no-store',signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error(`Supabase RPC failed (${response.status})`);
    return await response.json() as T;
  };
}
export function createRegistrationDependencies():RegistrationDependencies {
  const rpc=createPromotionRpc(),user=required('SMTP_USER'),pass=required('SMTP_APP_PASSWORD').replace(/\s/g,''),site=new URL(required('APP_URL'));
  if(!['http:','https:'].includes(site.protocol)||site.username||site.password)throw new Error('Invalid public site URL');
  const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user,pass},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000});
  return {rpc,siteUrl:site.origin,async sendMail(mail){const sent=await transport.sendMail({from:{name:'WAYU · Campaña académica',address:user},replyTo:user,...mail,disableFileAccess:true,disableUrlAccess:true});if(!sent.accepted?.length||sent.rejected?.length)throw new Error('SMTP did not accept recipient');return sent.messageId;},report(event){console.error(`[wayu-promotion] ${event}`);}};
}
