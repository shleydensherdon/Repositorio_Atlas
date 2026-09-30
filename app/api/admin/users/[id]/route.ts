import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin, hashPassword } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const currentAdmin = await getAuthenticatedAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updateData: any = {};

    if (body.name) updateData.name = body.name.trim();
    if (body.email) updateData.email = body.email.toLowerCase().trim();
    if (body.role) updateData.role = body.role;

    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: 'A nova palavra-passe deve ter no mínimo 6 caracteres.' },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(body.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar dados do administrador.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const currentAdmin = await getAuthenticatedAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    // Check if user is trying to delete themselves
    if (currentAdmin.id === params.id) {
      return NextResponse.json(
        { error: 'Não é possível remover a sua própria conta ativa enquanto estiver ligado.' },
        { status: 400 }
      );
    }

    // Check if there is at least one admin left
    const totalUsers = await prisma.user.count();
    if (totalUsers <= 1) {
      return NextResponse.json(
        { error: 'O sistema necessita de manter pelo menos um administrador ativo.' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao remover administrador.' },
      { status: 500 }
    );
  }
}
