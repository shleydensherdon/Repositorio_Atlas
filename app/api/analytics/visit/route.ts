import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();

    // Create the visit record in the database
    await prisma.siteVisit.create({
      data: {
        path: path || '/',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
