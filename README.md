# FinQ - Kişisel Finans Takip Uygulaması

FinQ, modern teknolojilerle geliştirilmiş, kullanıcı dostu ve şık bir kişisel finans yönetim uygulamasıdır. Gelir ve giderlerinizi takip etmenize, kategori bazlı harcama dağılımınızı görmenize ve finansal durumunuzu kontrol altında tutmanıza yardımcı olur.

## 🚀 Teknolojiler

### Backend
- **.NET 10** (Minimal APIs)
- **Entity Framework Core** (Npgsql)
- **PostgreSQL** (Supabase Managed DB)
- **BCrypt.Net** (Şifre güvenliği)
- **JWT** (Kimlik doğrulama)

### Frontend
- **React 19** + **Vite**
- **Zustand** (State management)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Recharts** (Grafikler)
- **Axios** (API iletişim)

## ✨ Özellikler

- 🔐 **Güvenli Kimlik Doğrulama:** Register ve Login işlemleri, JWT tabanlı oturum yönetimi.
- 📊 **Dashboard:** Toplam harcama özeti ve harcama dağılımını gösteren interaktif grafikler.
- 💸 **İşlem Yönetimi:** Harcama ekleme (başlık, miktar, tarih, kategori) ve silme işlemleri.
- 👤 **Profil Yönetimi:** Ad, Email ve Şifre güncelleme desteği.
- 🌓 **Karanlık Mod:** Göz yormayan modern Dark Mode desteği (FOUC korumalı).
- 📱 **Responsive Tasarım:** Mobil ve masaüstü uyumlu arayüz.

## 🛠️ Kurulum ve Çalıştırma

Projenin çalışması için hem **Backend** hem de **Frontend** katmanlarının aynı anda çalışıyor olması gerekir.

### 1. Veritabanı Hazırlığı
- [Supabase](https://supabase.com/) üzerinde bir PostgreSQL veritabanı oluşturun.
- Gerekli tabloları oluşturmak için veritabanında ilgili şemayı (`users`, `transactions`) oluşturun.

### 2. Backend'i Başlatma
- `backend/appsettings.json` dosyasındaki `ConnectionStrings:DefaultConnection` kısmına veritabanı bağlantı dizinizi ekleyin.
- Supabase JWT Secret bilgisini ekleyin.
- Terminalden ilgili klasöre gidin ve çalıştırın:
  ```bash
  cd backend
  dotnet run
  ```
  *Varsayılan port:* `http://localhost:5124`

### 3. Frontend'i Başlatma
- Terminalden ilgili klasöre gidin:
  ```bash
  cd frontend
  npm install
- Frontend'i başlatın:
  ```bash
  npm run dev
  ```

## 📝 Lisans
Bu proje geliştirme ve öğrenme amaçlı oluşturulmuştur.
