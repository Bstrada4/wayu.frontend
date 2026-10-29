import { premiumProduct } from './product';

export type Product = {
  slug: string;
  name: string;
  category: string;
  priceInCents: number;
  description: string;
  features: readonly string[];
  images: readonly { src: string; alt: string }[];
  badge?: string;
};

export const categories = [
  { slug: 'parrilla', name: 'Parrilla y accesorios', title: 'Alrededor del fuego.', description: 'Parrillas y accesorios para disfrutar cada encuentro, desde la primera brasa hasta el último corte.', image: '/images/hero.jpg' },
  { slug: 'cuchillos', name: 'Cuchillos y tablas', title: 'Un corte por encima.', description: 'Herramientas para preparar, cortar y servir. Descubre el set premium de nuestra campaña de Fiestas Patrias.', image: '/images/premium-prm-1.jpg' },
  { slug: 'bar-y-cocktail', name: 'Bar y mesa', title: 'Por los buenos momentos.', description: 'La sobremesa también tiene sus esenciales. Piezas para servir y brindar en buena compañía.', image: '/images/bar.jpg' },
] as const;

export const products: Product[] = [
  { ...premiumProduct, slug: 'set-tabla-cuchillo-tenedor-prm-wayu', category: 'cuchillos', badge: '10% OFF CON TU CÓDIGO' },
  { slug: 'set-cuero-premium-wayu', name: 'Set Cuero PU Wayu', category: 'cuchillos', priceInCents: 34990, description: 'Un set de herramientas para parrilla que puedes transportar en su estuche de cuero PU. Un compañero para preparar y compartir tus asados.', features: ['Cuchillo y hacha Hammer', 'Espada afiladora y pinza', 'Garra de oso y abridor de vino', 'Estuche de cuero PU'], images: [{ src: '/images/premium.jpg', alt: 'Set de herramientas con estuche de cuero PU Wayu' }, { src: '/images/premium-life.jpg', alt: 'Herramientas del set de cuero Wayu' }, { src: '/images/premium-detail.jpg', alt: 'Detalle del estuche de cuero PU' }] },
  { slug: 'parrilla-a-carbon-con-spiedo-wayu', name: 'Parrilla a Carbón con Spiedo Wayu', category: 'parrilla', priceInCents: 99990, description: 'Una parrilla para cocinar al aire libre con spiedo, rejilla Iron Cast y mesas auxiliares. Prepara la reunión y deja que el fuego haga su parte.', features: ['Medidas: 140 × 106 × 67 cm', 'Spiedo y motor eléctrico a pila D (pila no incluida)', 'Rejilla Iron Cast y termómetro', 'Ruedas, bandeja de cenizas y dos mesas auxiliares', 'Usar únicamente en exteriores'], images: [{ src: '/images/parrilla-a-carbon-con-spiedo-wayu-1.jpg', alt: 'Parrilla a carbón con spiedo Wayu' }, { src: '/images/parrilla-a-carbon-con-spiedo-wayu-2.jpg', alt: 'Otra vista de la parrilla Wayu' }] },
  { slug: 'fogon', name: 'Fogón Wayu', category: 'parrilla', priceInCents: 66990, description: 'Reúne a los tuyos alrededor de un fogón de acero con rejilla para asado, patas plegables y funda para transportarlo.', features: ['Medidas: 57,5 × 55 × 57,5 cm', 'Diámetro: 55 cm', 'Rejilla de acero inoxidable', 'Tres patas plegables y manillas de transporte', 'Incluye funda'], images: [{ src: '/images/fogon-1.jpg', alt: 'Fogón de acero Wayu' }, { src: '/images/fogon-2.jpg', alt: 'Detalle del fogón Wayu' }] },
  { slug: 'set-parrillero-3-piezas-wayu', name: 'Set Parrillero de 3 Piezas Wayu', category: 'parrilla', priceInCents: 6990, description: 'Un conjunto compacto de utensilios para acompañar tus preparaciones a la parrilla, con mangos ergonómicos y piezas de acero inoxidable.', features: ['Set de tres piezas', 'Acero inoxidable', 'Mangos ergonómicos', 'Diseñado para uso en parrilla'], images: [{ src: '/images/set-parrillero-3-piezas-wayu-1.jpg', alt: 'Set parrillero de tres piezas Wayu' }, { src: '/images/set-parrillero-3-piezas-wayu-2.jpg', alt: 'Detalle del set parrillero Wayu' }] },
  { slug: 'delantal-bbq-wayu', name: 'Delantal BBQ Wayu', category: 'parrilla', priceInCents: 4290, description: 'Prepara tu próximo asado con un delantal de tela resistente, correas ajustables y bolsillos para tener tus utensilios a mano.', features: ['60% algodón y 40% poliéster', 'Correas ajustables', 'Bolsillos funcionales', 'Tela fácil de limpiar'], images: [{ src: '/images/delantal-bbq-wayu-1.jpg', alt: 'Delantal BBQ Wayu' }, { src: '/images/delantal-bbq-wayu-2.jpg', alt: 'Detalle del delantal BBQ' }] },
  { slug: 'wayu-beer-mug-stainless-steel-750ml', name: 'Jarra de Acero Inoxidable Wayu · 750 ml', category: 'bar-y-cocktail', priceInCents: 3990, description: 'Una jarra de acero inoxidable con acabado negro y asa para acompañar los brindis de la sobremesa.', features: ['Capacidad de 750 ml', 'Acero inoxidable', 'Acabado negro', 'Asa para un agarre cómodo'], images: [{ src: '/images/wayu-beer-mug-stainless-steel-750ml-1.jpg', alt: 'Jarra de acero inoxidable Wayu de 750 ml' }, { src: '/images/wayu-beer-mug-stainless-steel-750ml-2.jpg', alt: 'Otra vista de la jarra Wayu' }] },
  { slug: 'set-aperitivo-wayu', name: 'Set Aperitivo Wayu', category: 'bar-y-cocktail', priceInCents: 6490, description: 'Sirve quesos, tapas y tus aperitivos favoritos en una presentación pensada para compartir al centro de la mesa.', features: ['Set para servir aperitivos', 'Tabla de 33 × 20 × 1,8 cm', 'Para quesos, tapas y otros bocados', 'Presentación para compartir'], images: [{ src: '/images/set-aperitivo-wayu-1.jpg', alt: 'Set de aperitivo Wayu con tabla' }, { src: '/images/set-aperitivo-wayu-2.jpg', alt: 'Detalle del set de aperitivo' }] },
];

export const premiumSlug = 'set-tabla-cuchillo-tenedor-prm-wayu';
export const findProduct = (slug: string) => products.find(product => product.slug === slug);
export const formatMoney = (cents: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
