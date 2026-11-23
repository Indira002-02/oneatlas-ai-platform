import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const company = searchParams.get('company') || '';
    const sortBy = searchParams.get('sortBy') || 'name_asc';

    // Build Prisma query filters
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { type: { contains: search } },
      ];
    }

    if (company && company !== 'all') {
      where.company = { slug: company };
    }

    // Build dynamic sorting
    let orderBy: any = { name: 'asc' };
    if (sortBy === 'price_asc') {
      orderBy = { inputPricePerM: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { inputPricePerM: 'desc' };
    } else if (sortBy === 'context_desc') {
      orderBy = { contextWindow: 'desc' };
    }

    const models = await prisma.model.findMany({
      where,
      orderBy,
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
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
