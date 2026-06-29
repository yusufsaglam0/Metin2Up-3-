import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export default function AuthPage({ mode = 'login' }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(username, email, password);
        toast({ title: 'Hesabınız oluşturuldu', description: `Hoşgeldin ${username}!` });
      } else {
        await login(username, password);
        toast({ title: 'Giriş başarılı' });
      }
      navigate('/');
    } catch (err) {
      toast({ title: 'Hata', description: err?.response?.data?.detail || 'Bir hata oluştu' });
    } finally { setSubmitting(false); }
  };

  return (
    <PageLayout breadcrumbs={[{ label: isRegister ? 'Üye Ol' : 'Giriş Yap' }]} hideSidebar>
      <div className="max-w-md mx-auto bg-[#1d1517] border border-[#3a1e21] rounded-md overflow-hidden">
        <div className="bg-gradient-to-b from-[#5a1418] to-[#3a0d10] px-4 py-3 border-b border-[#3a1e21] flex items-center gap-2">
          {isRegister ? <UserPlus className="text-[#f0c87a]" size={18} /> : <LogIn className="text-[#f0c87a]" size={18} />}
          <h1 className="text-white font-bold text-sm tracking-wider">{isRegister ? 'ÜYE OL' : 'GİRİŞ YAP'}</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-[12px] text-gray-300 mb-1">Kullanıcı adı</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
          </div>
          {isRegister && (
            <div>
              <label className="block text-[12px] text-gray-300 mb-1">E-posta</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
            </div>
          )}
          <div>
            <label className="block text-[12px] text-gray-300 mb-1">Parola</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm py-2 rounded disabled:opacity-60 transition-colors">
            {submitting ? 'Lütfen bekleyin...' : (isRegister ? 'Üye Ol' : 'Giriş Yap')}
          </button>
          <div className="text-center text-[12px] text-gray-400 pt-2">
            {isRegister ? (
              <>Hesabınız var mı? <Link to="/login" className="text-[#e8c46b] hover:underline">Giriş yapın</Link></>
            ) : (
              <>Hesabınız yok mu? <Link to="/register" className="text-[#e8c46b] hover:underline">Üye olun</Link></>
            )}
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
