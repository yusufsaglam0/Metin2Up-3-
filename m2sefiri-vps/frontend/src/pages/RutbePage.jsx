import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { Award, Shield, Star, Crown, User } from 'lucide-react';

const iconMap = { user: User, shield: Shield, star: Star, award: Award, crown: Crown };

export default function RutbePage() {
  const [ranks, setRanks] = useState([]);
  useEffect(() => { api.get('/ranks').then(({ data }) => setRanks(data)).catch(() => {}); }, []);
  return (
    <PageLayout breadcrumbs={[{ label: 'Rütbe Sistemi' }]}>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-4 py-4 rounded-t-md border border-[#3a1e21] border-b-0">
        <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-2"><Award size={20} className="text-[#f0c87a]" /> Rütbe Sistemi</h1>
        <p className="text-gray-300 text-[12px] mt-1">Forum aktivitenize göre otomatik olarak rütbe kazanırsınız.</p>
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5">
        {ranks.map((r) => {
          const Icon = iconMap[r.icon] || Award;
          return (
            <div key={r.name} className="flex items-center gap-4 px-4 py-4 border-t border-[#2a1a1c] first:border-t-0 hover:bg-[#1d1416]/60 transition-colors">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${r.color}20`, border: `2px solid ${r.color}` }}>
                <Icon size={20} style={{ color: r.color }} />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold tracking-wide" style={{ color: r.color }}>{r.name}</div>
                <div className="text-gray-400 text-[12px] mt-0.5">{r.description}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-gray-400">Minimum Mesaj</div>
                <div className="text-white font-bold">{r.minPosts}</div>
              </div>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
