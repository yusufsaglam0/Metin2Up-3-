import React, { useState } from 'react';
import { Bell, Mail, Search, User, Menu, X, Server, Megaphone, Award, Shield } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Anasayfa', to: '/', icon: null },
  { label: 'Metin2 Pvp Sunucular', to: '/sub/sf-1-105', icon: Server },
  { label: 'Açılacak PvP Serverler', to: '/acilacak', icon: Megaphone },
  { label: 'Rütbe Sistemi', to: '/rutbe', icon: Award },
  { label: 'Reklam', to: '/reklam', icon: null, highlight: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#1a1416] border-b border-[#3a1e21] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1100px] mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          <Link to="/" className="flex items-center shrink-0">
            <div className="text-[#e8c46b] font-black text-lg tracking-tight leading-none" style={{ fontFamily: "'Cinzel', serif" }}>
              <span className="text-2xl" style={{ background: 'linear-gradient(180deg, #ffe27a, #c98a1a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>METIN2</span>
              <div className="text-[10px] text-[#c98a1a] tracking-[0.3em] mt-1">SEFIRI</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.label} to={link.to} end={link.to === '/'}
                  className={({ isActive }) => `px-3 py-2 text-[13px] font-medium rounded transition-colors flex items-center gap-1.5 ${isActive ? 'text-white bg-[#7a1f24]' : 'text-gray-200 hover:text-white hover:bg-[#2a1518]'} ${link.highlight ? 'text-[#ffb04a]' : ''}`}>
                  {Icon && <Icon size={14} />}
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen((s) => !s)} className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors" aria-label="Ara"><Search size={18} /></button>
            <button className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors relative" aria-label="Mesajlar">
              <Mail size={18} />
              {user && <span className="absolute -top-0.5 -right-0.5 bg-[#c5252b] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>}
            </button>
            <button className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors relative" aria-label="Bildirimler">
              <Bell size={18} />
              {user && <span className="absolute -top-0.5 -right-0.5 bg-[#c5252b] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>}
            </button>
            {user?.is_admin && (
              <button onClick={() => navigate('/admin')} className="hidden sm:flex p-2 rounded text-[#ef4444] hover:text-white hover:bg-[#5a1418] transition-colors items-center gap-1" aria-label="Admin" title="Admin Paneli">
                <Shield size={18} />
              </button>
            )}
            {user ? (
              <button onClick={() => navigate(`/profile/${user.username}`)} className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors" aria-label="Profil">
                <User size={18} />
              </button>
            ) : null}
            <button className="lg:hidden p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors" onClick={() => setMobileOpen((m) => !m)} aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="py-2 border-t border-[#2a1518]">
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Forumda ara..." autoFocus
              className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]" />
          </div>
        )}

        {mobileOpen && (
          <div className="lg:hidden py-2 border-t border-[#2a1518] flex flex-col gap-1 pb-3">
            {navItems.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink key={link.label} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `px-3 py-2 text-sm rounded flex items-center gap-2 ${isActive ? 'bg-[#7a1f24] text-white' : 'text-gray-200 hover:bg-[#2a1518]'}`}>
                  {Icon && <Icon size={16} />}
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
