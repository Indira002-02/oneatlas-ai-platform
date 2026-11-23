import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slugsParam = searchParams.get('slugs') || '';

    if (!slugsParam) {
      return NextResponse.json({ error: 'Please provide model slugs to compare' }, { status: 400 });
    }

    const slugs = slugsParam.split(',').map((s) => s.trim());

    const models = await prisma.model.findMany({
      where: {
        slug: { in: slugs },
      },
      include: {
        company: true,
        providers: {
          include: {
            provider: true,
          },
        },
        benchmarkScores: {
          include: {
            benchmark: true,
          },
        },
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Comparison API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch comparison data' }, { status: 500 });
  }
}
