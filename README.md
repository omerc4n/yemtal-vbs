# YEMTAL-VBS — React Tabanlı Veli Bilgilendirme ve Otomasyon Sistemi

Yunus Emre Mesleki ve Teknik Anadolu Lisesi için geliştirilmiş modern, kurumsal, React tabanlı SMS & Devamsızlık Yönetim Paneli.

---

## 🚀 Son Yapılan Güncellemeler & Yeni Özellikler

### 1. 🌙 Tam Karanlık Tema (Always Dark Mode)
- Site tamamen kurumsal **karanlık tema (Dark Mode)** estetiğinde yapılandırıldı. Arka planlar (`#020617`, `#0F172A`), şık kenarlıklar (`#1E293B`, `#334155`) ve canlı kontrast renkleriyle donatıldı.
- Aydınlık tema geçiş butonları kaldırılarak kalıcı karanlık mod sabitlendi.

---

### 2. 🕒 Canlı Tarih & Saat Göstergesi
- Header'daki eski statik yazı kaldırıldı; yerine saniye saniye güncellenen **canlı Türkçe Tarih ve Saat** (`16 Kasım 2026 Pazartesi • 19:30:20`) göstergesi yerleştirildi.
- "e-Okul Robotu: Hazır" rozeti ve "Verileri Güncelle" butonu üst bardan kaldırıldı.

---

### 3. 📊 Düzeltilmiş ve Sadeleştirilmiş Genel Bakış (Dashboard)
- **4 Temel KPI Kartı:**
  1. **Kayıtlı Öğrenci (840):** Tüm şubeler e-Okul eşleşmeli.
  2. **Kayıtlı Veli (832):** %99.0 iletişim erişim oranı.
  3. **Bugün Devamsız (18 Öğrenci):** Bekleyen SMS bildirimi sayısı.
  4. **Netgsm Bakiye (4.250 Adet):** Onaylı `YEMTAL` başlığı ile.
- **Hızlı Devamsızlık Banner'ı:** 18 devamsız öğrencinin velilerine tek tıkla ulaşabileceğiniz doğrudan yönlendirme.
- **Rehber Havuzu & Eksik Veri Paneli:** Telefonu olmayan 8 öğrenci uyarısı ve doğrudan eksik tamamlama kısayolu.
- **Kurum & Netgsm Durum Kartı:** Kurum kodu (`YEMTAL-01`), aktif oturum sahibi ve Netgsm başlık bilgisi.

---

### 4. 👑 Yetkili Roller & Admin Kullanıcı Yönetimi
- **Sistem Rolleri (4 Ayrı Rol):**
  1. **Admin** (Ana Yönetici / Root hesap - Kullanıcı oluşturma, silme ve hesaplar arası geçiş yetkisi)
  2. **Müdür** (Okul Müdürü)
  3. **Müdür Yardımcısı** (Devamsızlık & İdari SMS yetkileri)
  4. **Öğretmen** (Yoklama ve devamsızlık inceleme yetkisi)
- **Kullanıcı Oluşturma Alanları:**
  - **Ad Soyad**
  - **Telefon Numarası** (05XX XXX XX XX)
  - **Giriş Şifresi** (Göster / Gizle seçenekli güvenli şifre belirleme)
  - **Kullanıcı Rolü** (Admin / Müdür / Müdür Yardımcısı / Öğretmen)
- **Kullanıcı Silme & Giriş Onay Modalları:** Silme ve vekaleten oturum açma işlemlerinde "Emin misiniz?" onay pencereleri açılır.
- **Admin Login Sistem Alt Barı:** Başka bir personelin hesabına geçildiğinde altta sabit bar belirir ve tek tıkla ana Admin hesabına dönüş imkanı sunar.

---

### 5. 🤖 Otomasyon Öğrenci (e-Okul Devamsızlık Masası) (YENİ!)
- **Chrome Eklentisi Entegrasyonu:**
  - Chrome eklentisinden *"e-Okul'dan Okula Devamsızlık Verisi Çek"* dendiğinde çekilen kayıtlar anında bu sekmeye listelenir.
  - Sayfada sağ üstte **"e-Okul Veri Yenile"** butonu bulunur; basıldığında eklentiden veya e-Okul sisteminden veriler anında tazelenir ve havuza yeni yoklamalar düşer.
