import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAuthenticatedAdmin } from '@/lib/auth';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  try {
    const formData = await req.formData();
    const files = formData.getAll('files').filter((file): file is File => file instanceof File);
    if (!files.length) return NextResponse.json({ error: 'Nenhuma imagem recebida.' }, { status: 400 });
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'admin');
    fs.mkdirSync(uploadDir, { recursive: true });
    const results = [];
    for (const file of files) {
      if (!allowedTypes.has(file.type)) return NextResponse.json({ error: 'Use imagens JPG, PNG ou WebP.' }, { status: 415 });
      if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Cada imagem deve ter no máximo 8 MB.' }, { status: 413 });
      const extension = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
      fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
      results.push({ imageUrl: `/uploads/admin/${filename}`, originalName: file.name, fileType: file.type, fileSize: file.size });
    }
    return NextResponse.json({ success: true, files: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Falha no upload.' }, { status: 500 });
  }
}
