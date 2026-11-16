import React, { useState } from 'react';

export default function ReportsAuditView({ logs, users, showToast }) {
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    if (selectedUser !== 'all' && log.userId !== Number(selectedUser)) return false;
    if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const smsLogsCount = logs.filter(l => l.category === 'sms').length;
  const userMgmtLogsCount = logs.filter(l => l.category === 'user_mgmt').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* Üst Başlık & Aksiyonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">history_edu</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              Kullanıcı İşlem Raporları &amp; Denetim Günlüğü
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                Canlı Audit Log
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sistemde kimin ne zaman hangi SMS'i attığı, hangi ayarı veya rehberi değiştirdiği burada şeffafça listelenir
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => showToast('Denetim günlüğü raporu Excel formatında dışa aktarıldı', 'success')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Raporu Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* 4 Özet Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Toplam Kayıtlı İşlem</span>
            <div className="font-headline font-bold text-2xl text-slate-900 dark:text-white mt-0.5 tabular-nums">
              {logs.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-navy dark:text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">SMS Gönderim Olayı</span>
            <div className="font-headline font-bold text-2xl text-emerald-800 dark:text-emerald-400 mt-0.5 tabular-nums">
              {smsLogsCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">sms</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Kullanıcı &amp; Yetki İşlemi</span>
            <div className="font-headline font-bold text-2xl text-indigo-700 dark:text-indigo-400 mt-0.5 tabular-nums">
              {userMgmtLogsCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Tanımlı Yetkili Hesap</span>
            <div className="font-headline font-bold text-2xl text-navy dark:text-blue-400 mt-0.5 tabular-nums">
              {users.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          </div>
        </div>
      </div>

      {/* Filtre ve Arama Alanı */}
      <div className="bg-white dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Kullanıcıya Göre Filtre */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Kullanıcı:</span>
            <select 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
              className="text-xs font-semibold py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="all">Tüm Kullanıcılar</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.roleLabel})</option>
              ))}
            </select>
          </div>

          {/* Kategoriye Göre Filtre */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">İşlem Türü:</span>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold py-1.5 px-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="all">Tüm İşlemler</option>
              <option value="sms">SMS Gönderimleri</option>
              <option value="sync">e-Okul Senkronizasyonu</option>
              <option value="directory">Rehber Düzenleme</option>
              <option value="user_mgmt">Kullanıcı Yönetimi</option>
              <option value="settings">Ayar Değişikliği</option>
            </select>
          </div>
        </div>

        {/* Serbest Arama */}
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="İşlem açıklamalarında ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[16px]">search</span>
        </div>
      </div>

      {/* Rapor Tablosu */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">Tarih &amp; Saat</th>
                <th className="py-3 px-4">İşlemi Yapan Yetkili</th>
                <th className="py-3 px-3">İşlem / Kategori</th>
                <th className="py-3 px-4">Yapılan İşlemin Detayı</th>
                <th className="py-3 px-3">Durum</th>
                <th className="py-3 px-3 text-right">Cihaz / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-body">
                    Filtreleme kriterlerine uygun denetim kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-code text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            log.userRole.includes('Admin') ? 'bg-navy text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}>
                            {log.userName.charAt(0)}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white">{log.userName}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{log.userRole}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {log.category === 'sms' && <span className="material-symbols-outlined text-[13px] text-emerald">sms</span>}
                          {log.category === 'sync' && <span className="material-symbols-outlined text-[13px] text-teal">sync</span>}
                          {log.category === 'directory' && <span className="material-symbols-outlined text-[13px] text-blue-500">contacts</span>}
                          {log.category === 'user_mgmt' && <span className="material-symbols-outlined text-[13px] text-indigo-500">person_add</span>}
                          {log.category === 'settings' && <span className="material-symbols-outlined text-[13px] text-amber-500">tune</span>}
                          <span>{log.action}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-md font-body text-slate-800 dark:text-slate-200 leading-snug">
                        {log.description}
                      </td>
                      <td className="py-3 px-3">
                        {log.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span> Başarılı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Bilgi
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-code text-[11px] text-slate-400">
                        {log.ip || '192.168.1.10'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
