import {existsSync} from 'node:fs';
import nodemailer from 'nodemailer';
if(existsSync('.env.local'))process.loadEnvFile('.env.local');
async function main(){
  const smtpOnly=process.argv.includes('--smtp-only');
  const names=smtpOnly?['SMTP_USER','SMTP_APP_PASSWORD']:['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','SMTP_USER','SMTP_APP_PASSWORD','APP_URL'];
  const missing=names.filter(n=>!process.env[n]?.trim());
  if(missing.length)throw new Error(`Falta configurar: ${missing.join(', ')}`);
  console.log('Variables requeridas presentes. No se muestran claves ni contraseñas.');
  if(!smtpOnly){
    const url=new URL(process.env.SUPABASE_URL),key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(url.protocol!=='https:')throw new Error('SUPABASE_URL debe usar HTTPS');
    if(!key.startsWith('sb_secret_')){try{if(JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString()).role!=='service_role')throw new Error();}catch{throw new Error('Se requiere una clave de servidor de Supabase');}}
    if(process.argv.includes('--remote')){
      const headers={apikey:key,'Content-Type':'application/json'};if(!key.startsWith('sb_secret_'))headers.Authorization=`Bearer ${key}`;
      try{const r=await fetch(new URL('/rest/v1/rpc/validate_wayu_discount',url),{method:'POST',headers,body:JSON.stringify({p_code:'CONFIGURATION_CHECK_NOT_A_COUPON'}),signal:AbortSignal.timeout(15000)});if(!r.ok||await r.json()!==false)throw new Error();}catch{throw new Error('No se pudo verificar la conexión o la migración de Supabase');}
      console.log('Supabase responde y la validación del cupón existe.');
    }
  }
  if(smtpOnly||process.argv.includes('--remote')){
    const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_APP_PASSWORD.replace(/\s/g,'')},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:20000});
    try{await transport.verify();}catch{throw new Error('No se pudo autenticar con Gmail. Revisa la contraseña de aplicación, la verificación en dos pasos y la conexión de red.');}
    console.log('Gmail SMTP aceptó la autenticación. No se envió ningún correo.');
  }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
