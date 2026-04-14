# FinQ - Kişisel Finans Takip Uygulaması

FinQ, modern teknolojilerle geliştirilmiş, kullanıcı dostu ve şık bir kişisel finans yönetim uygulamasıdır. Gelir ve giderlerinizi takip etmenize, kategori bazlı harcama dağılımınızı görmenize ve finansal durumunuzu kontrol altında tutmanıza yardımcı olur.

## 🚀 Teknolojiler

### Backend
- **.NET 10** (Minimal APIs)
- **Supabase C# SDK** (Postgrest-csharp)
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
- 👤 **Profil Yönetimi:** Kullanıcı bilgilerinin görüntülenmesi ve özelleştirilmesi.
- 🌓 **Karanlık Mod:** Göz yormayan modern Dark Mode desteği.
- 📱 **Responsive Tasarım:** Mobil ve masaüstü uyumlu arayüz.

## 🛠️ Kurulum

### 1. Veritabanı Hazırlığı (Supabase)
- [Supabase](https://supabase.com/) üzerinde bir proje oluşturun.
- `backend/schema.sql` dosyasındaki SQL komutlarını Supabase **SQL Editor** kısmında çalıştırarak tabloları oluşturun.
- (Opsiyonel) RLS politikalarını ihtiyacınıza göre düzenleyin veya geliştirme aşamasında `DISABLE ROW LEVEL SECURITY` komutunu kullanın.

### 2. Backend Ayarları
- `backend/appsettings.json` dosyasındaki Supabase API bilgilerini güncelleyin:
  ```json
  "Supabase": {
    "Url": "YOUR_SUPABASE_URL",
    "Key": "YOUR_SUPABASE_ANON_KEY",
    "JwtSecret": "YOUR_JWT_SECRET"
  }
  ```
- Backend'i başlatın:
  ```bash
  cd backend
  dotnet run
  ```

### 3. Frontend Ayarları
- Bağımlılıkları yükleyin:
  ```bash
  cd frontend
  npm install
  ```
- `.env` dosyasındaki (varsa) API URL'sini backend portuyla eşleşecek şekilde güncelleyin (Varsayılan: `http://localhost:5124/api`).
- Frontend'i başlatın:
  ```bash
  npm run dev
  ```

## 📝 Lisans
Bu proje geliştirme ve öğrenme amaçlı oluşturulmuştur.
