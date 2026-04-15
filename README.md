# 🪙 FinQ - Modern Kişisel Finans Takip Uygulaması

FinQ, harcamalarınızı ve gelirlerinizi şık, modern ve performanslı bir arayüzle takip etmenize olanak tanıyan tam donanımlı bir finansal yönetim platformudur.

![FinQ Preview](https://via.placeholder.com/1200x600?text=FinQ+-+Personal+Finance+Tracker)

## 🚀 Teknolojik Mimari

Proje, hem backend hem de frontend tarafında en modern pratikler ve kütüphaneler kullanılarak "Feature-Based" (Özellik Bazlı) bir mimariyle geliştirilmiştir.

### Backend ( .NET 10 )
- **Minimal APIs:** Hafif ve yüksek performanslı API yapısı.
- **Entity Framework Core (Npgsql):** PostgreSQL ile güçlü ve tip güvenli veritabanı etkileşimi.
- **Vertical Slice Architecture:** `Domain`, `Features` ve `Infrastructure` katmanlarıyla yüksek modülerlik.
- **AutoMapper:** DTO ve Domain model eşleştirmeleri için merkezi yönetim.
- **FluentValidation:** API istekleri için otomatik ve kural tabanlı validasyon.
- **Global Exception Handling:** Merkezi hata yönetimi ve standart `ProblemDetails` yanıtları.
- **JWT & BCrypt:** Güvenli kimlik doğrulama ve şifreleme.

### Frontend ( React 19 + Vite )
- **Zustand:** Kompakt ve hızlı state yönetimi.
- **Tailwind CSS 4:** Modern, utility-first stil yönetimi.
- **Vite PWA:** Çevrimdışı çalışma ve "Add to Home Screen" desteği.
- **Recharts:** Harcama dağılımı için dinamik grafikler.
- **React Router 7:** Gelişmiş routing ve veri yükleme desteği.
- **Lucide React:** Modern ve hafif ikon seti.

## ✨ Temel Özellikler

- 🔐 **Gelişmiş Kimlik Doğrulama:** JWT tabanlı güvenli oturum yönetimi ve kullanıcı profil güncellemeleri.
- 📊 **Dinamik Dashboard:** Toplam denge, gelir/gider özeti ve kategori bazlı harcama grafikleri.
- 💸 **İşlem Yönetimi:** Harcamaların başlık, miktar, kategori ve tarih bazlı takibi.
- 📱 **PWA Desteği:** Uygulamayı telefonunuza veya masaüstünüze uygulama olarak yükleyin.
- 🌓 **Akıllı Karanlık Mod:** Tarayıcı tercihlerine uyumlu, şık Dark Mode deneyimi.
- 🛡️ **Veri Validasyonu:** Hatalı veri girişlerini önleyen güçlü backend ve frontend validasyonları.

## 🛠️ Kurulum Rehberi

### 1. Veritabanı (Supabase PostgreSQL)
1. [Supabase](https://supabase.com/) üzerinde bir proje oluşturun.
2. `backend/schema.sql` içerisindeki SQL kodlarını SQL Editor üzerinden çalıştırarak tabloları oluşturun.

### 2. Backend Yapılandırması
1. `backend/appsettings.json` dosyasını düzenleyin:
   - `ConnectionStrings:DefaultConnection` -> Supabase bağlantı dizgesi.
   - `Supabase:Url`, `Supabase:Key`, `Supabase:JwtSecret` bilgilerini girin.
2. Servisi başlatın:
   ```bash
   cd backend
   dotnet run
   ```

### 3. Frontend Yapılandırması
1. Bağımlılıkları yükleyin:
   ```bash
   cd frontend
   npm install
   ```
2. Geliştirme modunda başlatın:
   ```bash
   npm run dev
   ```

## 📂 Klasör Yapısı

```text
FinQ/
├── backend/                  # .NET 10 API
│   ├── Domain/               # Modeller ve Entity'ler
│   ├── Features/             # API Endpoints (Auth, Transaction, Profile)
│   ├── Infrastructure/       # Data, Validation, Mapping, Exception Handling
│   └── schema.sql            # Veritabanı şeması
├── frontend/                 # React 19 Uygulaması
│   ├── src/
│   │   ├── components/       # UI Bileşenleri (Layout, Common)
│   │   ├── features/         # Sayfa bazlı özellikler (Auth, Dashboard)
│   │   ├── store/            # Zustand state yönetimi
│   │   └── services/         # Axios API servisleri
│   └── public/               # PWA ve statik varlıklar
└── README.md
```

## 📝 Lisans
Bu proje geliştirme portfolyosu amacıyla oluşturulmuştur. Tüm hakları saklıdır.
