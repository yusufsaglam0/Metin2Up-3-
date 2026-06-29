import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Header from './Header';
import SideBanner from './SideBanner';
import LoginCard from './LoginCard';
import AdCard from './AdCard';
import { Link } from 'react-router-dom';

export default function PageLayout({ children, breadcrumbs = [], hideSidebar = false }) {
  return (
    <div className="min-h-screen bg-[#0d0809] text-gray-200 relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{ background: 'radial-gradient(ellipse at top, #1a0d0f 0%, #0d0809 60%, #050304 100%)' }} />
      <SideBanner side="left" />
      <SideBanner side="right" />
      <div className="relative z-10 xl:px-[200px]">
        <Header />
        <div className="max-w-[1100px] mx-auto px-3 sm:px-4 pt-3">
          <div className="flex items-center gap-1 text-[12px] text-gray-400 flex-wrap">
            <Link to="/" className="flex items-center gap-1 hover:text-[#e8c46b]"><Home size={12} /> Anasayfa</Link>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <ChevronRight size={12} />
                {b.href ? <Link to={b.href} className="hover:text-[#e8c46b]">{b.label}</Link> : <span className="text-gray-300">{b.label}</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <main className="max-w-[1100px] mx-auto px-3 sm:px-4 py-4">
          <div className="flex gap-5">
            <div className="flex-1 min-w-0">{children}</div>
            {!hideSidebar && (
              <aside className="hidden lg:block w-[260px] shrink-0">
                <div className="sticky top-20">
                  <LoginCard />
                  <AdCard />
                </div>
              </aside>
            )}
          </div>
        </main>
        <footer className="border-t border-[#2a1518] bg-[#0a0607] mt-8">
          <div className="max-w-[1100px] mx-auto px-4 py-6 text-center">
            <div className="text-[#c98a1a] font-bold text-lg tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>METIN2UP</div>
            <div className="text-gray-500 text-[11px] mt-2">© {new Date().getFullYear()} Metin2UP.com – Tüm hakları saklıdır. Metin2 PVP Server Tanıtım Forumu.</div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[12px] flex-wrap">
              <Link to="/" className="text-gray-400 hover:text-[#e8c46b]">Anasayfa</Link>
              <Link to="/reklam" className="text-gray-400 hover:text-[#e8c46b]">Reklam</Link>
              <Link to="/rutbe" className="text-gray-400 hover:text-[#e8c46b]">Rütbe Sistemi</Link>
              <Link to="/acilacak" className="text-gray-400 hover:text-[#e8c46b]">Açılacak PvP</Link>
              <a href="https://discord.gg/metin2up" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#e8c46b]">Discord</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
