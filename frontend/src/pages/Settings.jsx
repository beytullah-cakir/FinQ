import { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Bell, Shield, Moon, Sun, Save, CreditCard, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Settings() {
  const { user, updateUser, isLoading, error } = useStore();
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    currency: 'TRY (₺)',
    dark_mode: document.documentElement.classList.contains('dark'),
  });

  const [activeTab, setActiveTab] = useState('profile');

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setFormData({ ...formData, dark_mode: false });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setFormData({ ...formData, dark_mode: true });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }

    const success = await updateUser({
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined
    });

    if (success) {
      setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.');
      setFormData({ ...formData, password: '', confirmPassword: '' });
      // Reset success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profil Ayarları', icon: User },
    { id: 'preferences', label: 'Görünüm & Tercihler', icon: Moon },
    { id: 'security', label: 'Güvenlik & Şifre', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Ayarlar</h2>
          <p className="text-muted-foreground mt-1">Hesabınızı ve uygulama tercihlerini özelleştirin.</p>
        </div>
      </div>

      {(error || successMessage) && (
        <div className={cn(
          "p-4 rounded-xl border animate-in fade-in slide-in-from-top-2",
          error ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-primary/10 border-primary/20 text-primary"
        )}>
          {error || successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold mb-6">Profil Bilgileri</h3>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                     <User className="h-10 w-10 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <h4 className="font-semibold text-lg">{user?.name}</h4>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Ad Soyad</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email Adresi</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold mb-6">Şifre Değiştir</h3>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">Hesabınızı güvende tutmak için periyodik olarak şifrenizi değiştirmenizi öneririz.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Yeni Şifre</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold mb-6">Görünüm & Tercihler</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-background border border-border rounded-lg flex items-center justify-center">
                        <Moon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Karanlık Mod (Dark Mode)</p>
                        <p className="text-xs text-muted-foreground">Uygulama arayüzünü karartın.</p>
                      </div>
                   </div>
                   <button 
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${formData.dark_mode ? 'bg-primary' : 'bg-muted'}`}
                   >
                     <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.dark_mode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                   </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-input/50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-background border border-border rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Para Birimi</p>
                        <p className="text-xs text-muted-foreground">İşlemlerde varsayılan para birimi.</p>
                      </div>
                   </div>
                   <select 
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="bg-transparent border-none focus:ring-0 text-sm font-medium text-primary cursor-pointer"
                    >
                      <option>TRY (₺)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" /> Değişiklikleri Kaydet
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
