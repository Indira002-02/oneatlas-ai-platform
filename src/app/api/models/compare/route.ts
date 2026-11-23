export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slugsParam = searchParams.get('slugs') || '';

    if (!slugsParam) {
      return NextResponse.json({ error: 'No model slugs provided' }, { status: 400 });
    }

    const slugs = slugsParam.split(',').filter(Boolean);

    const models = await prisma.model.findMany({
      where: {
        slug: { in: slugs },
      },
      include: { company: true },
    });

    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to compare models' }, { status: 500 });
  }
}
