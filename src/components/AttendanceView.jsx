import React, { useState } from 'react';

export default function AttendanceView({ 
  attendanceList, 
  onSendBulkSms, 
  onSendSingleSms, 
  smsBalance 
}) {
  const [selectedClass, setSelectedClass] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredList = attendanceList.filter(item => {
    if (selectedClass === 'all') return true;
    return item.class === selectedClass;
  });

  const pendingCount = attendanceList.filter(i => i.smsStatus !== 'sent').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* Üst Başlık & Hızlı Eylemler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">bolt</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
              Devamsızlık e-Okul Otomasyon Ekranı
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bugün yoklamada devamsız yazılan öğrenciler ve otomatik SMS gönderimi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sınıf Filtresi */}
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 shadow-xs"
          >
            <option value="all">Tüm Şubeler (18 Kayıt)</option>
            <option value="9-A">9-A Bilişim Teknolojileri</option>
            <option value="10-B">10-B Elektrik-Elektronik</option>
            <option value="11-A">11-A Makine Teknolojisi</option>
            <option value="12-C">12-C Motorlu Araçlar</option>
          </select>

          {/* Toplu SMS Gönder Butonu */}
          <button 
            type="button"
            disabled={pendingCount === 0}
            onClick={() => setIsModalOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold shadow-xs transition-all ${
              pendingCount > 0 
                ? 'bg-emerald text-white hover:bg-emerald-600 active:scale-[0.98]' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>Tüm Bekleyenlere SMS Gönder ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* Devamsızlık Listesi Tablosu */}
      <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-4">Okul No</th>
                <th className="py-3 px-4">Öğrenci Adı Soyadı</th>
                <th className="py-3 px-3">Sınıf</th>
                <th className="py-3 px-3">Devamsızlık Durumu</th>
                <th className="py-3 px-4">Veli İletişim</th>
                <th className="py-3 px-3">SMS Durumu</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredList.map(item => {
                const isSent = item.smsStatus === 'sent';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-code font-bold text-navy dark:text-blue-400">{item.schoolNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {item.class}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${item.typeBadge}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{item.parentName}</span>
                        <span className="font-code text-[11px] text-slate-500 dark:text-slate-400">{item.parentPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {isSent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span> İletildi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isSent ? (
                        <button disabled className="px-2.5 py-1 text-slate-400 bg-slate-100 dark:bg-slate-800 rounded text-xs cursor-not-allowed">
                          Gönderildi
                        </button>
                      ) : (
                        <button 
                          onClick={() => onSendSingleSms(item.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-navy text-white rounded text-xs font-semibold hover:bg-blue-900 shadow-xs transition-all"
                        >
                          <span className="material-symbols-outlined text-[14px]">send</span> Gönder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toplu Gönderim Onay Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">send</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                  Toplu Devamsızlık SMS Gönderimi
                </h3>
                <p className="text-xs text-slate-500">e-Okul yoklama listesi Netgsm onayı</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Bekleyen Devamsız Öğrenci:</span>
                <span className="font-bold text-navy dark:text-blue-400">{pendingCount} Kişi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Düşülecek Netgsm Kredisi:</span>
                <span className="font-bold text-emerald">{pendingCount} Adet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Mevcut Netgsm Bakiyesi:</span>
                <span className="font-bold font-code">{smsBalance} Adet</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gönderim başlatıldığında velilere <em>"Sayın Velimiz, [Öğrenci Adı] bugün okula gelmemiştir..."</em> resmi bilgilendirme SMS'i Netgsm üzerinden iletilecektir.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
              >
                Vazgeç
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsModalOpen(false);
                  onSendBulkSms();
                }}
                className="px-5 py-2 text-xs font-bold bg-emerald text-white rounded-md hover:bg-emerald-600 shadow-xs"
              >
                Onayla ve Gönder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
