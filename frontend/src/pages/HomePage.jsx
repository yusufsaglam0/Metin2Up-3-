import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Header from '../components/Header';
import SideBanner from '../components/SideBanner';
import VipSection from '../components/VipSection';
import ForumCategory from '../components/ForumCategory';
import LoginCard from '../components/LoginCard';
import AdCard from '../components/AdCard';
import StatsBar from '../components/StatsBar';
import { forumCategories } from '../mock';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0809] text-gray-200 relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background grain/dark texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at top, #1a0d0f 0%, #0d0809 60%, #050304 100%)',
        }}
      />

      <SideBanner side="left" />
      <SideBanner side="right" />

      <div className="relative z-10 xl:px-[200px]">
        <Header />

        {/* Breadcrumb */}
        <div className="max-w-[1100px] mx-auto px-3 sm:px-4 pt-3">
          <div className="flex items-center gap-1 text-[12px] text-gray-400">
            <Home size={12} />
            <ChevronRight size={12} />
            <span className="text-gray-300">Anasayfa</span>
          </div>
        </div>

        <main className="max-w-[1100px] mx-auto px-3 sm:px-4 py-4">
          <div className="flex gap-5">
            {/* Forum content */}
            <div className="flex-1 min-w-0">
              <VipSection />
              {forumCategories.map((cat) => (
                <ForumCategory key={cat.id} category={cat} />
              ))}
              <StatsBar />
            </div>

            {/* Right sidebar */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="sticky top-20">
                <div className="flex justify-end mb-2">
                  <button className="text-[11px] text-gray-400 hover:text-gray-200 flex items-center gap-1">
                    Yan Alanı Gizle <ChevronRight size={11} />
                  </button>
                </div>
                <LoginCard />
                <AdCard />
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#2a1518] bg-[#0a0607] mt-8">
          <div className="max-w-[1100px] mx-auto px-4 py-6 text-center">
            <div className="text-[#c98a1a] font-bold text-lg tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
              METIN2 SEFIRI
            </div>
            <div className="text-gray-500 text-[11px] mt-2">
              © {new Date().getFullYear()} Metin2Sefiri.com – Tüm hakları saklıdır. Metin2 PVP Server Tanıtım Forumu.
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[12px]">
              <a href="#" className="text-gray-400 hover:text-[#e8c46b]">Anasayfa</a>
              <a href="#" className="text-gray-400 hover:text-[#e8c46b]">İletişim</a>
              <a href="#" className="text-gray-400 hover:text-[#e8c46b]">Reklam</a>
              <a href="#" className="text-gray-400 hover:text-[#e8c46b]">Discord</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