- **e-Okul Devamsızlık Türleri:**
  - 🔴 **Tam Gün Yok:** Tüm gün okula gelmeyen öğrenciler.
  - 🟠 **Öğleden Önce Yok:** Sabah ilk 4 derste sınıfta bulunmayan öğrenciler.
  - 🔵 **Öğleden Sonra Yok:** Öğle arasından sonraki derslerde bulunmayan öğrenciler.
- **Mesaj Gönderim Operasyonu (Tekli & Toplu):**
  - **Tekli Mesaj Gönder:** Her öğrencinin satırındaki yeşil *"Mesaj Gönder"* butonu ile veli iletişim numarasına ve devamsızlık türüne uygun otomatik şablon mesajı önizlenip tek tıkla gönderilir.
  - **Toplu Mesaj Gönder:** Checkbox seçimleriyle veya sağ üstteki *"Tümüne / Seçilenlere Mesaj Gönder"* butonuyla bekleyen tüm velilere tek seferde SMS gönderilir.
  - Her gönderimde Netgsm kredisi otomatik düşülür ve Denetim Raporlarına saniyesiyle kimin SMS attığı işlenir.
- **"e-Okul'dan Veri Çekildiği Zaman Oraya İşlesin mi?" Ayarı:**
  - **Onaylı (Manuel İnceleme):** Veriler havuza gelir; yetkili inceleyip mesaj gönder butonuna basınca işlem yapılır.
  - **Otomatik:** Veri çekildiği an sisteme işlenir ve SMS gönderilmeye hazır hale gelir.

---

### 6. 📜 Kimin Ne Yaptığını Gösteren Canlı Denetim Raporu (Audit Log)
- Hangi yetkili (Admin, Müdür, Müdür Yrd, Öğretmen), ne zaman hangi SMS'i gönderdi, hangi e-Okul verisini sisteme işledi veya hangi rehber numarasını değiştirdi anlık olarak kayıt altına alınır.
- Kullanıcıya, işlem kategorisine ve arama kelimesine göre canlı filtrelenir; Excel olarak dışa aktarılabilir.

---

## 📁 Proje Dosya Yapısı

```
E-YEMTAL/
│
├── index.html                     # Doğrudan tarayıcıda çalışan React 18 SPA (Karanlık Tema)
├── package.json                   # Vite & React proje konfigürasyonu
├── vite.config.js                 # Vite yapılandırma dosyası
├── yemtal_vbs_design_system.md    # Kurumsal tasarım sistemi rehberi
│
├── assets/
│   └── css/style.css              # Telefon mockup, scrollbar ve animasyon stilleri
│
└── src/
    ├── main.jsx                   # Vite giriş noktası
    ├── App.jsx                    # Ana React bileşeni & State yöneticisi
    ├── data/
    │   └── mockData.js            # Kullanıcılar, staging havuzu, loglar, şablonlar
    └── components/
        ├── Sidebar.jsx            # Sol menü ve bildirim sayaçları
        ├── Header.jsx             # Canlı saat/tarih ve yetkili rozeti
        ├── DashboardView.jsx      # 4 KPI kartlı Genel Bakış
        ├── AttendanceView.jsx     # Devamsız öğrenci ve SMS onay ekranı
        ├── AutomationStudentsView.jsx # e-Okul veri işleme ve onay havuzu (YENİ!)
        ├── MessageSenderView.jsx  # Manuel SMS ve canlı akıllı telefon önizlemesi
        ├── DirectoryView.jsx      # 840 öğrenci/veli rehberi ve düzenleme
        ├── ReportsAuditView.jsx   # Kimin ne yaptığı canlı denetim günlüğü
        └── SettingsView.jsx       # Netgsm API & Admin Kullanıcı Yönetimi
```

---

## 🖥️ Nasıl Çalıştırılır?

Herhangi bir sunucu veya kuruluma gerek yoktur:
Klasördeki **[index.html](file:///c:/Users/ADORE\Desktop\E-YEMTAL\index.html)** dosyasına çift tıklayarak tarayıcınızda hemen açabilirsiniz.
