import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Companies / AI Labs
  const openai = await prisma.company.upsert({
    where: { slug: 'openai' },
    update: {},
    create: { name: 'OpenAI', slug: 'openai', description: 'Creator of ChatGPT and GPT models.' }
  });

  const anthropic = await prisma.company.upsert({
    where: { slug: 'anthropic' },
    update: {},
    create: { name: 'Anthropic', slug: 'anthropic', description: 'Creator of Claude AI models.' }
  });

  const meta = await prisma.company.upsert({
    where: { slug: 'meta' },
    update: {},
    create: { name: 'Meta AI', slug: 'meta', description: 'Creator of Llama open-weights models.' }
  });

  const deepseek = await prisma.company.upsert({
    where: { slug: 'deepseek' },
    update: {},
    create: { name: 'DeepSeek', slug: 'deepseek', description: 'Pioneering open reasoning and coding models.' }
  });

  // 2. Create Providers
  const directOpenAI = await prisma.provider.upsert({
    where: { slug: 'openai-direct' },
    update: {},
    create: { name: 'OpenAI Direct API', slug: 'openai-direct', websiteUrl: 'https://platform.openai.com' }
  });

  const directAnthropic = await prisma.provider.upsert({
    where: { slug: 'anthropic-direct' },
    update: {},
    create: { name: 'Anthropic Direct API', slug: 'anthropic-direct', websiteUrl: 'https://console.anthropic.com' }
  });

  const togetherAI = await prisma.provider.upsert({
    where: { slug: 'together-ai' },
    update: {},
    create: { name: 'Together AI', slug: 'together-ai', websiteUrl: 'https://together.ai' }
  });

  // 3. Create Benchmarks
  const mmlu = await prisma.benchmark.upsert({
    where: { name: 'MMLU' },
    update: {},
    create: { name: 'MMLU', category: 'General Knowledge & Reasoning' }
  });

  const humanEval = await prisma.benchmark.upsert({
    where: { name: 'HumanEval' },
    update: {},
    create: { name: 'HumanEval', category: 'Code Generation' }
  });

  const gsm8k = await prisma.benchmark.upsert({
    where: { name: 'GSM8K' },
    update: {},
    create: { name: 'GSM8K', category: 'Grade School Math' }
  });

  // 4. Create Models with Specs, Pricing & Benchmark Scores
  const modelsData = [
    {
      name: 'GPT-4o',
      slug: 'gpt-4o',
      companyId: openai.id,
      type: 'LLM & Vision',
      contextWindow: 128000,
      releaseDate: new Date('2024-05-13'),
      description: 'OpenAI flagship multimodal model with fast response times and high intelligence.',
      isFeatured: true,
      inputPricePerM: 2.50,
      outputPricePerM: 10.00,
      providerId: directOpenAI.id,
      latencyMs: 380,
      throughput: 110.5,
      scores: [
        { benchmarkId: mmlu.id, score: 88.7 },
        { benchmarkId: humanEval.id, score: 90.2 },
        { benchmarkId: gsm8k.id, score: 95.8 },
      ]
    },
    {
      name: 'Claude 3.5 Sonnet',
      slug: 'claude-3-5-sonnet',
      companyId: anthropic.id,
      type: 'LLM & Vision',
      contextWindow: 200000,
      releaseDate: new Date('2024-06-20'),
      description: 'Industry-leading coding, reasoning, and instruction-following performance.',
      isFeatured: true,
      inputPricePerM: 3.00,
      outputPricePerM: 15.00,
      providerId: directAnthropic.id,
      latencyMs: 420,
      throughput: 95.0,
      scores: [
        { benchmarkId: mmlu.id, score: 88.3 },
        { benchmarkId: humanEval.id, score: 93.7 },
        { benchmarkId: gsm8k.id, score: 96.4 },
      ]
    },
    {
      name: 'Llama 3.3 70B',
      slug: 'llama-3-3-70b',
      companyId: meta.id,
      type: 'Open Weights LLM',
      contextWindow: 128000,
      releaseDate: new Date('2024-12-06'),
      description: 'Meta flagship open-weight 70B parameter LLM offering near-GPT-4 performance.',
      isFeatured: false,
      inputPricePerM: 0.88,
      outputPricePerM: 0.88,
      providerId: togetherAI.id,
      latencyMs: 250,
      throughput: 140.0,
      scores: [
        { benchmarkId: mmlu.id, score: 88.6 },
        { benchmarkId: humanEval.id, score: 88.1 },
        { benchmarkId: gsm8k.id, score: 94.2 },
      ]
    },
    {
      name: 'DeepSeek R1',
      slug: 'deepseek-r1',
      companyId: deepseek.id,
      type: 'Reasoning Model',
      contextWindow: 128000,
      releaseDate: new Date('2025-01-20'),
      description: 'Open-weights reasoning model specializing in complex math, logic, and code.',
      isFeatured: true,
      inputPricePerM: 0.55,
      outputPricePerM: 2.19,
      providerId: togetherAI.id,
      latencyMs: 510,
      throughput: 65.0,
      scores: [
        { benchmarkId: mmlu.id, score: 90.8 },
        { benchmarkId: humanEval.id, score: 92.6 },
        { benchmarkId: gsm8k.id, score: 97.3 },
      ]
    }
  ];

  for (const m of modelsData) {
    const model = await prisma.model.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        name: m.name,
        slug: m.slug,
        companyId: m.companyId,
        type: m.type,
        contextWindow: m.contextWindow,
        releaseDate: m.releaseDate,
        description: m.description,
        isFeatured: m.isFeatured,
        inputPricePerM: m.inputPricePerM,
        outputPricePerM: m.outputPricePerM,
      }
    });

    await prisma.modelProvider.upsert({
      where: { modelId_providerId: { modelId: model.id, providerId: m.providerId } },
      update: {},
      create: {
        modelId: model.id,
        providerId: m.providerId,
        latencyMs: m.latencyMs,
        throughput: m.throughput,
      }
    });

    for (const s of m.scores) {
      await prisma.benchmarkScore.upsert({
        where: { modelId_benchmarkId: { modelId: model.id, benchmarkId: s.benchmarkId } },
        update: {},
        create: {
          modelId: model.id,
          benchmarkId: s.benchmarkId,
          score: s.score,
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
