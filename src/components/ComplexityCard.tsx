import React from 'react';

interface ComplexityCardProps {
  title: string;
  description: string;
  complexity: string;
  isSpace?: boolean;
}

export default function ComplexityCard({ title, description, complexity, isSpace }: ComplexityCardProps) {
  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant p-6 flex justify-between items-center hover:border-primary-fixed transition-colors group">
      <div>
        <h4 className="text-lg font-bold text-primary group-hover:text-primary-fixed transition-colors">{title}</h4>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      <div className={`px-4 py-2 rounded font-mono text-lg font-bold border shadow-[0_0_10px_rgba(56,222,187,0.1)] ${
        isSpace 
          ? 'bg-secondary/10 text-secondary border-secondary/30' 
          : 'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/30'
      }`}>
        {complexity}
      </div>
    </div>
  );
}
