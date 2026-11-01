// Opt-in integration test. Sends one real coupon email to the configured owner.
// Run with: node --env-file=.env.local --conditions=react-server --import tsx scripts/test-registration-live.ts --send-to-owner
import { parseRegistration } from '../app/lib/promotion';
import { createRegistrationDependencies } from '../app/lib/registration-runtime';
import { registerPromotion } from '../app/lib/registration-service';

async function main() {
  if (!process.argv.includes('--send-to-owner')) throw new Error('This test requires --send-to-owner because it sends a real email.');
  if (process.env.SMTP_USER?.trim().toLowerCase() !== 'lessdlcc@gmail.com') throw new Error('The test can only send to the owner address authorized for this task.');
  const form = new FormData();
  form.set('name', 'Prueba de registro WAYU');
  form.set('phone', '999999999');
  form.set('email', 'lessdlcc@gmail.com');
  form.set('consent', 'on');
  const parsed = parseRegistration(form);
  if (!parsed.value) throw new Error(parsed.error);
  const dependencies = createRegistrationDependencies();
  const result = await registerPromotion(parsed.value, dependencies);
  if (result.error) throw new Error(result.error);
  if (!result.code || result.emailStatus !== 'sent') throw new Error('The request was limited or recently sent; no new email was confirmed.');
  const valid = await dependencies.rpc<boolean>('validate_wayu_discount', { p_code: result.code });
  if (!valid) throw new Error('Email accepted but coupon validation failed.');
  console.log(JSON.stringify({ registrationSaved: true, smtpAccepted: true, couponValid: true, recipient: 'lessdlcc@gmail.com', testName: 'Prueba de registro WAYU' }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
