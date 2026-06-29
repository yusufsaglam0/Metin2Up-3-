import React from 'react';

export default function SideBanner({ side = 'left' }) {
  return (
    <div
      className={`hidden xl:flex fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-[200px] h-screen z-0 pointer-events-none select-none`}
      aria-hidden="true"
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Character image bg */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80')",
            filter: 'hue-rotate(-10deg) saturate(1.1) brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        {/* Logo + ad text */}
        <div className="relative h-full flex flex-col items-center pt-16 px-3 text-center">
          <div
            className="text-[34px] leading-[0.95] font-black tracking-tight"
            style={{
              fontFamily: "'Cinzel', 'Trajan Pro', serif",
              background: 'linear-gradient(180deg, #ffe27a 0%, #c98a1a 60%, #7c4a0a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            <div>METIN2</div>
            <div>SEFIRI</div>
          </div>
          <div className="mt-24 text-[#f3d27a] font-semibold text-sm tracking-wide">
            BU ALANA
          </div>
          <div className="text-[#f3d27a] font-extrabold text-xl tracking-wide leading-tight">
            REKLAM
          </div>
          <div className="text-[#f3d27a] font-extrabold text-xl tracking-wide leading-tight">
            VEREBİLİRİNİZ!
          </div>
          <div className="mt-6 text-[#f0c87a] text-[11px] opacity-90">
            <div>Reklam için iletişim</div>
            <div className="mt-1">Discord;</div>
            <div>discord.gg/metin2sefiri</div>
          </div>
        </div>
      </div>
    </div>
  );
}
