import React, { useState } from 'react';
import { Pin, ChevronUp, ChevronDown, CheckCircle2, MessageCircle } from 'lucide-react';
import { vipTopics } from '../mock';

export default function VipSection() {
  const [open, setOpen] = useState(true);
  return (
    <section className="mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] hover:from-[#6a181c] px-3 sm:px-4 py-3 flex items-center gap-3 rounded-t-md border border-[#3a1e21] border-b-0 transition-colors"
      >
        <div className="w-9 h-9 rounded bg-black/30 flex items-center justify-center border border-[#3a1e21]">
          <Pin size={15} className="text-[#f0c87a]" />
        </div>
        <h2 className="flex-1 text-left text-white font-bold text-[15px] tracking-wide">VİP Konu Alanı</h2>
        {open ? <ChevronUp size={18} className="text-gray-300" /> : <ChevronDown size={18} className="text-gray-300" />}
      </button>

      {open && (
        <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md">
          <div className="px-4 py-2 text-[12px] text-gray-400 border-b border-[#2a1a1c] bg-[#13090a]">
            Buradaki konulara yorum yapılamaz. Lütfen reklam için iletişime geçin.
          </div>
          {vipTopics.map((topic) => (
            <div key={topic.id} className="flex items-center gap-3 px-3 sm:px-4 py-3 border-t border-[#2a1a1c] hover:bg-[#1d1416]/60 transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0f0a0b] border border-[#3a1e21] shrink-0">
                <img src={topic.authorAvatar} alt={topic.author} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <a href="#" className="block text-[14px] font-semibold text-gray-100 hover:text-[#e8c46b] line-clamp-1">
                  {topic.title}
                </a>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {topic.author}
                  {topic.verified && <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1" />}
                </div>
              </div>
              <div className="hidden sm:block shrink-0 w-[80px] bg-[#0f0a0b] border border-[#2a1a1c] rounded text-center py-1.5 px-2">
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Cevaplar</div>
                <div className="text-[14px] font-bold text-gray-100">{topic.replies}</div>
              </div>
              <div className="hidden md:flex shrink-0 w-[210px] items-center gap-2">
                {topic.lastReply ? (
                  <>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0f0a0b] border border-[#3a1e21] shrink-0">
                      <img src={topic.lastReply.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] text-gray-200 line-clamp-1">{topic.lastReply.text}</div>
                      <div className="text-[11px] text-gray-400 truncate">
                        <MessageCircle size={9} className="inline-block mr-1 opacity-60" />
                        {topic.lastReply.user}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] text-gray-500">Gösterim: {topic.views}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
