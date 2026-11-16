import React, { useState } from 'react';

export default function SettingsView({ 
  netgsmSettings, 
  onSaveNetgsmSettings,
  schoolSettings,
  onSaveSchoolSettings,
  users,
  currentUser,
  onAddUser,
  onDeleteUser,
  onSwitchUser,
  showToast 
}) {
  const [activeSubTab, setActiveSubTab] = useState('netgsm'); // 'netgsm' | 'users' | 'school'

  // Netgsm State
  const [username, setUsername] = useState(netgsmSettings.username);
  const [password, setPassword] = useState(netgsmSettings.password);
  const [header, setHeader] = useState(netgsmSettings.header);
  const [morningTime, setMorningTime] = useState(netgsmSettings.autoSyncMorning);
  const [afternoonTime, setAfternoonTime] = useState(netgsmSettings.autoSyncAfternoon);
  const [webhookUrl, setWebhookUrl] = useState(netgsmSettings.dlrWebhookUrl);

  // School State
  const [schoolName, setSchoolName] = useState(schoolSettings.name);
  const [schoolCode, setSchoolCode] = useState(schoolSettings.code);
  const [schoolEmail, setSchoolEmail] = useState(schoolSettings.email);
  const [schoolPhone, setSchoolPhone] = useState(schoolSettings.phone);

  // Yeni Kullanıcı Ekleme Form State (Ad Soyad, Telefon No, Şifre, Rol)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('teacher'); // 'admin' | 'principal' | 'vice_principal' | 'teacher'
  const [showPassword, setShowPassword] = useState(false);

  // ONAY MODALLARI: Silme ve Giriş Yapma Onayları
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToSwitch, setUserToSwitch] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  const handleSaveNetgsm = (e) => {
    e.preventDefault();
    onSaveNetgsmSettings({
      username,
      password,
      header,
      autoSyncMorning: morningTime,
      autoSyncAfternoon: afternoonTime,
      dlrWebhookUrl: webhookUrl
    });
  };

  const handleSaveSchool = (e) => {
    e.preventDefault();
    onSaveSchoolSettings({
      name: schoolName,
      code: schoolCode,
      email: schoolEmail,
      phone: schoolPhone
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim() || !newUserPassword.trim()) {
      showToast('Lütfen Ad Soyad, Telefon No ve Şifre alanlarını doldurun!', 'error');
      return;
    }

    let roleLabel = 'Öğretmen';
    if (newUserRole === 'admin') roleLabel = 'Admin';
    if (newUserRole === 'principal') roleLabel = 'Müdür';
    if (newUserRole === 'vice_principal') roleLabel = 'Müdür Yardımcısı';

    const initials = newUserName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    onAddUser({
      name: newUserName,
      phone: newUserPhone,
      password: newUserPassword,
      role: newUserRole,
      roleLabel,
      title: roleLabel,
      avatar: initials || 'KU',
      status: 'active'
    });

    setNewUserName('');
    setNewUserPhone('');
    setNewUserPassword('');
    setIsAddUserOpen(false);
  };

  // Silme Onaylandı
  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  // Hesap Değiştirme Onaylandı
  const handleConfirmSwitch = () => {
    if (userToSwitch) {
      onSwitchUser(userToSwitch.id);
      setUserToSwitch(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 animate-fadeIn">
      
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-900 text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">tune</span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-white">
              Sistem, Netgsm API &amp; Kullanıcı Yetki Merkezi
            </h2>
            <p className="text-xs text-slate-400">
              Netgsm SMS altyapısını yapılandırın, Admin ana hesabıyla yetkili kullanıcı ekleyip silin
            </p>
          </div>
        </div>
      </div>

      {/* Alt Sekme Başlıkları */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button 
          type="button"
          onClick={() => setActiveSubTab('netgsm')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'netgsm'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">sms</span>
          <span>Netgsm API &amp; SMS Ayarları</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'users'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">manage_accounts</span>
          <span>Admin Kullanıcı Yönetimi ({users.length})</span>
          {isAdmin && (
            <span className="w-2 h-2 rounded-full bg-emerald"></span>
          )}
        </button>

        <button 
          type="button"
          onClick={() => setActiveSubTab('school')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeSubTab === 'school'
              ? 'bg-navy text-white shadow-xs'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">school</span>
          <span>Kurum &amp; Okul Bilgileri</span>
        </button>
      </div>

      {/* SEKME 1: NETGSM API AYARLARI */}
      {activeSubTab === 'netgsm' && (
        <form onSubmit={handleSaveNetgsm} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[18px]">key</span>
              Netgsm API Kimlik &amp; Başlık Parametreleri
            </h3>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-300">Netgsm Kullanıcı Adı / Abone No:</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-code font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-300">Netgsm API Şifresi:</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-code"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-300">Onaylı SMS Başlığı (Sender Header):</label>
              <input 
                type="text" 
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-teal font-bold"
              />
              <span className="text-[11px] text-slate-500">Netgsm panelinizde onaylanmış 11 haneli resmi başlık olmalıdır.</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => showToast(`Netgsm API Testi Başarılı! Güncel Bakiye: ${netgsmSettings.balance} SMS`, 'success')}
                className="px-4 py-2 border border-slate-700 rounded-md text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors shadow-xs"
              >
                API Bağlantısını Test Et
              </button>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-6 flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-teal text-[18px]">schedule</span>
                Otomatik Devamsızlık SMS Saatleri
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Sabah Yoklaması:</label>
                  <input 
                    type="time" 
                    value={morningTime}
                    onChange={(e) => setMorningTime(e.target.value)}
                    className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-code font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-300">Öğle Yoklaması:</label>
                  <input 
                    type="time" 
                    value={afternoonTime}
                    onChange={(e) => setAfternoonTime(e.target.value)}
                    className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-code font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs pt-2">
                <label className="font-semibold text-slate-300">Teslim Raporu (DLR) Webhook URL:</label>
                <input 
                  type="text" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-[11px] font-code text-slate-300"
                />
                <span className="text-[11px] text-slate-500">Netgsm iletildi/iletilemedi durumları bu adrese döner.</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-navy text-white rounded-md text-xs font-bold hover:bg-blue-900 shadow-xs transition-all"
              >
                Netgsm Ayarlarını Kaydet
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SEKME 2: ADMIN KULLANICI YÖNETİMİ (ROLLER: Admin, Müdür, Müdür Yardımcısı, Öğretmen) */}
      {activeSubTab === 'users' && (
        <div className="flex flex-col gap-5">
          
          {/* Admin Güvenlik Kontrolü */}
          {!isAdmin && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-500">lock</span>
                <span>
                  <strong>Yetki Uyarısı:</strong> Kullanıcı oluşturma ve silme yetkisi yalnızca ana <strong>Admin</strong> hesabına aittir. Şu anki rolünüz: <em>{currentUser?.roleLabel}</em>.
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setUserToSwitch(users.find(u => u.role === 'admin'))}
                className="px-3 py-1.5 bg-navy text-white rounded font-bold text-xs hover:bg-blue-900 transition-colors"
              >
                Admin Hesabına Giriş Yap
              </button>
            </div>
          )}

          <div className="bg-[#0F172A] rounded-xl border border-slate-800 shadow-xs p-6 flex flex-col gap-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-[18px]">group</span>
                  Yetkili Kullanıcı Hesapları
                </h3>
                <p className="text-xs text-slate-400">
                  Sistemdeki Admin, Müdür, Müdür Yardımcısı ve Öğretmen hesaplarını yönetin
                </p>
              </div>

              {isAdmin && (
                <button 
                  type="button"
                  onClick={() => setIsAddUserOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white rounded-md text-xs font-bold hover:bg-blue-900 shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Yeni Kullanıcı Ekle</span>
                </button>
              )}
            </div>

            {/* Kullanıcılar Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 font-semibold text-slate-400 bg-slate-900/50">
                    <th className="py-3 px-4">Ad Soyad</th>
                    <th className="py-3 px-4">Telefon Numarası</th>
                    <th className="py-3 px-3">Yetki Rolü</th>
                    <th className="py-3 px-3">Şifre Durumu</th>
                    <th className="py-3 px-3">Kayıt Tarihi</th>
                    <th className="py-3 px-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {users.map(u => {
                    const isSelf = u.id === currentUser?.id;
                    const isMainAdmin = u.role === 'admin';

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              u.role === 'admin' ? 'bg-navy text-white shadow-xs border border-blue-600' : 'bg-slate-800 text-slate-200'
                            }`}>
                              {u.avatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                {u.name}
                                {isSelf && (
                                  <span className="text-[10px] font-bold text-emerald bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-900">Aktif Oturum</span>
                                )}
                              </span>
                              <span className="text-[11px] text-slate-500">{u.title}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-code text-slate-300 font-semibold">
                          {u.phone || '05XX XXX XX XX'}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                            u.role === 'admin' ? 'bg-amber-950/50 text-amber-300 border-amber-800' :
                            u.role === 'principal' ? 'bg-blue-950/50 text-blue-300 border-blue-800' :
                            u.role === 'vice_principal' ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {u.roleLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-code text-slate-500">••••••••</td>
                        <td className="py-3 px-3 text-slate-400">{u.createdAt}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Başka Hesaba Giriş Yap Butonu (Uyarı/Onay Modalı Tetikler) */}
                            {!isSelf && (
                              <button 
                                type="button"
                                onClick={() => setUserToSwitch(u)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                                title="Bu hesaba giriş yap"
                              >
                                Giriş Yap
                              </button>
                            )}

                            {/* Silme Butonu (Sadece Admin Silebilir, Onay Modalı Tetikler, Ana Admin Silinemez) */}
                            {isAdmin && !isMainAdmin && (
                              <button 
                                type="button"
                                onClick={() => setUserToDelete(u)}
                                className="p-1 hover:bg-red-950/60 text-slate-400 hover:text-crimson rounded transition-colors"
                                title="Kullanıcıyı Sil"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* 1. YENİ KULLANICI OLUŞTURMA MODALI (Ad Soyad, Telefon No, Şifre, Rol) */}
          {isAddUserOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
              <form onSubmit={handleCreateUser} className="bg-[#0F172A] rounded-xl border border-slate-800 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-400 text-[20px]">person_add</span>
                    Yeni Yetkili Kullanıcı Oluştur
                  </h3>
                  <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white p-1">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-semibold text-slate-300">Ad Soyad:</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Mehmet Özkan"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full p-2.5 mt-1 rounded border border-slate-700 bg-slate-900 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Telefon Numarası:</label>
                    <input 
                      type="text" 
                      placeholder="Örn: 0532 555 44 33"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      className="w-full p-2.5 mt-1 rounded border border-slate-700 bg-slate-900 text-white font-code"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Kullanıcı Rolü:</label>
                    <select 
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full p-2.5 mt-1 rounded border border-slate-700 bg-slate-900 text-white font-semibold"
                    >
                      <option value="principal">Müdür (Okul Müdürü)</option>
                      <option value="vice_principal">Müdür Yardımcısı</option>
                      <option value="teacher">Öğretmen</option>
                      <option value="admin">Admin (Yönetici)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-300">Giriş Şifresi:</label>
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(p => !p)}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        {showPassword ? 'Gizle' : 'Göster'}
                      </button>
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Kullanıcı giriş şifresi belirleyin"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full p-2.5 mt-1 rounded border border-slate-700 bg-slate-900 text-white font-code"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsAddUserOpen(false)} 
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-md"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-md hover:bg-blue-900 shadow-xs"
                  >
                    Kullanıcıyı Kaydet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SİLME ONAY MODALI (İstediğinize Emin misiniz?) */}
          {userToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
              <div className="bg-[#0F172A] rounded-xl border border-red-900/80 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800 text-crimson flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">warning</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-white">
                      Kullanıcı Hesabını Sil
                    </h3>
                    <p className="text-slate-400">Bu işlem geri alınamaz</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  <strong className="text-white">{userToDelete.name}</strong> (<span className="text-amber-400">{userToDelete.roleLabel}</span>) kullanıcısını silmek istediğinize <strong className="text-red-400">emin misiniz?</strong> Bu hesaba ait tüm erişim yetkileri kaldırılacaktır.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setUserToDelete(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-md"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="button" 
                    onClick={handleConfirmDelete}
                    className="px-5 py-2 text-xs font-bold bg-crimson text-white rounded-md hover:bg-red-700 shadow-xs"
                  >
                    Evet, Hesabı Sil
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. BAŞKA BİRİSİNİN HESABINA GİRİŞ YAPMA UYARI / ONAY MODALI */}
          {userToSwitch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
              <div className="bg-[#0F172A] rounded-xl border border-blue-900/80 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-scaleUp text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">switch_account</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-white">
                      Hesap Geçişi Uyarısı
                    </h3>
                    <p className="text-slate-400">Başka bir kullanıcının oturumuna geçiyorsunuz</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  <strong className="text-white">{userToSwitch.name}</strong> (<span className="text-blue-300 font-semibold">{userToSwitch.roleLabel}</span>) hesabına giriş yapmak üzeresiniz. 
                  <div className="mt-2 text-slate-400 text-[11px]">
                    Bu oturum süresince göndereceğiniz SMS'ler ve yapacağınız işlemler <strong>{userToSwitch.name}</strong> adına denetim raporlarına kaydedilecektir. Ekranın altında Admin Login barı gösterilecektir.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setUserToSwitch(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-md"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="button" 
                    onClick={handleConfirmSwitch}
                    className="px-5 py-2 text-xs font-bold bg-navy text-white rounded-md hover:bg-blue-900 shadow-xs"
                  >
                    Evet, Hesaba Giriş Yap
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SEKME 3: KURUM BİLGİLERİ */}
      {activeSubTab === 'school' && (
        <form onSubmit={handleSaveSchool} className="bg-[#0F172A] rounded-xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xs max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[18px]">school</span>
            Resmi Okul ve Kurum Parametreleri
          </h3>

          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-semibold text-slate-300">Resmi Okul Adı:</label>
            <input 
              type="text" 
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-semibold text-slate-300">Kurum Kodu:</label>
            <input 
              type="text" 
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-code font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">İletişim E-Posta:</label>
              <input 
                type="email" 
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">İletişim Telefon:</label>
              <input 
                type="text" 
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                className="p-2.5 rounded-md border border-slate-700 bg-slate-900 text-white font-code"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-navy text-white rounded-md text-xs font-bold hover:bg-blue-900 shadow-xs transition-all"
            >
              Kurum Bilgilerini Güncelle
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
