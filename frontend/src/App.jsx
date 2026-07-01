import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ totalMembers: 0, totalThreads: 0, onlineUsers: 1 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [isSubmittingThread, setIsSubmittingThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContentActual] = useState('');
  const [currentScreen, setCurrentScreen] = useState('forum'); 
  const [activeAdminTab, setActiveAdminTab] = useState('categories'); 
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatTags, setNewCatTags] = useState('Tasarım, Yazılım, Sosyal');
  const [newCatIcon, setNewCatIcon] = useState('💬'); 
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatTags, setEditCatTags] = useState('');
  const [mansetDuyuru, setMansetDuyuru] = useState('Metin2Up Gelişmiş Forum Dünyasına Hoş Geldiniz!'); 
  const [mansetInput, setMansetInput] = useState('');
  const [globalNotificationInput, setGlobalNotificationInput] = useState('');
  const [notifications, setNotifications] = useState(['Metin2Up yönetim üssü kalıcı sisteme bağlandı.']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [forumUsers, setForumUsers] = useState([
    { id: 1, name: 'DenemeOyuncu_01', email: 'player1@m2up.com', ip: '185.122.45.6', regDate: '2026-05-12', threadsCount: 14, status: 'Aktif' },
    { id: 2, name: 'KuralTanımaz_99', email: 'kural99@gmail.com', ip: '94.54.122.89', regDate: '2026-06-01', threadsCount: 2, status: 'Aktif' },
    { id: 3, name: 'LycanSever', email: 'wolfman@m2up.net', ip: '78.190.23.144', regDate: '2026-06-28', threadsCount: 45, status: 'Aktif' }
  ]);
  const [punishedUsers, setPunishedUsers] = useState([
    { name: 'Spamci_Reis', type: 'Susturuldu', duration: '3 Gün', ip: '46.2.88.11' },
    { name: 'Hileci_Dede', type: 'Banlandı', duration: 'Sınırsız', ip: '85.105.63.22' }
  ]);
  const fetchInitialData = () => {
    setLoading(true);
    fetch('/api/forum-data')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };
  useEffect(() => {
    fetchInitialData();
    const savedUser = localStorage.getItem('m2up_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { setMessage('Lütfen tüm alanları doldurun!'); return; }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const loggedInUser = { username: data.username, role: data.role || 'user' };
        const isBanned = punishedUsers.some(p => p.name.toLowerCase() === data.username.toLowerCase() && p.type === 'Banlandı');
        if(isBanned) { alert('Hesabınız kapatılmıştır!'); return; }
        setUser(loggedInUser);
        localStorage.setItem('m2up_user', JSON.stringify(loggedInUser));
        setMessage(''); setUsername(''); setPassword('');
      } else { setMessage('Kullanıcı adı veya şifre hatalı.'); }
    } catch (err) { setMessage('Sunucu hatası.'); }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) { setMessage('Lütfen tüm alanları doldurun!'); return; }
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (response.ok) {
        setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setIsRegistering(false); setUsername(''); setEmail(''); setPassword('');
      }
    } catch (err) { setMessage('Sunucu hatası.'); }
  };
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName || !newCatDesc) return;
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, desc: newCatDesc, tags: newCatTags }),
      });
      if (response.ok) {
        setNewCatName(''); setNewCatDesc('');
        alert('Kategori veritabanına kalıcı eklendi!');
        fetchInitialData();
      }
    } catch (error) { alert('Hata.'); }
  };
  const handleSaveCatEdit = async (cat) => {
    const name = editCatName || cat.name;
    const desc = editCatDesc || cat.desc;
    const tags = editCatTags || cat.tags;
    try {
      await fetch(`/api/admin/categories/${cat.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, desc, tags, isHidden: cat.isHidden, isLocked: cat.isLocked })
      });
      setEditingCatId(null);
      fetchInitialData();
    } catch (err) { alert('Güncellenemedi.'); }
  };
  const handleToggleHideCategory = async (cat) => {
    try {
      await fetch(`/api/admin/categories/${cat.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat.name, desc: cat.desc, tags: cat.tags, isHidden: !cat.isHidden, isLocked: cat.isLocked })
      });
      fetchInitialData();
    } catch (err) { alert('Hata.'); }
  };
  const handleToggleLockCategory = async (cat) => {
    try {
      await fetch(`/api/admin/categories/${cat.id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cat.name, desc: cat.desc, tags: cat.tags, isHidden: cat.isHidden, isLocked: !cat.isLocked })
      });
      fetchInitialData();
    } catch (err) { alert('Hata.'); }
  };
  const handleDeleteCategory = async (id, name) => {
    if(!window.confirm(`"${name}" veritabanından kalıcı olarak silinsin mi?`)) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchInitialData();
    } catch (err) { alert('Silinemedi.'); }
  };
  const handleSendGlobalNotification = (e) => {
    e.preventDefault();
    if(!globalNotificationInput) return;
    setNotifications([globalNotificationInput, ...notifications]);
    setGlobalNotificationInput('');
    alert('🔔 Bildirim tüm üyelere gönderildi.');
  };
  const handleBanUser = (targetUser, ip) => { 
    if (window.confirm(`${targetUser} isimli kullanıcıyı BANLAMAK istiyor musunuz?`)) {
      setPunishedUsers([...punishedUsers, { name: targetUser, type: 'Banlandı', duration: 'Sınırsız', ip: ip || 'Bilinmiyor' }]);
      setForumUsers(forumUsers.filter(u => u.name !== targetUser));
      alert(`${targetUser} forumdan uzaklaştırıldı.`);
    }
  };

  const handleDeleteUser = (targetUser) => {
    if (window.confirm(`${targetUser} kullanıcısını silmek istediğinize emin misiniz?`)) {
      setForumUsers(forumUsers.filter(u => u.name !== targetUser));
      alert(`${targetUser} tamamen silindi.`);
    }
  };

  const handleMuteUser = (targetUser, duration, ip) => {
    if (window.confirm(`${targetUser} isimli kullanıcıyı susturmak istiyor musunuz?`)) {
      setPunishedUsers([...punishedUsers, { name: targetUser, type: 'Susturuldu', duration, ip: ip || 'Bilinmiyor' }]);
      alert(`${targetUser} ${duration} süreyle susturuldu.`);
    }
  };
  return (
    <div className="App">
      <header className="forum-header">
        <h1>{mansetDuyuru}</h1>
      </header>
      
      <section className="forum-body">
        {threads.length > 0 ? (
          threads.map((t, idx) => (
            <div key={t.id} className="thread-item">
              <h3>{t.title}</h3>
              <p>{t.content}</p>
              
              {/* Sadece Yönetici Ekranında Çıkan Kontrol Elemanları */}
              {user && user.role === 'admin' && (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button className="sort-btn" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => {
                    const yeniBaslik = prompt("Konu başlığını düzenleyin:", t.title);
                    if (yeniBaslik) {
                      fetch(`/api/threads/${t.id}/update`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: yeniBaslik, content: t.content || '', isPinned: t.isPinned })
                      }).then(() => fetch(`/api/categories/${selectedCategory.id}/threads`).then(res => res.json()).then(data => setThreads(data || [])));
                    }
                  }}>Düzenle</button>

                  <button className="sort-btn" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => {
                    fetch(`/api/threads/${t.id}/update`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: t.title, content: t.content || '', isPinned: !t.isPinned })
                    }).then(() => fetch(`/api/categories/${selectedCategory.id}/threads`).then(res => res.json()).then(data => setThreads(data || [])));
                  }}>{t.isPinned ? 'Çöz' : 'Sabitle'}</button>

                  <button disabled={idx === 0} className="sort-btn" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => {
                    const updated = [...threads];
                    const temp = updated[idx]; updated[idx] = updated[idx - 1]; updated[idx - 1] = temp;
                    setThreads(updated);
                  }}>▲</button>

                  <button disabled={idx === threads.length - 1} className="sort-btn" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => {
                    const updated = [...threads];
                    const temp = updated[idx]; updated[idx] = updated[idx + 1]; updated[idx + 1] = temp;
                    setThreads(updated);
                  }}>▼</button>

                  <button className="action-link text-red" style={{ fontSize: '11px', marginLeft: '5px' }} onClick={() => {
                    if (window.confirm('Bu konuyu kalıcı olarak silmek istiyor musunuz?')) {
                      fetch(`/api/threads/${t.id}`, { method: 'DELETE' })
                        .then(() => fetch(`/api/categories/${selectedCategory.id}/threads`).then(res => res.json()))
                        .then(data => setThreads(data || []));
                    }
                  }}>Sil</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Bu kategoride henüz hiç konu açılmamış.</p>
        )}
      </section>
      <aside className="sidebar-container">
        <div className="modern-card text-center">
          {user ? (
            <div>
              <h3>Hesabım</h3>
              <p>Kullanıcı: <b>{user.username}</b></p>
            </div>
          ) : (
            <div>
              <h3>{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</h3>
              <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} />
                {isRegistering && <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />}
                <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</button>
              </form>
              <p onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: '10px', cursor: 'pointer', color: 'var(--accent)' }}>
                {isRegistering ? 'Zaten hesabın var mı? Giriş Yap' : 'Hesabın yok mu? Kayıt Ol'}
              </p>
              {message && <p className="message-box">{message}</p>}
            </div>
          )}
        </div>

        <div className="modern-card">
          <h3>İstatistikler</h3>
          <div className="stats-row"><span className="stats-label">Üye:</span> <span>{stats.totalMembers}</span></div>
          <div className="stats-row"><span className="stats-label">Konu:</span> <span>{stats.totalThreads}</span></div>
        </div>
      </aside>
    </div>
  );
}

export default App;
