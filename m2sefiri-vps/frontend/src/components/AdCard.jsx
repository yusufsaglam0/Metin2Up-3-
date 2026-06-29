import React from 'react';
import { Megaphone } from 'lucide-react';

export default function AdCard() {
  return (
    <div className="mt-4">
      <div className="text-center text-[12px] text-gray-300 py-2">Bu Alana Reklam Verebilirsiniz.</div>
      <div className="relative bg-gradient-to-br from-[#3a0d10] via-[#5a1418] to-[#3a0d10] border border-[#3a1e21] rounded-md overflow-hidden p-5 flex flex-col items-center justify-center text-center min-h-[260px]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#ffd27a,transparent_55%)]" />
        <Megaphone className="text-[#f0c87a] mb-2" size={28} />
        <div className="text-[#f0c87a] text-[11px] uppercase tracking-wider font-semibold">Bu alan tam sizin için işte!</div>
        <div className="text-white text-[11px] mt-1 opacity-80">Kitlelere ulaşmanın en etkili yolu burada.</div>
        <div className="mt-5 text-2xl font-black tracking-wider text-[#ffe27a]" style={{ fontFamily: "'Cinzel', serif" }}>
          BU ALANA
        </div>
        <div className="text-3xl font-black tracking-wider text-[#ffe27a] mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
          REKLAM
        </div>
        <div className="text-2xl font-black tracking-wider text-[#ffe27a] mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
          VEREBİLİRSİNİZ!
        </div>
      </div>
    </div>
  );
}
