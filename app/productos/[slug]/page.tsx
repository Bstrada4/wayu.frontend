import { notFound } from 'next/navigation';
import { findProduct } from '../../catalog';
import ProductDetail from '../../product-detail';
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  return { title: `${product?.name || 'Producto'} | Wayu`, description: product?.description };
}
export default async function ProductPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  return <ProductDetail key={slug} product={product}/>;
}
