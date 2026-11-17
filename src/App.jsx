import React, { useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_LOGS,
  INITIAL_NETGSM_SETTINGS,
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_DIRECTORY,
  INITIAL_EOKUL_STAGING
} from './data/mockData';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AutomationStudentsView from './components/AutomationStudentsView';
import MessageSenderView from './components/MessageSenderView';
import DirectoryView from './components/DirectoryView';
import ReportsAuditView from './components/ReportsAuditView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Kullanıcı & Oturum State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Varsayılan: Admin

  // Denetim Günlüğü State
  const [logs, setLogs] = useState(INITIAL_LOGS);

  // Rehber State
  const [directoryList, setDirectoryList] = useState(INITIAL_DIRECTORY);

  // Sistem Ayarları State
  const [netgsmSettings, setNetgsmSettings] = useState(INITIAL_NETGSM_SETTINGS);
  const [schoolSettings, setSchoolSettings] = useState(INITIAL_SCHOOL_SETTINGS);

  // Otomasyon Öğrenci / e-Okul State
  const [eOkulStagingList, setEOkulStagingList] = useState(INITIAL_EOKUL_STAGING);
  const [isFetchingEOkul, setIsFetchingEOkul] = useState(false);

  // Son e-Okul Veri Çekilme Bilgisi
  const [lastSyncInfo, setLastSyncInfo] = useState({
    time: "16 Kasım 2026 • 21:15",
    user: "Admin (Admin)"
  });

  // Toast Bildirim State
  const [toasts, setToasts] = useState([]);

  // Site HER ZAMAN karanlık temada
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Toast Bildirim Fonksiyonu
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Denetim Günlüğü (Audit Log) Ekleme Fonksiyonu
  const addLog = (action, category, description, status = 'success') => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newLog = {
      id: Date.now(),
      timestamp,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.roleLabel,
      action,
      category,
      description,
      status,
      ip: '192.168.1.10'
    };

    setLogs(prev => [newLog, ...prev]);
  };

  // EYLEM: Manuel SMS Gönderme
  const handleSendManualSms = ({ targetDesc, count, messageText }) => {
    setNetgsmSettings(prev => ({ ...prev, balance: prev.balance - count }));

    addLog(
      'Manuel Mesaj Gönderimi',
      'sms',
      `"${targetDesc}" hedefine toplam ${count} adet SMS iletildi. İçerik özeti: "${messageText.substring(0, 45)}..."`
    );

    showToast(`${targetDesc} için ${count} adet SMS başarıyla kuyruğa alındı ve iletildi!`, 'success');
  };

  // EYLEM: Öğrenci / Veli Bilgisi Güncelleme
  const handleUpdateStudent = (id, data) => {
    setDirectoryList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...data
        };
      }
      return item;
    }));

    const targetStudent = directoryList.find(i => i.id === id);
    addLog(
      'Rehber İletişim Güncellemesi',
      'directory',
      `${targetStudent?.name || id} öğrencisinin veli iletişim telefonu güncellendi.`
    );

    showToast('Veli iletişim bilgileri başarıyla güncellendi!', 'success');
  };

  // EYLEM: Yeni Kullanıcı Tanımlama (Admin Yetkisi: Ad Soyad, Telefon No, Şifre, Rol)
  const handleAddUser = (userData) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const today = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;

    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: today,
      lastLogin: 'Henüz giriş yapmadı'
    };

    setUsers(prev => [...prev, newUser]);

    addLog(
      'Yeni Kullanıcı Oluşturuldu',
      'user_mgmt',
      `${newUser.name} (${newUser.roleLabel} - Tel: ${newUser.phone}) adına yeni yetkili sistem hesabı tanımlandı.`
    );

    showToast(`${newUser.name} (${newUser.roleLabel}) hesabı başarıyla oluşturuldu!`, 'success');
  };

  // EYLEM: Kullanıcı Silme (Admin Yetkisi)
  const handleDeleteUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    if (target.role === 'admin') {
      showToast('Ana Admin hesabı silinemez!', 'error');
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));

    addLog(
      'Kullanıcı Hesabı Silindi',
      'user_mgmt',
      `${target.name} (${target.roleLabel}) hesabı sistemden kaldırıldı.`
    );

    showToast(`${target.name} kullanıcısı silindi.`, 'info');
  };

  // EYLEM: Kullanıcı Değiştirme (Simülasyon / Başka Hesaba Giriş)
  const handleSwitchUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addLog(
        'Hesap Değişimi Yapıldı',
        'user_mgmt',
        `${target.name} (${target.roleLabel}) hesabına vekaleten oturum açıldı.`
      );
      showToast(`Giriş yapıldı: ${target.name} (${target.roleLabel})`, 'info');
    }
  };

  // EYLEM: Admin Hesabına Geri Dön
  const handleReturnToAdmin = () => {
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      setCurrentUser(adminUser);
      showToast('Ana Admin hesabına geri dönüldü.', 'success');
    }
  };

  // EYLEM: Otomasyon Öğrenci - Tekil Devamsızlık Mesajı Gönderme
  const handleSendSingleAutomationSms = (item) => {
    setEOkulStagingList(prev => prev.map(i => i.id === item.id ? { ...i, smsStatus: 'sent', sentAt: 'Az önce' } : i));
    setNetgsmSettings(prev => ({ ...prev, balance: prev.balance - 1 }));

    addLog(
      'e-Okul Devamsızlık SMS Gönderimi',
      'sms',
      `${item.name} (${item.class}) velisine (${item.parentPhone}) '${item.attendanceType}' devamsızlık SMS'i gönderildi.`
    );

    showToast(`${item.name} velisine devamsızlık SMS'i iletildi!`, 'success');
  };

  // EYLEM: Otomasyon Öğrenci - Toplu Devamsızlık Mesajı Gönderme
  const handleSendBulkAutomationSms = (ids) => {
    const targetItems = eOkulStagingList.filter(i => ids.includes(i.id) && i.smsStatus === 'pending');
    const count = targetItems.length;
    if (count === 0) return;

    setEOkulStagingList(prev => prev.map(i => ids.includes(i.id) ? { ...i, smsStatus: 'sent', sentAt: 'Az önce' } : i));
    setNetgsmSettings(prev => ({ ...prev, balance: prev.balance - count }));

    addLog(
      'Toplu e-Okul SMS Gönderimi',
      'sms',
      `${count} adet devamsız öğrenci velisine Netgsm onaylı '${netgsmSettings.header}' başlığı ile bildirim yapıldı.`
    );

    showToast(`${count} adet veliye devamsızlık SMS'i başarıyla gönderildi!`, 'success');
  };

  // EYLEM: e-Okul Veri Yenile (Eklentiden Taze Veri Çekme)
  const handleRefreshEOkulData = () => {
    if (isFetchingEOkul) return;
    setIsFetchingEOkul(true);

    setTimeout(() => {
      setIsFetchingEOkul(false);
      
      const newItems = [
        {
          id: `eokul-${Date.now()}-1`,
          schoolNo: '1134',
          name: 'Kadir Mert Doğan',
          class: '10-A',
          attendanceType: 'Öğleden Önce Yok',
          detail: '1. ve 2. ders blok yoklama',
          parentName: 'Recep Doğan (Baba)',
          parentPhone: '0537 222 33 44',
          fetchedAt: 'Az önce',
          smsStatus: 'pending',
          isProcessed: true
        },
        {
          id: `eokul-${Date.now()}-2`,
          schoolNo: '2155',
          name: 'Büşra Çelik',
          class: '11-C',
          attendanceType: 'Tam Gün Yok',
          detail: 'Sabah ve Öğle devamsız (Özürsüz)',
          parentName: 'Ayşe Çelik (Anne)',
          parentPhone: '0546 555 11 22',
          fetchedAt: 'Az önce',
          smsStatus: 'pending',
          isProcessed: true
        },
        {
          id: `eokul-${Date.now()}-3`,
          schoolNo: '3088',
          name: 'Serhat Yavuz',
          class: '9-B',
          attendanceType: 'Öğleden Sonra Yok',
          detail: '5, 6, 7. derslerde sınıfta yok',
          parentName: 'Metin Yavuz (Baba)',
          parentPhone: '0507 999 44 33',
          fetchedAt: 'Az önce',
          smsStatus: 'pending',
          isProcessed: true
        }
      ];

      setEOkulStagingList(prev => [...newItems, ...prev]);

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const formattedDate = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
      const formattedTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const syncTimeStr = `${formattedDate} • ${formattedTime}`;
      const syncUserStr = `${currentUser.name} (${currentUser.roleLabel})`;
      
      setLastSyncInfo({
        time: syncTimeStr,
        user: syncUserStr
      });

      addLog(
        'e-Okul Verileri Yenilendi',
        'automation',
        `Chrome eklentisi köprüsünden 3 yeni devamsızlık kaydı çekildi ve listeye eklendi. (İşlem Yapan: ${syncUserStr})`
      );

      showToast(`e-Okul verileri yenilendi! (${syncUserStr})`, 'info');
    }, 1100);
  };

  const pendingStagingCount = eOkulStagingList.filter(i => i.smsStatus === 'pending').length;
  const isImpersonating = currentUser.role !== 'admin';

  return (
    <div className={`flex min-h-screen w-full relative bg-[#020617] text-slate-100 font-body antialiased ${
      isImpersonating ? 'pb-14' : ''
    }`}>
      
      {/* Sol Sidebar */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        smsBalance={netgsmSettings.balance}
        currentUser={currentUser}
        pendingStagingCount={pendingStagingCount}
        lastSyncInfo={lastSyncInfo}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Ana Çalışma Alanı */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617]">
        
        {/* Üst Header: Canlı Saat/Tarih ve Sağ Üstte 'Giriş: Kim Olduğu' */}
        <Header 
          currentUser={currentUser}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* isFetchingEOkul: "e-Okul Veri Yenile" butonu tıklandığında üstte yükleme çubuğu gösterir */}
        {isFetchingEOkul && (
          <div className="bg-teal-950 text-teal-200 px-6 py-2.5 border-b border-teal-800">
            <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>e-Okul'dan veriler çekiliyor...</span>
                </span>
                <span className="font-code text-teal-400">Otomasyon Botu</span>
              </div>
              <div className="w-full h-1.5 bg-teal-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Genel Bakış */}
        {currentTab === 'dashboard' && (
          <DashboardView 
            setCurrentTab={setCurrentTab}
            pendingStagingCount={pendingStagingCount}
            smsBalance={netgsmSettings.balance}
            currentUser={currentUser}
            lastSyncInfo={lastSyncInfo}
            showToast={showToast}
          />
        )}

        {/* Otomasyon Öğrenci — e-Okul Devamsızlık Masası */}
        {currentTab === 'automation_students' && (
          <AutomationStudentsView 
            stagingList={eOkulStagingList}
            onSendSingleSms={handleSendSingleAutomationSms}
            onSendBulkSms={handleSendBulkAutomationSms}
            onRefreshEOkulData={handleRefreshEOkulData}
            isRefreshing={isFetchingEOkul}
            smsBalance={netgsmSettings.balance}
            lastSyncInfo={lastSyncInfo}
            showToast={showToast}
          />
        )}

        {currentTab === 'send_sms' && (
          <MessageSenderView 
            onSendManualSms={handleSendManualSms}
            smsBalance={netgsmSettings.balance}
            showToast={showToast}
          />
        )}

        {currentTab === 'directory' && (
          <DirectoryView 
            directoryList={directoryList}
            onUpdateStudent={handleUpdateStudent}
            showToast={showToast}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsAuditView 
            logs={logs}
            users={users}
            showToast={showToast}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView 
            netgsmSettings={netgsmSettings}
            onSaveNetgsmSettings={(updated) => {
              setNetgsmSettings(prev => ({ ...prev, ...updated }));
              addLog('Netgsm API Ayarları Güncellendi', 'settings', 'Netgsm API parametreleri ve SMS başlığı güncellendi.');
              showToast('Netgsm ayarları başarıyla kaydedildi!', 'success');
            }}
            schoolSettings={schoolSettings}
            onSaveSchoolSettings={(updated) => {
              setSchoolSettings(prev => ({ ...prev, ...updated }));
              addLog('Okul Bilgileri Güncellendi', 'settings', 'Okul resmi adı ve iletişim bilgileri güncellendi.');
              showToast('Kurum bilgileri güncellendi!', 'success');
            }}
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onSwitchUser={handleSwitchUser}
            showToast={showToast}
          />
        )}

      </main>

      {/* YENİ: ALTTAN SABİT 'ADMIN LOGIN SISTEM' BARI (BAŞKA HESAPTA OLUNDUĞUNDA GÖRÜNÜR) */}
      {isImpersonating && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-t border-amber-700/80 px-4 md:px-8 py-2.5 shadow-2xl flex items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-[20px] animate-pulse">security</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <strong className="text-amber-300 font-bold tracking-wide uppercase">Admin Login Sistem:</strong>
              <span>Şu anda <strong className="text-white underline">{currentUser?.name}</strong> (<span className="text-amber-300 font-semibold">{currentUser?.roleLabel}</span>) hesabındasınız.</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleReturnToAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Admin Hesabına Geri Dön</span>
          </button>
        </div>
      )}

      {/* Floating Toast Bildirim Konteyneri */}
      <div className={`fixed right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none transition-all ${
        isImpersonating ? 'bottom-16' : 'bottom-5'
      }`}>
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-lg shadow-lg border text-sm font-medium animate-fadeIn ${
              toast.type === 'success' ? 'bg-slate-900 text-emerald-300 border-emerald-700' :
              toast.type === 'error' ? 'bg-slate-900 text-red-400 border-red-800' :
              'bg-slate-900 text-blue-300 border-blue-800'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] flex-shrink-0 ${
              toast.type === 'success' ? 'text-emerald' : toast.type === 'error' ? 'text-crimson' : 'text-blue-400'
            }`}>
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="flex-1 text-xs">{toast.message}</span>
            <button 
              type="button" 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
