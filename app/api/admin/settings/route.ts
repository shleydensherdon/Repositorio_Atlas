import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const body = await req.json();
  const setting = await prisma.setting.upsert({ where: { id: 'singleton' }, update: { companyName: body.companyName, whatsappNumber: body.whatsappNumber, contactEmail: body.contactEmail, contactPhone: body.contactPhone, address: body.address }, create: { id: 'singleton', companyName: body.companyName || 'Atlas Materials', whatsappNumber: body.whatsappNumber || '258874438819', contactEmail: body.contactEmail || 'comercial@atlasmaterials.com', contactPhone: body.contactPhone || '+258 87 443 8819', address: body.address || 'Maputo, Moçambique' } });
  return NextResponse.json({ success: true, setting });
}
