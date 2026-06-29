import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { Megaphone, Calendar, Eye, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function AcilacakPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/topics?filter=upcoming&limit=30').then(({ data }) => setTopics(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return (
    <PageLayout breadcrumbs={[{ label: 'Açılacak PvP Serverler' }]}>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-4 py-4 rounded-t-md border border-[#3a1e21] border-b-0">
        <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-2"><Megaphone size={20} className="text-[#f0c87a]" /> Açılacak PvP Serverler</h1>
        <p className="text-gray-300 text-[12px] mt-1">Yakında açılacak yeni Metin2 PvP serverları.</p>
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5">
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Yükleniyor...</div>
        ) : topics.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">Açılacak server yok.</div>
        ) : (
          topics.map((t) => (
            <Link key={t.id} to={`/topic/${t.id}`} className="flex items-center gap-3 px-4 py-3 border-t border-[#2a1a1c] first:border-t-0 hover:bg-[#1d1416]/60 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#2a1417] to-[#1a0d0f] border border-[#3a1e21] flex items-center justify-center">
                <Calendar size={15} className="text-[#c98a1a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#c5252b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Yeni</span>
                  <span className="text-[14px] font-semibold text-gray-100 line-clamp-1">{t.title}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">{t.author}{t.verified && <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1" />} · {new Date(t.created_at).toLocaleDateString('tr-TR')}</div>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400 shrink-0">
                <div className="flex items-center gap-1"><MessageSquare size={11} /> {t.replies_count}</div>
                <div className="flex items-center gap-1"><Eye size={11} /> {t.views}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </PageLayout>
  );
}
