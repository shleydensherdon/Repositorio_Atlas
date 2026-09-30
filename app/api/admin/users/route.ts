import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin, hashPassword } from '@/lib/auth';

export async function GET() {
  const currentAdmin = await getAuthenticatedAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, users, currentUserId: currentAdmin.id });
}

export async function POST(req: NextRequest) {
  const currentAdmin = await getAuthenticatedAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: 'Nome, e-mail e palavra-passe são obrigatórios.' },
        { status: 400 }
      );
    }

    const emailTrimmed = body.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: emailTrimmed },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Já existe um administrador cadastrado com este e-mail.' },
        { status: 409 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'A palavra-passe deve conter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(body.password);

    const newUser = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: emailTrimmed,
        passwordHash,
        role: body.role || 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar administrador.' },
      { status: 500 }
    );
  }
}
