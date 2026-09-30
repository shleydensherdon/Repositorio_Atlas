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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    return NextResponse.json({ error: 'Categoria não encontrada.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, category });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.slug !== undefined) updateData.slug = body.slug ? body.slug.trim() : slugify(body.name || '');
    if (body.description !== undefined) updateData.description = body.description ? body.description.trim() : null;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
    if (body.orderIndex !== undefined) updateData.orderIndex = Number(body.orderIndex);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const category = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
      include: { _count: { select: { products: true } } },
    });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/categorias');
    revalidatePath('/produtos');
    revalidatePath('/api/navigation');

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao atualizar categoria.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const reassignTo = url.searchParams.get('reassignTo');

    const count = await prisma.product.count({ where: { categoryId: params.id } });

    if (count > 0 && !reassignTo) {
      return NextResponse.json({
        error: `Esta categoria possui ${count} produto(s) associado(s). É necessário reatribuir ou gerir os produtos vinculados antes de remover.`,
        productCount: count,
        requiresReassign: true,
      }, { status: 409 });
    }

    if (count > 0 && reassignTo) {
      await prisma.product.updateMany({
        where: { categoryId: params.id },
        data: { categoryId: reassignTo },
      });
    }

    await prisma.category.delete({ where: { id: params.id } });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/categorias');
    revalidatePath('/produtos');
    revalidatePath('/api/navigation');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Não foi possível remover a categoria.' }, { status: 500 });
  }
}
