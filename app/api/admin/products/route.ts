import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getTileMeasurements(body: Record<string, unknown>) {
  const tileLengthMeters = body.tileLengthMeters == null || body.tileLengthMeters === ''
    ? null
    : Number(body.tileLengthMeters);
  const tileWidthMeters = body.tileWidthMeters == null || body.tileWidthMeters === ''
    ? null
    : Number(body.tileWidthMeters);
  const isTile = Boolean(body.isPerSquareMeter);
  const tileAreaSquareMeters = isTile && tileLengthMeters && tileWidthMeters
    ? Number((tileLengthMeters * tileWidthMeters).toFixed(4))
    : null;
  const dimensions = isTile && tileLengthMeters && tileWidthMeters
    ? `${tileLengthMeters.toFixed(2)} m x ${tileWidthMeters.toFixed(2)} m`
    : typeof body.dimensions === 'string' ? body.dimensions : null;

  return { tileLengthMeters, tileWidthMeters, tileAreaSquareMeters, dimensions };
}

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const products = await prisma.product.findMany({
    include: { category: true, brand: true, images: { orderBy: { orderIndex: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.name || !body.categoryId) {
      return NextResponse.json({ error: 'Nome e categoria são obrigatórios.' }, { status: 400 });
    }

    const slugBase = slugify(body.name);
    const slug = `${slugBase}-${Date.now().toString(36)}`;
    const tileMeasurements = getTileMeasurements(body);

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug,
        sku: body.sku ? body.sku.trim() : null,
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        price: body.price === '' || body.price == null ? null : Number(body.price),
        unit: body.unit || 'un',
        isPerSquareMeter: Boolean(body.isPerSquareMeter),
        isAvailable: body.isAvailable !== false,
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive !== false,
        dimensions: tileMeasurements.dimensions,
        tileLengthMeters: tileMeasurements.tileLengthMeters,
        tileWidthMeters: tileMeasurements.tileWidthMeters,
        tileAreaSquareMeters: tileMeasurements.tileAreaSquareMeters,
        shortDescription: body.shortDescription || null,
        description: body.description || null,
        technicalSpecs: body.technicalSpecs || null,
        images: body.images?.length
          ? {
              create: body.images.map((image: { imageUrl: string; isPrimary?: boolean; altText?: string }, index: number) => ({
                imageUrl: image.imageUrl,
                isPrimary: image.isPrimary ?? index === 0,
                orderIndex: index,
                altText: image.altText || null,
              })),
            }
          : undefined,
      },
      include: { images: true, category: true, brand: true },
    });

    // Invalidate caches everywhere
    revalidatePath('/', 'layout');
    revalidatePath('/produtos');
    revalidatePath('/categorias');
    revalidatePath('/api/navigation');

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar produto.' }, { status: 500 });
  }
}
