import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Eye, MessageSquare, CheckCircle2, Send, Lock } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export default function TopicPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get(`/topics/${id}`).then(({ data }) => setData(data)).catch(() => setData({ error: true }));
  useEffect(() => { setData(null); load(); /* eslint-disable-next-line */ }, [id]);

  const submitReply = async (e) => {
    e.preventDefault();
    if (!user) { toast({ title: 'Giriş gerekli' }); return; }
    if (content.length < 1) { toast({ title: 'Eksik', description: 'Yorum boş olamaz.' }); return; }
    setSubmitting(true);
    try {
      await api.post(`/topics/${id}/replies`, { content });
      setContent('');
      await load();
      toast({ title: 'Yorum eklendi' });
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail || 'Yorum eklenemedi' });
    } finally { setSubmitting(false); }
  };

  if (!data) return <PageLayout><div className="text-center py-12 text-gray-400">Yükleniyor...</div></PageLayout>;
  if (data.error) return <PageLayout><div className="text-center py-12 text-gray-400">Konu bulunamadı.</div></PageLayout>;

  const t = data.topic;
  return (
    <PageLayout breadcrumbs={[{ label: t.subforum_slug, href: `/sub/${t.subforum_slug}` }, { label: t.title }]}>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-4 py-4 rounded-t-md border border-[#3a1e21] border-b-0">
        <div className="flex items-center gap-2 flex-wrap">
          {t.is_vip && <span className="bg-[#f0c87a] text-[#3a0d10] text-[10px] font-bold px-2 py-0.5 rounded">VİP</span>}
          {t.is_new && <span className="bg-[#c5252b] text-white text-[10px] font-bold px-2 py-0.5 rounded">Yeni</span>}
          <h1 className="text-white font-bold text-lg tracking-wide">{t.title}</h1>
        </div>
        <div className="text-gray-300 text-[12px] mt-1 flex items-center gap-3 flex-wrap">
          <Link to={`/profile/${t.author}`} className="hover:text-[#e8c46b]">{t.author}{t.verified && <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1" />}</Link>
          <span>·</span>
          <span>{new Date(t.created_at).toLocaleString('tr-TR')}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Eye size={12} /> {t.views}</span>
          <span className="flex items-center gap-1"><MessageSquare size={12} /> {t.replies_count}</span>
        </div>
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5 p-5">
        <p className="text-gray-200 text-[14px] leading-relaxed whitespace-pre-wrap">{t.content}</p>
      </div>

      {/* Replies */}
      <h2 className="text-[#e8c46b] font-bold text-sm mb-3 tracking-wide">CEVAPLAR ({data.replies.length})</h2>
      <div className="space-y-3 mb-5">
        {data.replies.length === 0 && <div className="text-gray-500 text-sm text-center py-6 bg-[#16101177] border border-[#3a1e21] rounded-md">Henüz cevap yok.</div>}
        {data.replies.map((r) => (
          <div key={r.id} className="bg-[#1d1517] border border-[#3a1e21] rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <Link to={`/profile/${r.author}`} className="text-[#e8c46b] font-semibold text-[13px] hover:underline">
                {r.author}{r.verified && <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1" />}
              </Link>
              <span className="text-gray-500 text-[11px]">{new Date(r.created_at).toLocaleString('tr-TR')}</span>
            </div>
            <p className="text-gray-200 text-[13px] whitespace-pre-wrap leading-relaxed">{r.content}</p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      {t.is_vip ? (
        <div className="bg-[#2a1518] border border-[#3a1e21] rounded-md p-4 text-center text-gray-300 text-sm flex items-center justify-center gap-2">
          <Lock size={14} /> Bu VİP konuya yorum yapılamaz.
        </div>
      ) : user ? (
        <form onSubmit={submitReply} className="bg-[#1d1517] border border-[#3a1e21] rounded-md p-4 space-y-2">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Cevabınızı yazın..." className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60 transition-colors">
              <Send size={14} /> {submitting ? 'Gönderiliyor...' : 'Cevap Gönder'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md p-4 text-center text-gray-300 text-sm">
          Cevap yazmak için <Link to="/login" className="text-[#e8c46b] hover:underline">giriş yapın</Link> veya <Link to="/register" className="text-[#e8c46b] hover:underline">üye olun</Link>.
        </div>
      )}
    </PageLayout>
  );
}
