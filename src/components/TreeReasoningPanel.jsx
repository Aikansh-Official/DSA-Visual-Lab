import React from 'react';
import { Route } from 'lucide-react';

export default function TreeReasoningPanel({ title = 'Behind the Scenes', steps = [] }) {
  return (
    <section className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4" aria-live="polite">
      <div className="flex items-center gap-2 text-primary">
        <Route className="h-4 w-4" />
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      {steps.length ? (
        <ol className="mt-3 space-y-2">
          {steps.map((step, index) => (
            <li key={`${index}-${step}`} className="flex gap-3 text-xs leading-relaxed text-on-surface-variant">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">Choose an operation to see the exact decisions the tree makes.</p>
      )}
    </section>
  );
}
