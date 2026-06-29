import React from 'react';
import { stats } from '../mock';
import { MessageSquare, Reply, Users, UserPlus } from 'lucide-react';

export default function StatsBar() {
  return (
    <div className="bg-[#1d1517] border border-[#3a1e21] rounded-md p-4 mb-5">
      <h3 className="text-[#e8c46b] font-bold text-sm mb-3 tracking-wide">FORUM İSTATİSTİKLERİ</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#c98a1a]" />
          <div>
            <div className="text-[11px] text-gray-400">Toplam Konu</div>
            <div className="text-white font-bold">{stats.totalTopics.toLocaleString('tr-TR')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Reply size={18} className="text-[#c98a1a]" />
          <div>
            <div className="text-[11px] text-gray-400">Toplam Cevap</div>
            <div className="text-white font-bold">{stats.totalReplies.toLocaleString('tr-TR')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users size={18} className="text-[#c98a1a]" />
          <div>
            <div className="text-[11px] text-gray-400">Üyeler</div>
            <div className="text-white font-bold">{stats.totalMembers.toLocaleString('tr-TR')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-[#c98a1a]" />
          <div>
            <div className="text-[11px] text-gray-400">Son Üye</div>
            <div className="text-white font-bold truncate max-w-[100px]">{stats.newestMember}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
