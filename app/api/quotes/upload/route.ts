import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhum ficheiro recebido.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'quotes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedResults = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name).toLowerCase();
      const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
      const filePath = path.join(uploadDir, safeName);

      fs.writeFileSync(filePath, buffer);

      uploadedResults.push({
        originalName: file.name,
        fileName: safeName,
        fileUrl: `/uploads/quotes/${safeName}`,
        fileType: file.type,
        fileSize: file.size,
      });
    }

    return NextResponse.json({ success: true, files: uploadedResults });
  } catch (error: any) {
    console.error('Erro no upload de ficheiros:', error);
    return NextResponse.json(
      { error: 'Falha ao processar o upload dos ficheiros.' },
      { status: 500 }
    );
  }
}
