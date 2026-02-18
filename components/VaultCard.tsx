
import React from 'react';

interface VaultCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  color?: string;
}

export const VaultCard: React.FC<VaultCardProps> = ({ label, value, icon, trend, color = '#00ff9d' }) => {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg relative overflow-hidden group">
      <div 
        className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" 
        style={{ backgroundColor: color }}
      />
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</h3>
        <p className="text-2xl font-bold mono" style={{ color }}>{value}</p>
      </div>
    </div>
  );
};
