/**
 * YEMTAL-VBS — Örnek Veri Seti & Durum Yönetimi
 * Yunus Emre Mesleki ve Teknik Anadolu Lisesi
 */

const YEMTAL_DATA = {
  system: {
    schoolName: "Yunus Emre Mesleki ve Teknik Anadolu Lisesi",
    schoolShort: "YUNUS EMRE MTAL",
    institutionCode: "YEMTAL-01",
    academicYear: "2026-2027 Eğitim Öğretim Yılı",
    smsBalance: 4250,
    smsSenderTitle: "YEMTAL",
    eOkulExtensionStatus: "Aktif",
    netgsmApiStatus: "Onaylı",
    lastSyncTime: "Bugün 09:15",
    totalStudents: 840,
    totalParents: 832,
    missingPhoneCount: 8,
    missingSecondParentCount: 45
  },

  // Şubeler
  classes: [
    { id: "9-A", name: "9-A Bilişim Teknolojileri", studentCount: 34, pendingAbsent: 3 },
    { id: "9-B", name: "9-B Bilişim Teknolojileri", studentCount: 33, pendingAbsent: 0 },
    { id: "10-A", name: "10-A Elektrik-Elektronik", studentCount: 31, pendingAbsent: 0 },
    { id: "10-B", name: "10-B Elektrik-Elektronik", studentCount: 32, pendingAbsent: 4 },
    { id: "11-A", name: "11-A Makine Teknolojisi", studentCount: 28, pendingAbsent: 6 },
    { id: "11-B", name: "11-B Makine Teknolojisi", studentCount: 29, pendingAbsent: 0 },
    { id: "12-A", name: "12-A Yenilenebilir Enerji", studentCount: 27, pendingAbsent: 0 },
    { id: "12-B", name: "12-B Motorlu Araçlar", studentCount: 26, pendingAbsent: 0 },
    { id: "12-C", name: "12-C Motorlu Araçlar", studentCount: 30, pendingAbsent: 5 }
  ],

  // Bugün e-Okul'dan otomatik çekilen 18 Devamsız Öğrenci Listesi
  attendanceList: [
    {
      id: 1,
      schoolNo: "1042",
      name: "Ali Emre Kaya",
      class: "9-A",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Ahmet Kaya (Baba)",
      parentPhone: "0532 411 22 33",
      smsStatus: "pending", // pending, sent, failed
      time: "09:10"
    },
    {
      id: 2,
      schoolNo: "1089",
      name: "Zeynep Sude Yılmaz",
      class: "9-A",
      type: "Yarım Gün (Öğleden Sonra)",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      parentName: "Fatma Yılmaz (Anne)",
      parentPhone: "0544 555 66 77",
      smsStatus: "pending",
      time: "09:10"
    },
    {
      id: 3,
      schoolNo: "1104",
      name: "Burak Demir",
      class: "9-A",
      type: "Geç Kalma (1. Ders)",
      typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
      parentName: "Mehmet Demir (Baba)",
      parentPhone: "0505 123 45 67",
      smsStatus: "pending",
      time: "09:12"
    },
    {
      id: 4,
      schoolNo: "2130",
      name: "Ece Naz Öztürk",
      class: "10-B",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Selin Öztürk (Anne)",
      parentPhone: "0533 999 88 11",
      smsStatus: "pending",
      time: "09:12"
    },
    {
      id: 5,
      schoolNo: "2145",
      name: "Can Polat Aydın",
      class: "10-B",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Kemal Aydın (Baba)",
      parentPhone: "0542 333 44 22",
      smsStatus: "pending",
      time: "09:13"
    },
    {
      id: 6,
      schoolNo: "2178",
      name: "Merve Çelik",
      class: "10-B",
      type: "Yarım Gün (Öğleden Sonra)",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      parentName: "Hülya Çelik (Anne)",
      parentPhone: "0555 777 88 99",
      smsStatus: "pending",
      time: "09:13"
    },
    {
      id: 7,
      schoolNo: "2201",
      name: "Kaan Arslan",
      class: "10-B",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Bülent Arslan (Baba)",
      parentPhone: "0536 222 11 00",
      smsStatus: "pending",
      time: "09:14"
    },
    {
      id: 8,
      schoolNo: "3050",
      name: "Emirhan Yıldız",
      class: "11-A",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Osman Yıldız (Baba)",
      parentPhone: "0541 666 55 44",
      smsStatus: "pending",
      time: "09:14"
    },
    {
      id: 9,
      schoolNo: "3062",
      name: "Büşra Doğan",
      class: "11-A",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Aysel Doğan (Anne)",
      parentPhone: "0530 888 77 66",
      smsStatus: "pending",
      time: "09:14"
    },
    {
      id: 10,
      schoolNo: "3081",
      name: "Batuhan Koç",
      class: "11-A",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "İsmail Koç (Baba)",
      parentPhone: "0543 444 33 22",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 11,
      schoolNo: "3105",
      name: "İrem Su Karaca",
      class: "11-A",
      type: "Yarım Gün",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      parentName: "Songül Karaca (Anne)",
      parentPhone: "0554 222 33 44",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 12,
      schoolNo: "3120",
      name: "Görkem Yavuz",
      class: "11-A",
      type: "Geç Kalma (1. Ders)",
      typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
      parentName: "Mustafa Yavuz (Baba)",
      parentPhone: "0538 555 44 33",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 13,
      schoolNo: "3144",
      name: "Melis Şen",
      class: "11-A",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Ayşe Şen (Anne)",
      parentPhone: "0535 999 11 22",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 14,
      schoolNo: "4012",
      name: "Umut Barış Güler",
      class: "12-C",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Ramazan Güler (Baba)",
      parentPhone: "0545 111 22 88",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 15,
      schoolNo: "4033",
      name: "Selin Aksoy",
      class: "12-C",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Nurten Aksoy (Anne)",
      parentPhone: "0506 333 77 99",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 16,
      schoolNo: "4055",
      name: "Furkan Korkmaz",
      class: "12-C",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Cemal Korkmaz (Baba)",
      parentPhone: "0531 444 88 55",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 17,
      schoolNo: "4071",
      name: "Deniz Erdem",
      class: "12-C",
      type: "Yarım Gün",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      parentName: "Nilüfer Erdem (Anne)",
      parentPhone: "0546 222 99 11",
      smsStatus: "pending",
      time: "09:15"
    },
    {
      id: 18,
      schoolNo: "4090",
      name: "Efe Berk Tunç",
      class: "12-C",
      type: "Tam Gün",
      typeBadge: "bg-red-50 text-crimson border-red-200",
      parentName: "Serdar Tunç (Baba)",
      parentPhone: "0552 888 44 11",
      smsStatus: "pending",
      time: "09:15"
    }
  ],

  // Rehber Veritabanı Örneği (Hem eksiksiz hem eksik 8 kayıt içerir)
  directory: [
    { id: 101, schoolNo: "1042", name: "Ali Emre Kaya", class: "9-A", parent1Name: "Ahmet Kaya (Baba)", parent1Phone: "0532 411 22 33", parent2Name: "Sevgi Kaya (Anne)", parent2Phone: "0532 411 22 34", status: "complete" },
    { id: 102, schoolNo: "1089", name: "Zeynep Sude Yılmaz", class: "9-A", parent1Name: "Fatma Yılmaz (Anne)", parent1Phone: "0544 555 66 77", parent2Name: "-", parent2Phone: "", status: "missing_parent2" },
    { id: 103, schoolNo: "1104", name: "Burak Demir", class: "9-A", parent1Name: "Mehmet Demir (Baba)", parent1Phone: "0505 123 45 67", parent2Name: "Hatice Demir", parent2Phone: "0505 123 45 68", status: "complete" },
    
    // Eksik 1. Numaralı Kayıtlar (8 Adet):
    { id: 104, schoolNo: "1122", name: "Oğuzhan Kurt", class: "9-A", parent1Name: "Murat Kurt (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 105, schoolNo: "1150", name: "Derya Çetin", class: "9-B", parent1Name: "Cevdet Çetin (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 106, schoolNo: "2015", name: "Serkan Keskin", class: "10-A", parent1Name: "Nazmi Keskin (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 107, schoolNo: "2180", name: "Gizem Güneş", class: "10-B", parent1Name: "Nuran Güneş (Anne)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 108, schoolNo: "3022", name: "Halil İbrahim Öz", class: "11-A", parent1Name: "Mahmut Öz (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 109, schoolNo: "3110", name: "Aleyna Polat", class: "11-B", parent1Name: "Tülay Polat (Anne)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 110, schoolNo: "4019", name: "Kerem Vural", class: "12-A", parent1Name: "Recep Vural (Baba)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },
    { id: 111, schoolNo: "4064", name: "Hilal Akça", class: "12-C", parent1Name: "Gül Akça (Anne)", parent1Phone: "", parent2Name: "", parent2Phone: "", status: "missing_phone" },

    // Normal Kayıtlar
    { id: 112, schoolNo: "2130", name: "Ece Naz Öztürk", class: "10-B", parent1Name: "Selin Öztürk (Anne)", parent1Phone: "0533 999 88 11", parent2Name: "Hakan Öztürk", parent2Phone: "0533 999 88 12", status: "complete" },
    { id: 113, schoolNo: "2145", name: "Can Polat Aydın", class: "10-B", parent1Name: "Kemal Aydın (Baba)", parent1Phone: "0542 333 44 22", parent2Name: "Nermin Aydın", parent2Phone: "0542 333 44 23", status: "complete" },
    { id: 114, schoolNo: "3050", name: "Emirhan Yıldız", class: "11-A", parent1Name: "Osman Yıldız (Baba)", parent1Phone: "0541 666 55 44", parent2Name: "Zehra Yıldız", parent2Phone: "0541 666 55 45", status: "complete" },
    { id: 115, schoolNo: "4012", name: "Umut Barış Güler", class: "12-C", parent1Name: "Ramazan Güler (Baba)", parent1Phone: "0545 111 22 88", parent2Name: "Emine Güler", parent2Phone: "0545 111 22 89", status: "complete" }
  ],

  // Hazır SMS Şablonları
  smsTemplates: [
    {
      id: "absenteeism",
      name: "Günlük Devamsızlık Bildirimi",
      text: "Sayın Velimiz, [Ogrenci_Adi] isimli öğrencimiz [Tarih] tarihinde [Devamsizlik_Turu] olarak okula gelmemiştir. Bilgilerinize rica ederiz. YEMTAL İdaresi"
    },
    {
      id: "meeting",
      name: "Veli Toplantısı Daveti",
      text: "Sayın Velimiz, 1. Dönem genel veli toplantımız [Toplanti_Tarihi] günü saat [Toplanti_Saati]'de okulumuz konferans salonunda yapılacaktır. Katılımınızı rica ederiz. YEMTAL Okul Aile Birliği"
    },
    {
      id: "exam",
      name: "Ortak Sınav Takvimi Duyurusu",
      text: "Sayın Velimiz, [Donem] dönemi 1. ortak yazılı sınavlarımız [Baslangic_Tarihi] itibarıyla başlayacaktır. Detaylı ders programına okul web sitemizden ulaşabilirsiniz. YEMTAL"
    },
    {
      id: "discipline",
      name: "Önemli İdari Görüşme Talebi",
      text: "Sayın Velimiz, öğrencimiz [Ogrenci_Adi] ile ilgili görüşmek üzere en kısa sürede okul idaresine uğramanızı rica ederiz. YEMTAL İdaresi"
    }
  ],

  // Gönderim Geçmişi Logları
  smsHistory: [
    { id: 1, date: "16.11.2026 09:12", target: "18 Öğrenci Velisi", title: "Devamsızlık Bildirimi", count: 18, status: "Gönderildi", successRate: "%100" },
    { id: 2, date: "15.11.2026 14:35", target: "12-C Şubesi (30 Kişi)", title: "Staj Evrakları Hatırlatması", count: 30, status: "Gönderildi", successRate: "%100" },
    { id: 3, date: "14.11.2026 10:00", target: "Tüm Okul Velileri (832 Kişi)", title: "Ara Tatil Bilgilendirmesi", count: 832, status: "Gönderildi", successRate: "%99.4" }
  ]
};

// Global dışa aktarım
window.YEMTAL_DATA = YEMTAL_DATA;
