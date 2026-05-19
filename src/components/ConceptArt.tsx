import React from 'react';

const ArtFrame = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(20,184,166,0.14),transparent_30%)]" />
    <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(#cbd5e1_1px,transparent_1px),linear-gradient(90deg,#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]" />
    <div className="relative h-full w-full">{children}</div>
  </div>
);

const Label = ({ x, y, children }: { x: number; y: number; children: React.ReactNode }) => (
  <text x={x} y={y} textAnchor="middle" className="fill-slate-500 text-[11px] font-semibold uppercase tracking-wide">
    {children}
  </text>
);

const Node = ({
  x,
  y,
  value,
  color = '#ffffff',
  text = '#0f172a',
  stroke = '#2563eb',
}: {
  x: number;
  y: number;
  value: string;
  color?: string;
  text?: string;
  stroke?: string;
}) => (
  <g>
    <circle cx={x} cy={y} r="25" fill={color} stroke={stroke} strokeWidth="3" />
    <text x={x} y={y + 5} textAnchor="middle" fill={text} className="text-sm font-bold">
      {value}
    </text>
  </g>
);

const Edge = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
);

export const StackHeroArt = () => (
  <ArtFrame>
    <svg viewBox="0 0 720 405" className="h-full w-full">
      <rect x="214" y="84" width="230" height="256" rx="28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
      <path d="M220 116h218" stroke="#e2e8f0" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((item) => {
        const y = 270 - item * 38;
        const active = item === 4;
        return (
          <g key={item}>
            <rect x="252" y={y} width="154" height="28" rx="14" fill={active ? '#dbeafe' : '#ffffff'} stroke={active ? '#2563eb' : '#cbd5e1'} strokeWidth="3" />
            <ellipse cx="329" cy={y + 14} rx="72" ry="9" fill={active ? '#bfdbfe' : '#f1f5f9'} opacity="0.95" />
            <text x="329" y={y + 18} textAnchor="middle" className="fill-slate-700 text-[12px] font-bold">
              Plate {item + 1}
            </text>
          </g>
        );
      })}
      <path d="M452 128h76" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M528 128l-14-10v20z" fill="#2563eb" />
      <text x="566" y="133" className="fill-blue-600 text-sm font-bold">TOP</text>
      <rect x="92" y="95" width="120" height="58" rx="12" fill="#ffffff" stroke="#cbd5e1" />
      <text x="152" y="120" textAnchor="middle" className="fill-blue-600 text-xs font-bold">push()</text>
      <text x="152" y="140" textAnchor="middle" className="fill-slate-500 text-[10px]">add to top</text>
      <rect x="488" y="244" width="120" height="58" rx="12" fill="#ffffff" stroke="#cbd5e1" />
      <text x="548" y="269" textAnchor="middle" className="fill-rose-600 text-xs font-bold">pop()</text>
      <text x="548" y="289" textAnchor="middle" className="fill-slate-500 text-[10px]">remove top</text>
      <Label x={330} y={370}>LIFO mental model</Label>
    </svg>
  </ArtFrame>
);

export const QueueHeroArt = () => (
  <ArtFrame>
    <svg viewBox="0 0 720 405" className="h-full w-full">
      <rect x="92" y="170" width="528" height="96" rx="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M92 218H52" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
      <path d="M620 218h46" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
      <text x="70" y="152" className="fill-rose-600 text-xs font-bold">FRONT</text>
      <text x="615" y="152" className="fill-blue-600 text-xs font-bold">REAR</text>
      {[0, 1, 2, 3, 4].map((item) => {
        const x = 132 + item * 92;
        const active = item === 0;
        return (
          <g key={item}>
            <circle cx={x} cy="203" r="23" fill={active ? '#dbeafe' : '#ffffff'} stroke={active ? '#2563eb' : '#94a3b8'} strokeWidth="3" />
            <rect x={x - 28} y="229" width="56" height="34" rx="12" fill={active ? '#bfdbfe' : '#e2e8f0'} stroke={active ? '#2563eb' : '#94a3b8'} />
            <text x={x} y="209" textAnchor="middle" className="fill-slate-800 text-xs font-bold">
              {item + 1}
            </text>
          </g>
        );
      })}
      <path d="M570 126c38 14 62 44 72 82" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M640 208l-12-13 19-3z" fill="#2563eb" />
      <path d="M132 302c-38-13-62-42-72-78" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 224l12 13-19 3z" fill="#ef4444" />
      <rect x="250" y="74" width="220" height="54" rx="14" fill="#ffffff" stroke="#cbd5e1" />
      <text x="360" y="97" textAnchor="middle" className="fill-blue-600 text-sm font-bold">FIFO queue</text>
      <text x="360" y="116" textAnchor="middle" className="fill-slate-500 text-[11px]">first person served first</text>
      <Label x={360} y={348}>enqueue at rear, dequeue at front</Label>
    </svg>
  </ArtFrame>
);

