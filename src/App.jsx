import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USERS, 
  INITIAL_LOGS, 
  INITIAL_NETGSM_SETTINGS, 
  INITIAL_SCHOOL_SETTINGS, 
  INITIAL_ATTENDANCE, 
  INITIAL_DIRECTORY,
  INITIAL_EOKUL_STAGING
} from './data/mockData';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AttendanceView from './components/AttendanceView';
import AutomationStudentsView from './components/AutomationStudentsView';
import MessageSenderView from './components/MessageSenderView';
import DirectoryView from './components/DirectoryView';
import ReportsAuditView from './components/ReportsAuditView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // App Core State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Varsayılan: Admin (Yönetici)
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [attendanceList, setAttendanceList] = useState(INITIAL_ATTENDANCE);
  const [directoryList, setDirectoryList] = useState(INITIAL_DIRECTORY);
  const [netgsmSettings, setNetgsmSettings] = useState(INITIAL_NETGSM_SETTINGS);
  const [schoolSettings, setSchoolSettings] = useState(INITIAL_SCHOOL_SETTINGS);

  // Otomasyon Öğrenci / e-Okul Staging State
  const [eOkulStagingList, setEOkulStagingList] = useState(INITIAL_EOKUL_STAGING);
  const [autoProcessPolicy, setAutoProcessPolicy] = useState('manual'); // 'manual' | 'auto'
  const [isFetchingEOkul, setIsFetchingEOkul] = useState(false);

  // Sync Progress State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Toast Notifications State
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

  // EYLEM: Toplu Devamsızlık SMS Gönderme
  const handleSendBulkSms = () => {
    const pending = attendanceList.filter(i => i.smsStatus !== 'sent');
    const count = pending.length;
    if (count === 0) return;

    setAttendanceList(prev => prev.map(i => ({ ...i, smsStatus: 'sent' })));
    setNetgsmSettings(prev => ({ ...prev, balance: prev.balance - count }));

    addLog(
      'Toplu Devamsızlık SMS Gönderimi',
      'sms',
      `${count} adet devamsız öğrenci velisine e-Okul yoklama SMS'i Netgsm onaylı '${netgsmSettings.header}' başlığı ile iletildi.`
    );

    showToast(`${count} adet devamsızlık SMS bildirimi başarıyla velilere iletildi!`, 'success');
  };

  // EYLEM: Tekil Devamsızlık SMS Gönderme
  const handleSendSingleSms = (id) => {
    const student = attendanceList.find(i => i.id === id);
    if (!student) return;

    setAttendanceList(prev => prev.map(i => i.id === id ? { ...i, smsStatus: 'sent' } : i));
    setNetgsmSettings(prev => ({ ...prev, balance: prev.balance - 1 }));

    addLog(
      'Tekil Devamsızlık SMS Gönderimi',
      'sms',
      `${student.name} (${student.class}) velisine (${student.parentPhone}) devamsızlık bildirimi iletildi.`
    );

    showToast(`${student.name} velisine SMS iletildi.`, 'success');
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

  // EYLEM: e-Okul Senkronizasyonu
  const handleTriggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(25);

    setTimeout(() => setSyncProgress(65), 400);
    setTimeout(() => setSyncProgress(100), 800);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncProgress(0);
      addLog(
        'e-Okul Veri Senkronizasyonu',
        'sync',
        'e-Okul yoklama defteri taranarak 18 devamsız öğrenci listesi çekildi.'
      );
      showToast('e-Okul verileri başarıyla senkronize edildi!', 'success');
    }, 1100);
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

      addLog(
        'e-Okul Verileri Yenilendi',
        'automation',
        `Chrome eklentisi köprüsünden 3 yeni devamsızlık kaydı çekildi ve listeye eklendi.`
      );

      showToast('e-Okul verileri yenilendi! 3 yeni devamsızlık kaydı çekildi.', 'info');
    }, 1100);
  };

  // EYLEM: Otomasyon Öğrenci - e-Okul Veri İşleme Kuralı Değiştir
  const handleChangeAutoProcessPolicy = (newPolicy) => {
    setAutoProcessPolicy(newPolicy);
    addLog(
      'e-Okul İşleme Kuralı Güncellendi',
      'settings',
      `e-Okul veri işleme politikası '${newPolicy === 'auto' ? 'Doğrudan Sisteme Otomatik İşle' : 'Manuel Onay Beklet'}' olarak belirlendi.`
    );
    showToast(
      newPolicy === 'auto' ? 'Kural: e-Okul verileri doğrudan sisteme işlenecek!' : 'Kural: e-Okul verileri onayınız için havuzda bekletilecek.',
      'info'
    );
  };

  const pendingAttendanceCount = attendanceList.filter(i => i.smsStatus !== 'sent').length;
  const pendingStagingCount = eOkulStagingList.filter(i => i.status === 'pending').length;
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
        pendingAttendanceCount={pendingAttendanceCount}
        pendingStagingCount={pendingStagingCount}
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

        {/* Canlı e-Okul Senkronizasyon İlerleme Çubuğu */}
        {isSyncing && (
          <div className="bg-teal-950 text-teal-200 px-6 py-2.5 border-b border-teal-800">
            <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>e-Okul ile veri senkronizasyonu yapılıyor...</span>
                </span>
                <span className="font-code text-teal-400">Otomasyon Botu</span>
              </div>
              <div className="w-full h-1.5 bg-teal-900 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Sekmelere Göre Görünümler */}
        {currentTab === 'dashboard' && (
          <DashboardView 
            setCurrentTab={setCurrentTab}
            pendingAttendanceCount={pendingAttendanceCount}
            smsBalance={netgsmSettings.balance}
            currentUser={currentUser}
            showToast={showToast}
          />
        )}

        {currentTab === 'attendance' && (
          <AttendanceView 
            attendanceList={attendanceList}
            onSendBulkSms={handleSendBulkSms}
            onSendSingleSms={handleSendSingleSms}
            smsBalance={netgsmSettings.balance}
          />
        )}

        {/* YENİ: Otomasyon Öğrenci (e-Okul Devamsızlık Masası) */}
        {currentTab === 'automation_students' && (
          <AutomationStudentsView 
            stagingList={eOkulStagingList}
            onSendSingleSms={handleSendSingleAutomationSms}
            onSendBulkSms={handleSendBulkAutomationSms}
            onRefreshEOkulData={handleRefreshEOkulData}
            isRefreshing={isFetchingEOkul}
            smsBalance={netgsmSettings.balance}
            autoProcessPolicy={autoProcessPolicy}
            onChangeAutoProcessPolicy={handleChangeAutoProcessPolicy}
            showToast={showToast}
          />
        )}

        {currentTab === 'sync' && (
          <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-900 text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">cloud_download</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-lg text-white">
                  e-Okul Entegrasyonu &amp; Veri Aktarımı
                </h2>
                <p className="text-xs text-slate-400">Resmi e-Okul Yönetim Bilgi Sistemi üzerinden öğrenci ve yoklama aktarımı</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0F172A] rounded-xl border border-slate-800 p-6 flex flex-col gap-5 shadow-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-[18px]">sync</span>
                  Canlı Senkronizasyon Konsolu
                </h3>

                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Chrome Eklentisi Köprüsü:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald"></span> Bağlantı Kuruldu
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">e-Okul Oturum Durumu:</span>
                    <span className="text-slate-300">Giriş Yapıldı (MEBBİS Yetkilendirmesi)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button"
                    onClick={handleTriggerSync}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-navy text-white rounded-lg text-xs font-bold hover:bg-blue-900 shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">autorenew</span>
                    <span>e-Okul'dan Verileri Şimdi Çek</span>
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => showToast('Öğrenci listesi şablonu Excel olarak indirildi', 'info')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Öğrenci Listesi Excel İndir</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-6 flex flex-col justify-between gap-4 shadow-xs">
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal text-[18px]">info</span>
                    Nasıl Çalışır?
                  </h3>
                  <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                    <li>Google Chrome tarayıcınızda resmi e-Okul sayfasına MEBBİS şifrenizle giriş yapın.</li>
                    <li>Günlük yoklama defteri veya öğrenci listesi ekranını açın.</li>
                    <li>YEMTAL-VBS Chrome eklentisi verileri otomatik okur ve tek tıkla bu panele aktarır.</li>
                  </ol>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-lg text-xs text-amber-300">
                  <strong>Güvenlik Notu:</strong> Eklenti yalnızca yerel olarak çalışır, MEBBİS veya e-Okul şifrenizi asla sunuculara göndermez.
                </div>
              </div>
            </div>
          </div>
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
