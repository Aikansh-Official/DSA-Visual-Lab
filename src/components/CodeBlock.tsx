import React, { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { CodeSnippet } from '../codeSnippets';

interface CodeBlockProps {
  code: string;
  filename: string;
  snippets?: CodeSnippet[];
}

export default function CodeBlock({ code, filename, snippets }: CodeBlockProps) {
  const fallbackSnippets = useMemo<CodeSnippet[]>(() => [{ language: 'JavaScript', filename, code }], [code, filename]);
  const options = snippets?.length ? snippets : fallbackSnippets;
  const [activeLanguage, setActiveLanguage] = useState(options[0].language);
  const activeSnippet = options.find((snippet) => snippet.language === activeLanguage) ?? options[0];

  const copyCode = async () => {
    await navigator.clipboard?.writeText(activeSnippet.code);
  };

  return (
    <div className="bg-[#0f172a] rounded-lg border border-[#334155] overflow-hidden flex flex-col h-full">
      <div className="bg-[#1e293b] px-4 py-3 border-b border-[#334155] flex flex-col gap-3">
        <div className="flex justify-between items-center gap-3">
          <span className="text-xs font-mono text-slate-400">{activeSnippet.filename}</span>
          <button onClick={copyCode} className="text-slate-400 hover:text-primary-fixed transition-colors p-1" aria-label="Copy code">
          <Copy className="w-4 h-4" />
          </button>
        </div>
        {options.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {options.map((snippet) => (
              <button
                key={snippet.language}
                onClick={() => setActiveLanguage(snippet.language)}
                className={`px-3 py-1 rounded border text-[11px] font-mono font-bold transition-all ${
                  activeLanguage === snippet.language
                    ? 'border-primary-fixed bg-primary-fixed text-white shadow-[0_0_14px_rgba(37,99,235,0.35)]'
                    : 'border-slate-600 text-slate-300 hover:border-primary-fixed hover:text-white'
                }`}
              >
                {snippet.language}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-[#e2e8f0]">
          <code>{activeSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
