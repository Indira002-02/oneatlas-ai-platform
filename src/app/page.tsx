'use client';

import { useState, useEffect } from 'react';

interface BenchmarkScore {
  score: number;
  benchmark: {
    name: string;
    category: string;
  };
}

interface ProviderInfo {
  latencyMs?: number;
  throughput?: number;
  provider: {
    name: string;
  };
}

interface Model {
  id: string;
  name: string;
  slug: string;
  type: string;
  contextWindow: number;
  description: string;
  inputPricePerM: number;
  outputPricePerM: number;
  isFeatured: boolean;
  company: {
    name: string;
    slug: string;
  };
  providers: ProviderInfo[];
  benchmarkScores: BenchmarkScore[];
}

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [loading, setLoading] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<Model[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Fetch models from API
  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ search, company, sortBy });
        const res = await fetch(`/api/models?${query.toString()}`);
        const data = await res.json();
        setModels(data);
      } catch (err) {
        console.error('Failed to load models', err);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, [search, company, sortBy]);

  // Toggle selection for comparison
  const toggleSelect = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
    } else {
      if (selectedSlugs.length >= 4) {
        alert('You can compare up to 4 models at a time.');
        return;
      }
      setSelectedSlugs([...selectedSlugs, slug]);
    }
  };

  // Fetch side-by-side comparison matrix
  const handleCompare = async () => {
    if (selectedSlugs.length < 2) {
      alert('Please select at least 2 models to compare.');
      return;
    }
    try {
      const res = await fetch(`/api/models/compare?slugs=${selectedSlugs.join(',')}`);
      const data = await res.json();
      setComparisonData(data);
      setIsComparing(true);
    } catch (err) {
      console.error('Failed to load comparison', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 text-center md:text-left border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          OneAtlas <span className="text-blue-500">AI Platform</span>
        </h1>
        <p className="text-slate-400 text-lg">
          AI Model Discovery, Price Benchmarking, and Side-by-Side Comparison Engine
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Controls Bar: Search, Filter, Sort & Compare Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search models (e.g., GPT, Claude, Reasoning)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          {/* Company Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'openai', 'anthropic', 'meta', 'deepseek'].map((c) => (
              <button
                key={c}
                onClick={() => setCompany(c)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                  company === c
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c === 'all' ? 'All Labs' : c}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="name_asc">Sort by: Name (A-Z)</option>
            <option value="price_asc">Sort by: Price (Lowest First)</option>
            <option value="price_desc">Sort by: Price (Highest First)</option>
            <option value="context_desc">Sort by: Context Window (Largest)</option>
          </select>

          {/* Compare Trigger Button */}
          {selectedSlugs.length > 0 && (
            <button
              onClick={handleCompare}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition shadow-lg flex items-center gap-2"
            >
              Compare ({selectedSlugs.length}) Models
            </button>
          )}
        </div>

        {/* Side-by-Side Comparison View Modal */}
        {isComparing && comparisonData && (
          <div className="mb-12 bg-slate-900 border border-emerald-500/40 rounded-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-400">Side-by-Side Model Comparison Matrix</h2>
              <button
                onClick={() => setIsComparing(false)}
                className="text-slate-400 hover:text-white text-sm bg-slate-800 px-3 py-1 rounded"
              >
                Close Comparison
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-sm">
                    <th className="py-3 px-4">Feature / Metric</th>
                    {comparisonData.map((m) => (
                      <th key={m.id} className="py-3 px-4 text-white text-base font-bold bg-slate-950/50">
                        {m.name}
                        <div className="text-xs font-normal text-slate-400">{m.company.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-300">Architecture Type</td>
                    {comparisonData.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-slate-400">{m.type}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-300">Context Window</td>
                    {comparisonData.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-blue-400 font-mono">
                        {m.contextWindow.toLocaleString()} tokens
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-300">Input Price / 1M Tokens</td>
                    {comparisonData.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-emerald-400 font-mono">${m.inputPricePerM.toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-300">Output Price / 1M Tokens</td>
                    {comparisonData.map((m) => (
                      <td key={m.id} className="py-3 px-4 text-emerald-400 font-mono">${m.outputPricePerM.toFixed(2)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-300">MMLU Benchmark Score</td>
                    {comparisonData.map((m) => {
                      const score = m.benchmarkScores.find((b) => b.benchmark.name === 'MMLU')?.score;
                      return (
                        <td key={m.id} className="py-3 px-4 font-bold text-amber-400">
                          {score ? `${score}%` : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-300">HumanEval (Coding)</td>
                    {comparisonData.map((m) => {
                      const score = m.benchmarkScores.find((b) => b.benchmark.name === 'HumanEval')?.score;
                      return (
                        <td key={m.id} className="py-3 px-4 font-bold text-amber-400">
                          {score ? `${score}%` : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Model Cards Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-16">Loading AI Models...</div>
        ) : models.length === 0 ? (
          <div className="text-center text-slate-500 py-16">No AI models found matching your search.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {models.map((m) => {
              const isSelected = selectedSlugs.includes(m.slug);
              return (
                <div
                  key={m.id}
                  className={`bg-slate-900 border rounded-xl p-6 transition flex flex-col justify-between shadow-md relative ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Card Top: Title & Compare Checkbox */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-semibold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/50">
                          {m.company.name}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1">{m.name}</h3>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(m.slug)}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span className="text-xs text-slate-300">Compare</span>
                      </label>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{m.description}</p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-500 block">Context Window</span>
                        <span className="text-slate-200 font-mono font-medium">{m.contextWindow.toLocaleString()} tokens</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Pricing (In / Out)</span>
                        <span className="text-emerald-400 font-mono font-medium">
                          ${m.inputPricePerM} / ${m.outputPricePerM}
                        </span>
                      </div>
                    </div>

                    {/* Benchmark Scores Pill */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {m.benchmarkScores.map((b) => (
                        <div key={b.benchmark.name} className="bg-slate-800 text-xs px-2.5 py-1 rounded text-slate-300">
                          <span className="text-slate-400 mr-1">{b.benchmark.name}:</span>
                          <span className="font-bold text-amber-400">{b.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
