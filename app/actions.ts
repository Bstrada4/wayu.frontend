'use server';
export type PromoState = { code?: string; error?: string };
export async function unlockPromo(_: PromoState, form: FormData): Promise<PromoState> {
  const name = String(form.get('name') || '').trim();
  const phone = String(form.get('phone') || '').replace(/[\s()-]/g, '');
  const email = String(form.get('email') || '').trim();
  if (name.length < 5 || name.length > 100 || name.split(/\s+/).length < 2) return { error: 'Escribe tu nombre y al menos un apellido.' };
  if (!/^(?:\+?51)?9\d{8}$/.test(phone)) return { error: 'Ingresa un celular peruano válido de 9 dígitos.' };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Revisa tu correo electrónico.' };
  if (form.get('consent') !== 'on') return { error: 'Acepta las condiciones de la promoción académica.' };
  // Academic demo: personal data is validated and discarded, never stored or sent.
  return { code: 'WAYUPERU10' };
}
