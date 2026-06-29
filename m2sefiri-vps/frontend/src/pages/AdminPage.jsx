import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Users, MessageSquare, Megaphone, BarChart3, Shield, Trash2, CheckCircle2, XCircle, Star, ShieldOff, Search } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const TABS = [
  { key: 'overview', label: 'Genel Bakış', icon: BarChart3 },
  { key: 'users', label: 'Kullanıcılar', icon: Users },
  { key: 'topics', label: 'Konular', icon: MessageSquare },
  { key: 'ads', label: 'Reklam Başvuruları', icon: Megaphone },
];

function StatCard({ icon: Icon, label, value, color = '#c98a1a' }) {
  return (
    <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-white font-bold text-2xl">{value}</div>
      </div>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(({ data }) => setStats(data)); }, []);
  if (!stats) return <div className="text-gray-400 text-sm">Yükleniyor...</div>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Users} label="Kullanıcılar" value={stats.users} color="#3b82f6" />
      <StatCard icon={Shield} label="Adminler" value={stats.admins} color="#ef4444" />
      <StatCard icon={CheckCircle2} label="Onaylı Üyeler" value={stats.verified_users} color="#22c55e" />
      <StatCard icon={MessageSquare} label="Konular" value={stats.topics} color="#c98a1a" />
      <StatCard icon={MessageSquare} label="Cevaplar" value={stats.replies} color="#a855f7" />
      <StatCard icon={Megaphone} label="Bekleyen Reklam" value={stats.ads_pending} color="#f59e0b" />
      <StatCard icon={Megaphone} label="Toplam Reklam" value={stats.ads_total} color="#c98a1a" />
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: q ? { q } : {} });
      setUsers(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, [q]);
  useEffect(() => { load(); }, [load]);

  const toggle = async (u, field) => {
    try {
      const { data } = await api.patch(`/admin/users/${u.id}`, { [field]: !u[field] });
      setUsers((arr) => arr.map((x) => (x.id === u.id ? data : x)));
      toast({ title: 'Güncellendi' });
    } catch (err) { toast({ title: 'Hata', description: err?.response?.data?.detail || 'Güncellenemedi' }); }
  };

  const remove = async (u) => {
    if (!window.confirm(`${u.username} kullanıcısını silmek istediğinden emin misin?`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      setUsers((arr) => arr.filter((x) => x.id !== u.id));
      toast({ title: 'Silindi' });
    } catch (err) { toast({ title: 'Hata', description: err?.response?.data?.detail || 'Silinemedi' }); }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kullanıcı adı veya e-posta ara..." className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
        </div>
      </div>
      <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 border-b border-[#3a1e21] bg-[#13090a] text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
          <div className="col-span-3">Kullanıcı</div>
          <div className="col-span-3">E-posta</div>
          <div className="col-span-1 text-center">Mesaj</div>
          <div className="col-span-2">Katılım</div>
          <div className="col-span-3 text-right">İşlemler</div>
        </div>
        {loading ? <div className="px-4 py-6 text-gray-400 text-sm text-center">Yükleniyor...</div> : users.length === 0 ? <div className="px-4 py-6 text-gray-500 text-sm text-center">Kullanıcı yok</div> : users.map((u) => (
          <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 border-t border-[#2a1a1c] items-center text-sm">
            <div className="col-span-3 flex items-center gap-2 flex-wrap">
              <span className="text-gray-100 font-semibold truncate">{u.username}</span>
              {u.verified && <CheckCircle2 size={12} className="text-[#48a4f5]" />}
              {u.is_admin && <span className="bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#ef4444]/40">ADMIN</span>}
              {u.is_seed && <span className="bg-gray-500/20 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded">SEED</span>}
            </div>
            <div className="col-span-3 text-gray-400 text-xs truncate">{u.email}</div>
            <div className="col-span-1 text-center text-gray-200">{u.post_count ?? 0}</div>
            <div className="col-span-2 text-gray-400 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : '-'}</div>
            <div className="col-span-3 flex items-center gap-1.5 justify-end flex-wrap">
              <button onClick={() => toggle(u, 'verified')} title={u.verified ? 'Doğruluk rütbesini kaldır' : 'Doğruluk rütbesi ver'} className={`p-1.5 rounded transition-colors ${u.verified ? 'bg-[#48a4f5]/20 text-[#48a4f5] hover:bg-[#48a4f5]/30' : 'bg-[#1f1719] text-gray-400 hover:bg-[#2a1f22]'}`}>
                <Star size={13} />
              </button>
              <button onClick={() => toggle(u, 'is_admin')} title={u.is_admin ? 'Admin kaldır' : 'Admin yap'} className={`p-1.5 rounded transition-colors ${u.is_admin ? 'bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30' : 'bg-[#1f1719] text-gray-400 hover:bg-[#2a1f22]'}`}>
                {u.is_admin ? <ShieldOff size={13} /> : <Shield size={13} />}
              </button>
              <button onClick={() => remove(u)} title="Sil" className="p-1.5 rounded bg-[#1f1719] text-gray-400 hover:bg-[#5a1418] hover:text-white transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicsTab() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/admin/topics').then(({ data }) => setTopics(data)).finally(() => setLoading(false)); }, []);
  const remove = async (t) => {
    if (!window.confirm(`"${t.title}" konusunu silmek istediğinden emin misin?`)) return;
    try {
      await api.delete(`/admin/topics/${t.id}`);
      setTopics((arr) => arr.filter((x) => x.id !== t.id));
      toast({ title: 'Konu silindi' });
    } catch { toast({ title: 'Hata' }); }
  };
  return (
    <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md overflow-hidden">
      {loading ? <div className="px-4 py-6 text-gray-400 text-sm text-center">Yükleniyor...</div> : topics.length === 0 ? <div className="px-4 py-6 text-gray-500 text-sm text-center">Konu yok</div> : topics.map((t) => (
        <div key={t.id} className="flex items-center gap-3 px-4 py-3 border-t border-[#2a1a1c] first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {t.is_vip && <span className="bg-[#f0c87a]/20 text-[#f0c87a] text-[9px] font-bold px-1.5 py-0.5 rounded">VİP</span>}
              <span className="text-gray-100 text-sm font-semibold line-clamp-1">{t.title}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">{t.author} · {t.subforum_slug} · {new Date(t.created_at).toLocaleDateString('tr-TR')} · {t.replies_count} cevap · {t.views} gösterim</div>
          </div>
          <button onClick={() => remove(t)} className="p-1.5 rounded bg-[#1f1719] text-gray-400 hover:bg-[#5a1418] hover:text-white transition-colors shrink-0"><Trash2 size={13} /></button>
        </div>
      ))}
    </div>
  );
}

function AdsTab() {
  const [ads, setAds] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get('/admin/ads', { params: filter ? { status: filter } : {} });
    setAds(data); setLoading(false);
  }, [filter]);
  useEffect(() => { load(); }, [load]);
  const setStatus = async (ad, status) => {
    try { await api.patch(`/admin/ads/${ad.id}`, { status }); setAds((arr) => arr.map((x) => x.id === ad.id ? { ...x, status } : x)); toast({ title: 'Güncellendi' }); } catch { toast({ title: 'Hata' }); }
  };
  const remove = async (ad) => {
    if (!window.confirm('Silinsin mi?')) return;
    try { await api.delete(`/admin/ads/${ad.id}`); setAds((arr) => arr.filter((x) => x.id !== ad.id)); toast({ title: 'Silindi' }); } catch { toast({ title: 'Hata' }); }
  };
  const statusColor = (s) => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b';
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button key={s || 'all'} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-[12px] rounded transition-colors ${filter === s ? 'bg-[#7a1f24] text-white' : 'bg-[#1f1719] text-gray-300 hover:bg-[#2a1f22]'}`}>
            {s === '' ? 'Tümü' : s === 'pending' ? 'Bekleyen' : s === 'approved' ? 'Onaylı' : 'Reddedilen'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? <div className="text-gray-400 text-sm text-center py-6">Yükleniyor...</div> : ads.length === 0 ? <div className="text-gray-500 text-sm text-center py-6">Başvuru yok</div> : ads.map((ad) => (
          <div key={ad.id} className="bg-[#1d1517] border border-[#3a1e21] rounded-md p-4">
            <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
              <div>
                <div className="text-gray-100 font-semibold text-sm">{ad.name}</div>
                <div className="text-gray-400 text-xs">{ad.contact} · {ad.ad_type} · {new Date(ad.created_at).toLocaleString('tr-TR')}</div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ backgroundColor: `${statusColor(ad.status)}20`, color: statusColor(ad.status), border: `1px solid ${statusColor(ad.status)}40` }}>{ad.status}</span>
            </div>
            <p className="text-gray-300 text-[13px] whitespace-pre-wrap mb-3">{ad.message}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setStatus(ad, 'approved')} className="text-[11px] px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center gap-1"><CheckCircle2 size={11} /> Onayla</button>
              <button onClick={() => setStatus(ad, 'rejected')} className="text-[11px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center gap-1"><XCircle size={11} /> Reddet</button>
              <button onClick={() => setStatus(ad, 'pending')} className="text-[11px] px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">Beklemeye al</button>
              <button onClick={() => remove(ad)} className="text-[11px] px-2 py-1 rounded bg-[#1f1719] text-gray-400 hover:bg-[#5a1418] hover:text-white flex items-center gap-1"><Trash2 size={11} /> Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('overview');
  if (loading) return <PageLayout><div className="text-center py-12 text-gray-400">Yükleniyor...</div></PageLayout>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_admin) return <PageLayout><div className="text-center py-16 text-gray-300"><Shield size={48} className="mx-auto mb-3 text-[#7a1f24]" /><h2 className="text-lg font-bold">Yetki yok</h2><p className="text-sm text-gray-500 mt-2">Bu sayfaya erişmek için admin yetkisi gerekli.</p></div></PageLayout>;

  return (
    <PageLayout breadcrumbs={[{ label: 'Yönetim Paneli' }]} hideSidebar>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-4 py-4 rounded-t-md border border-[#3a1e21] border-b-0">
        <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-2"><Shield size={20} className="text-[#f0c87a]" /> Yönetim Paneli</h1>
        <p className="text-gray-300 text-[12px] mt-1">Hoşgeldin <span className="text-[#e8c46b]">{user.username}</span>. Tüm forum verilerini buradan yönetebilirsin.</p>
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5">
        <div className="flex items-center gap-1 px-2 py-2 border-b border-[#2a1a1c] bg-[#13090a] overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 text-[13px] rounded flex items-center gap-1.5 transition-colors whitespace-nowrap ${tab === t.key ? 'bg-[#7a1f24] text-white' : 'text-gray-300 hover:bg-[#2a1518]'}`}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
        <div className="p-4">
          {tab === 'overview' && <Overview />}
          {tab === 'users' && <UsersTab />}
          {tab === 'topics' && <TopicsTab />}
          {tab === 'ads' && <AdsTab />}
        </div>
      </div>
    </PageLayout>
  );
}
