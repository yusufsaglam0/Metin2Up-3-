import React, { useState } from 'react';
import { Bell, Mail, Search, Settings, User, Menu, X, Server, Megaphone, Award, Tag } from 'lucide-react';
import { navLinks } from '../mock';

const iconMap = { server: Server, megaphone: Megaphone, award: Award };

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1a1416] border-b border-[#3a1e21] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1100px] mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <div className="text-[#e8c46b] font-black text-lg tracking-tight leading-none" style={{ fontFamily: "'Cinzel', serif" }}>
              <div className="flex items-baseline">
                <span className="text-2xl" style={{ background: 'linear-gradient(180deg, #ffe27a, #c98a1a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>METIN2</span>
              </div>
              <div className="text-[10px] text-[#c98a1a] tracking-[0.3em] mt-1">SEFIRI</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon ? iconMap[link.icon] : null;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 py-2 text-[13px] font-medium rounded transition-colors flex items-center gap-1.5
                    ${link.active ? 'text-white bg-[#7a1f24]' : 'text-gray-200 hover:text-white hover:bg-[#2a1518]'}
                    ${link.highlight && !link.active ? 'text-[#ffb04a]' : ''}
                  `}
                >
                  {Icon && <Icon size={14} />}
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right tools */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <div className="relative">
              <button className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors relative">
                <Mail size={18} />
                <span className="absolute -top-0.5 -right-0.5 bg-[#c5252b] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>
              </button>
            </div>
            <div className="relative">
              <button className="p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors relative">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 bg-[#c5252b] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>
              </button>
            </div>
            <button
              className="lg:hidden p-2 rounded text-gray-300 hover:text-white hover:bg-[#2a1518] transition-colors"
              onClick={() => setMobileOpen((m) => !m)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="py-2 border-t border-[#2a1518]">
            <input
              type="text"
              placeholder="Forumda ara..."
              autoFocus
              className="w-full bg-[#0f0a0b] border border-[#3a1e21] text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#7a1f24]"
            />
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-2 border-t border-[#2a1518] flex flex-col gap-1 pb-3">
            {navLinks.map((link) => {
              const Icon = link.icon ? iconMap[link.icon] : null;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-sm rounded flex items-center gap-2 ${link.active ? 'bg-[#7a1f24] text-white' : 'text-gray-200 hover:bg-[#2a1518]'}`}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
