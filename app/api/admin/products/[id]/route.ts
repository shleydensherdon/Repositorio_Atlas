import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth';

function getTileMeasurements(body: Record<string, unknown>) {
  const tileLengthMeters = body.tileLengthMeters == null || body.tileLengthMeters === ''
    ? null
    : Number(body.tileLengthMeters);
  const tileWidthMeters = body.tileWidthMeters == null || body.tileWidthMeters === ''
    ? null
    : Number(body.tileWidthMeters);
  const isTile = body.isPerSquareMeter === true;
  const tileAreaSquareMeters = isTile && tileLengthMeters && tileWidthMeters
    ? Number((tileLengthMeters * tileWidthMeters).toFixed(4))
    : null;
  const dimensions = isTile && tileLengthMeters && tileWidthMeters
    ? `${tileLengthMeters.toFixed(2)} m x ${tileWidthMeters.toFixed(2)} m`
    : typeof body.dimensions === 'string' ? body.dimensions : null;

  return { tileLengthMeters, tileWidthMeters, tileAreaSquareMeters, dimensions };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      brand: true,
      images: { orderBy: { orderIndex: 'asc' } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await req.json();
    const tileMeasurements = getTileMeasurements(body);

    const updateData: any = {};
    if (body.name !== undefined) {
      updateData.name = body.name.trim();
      if (body.slug !== undefined) {
        updateData.slug = body.slug;
      }
    }
    if (body.sku !== undefined) updateData.sku = body.sku ? body.sku.trim() : null;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.brandId !== undefined) updateData.brandId = body.brandId || null;
    if (body.price !== undefined) updateData.price = body.price === '' || body.price === null ? null : Number(body.price);
    if (body.unit !== undefined) updateData.unit = body.unit || 'un';
    if (body.isPerSquareMeter !== undefined) updateData.isPerSquareMeter = Boolean(body.isPerSquareMeter);
    if (body.isAvailable !== undefined) updateData.isAvailable = Boolean(body.isAvailable);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.dimensions !== undefined || body.tileLengthMeters !== undefined || body.tileWidthMeters !== undefined || body.isPerSquareMeter !== undefined) {
      updateData.dimensions = tileMeasurements.dimensions;
      updateData.tileLengthMeters = tileMeasurements.tileLengthMeters;
      updateData.tileWidthMeters = tileMeasurements.tileWidthMeters;
      updateData.tileAreaSquareMeters = tileMeasurements.tileAreaSquareMeters;
    }
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription || null;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.technicalSpecs !== undefined) updateData.technicalSpecs = body.technicalSpecs || null;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { images: true, category: true, brand: true },
    });

    if (Array.isArray(body.images)) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      if (body.images.length > 0) {
        await prisma.productImage.createMany({
          data: body.images.map((img: { imageUrl: string; isPrimary?: boolean; altText?: string }, index: number) => ({
            productId: params.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary ?? index === 0,
            orderIndex: index,
            altText: img.altText || null,
          })),
        });
      }
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { orderIndex: 'asc' } }, category: true, brand: true },
    });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/produtos');
    revalidatePath('/categorias');
    revalidatePath('/api/navigation');

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar produto.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    await prisma.product.delete({ where: { id: params.id } });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/produtos');
    revalidatePath('/categorias');
    revalidatePath('/api/navigation');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Não foi possível remover o produto.' }, { status: 500 });
  }
}
