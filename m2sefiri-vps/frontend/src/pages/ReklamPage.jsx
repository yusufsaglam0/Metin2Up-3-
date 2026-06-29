import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import api from '../lib/api';
import { Megaphone, CheckCircle2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export default function ReklamPage() {
  const [form, setForm] = useState({ name: '', contact: '', message: '', ad_type: 'banner' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/ads/apply', form);
      setDone(true);
      toast({ title: 'Başvurunuz alındı', description: 'En kısa sürede iletişime geçilecek.' });
    } catch {
      toast({ title: 'Hata', description: 'Başvuru gönderilemedi.' });
    } finally { setSubmitting(false); }
  };

  return (
    <PageLayout breadcrumbs={[{ label: 'Reklam' }]}>
      <div className="bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] px-4 py-4 rounded-t-md border border-[#3a1e21] border-b-0">
        <h1 className="text-white font-bold text-lg tracking-wide flex items-center gap-2"><Megaphone size={20} className="text-[#f0c87a]" /> Reklam Ver</h1>
        <p className="text-gray-300 text-[12px] mt-1">Server ya da hizmetinizi binlerce Metin2 oyuncusuna ulaştırın.</p>
      </div>
      <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md mb-5 p-5">
        {done ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg">Başvurunuz alındı!</h3>
            <p className="text-gray-400 text-sm mt-2">Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
            <button onClick={() => { setDone(false); setForm({ name: '', contact: '', message: '', ad_type: 'banner' }); }} className="mt-4 bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm px-4 py-2 rounded transition-colors">Yeni Başvuru</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3 max-w-xl">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] text-gray-300 mb-1">Ad Soyad / Marka</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
              </div>
              <div>
                <label className="block text-[12px] text-gray-300 mb-1">İletişim (Discord/E-posta)</label>
                <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-gray-300 mb-1">Reklam Türü</label>
              <select value={form.ad_type} onChange={(e) => setForm({ ...form, ad_type: e.target.value })} className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]">
                <option value="banner">Yan Banner</option>
                <option value="vip">VİP Konu</option>
                <option value="sponsor">Ana Sayfa Sponsor</option>
                <option value="other">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-gray-300 mb-1">Mesajınız</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} required className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
            </div>
            <button type="submit" disabled={submitting} className="bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm px-4 py-2 rounded disabled:opacity-60 transition-colors">
              {submitting ? 'Gönderiliyor...' : 'Başvuru Gönder'}
            </button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
