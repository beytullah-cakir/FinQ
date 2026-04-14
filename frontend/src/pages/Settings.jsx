import { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, Bell, Shield, Moon, Sun, Save, CreditCard } from 'lucide-react';

export default function Settings() {
  const { user } = useStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: 'TRY (₺)',
    dark_mode: document.documentElement.classList.contains('dark'),
  });

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

  const menuItems = [
    { id: 'profile', label: 'Profil Ayarları', icon: User },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik & Şifre', icon: Shield },
    { id: 'billing', label: 'Faturalandırma', icon: CreditCard },
  ];

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Ayarlar</h2>
          <p className="text-muted-foreground mt-1">Hesabınızı ve uygulama tercihlerini özelleştirin.</p>
        </div>
      </div>

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
          {/* Profile Section */}
          <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6">Profil Bilgileri</h3>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 relative group">
                   <User className="h-10 w-10 text-primary" />
                   <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold">
                     DEĞİŞTİR
                   </div>
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <h4 className="font-semibold text-lg">{formData.name}</h4>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
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

          {/* Preferences Section */}
          <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6">
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

          <div className="flex justify-end pt-4">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/25">
              <Save className="h-5 w-5" /> Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
