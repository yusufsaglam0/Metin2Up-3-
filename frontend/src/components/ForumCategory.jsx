import React, { useState } from 'react';
import { MessageCircle, ChevronUp, ChevronDown, CheckCircle2, Sparkles, Code2, Image as ImageIcon, Users, Video } from 'lucide-react';

const categoryIconMap = {
  emek: Sparkles,
  kolay: Sparkles,
  hata: MessageCircle,
  genel: Users,
  developer: Code2,
  video: Video,
};

function VerifiedBadge() {
  return (
    <CheckCircle2 size={11} className="inline-block text-[#48a4f5] ml-1 align-middle" />
  );
}

function SubForumRow({ sub }) {
  return (
    <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-t border-[#2a1a1c] hover:bg-[#1d1416]/60 transition-colors">
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#2a1417] to-[#1a0d0f] border border-[#3a1e21] flex items-center justify-center">
        <MessageCircle size={16} className="text-[#c98a1a]" />
      </div>
      {/* Title + desc */}
      <div className="flex-1 min-w-0">
        <a href="#" className="block text-[14px] font-semibold text-gray-100 hover:text-[#e8c46b] transition-colors truncate">
          {sub.name}
        </a>
        {sub.description && (
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{sub.description}</p>
        )}
      </div>
      {/* Counts */}
      <div className="hidden sm:flex shrink-0 w-[80px] bg-[#0f0a0b] border border-[#2a1a1c] rounded text-center py-1.5 px-2">
        <div className="w-full">
          <div className="text-[10px] uppercase tracking-wider text-gray-400">Konular</div>
          <div className="text-[14px] font-bold text-gray-100">{sub.topics}</div>
        </div>
      </div>
      {/* Last post */}
      <div className="hidden md:flex shrink-0 w-[210px] items-center gap-2">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0f0a0b] border border-[#3a1e21] shrink-0">
          {sub.lastPost?.avatar ? (
            <img src={sub.lastPost.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#2a1417] to-[#1a0d0f]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {sub.lastPost?.isNew && (
            <span className="inline-block bg-[#c5252b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded mr-1">
              Yeni
            </span>
          )}
          <a href="#" className="text-[12px] text-gray-200 hover:text-[#e8c46b] line-clamp-1" title={sub.lastPost?.title}>
            {sub.lastPost?.title}
          </a>
          <div className="text-[11px] text-gray-400 truncate">
            <MessageCircle size={9} className="inline-block mr-1 opacity-60" />
            {sub.lastPost?.user}
            {sub.lastPost?.verified && <VerifiedBadge />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForumCategory({ category }) {
  const [open, setOpen] = useState(true);
  const Icon = categoryIconMap[category.id] || MessageCircle;

  return (
    <section className="mb-5">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full bg-gradient-to-r from-[#5a1418] via-[#3a0d10] to-[#2a0a0d] hover:from-[#6a181c] hover:via-[#430f13] px-3 sm:px-4 py-3 flex items-center gap-3 rounded-t-md border border-[#3a1e21] border-b-0 transition-colors"
      >
        <div className="w-9 h-9 rounded bg-black/30 flex items-center justify-center border border-[#3a1e21]">
          <Icon size={16} className="text-[#f0c87a]" />
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-white font-bold text-[15px] tracking-wide">{category.title}</h2>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-300" /> : <ChevronDown size={18} className="text-gray-300" />}
      </button>

      {open && (
        <div className="bg-[#16101177] border border-[#3a1e21] rounded-b-md">
          {category.description && (
            <div className="px-4 py-2 text-[12px] text-gray-400 border-b border-[#2a1a1c] bg-[#13090a]">
              {category.description}
            </div>
          )}
          {category.subForums.map((sub) => (
            <SubForumRow key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </section>
  );
}
