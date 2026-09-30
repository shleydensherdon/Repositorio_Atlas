import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { orderIndex: 'asc' } },
      products: { include: { product: true } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, project });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await req.json();

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.date !== undefined) updateData.date = body.date ? body.date.trim() : null;
    if (body.location !== undefined) updateData.location = body.location ? body.location.trim() : null;
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.description !== undefined) updateData.description = body.description ? body.description.trim() : null;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage || null;
    if (body.gallery !== undefined) updateData.gallery = body.gallery ? JSON.stringify(body.gallery) : null;
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.orderIndex !== undefined) updateData.orderIndex = Number(body.orderIndex);

    if (Array.isArray(body.images) && body.images.length > 0) {
      const primary = body.images.find((i: any) => i.isPrimary) || body.images[0];
      if (primary && (!updateData.coverImage || updateData.coverImage === '')) {
        updateData.coverImage = primary.imageUrl;
      }
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    });

    if (Array.isArray(body.images)) {
      await prisma.projectImage.deleteMany({ where: { projectId: params.id } });
      if (body.images.length > 0) {
        await prisma.projectImage.createMany({
          data: body.images.map((img: { imageUrl: string; isPrimary?: boolean; altText?: string }, index: number) => ({
            projectId: params.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary ?? index === 0,
            orderIndex: index,
            altText: img.altText || null,
          })),
        });
      }
    }

    if (Array.isArray(body.productIds)) {
      await prisma.projectProduct.deleteMany({ where: { projectId: params.id } });
      if (body.productIds.length > 0) {
        await prisma.projectProduct.createMany({
          data: body.productIds.map((productId: string) => ({
            projectId: params.id,
            productId,
          })),
        });
      }
    }

    const updated = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { orderIndex: 'asc' } },
        products: { include: { product: true } },
      },
    });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/projetos');

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar projeto.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    await prisma.project.delete({ where: { id: params.id } });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/projetos');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Não foi possível remover o projeto.' }, { status: 500 });
  }
}
