import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export const revalidate = 0;

export default async function EditarProdutoPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        category: true,
        brand: true,
      },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    sku: product.sku || '',
    categoryId: product.categoryId,
    brandId: product.brandId || '',
    price: product.price !== null ? product.price : '',
    unit: product.unit || 'un',
    dimensions: product.dimensions || '',
    tileLengthMeters: product.tileLengthMeters ?? '',
    tileWidthMeters: product.tileWidthMeters ?? '',
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    isPerSquareMeter: product.isPerSquareMeter,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    isAvailable: product.isAvailable,
    images: product.images.map((img) => ({
      imageUrl: img.imageUrl,
      isPrimary: img.isPrimary,
      altText: img.altText || undefined,
      orderIndex: img.orderIndex,
    })),
  };

  return (
    <ProductForm
      initialData={initialData}
      categories={categories}
      brands={brands}
      isEditing={true}
    />
  );
}
