import React from 'react';

interface DataPoint {
  label: string;
  value: number; // 0 to 100
}

export default function SkillRadar({ data }: { data: DataPoint[] }) {
  const size = 200;
  const center = size / 2;
  const radius = (size / 2) - 40;
  const angleSlice = (Math.PI * 2) / data.length;

  // Helper to calculate coordinates
  const getCoords = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    return [
      center + (Math.cos(angle) * radius * (value / 100)),
      center + (Math.sin(angle) * radius * (value / 100)),
    ];
  };

  const pathString = data.map((d, i) => {
    const [x, y] = getCoords(d.value, i);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ') + 'Z';

  return (
    <div className="relative w-full flex justify-center py-8">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Web */}
        {[25, 50, 75, 100].map(level => (
          <path
            key={level}
            d={data.map((_, i) => {
              const [x, y] = getCoords(level, i);
              return `${i === 0 ? 'M' : 'L'}${x},${y}`;
            }).join(' ') + 'Z'}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="1"
          />
        ))}

        {/* The Data Shape */}
        <path
          d={pathString}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />

        {/* Points and Labels */}
        {data.map((d, i) => {
          const [x, y] = getCoords(100, i);
          const [lx, ly] = getCoords(125, i); // Label position
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" className="fill-blue-500" />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] fill-slate-500 uppercase tracking-widest font-semibold"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}