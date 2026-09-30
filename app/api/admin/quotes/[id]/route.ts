import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { status } = await req.json();

    const updated = await prisma.quote.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, quote: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao atualizar estado da cotação.' },
      { status: 500 }
    );
  }
}
