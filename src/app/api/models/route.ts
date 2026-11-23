export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const company = searchParams.get('company') || '';
    const sortBy = searchParams.get('sortBy') || 'name_asc';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (company) {
      where.company = { slug: company };
    }

    const models = await prisma.model.findMany({
      where,
      include: { company: true },
    });

    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
