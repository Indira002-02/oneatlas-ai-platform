# OneAtlas AI Platform

An engineering assignment MVP built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma ORM. The platform provides AI model discovery, price benchmarking, spec comparisons, and side-by-side evaluation matrix functionality across major AI labs (OpenAI, Anthropic, Meta AI, DeepSeek).

---

## 🚀 Features

- **Global Search**: Search models dynamically by name, architecture type, or description.
- **AI Lab Filtering**: Instant filtering by company (OpenAI, Anthropic, Meta AI, DeepSeek).
- **Multi-Field Sorting**: Sort models by Name, Lowest Input Price, Highest Input Price, or Largest Context Window.
- **Benchmark & Spec Visibility**: View context window size, pricing per 1M input/output tokens, throughput, latency, and standard benchmark scores (MMLU, HumanEval, GSM8K).
- **Side-by-Side Matrix Comparison**: Select 2+ models and open a matrix modal to compare technical specifications and performance side by side.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ORM**: SQLite + Prisma ORM
- **API Routes**: Next.js Serverless API Route Handlers

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have **Node.js v18+** installed on your machine.

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd oneatlas-ai-platform

# Install dependencies
npm install
