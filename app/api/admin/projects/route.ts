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

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.title) return NextResponse.json({ error: 'O nome do projeto é obrigatório.' }, { status: 400 });

    const cover = body.coverImage || body.images?.[0]?.imageUrl || null;

    const project = await prisma.project.create({
      data: {
        title: body.title.trim(),
        slug: `${slugify(body.title)}-${Date.now().toString(36)}`,
        date: body.date ? body.date.trim() : null,
        location: body.location ? body.location.trim() : null,
        category: body.category || null,
        description: body.description ? body.description.trim() : null,
        coverImage: cover,
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive !== false,
        orderIndex: Number(body.orderIndex || 0),
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
        products: body.productIds?.length
          ? {
              create: body.productIds.map((productId: string) => ({ productId })),
            }
          : undefined,
      },
      include: { images: true, products: { include: { product: true } } },
    });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/projetos');

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar projeto.' }, { status: 500 });
  }
}
