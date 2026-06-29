import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Eye, CheckCircle2, Plus, X } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export default function SubforumPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get(`/subforums/${slug}`).then(({ data }) => setData(data)).catch(() => setData({ error: true }));
  useEffect(() => { setData(null); load(); /* eslint-disable-next-line */ }, [slug]);

  const submitTopic = async (e) => {
    e.preventDefault();
    if (!user) { toast({ title: 'Giriş gerekli', description: 'Konu açmak için giriş yapın.' }); return; }
    if (title.length < 3 || content.length < 1) { toast({ title: 'Eksik', description: 'Başlık ve içerik gerekli.' }); return; }
    setSubmitting(true);
    try {
      const { data: newTopic } = await api.post('/topics', { subforum_slug: slug, title, content });
      toast({ title: 'Konu oluşturuldu' });
      setTitle(''); setContent(''); setShowForm(false);
      navigate(`/topic/${newTopic.id}`);
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail || 'Konu oluşturulamadı' });
    } finally { setSubmitting(false); }
  };

  if (!data) return <PageLayout><div className="text-center py-12 text-gray-400">Yükleniyor...</div></PageLayout>;
  if (data.error) return <PageLayout><div className="text-center py-12 text-gray-400">Alt forum bulunamadı.</div></PageLayout>;

  return (
    <PageLayout breadcrumbs={[{ label: data.category.title }, { label: data.subforum.name }]}>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-4 py-4 rounded-t-md border border-[#3a1e21] border-b-0">
        <h1 className="text-white font-bold text-lg tracking-wide">{data.subforum.name}</h1>
        {data.subforum.description && <p className="text-gray-300 text-[12px] mt-1">{data.subforum.description}</p>}
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a1a1c] bg-[#13090a]">
          <div className="text-[12px] text-gray-400">Toplam <span className="text-gray-200 font-bold">{data.total}</span> konu</div>
          <button onClick={() => setShowForm((s) => !s)} className="bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
            {showForm ? <><X size={14} /> Kapat</> : <><Plus size={14} /> Yeni Konu</>}
          </button>
        </div>
        {showForm && (
          <form onSubmit={submitTopic} className="px-4 py-3 border-b border-[#2a1a1c] bg-[#0f0a0b] space-y-2">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Konu başlığı" className="w-full bg-[#1a1416] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="İçerik" rows={4} className="w-full bg-[#1a1416] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
            <button type="submit" disabled={submitting} className="bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm px-4 py-1.5 rounded disabled:opacity-60 transition-colors">{submitting ? 'Gönderiliyor...' : 'Konu Aç'}</button>
          </form>
        )}
        {data.topics.length === 0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">Henüz konu yok. İlk konuyu sen aç!</div>}
        {data.topics.map((t) => (
          <Link key={t.id} to={`/topic/${t.id}`} className="flex items-center gap-3 px-4 py-3 border-t border-[#2a1a1c] hover:bg-[#1d1416]/60 transition-colors">
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#2a1417] to-[#1a0d0f] border border-[#3a1e21] flex items-center justify-center">
              <MessageSquare size={15} className="text-[#c98a1a]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                {t.is_new && <span className="bg-[#c5252b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Yeni</span>}
                <span className="text-[14px] font-semibold text-gray-100 line-clamp-1">{t.title}</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{t.author}{t.verified && <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1" />} · {new Date(t.created_at).toLocaleDateString('tr-TR')}</div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400 shrink-0">
              <div className="text-center"><div className="text-gray-200 font-bold text-[13px]">{t.replies_count}</div><div>Cevap</div></div>
              <div className="text-center"><div className="text-gray-200 font-bold text-[13px]">{t.views}</div><div>Gösterim</div></div>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}
