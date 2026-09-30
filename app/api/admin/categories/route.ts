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
    const category = await prisma.category.create({
      data: {
        name: body.name.trim(),
        slug: body.slug ? body.slug.trim() : slugify(body.name),
        description: body.description ? body.description.trim() : null,
        imageUrl: body.imageUrl || null,
        orderIndex: Number(body.orderIndex || 0),
        isActive: body.isActive !== false,
      },
    });

    // Invalidate caches
    revalidatePath('/', 'layout');
    revalidatePath('/categorias');
    revalidatePath('/produtos');
    revalidatePath('/api/navigation');

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao criar categoria.' }, { status: 500 });
  }
}