export const ArrayHeroArt = () => (
  <ArtFrame>
    <svg viewBox="0 0 720 405" className="h-full w-full">
      <rect x="92" y="138" width="536" height="112" rx="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
      {[12, 25, 42, 67, 88, 93].map((value, index) => {
        const x = 122 + index * 82;
        const active = index === 2;
        return (
          <g key={value}>
            <rect x={x} y="164" width="70" height="58" rx="10" fill={active ? '#dbeafe' : '#f8fafc'} stroke={active ? '#2563eb' : '#cbd5e1'} strokeWidth="3" />
            <text x={x + 35} y="199" textAnchor="middle" className="fill-slate-900 text-base font-bold">{value}</text>
            <text x={x + 35} y="238" textAnchor="middle" className="fill-slate-500 text-[10px] font-bold">IDX {index}</text>
          </g>
        );
      })}
      <path d="M275 106v42" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      <path d="M275 148l-9-12h18z" fill="#2563eb" />
      <rect x="222" y="58" width="106" height="42" rx="12" fill="#ffffff" stroke="#2563eb" />
      <text x="275" y="84" textAnchor="middle" className="fill-blue-600 text-xs font-bold">access [2]</text>
      <path d="M150 298h420" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 10" />
      <text x="360" y="326" textAnchor="middle" className="fill-slate-600 text-sm font-semibold">contiguous memory cells</text>
    </svg>
  </ArtFrame>
);

export const BinaryTreeArt = () => (
  <ArtFrame>
    <TreeSvg>
      <Edge x1={200} y1={82} x2={118} y2={154} />
      <Edge x1={200} y1={82} x2={282} y2={154} />
      <Edge x1={118} y1={154} x2={72} y2={228} />
      <Edge x1={118} y1={154} x2={164} y2={228} />
      <Edge x1={282} y1={154} x2={236} y2={228} />
      <Edge x1={282} y1={154} x2={328} y2={228} />
      <Node x={200} y={76} value="A" />
      <Node x={118} y={154} value="B" />
      <Node x={282} y={154} value="C" />
      <Node x={72} y={228} value="D" />
      <Node x={164} y={228} value="E" />
      <Node x={236} y={228} value="F" />
      <Node x={328} y={228} value="G" />
      <Label x={200} y={292}>each node has at most two children</Label>
    </TreeSvg>
  </ArtFrame>
);

export const BSTArt = () => (
  <ArtFrame>
    <TreeSvg>
      <Edge x1={200} y1={82} x2={118} y2={154} />
      <Edge x1={200} y1={82} x2={282} y2={154} />
      <Edge x1={118} y1={154} x2={72} y2={228} />
      <Edge x1={118} y1={154} x2={164} y2={228} />
      <Edge x1={282} y1={154} x2={236} y2={228} />
      <Edge x1={282} y1={154} x2={328} y2={228} />
      <Node x={200} y={76} value="50" color="#dbeafe" />
      <Node x={118} y={154} value="25" />
      <Node x={282} y={154} value="75" />
      <Node x={72} y={228} value="10" />
      <Node x={164} y={228} value="35" />
      <Node x={236} y={228} value="60" />
      <Node x={328} y={228} value="90" />
      <text x="84" y="108" className="fill-blue-600 text-[12px] font-bold">&lt; parent</text>
      <text x="278" y="108" className="fill-teal-600 text-[12px] font-bold">&gt; parent</text>
      <Label x={200} y={292}>left smaller, right larger</Label>
    </TreeSvg>
  </ArtFrame>
);

export const AVLArt = () => (
  <ArtFrame>
    <TreeSvg>
      <Edge x1={200} y1={82} x2={124} y2={158} />
      <Edge x1={200} y1={82} x2={276} y2={158} />
      <Edge x1={124} y1={158} x2={84} y2={230} />
      <Edge x1={124} y1={158} x2={164} y2={230} />
      <Node x={200} y={76} value="30" color="#ecfeff" stroke="#14b8a6" />
      <Node x={124} y={158} value="20" stroke="#14b8a6" />
      <Node x={276} y={158} value="40" stroke="#14b8a6" />
      <Node x={84} y={230} value="10" stroke="#14b8a6" />
      <Node x={164} y={230} value="25" stroke="#14b8a6" />
      <rect x="216" y="50" width="34" height="22" rx="8" fill="#ffffff" stroke="#14b8a6" />
      <text x="233" y="65" textAnchor="middle" className="fill-teal-600 text-[10px] font-bold">BF 0</text>
      <Label x={200} y={292}>self-balancing by height</Label>
    </TreeSvg>
  </ArtFrame>
);

