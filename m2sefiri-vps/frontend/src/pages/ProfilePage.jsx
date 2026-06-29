import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { User, MessageSquare, Reply, Award, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    setData(null);
    api.get(`/users/${username}`).then(({ data }) => setData(data)).catch(() => setData({ error: true }));
  }, [username]);

  if (!data) return <PageLayout><div className="text-center py-12 text-gray-400">Yükleniyor...</div></PageLayout>;
  if (data.error) return <PageLayout><div className="text-center py-12 text-gray-400">Kullanıcı bulunamadı.</div></PageLayout>;

  const u = data.user;
  const r = u.rank;
  return (
    <PageLayout breadcrumbs={[{ label: 'Profil' }, { label: u.username }]}>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-5 py-6 rounded-t-md border border-[#3a1e21] border-b-0 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-[#0f0a0b] border-2 border-[#3a1e21] flex items-center justify-center shrink-0">
          <User size={36} className="text-[#c98a1a]" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
            {u.username}{u.verified && <CheckCircle2 size={16} className="text-[#48a4f5]" />}
          </h1>
          {r && (
            <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold" style={{ backgroundColor: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40` }}>
              <Award size={12} /> {r.name}
            </div>
          )}
          <div className="text-gray-300 text-[12px] mt-2">
            <span>Mesaj: <span className="text-[#e8c46b] font-bold">{u.post_count ?? 0}</span></span>
            <span className="mx-3">·</span>
            <span>Katılım: {u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : '-'}</span>
          </div>
        </div>
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5" />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md">
          <div className="px-4 py-2 border-b border-[#3a1e21] text-[#e8c46b] font-bold text-sm flex items-center gap-2"><MessageSquare size={14} /> Son Konular</div>
          <div className="divide-y divide-[#2a1a1c]">
            {data.topics.length === 0 && <div className="px-4 py-6 text-center text-gray-500 text-sm">Konu yok</div>}
            {data.topics.map((t) => (
              <Link key={t.id} to={`/topic/${t.id}`} className="block px-4 py-3 hover:bg-[#2a1518]/50 transition-colors">
                <div className="text-[13px] text-gray-100 line-clamp-1">{t.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{new Date(t.created_at).toLocaleDateString('tr-TR')}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md">
          <div className="px-4 py-2 border-b border-[#3a1e21] text-[#e8c46b] font-bold text-sm flex items-center gap-2"><Reply size={14} /> Son Cevaplar</div>
          <div className="divide-y divide-[#2a1a1c]">
            {data.replies.length === 0 && <div className="px-4 py-6 text-center text-gray-500 text-sm">Cevap yok</div>}
            {data.replies.map((r2) => (
              <Link key={r2.id} to={`/topic/${r2.topic_id}`} className="block px-4 py-3 hover:bg-[#2a1518]/50 transition-colors">
                <div className="text-[13px] text-gray-100 line-clamp-2">{r2.content}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{new Date(r2.created_at).toLocaleDateString('tr-TR')}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
