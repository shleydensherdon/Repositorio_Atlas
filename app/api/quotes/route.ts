import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQuoteReference } from '@/lib/utils';
import { z } from 'zod';

const QuoteSchema = z.object({
  customerName: z.string().min(2, 'O nome é obrigatório'),
  customerEmail: z.string().email('E-mail inválido'),
  customerPhone: z.string().min(6, 'Telefone é obrigatório'),
  customerWhatsapp: z.string().optional(),
  companyName: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      productName: z.string(),
      quantity: z.number().positive(),
      unit: z.string().default('un'),
      calculatedArea: z.number().optional().nullable(),
      wastePercentage: z.number().optional().nullable(),
      unitPrice: z.number().optional().nullable(),
      subtotal: z.number().optional().nullable(),
    })
  ).min(1, 'A cotação deve conter pelo menos um produto'),
  attachments: z.array(
    z.object({
      fileUrl: z.string(),
      fileName: z.string(),
      fileType: z.string(),
      fileSize: z.number(),
    })
  ).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = QuoteSchema.parse(body);

    const referenceCode = generateQuoteReference();

    // Calcular total estimado
    const estimatedTotal = validated.items.reduce(
      (acc, item) => acc + (item.subtotal || 0),
      0
    );

    // Gravar na base de dados
    const quote = await prisma.quote.create({
      data: {
        referenceCode,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        customerWhatsapp: validated.customerWhatsapp || validated.customerPhone,
        companyName: validated.companyName,
        projectType: validated.projectType || 'Residencial',
        location: validated.location,
        notes: validated.notes,
        estimatedTotal,
        status: 'NOVO',
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId?.startsWith('calc-') ? null : item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unit: item.unit,
            calculatedArea: item.calculatedArea,
            wastePercentage: item.wastePercentage ?? 10,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
        attachments: {
          create: validated.attachments?.map((att) => ({
            fileUrl: att.fileUrl,
            fileName: att.fileName,
            fileType: att.fileType,
            fileSize: att.fileSize,
          })) || [],
        },
      },
      include: {
        items: true,
        attachments: true,
      },
    });

    return NextResponse.json({
      success: true,
      referenceCode: quote.referenceCode,
      quoteId: quote.id,
      message: 'Pedido de cotação submetido com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro ao submeter cotação:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Ocorreu um erro interno ao processar a cotação.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        items: true,
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ quotes });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao buscar cotações.' }, { status: 500 });
  }
}