export const RedBlackArt = () => (
  <ArtFrame>
    <TreeSvg>
      <Edge x1={200} y1={82} x2={118} y2={154} />
      <Edge x1={200} y1={82} x2={282} y2={154} />
      <Edge x1={118} y1={154} x2={72} y2={228} />
      <Edge x1={118} y1={154} x2={164} y2={228} />
      <Node x={200} y={76} value="40" color="#0f172a" text="#ffffff" stroke="#0f172a" />
      <Node x={118} y={154} value="20" color="#ef4444" text="#ffffff" stroke="#b91c1c" />
      <Node x={282} y={154} value="60" color="#ef4444" text="#ffffff" stroke="#b91c1c" />
      <Node x={72} y={228} value="10" color="#0f172a" text="#ffffff" stroke="#0f172a" />
      <Node x={164} y={228} value="30" color="#0f172a" text="#ffffff" stroke="#0f172a" />
      <Label x={200} y={292}>color rules keep searches fast</Label>
    </TreeSvg>
  </ArtFrame>
);

export const BTreeArt = () => (
  <ArtFrame>
    <svg viewBox="0 0 400 320" className="h-full w-full">
      <rect x="136" y="52" width="128" height="48" rx="12" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
      <line x1="178" y1="52" x2="178" y2="100" stroke="#2563eb" strokeWidth="2" />
      <line x1="222" y1="52" x2="222" y2="100" stroke="#2563eb" strokeWidth="2" />
      <text x="157" y="82" textAnchor="middle" className="fill-blue-700 text-sm font-bold">20</text>
      <text x="200" y="82" textAnchor="middle" className="fill-blue-700 text-sm font-bold">40</text>
      <text x="243" y="82" textAnchor="middle" className="fill-blue-700 text-sm font-bold">70</text>
      {[52, 152, 252].map((x, i) => (
        <g key={x}>
          <line x1="200" y1="100" x2={x + 48} y2="164" stroke="#94a3b8" strokeWidth="3" />
          <rect x={x} y="164" width="96" height="46" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          <line x1={x + 48} y1="164" x2={x + 48} y2="210" stroke="#cbd5e1" strokeWidth="2" />
          <text x={x + 24} y="193" textAnchor="middle" className="fill-slate-800 text-xs font-bold">{i === 0 ? '5' : i === 1 ? '30' : '80'}</text>
          <text x={x + 72} y="193" textAnchor="middle" className="fill-slate-800 text-xs font-bold">{i === 0 ? '12' : i === 1 ? '55' : '95'}</text>
        </g>
      ))}
      <Label x={200} y={280}>multi-key nodes for large indexes</Label>
    </svg>
  </ArtFrame>
);

export const TrieArt = () => (
  <ArtFrame>
    <svg viewBox="0 0 400 320" className="h-full w-full">
      <Edge x1={200} y1={72} x2={132} y2={134} />
      <Edge x1={200} y1={72} x2={268} y2={134} />
      <Edge x1={132} y1={134} x2={132} y2={204} />
      <Edge x1={268} y1={134} x2={268} y2={204} />
      <Edge x1={132} y1={204} x2={132} y2={264} />
      <Edge x1={268} y1={204} x2={268} y2={264} />
      <Node x={200} y={72} value="*" color="#dbeafe" />
      <Node x={132} y={134} value="c" />
      <Node x={132} y={204} value="a" />
      <Node x={132} y={264} value="t" color="#ecfeff" stroke="#14b8a6" />
      <Node x={268} y={134} value="d" />
      <Node x={268} y={204} value="o" />
      <Node x={268} y={264} value="g" color="#ecfeff" stroke="#14b8a6" />
      <text x="166" y="254" className="fill-teal-600 text-[11px] font-bold">word end</text>
      <text x="302" y="254" className="fill-teal-600 text-[11px] font-bold">word end</text>
    </svg>
  </ArtFrame>
);

const TreeSvg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 400 320" className="h-full w-full">
    {children}
  </svg>
);
