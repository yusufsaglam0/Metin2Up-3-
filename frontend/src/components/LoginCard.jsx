import React, { useState } from 'react';
import { User, Lock, UserPlus, LogIn } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export default function LoginCard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast({ title: 'Hata', description: 'Lütfen kullanıcı adı ve şifre giriniz.' });
      return;
    }
    localStorage.setItem('m2sef_user', JSON.stringify({ username, remember }));
    toast({ title: 'Giriş başarılı', description: `Hoşgeldin, ${username}!` });
  };

  return (
    <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md overflow-hidden">
      <div className="bg-gradient-to-b from-[#5a1418] to-[#3a0d10] px-4 py-3 flex items-center gap-2 border-b border-[#3a1e21]">
        <User size={16} className="text-[#f0c87a]" />
        <h3 className="text-white font-semibold text-sm tracking-wide">HOŞGELDİNİZ</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div>
          <label className="block text-[12px] text-gray-300 mb-1">Kullanıcı adı ya da e-posta adresi</label>
          <div className="relative">
            <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[12px] text-gray-300 mb-1">Parola</label>
          <div className="relative">
            <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-[#7a1f24]"
          />
          Beni hatırla
        </label>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 bg-[#1f1719] hover:bg-[#2a1f22] text-gray-100 text-sm py-2 rounded border border-[#3a1e21] flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={14} /> Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => toast({ title: 'Üye Ol', description: 'Kayıt formu açıldı (demo).' })}
            className="flex-1 bg-[#7a1f24] hover:bg-[#8a2429] text-white text-sm py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus size={14} /> Üye Ol
          </button>
        </div>
      </form>
    </div>
  );
}
