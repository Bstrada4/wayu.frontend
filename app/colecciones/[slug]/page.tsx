import { notFound } from 'next/navigation';
import { categories } from '../../catalog';
import CatalogView from '../../catalog-view';
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const category = categories.find(item=>item.slug===slug);
  return { title: `${category?.name || 'Colección'} | Wayu`, description: category?.description };
}
export default async function CategoryPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  if (!categories.some(category=>category.slug===slug)) notFound();
  return <CatalogView key={slug} categorySlug={slug}/>;
}
