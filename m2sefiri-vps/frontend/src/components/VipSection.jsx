import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pin, ChevronUp, ChevronDown, CheckCircle2, MessageCircle, Eye } from 'lucide-react';
import api from '../lib/api';

export default function VipSection() {
  const [open, setOpen] = useState(true);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.get('/topics/vip').then(({ data }) => setTopics(data)).catch(() => {});
  }, []);

  if (!topics.length) return null;

  return (
    <section className="mb-5">
      <button onClick={() => setOpen((o) => !o)} className="w-full bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] hover:from-[#6a181c] px-3 sm:px-4 py-3 flex items-center gap-3 rounded-t-md border border-[#3a1e21] border-b-0 transition-colors">
        <div className="w-9 h-9 rounded bg-black/30 flex items-center justify-center border border-[#3a1e21]"><Pin size={15} className="text-[#f0c87a]" /></div>
        <h2 className="flex-1 text-left text-white font-bold text-[15px] tracking-wide">VİP Konu Alanı</h2>
        {open ? <ChevronUp size={18} className="text-gray-300" /> : <ChevronDown size={18} className="text-gray-300" />}
      </button>
      {open && (
        <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md">
          <div className="px-4 py-2 text-[12px] text-gray-400 border-b border-[#2a1a1c] bg-[#13090a]">Buradaki konulara yorum yapılamaz. Lütfen reklam için iletişime geçin.</div>
          {topics.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-3 sm:px-4 py-3 border-t border-[#2a1a1c] hover:bg-[#1d1416]/60 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2a1417] to-[#1a0d0f] border border-[#3a1e21] flex items-center justify-center shrink-0"><Pin size={14} className="text-[#f0c87a]" /></div>
              <div className="flex-1 min-w-0">
                <Link to={`/topic/${t.id}`} className="block text-[14px] font-semibold text-gray-100 hover:text-[#e8c46b] line-clamp-1">{t.title}</Link>
                <div className="text-[11px] text-gray-400 mt-0.5">{t.author}{t.verified && <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1" />}</div>
              </div>
              <div className="hidden sm:block shrink-0 w-[80px] bg-[#0f0a0b] border border-[#2a1a1c] rounded text-center py-1.5 px-2">
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Cevaplar</div>
                <div className="text-[14px] font-bold text-gray-100">{t.replies_count}</div>
              </div>
              <div className="hidden md:flex shrink-0 w-[210px] items-center gap-2 text-[11px] text-gray-400">
                <Eye size={12} /> Gösterim: <span className="text-gray-200 font-semibold">{t.views}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
