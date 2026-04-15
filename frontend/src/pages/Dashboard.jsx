import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Trash2, Plus, Calendar, DollarSign, Tag, TrendingDown, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const { expenses, fetchExpenses, addExpense, removeExpense, isAdding, user, error } = useStore();
  const [filterCategory, setFilterCategory] = useState('Hepsi');
  const [formData, setFormData] = useState({ title: '', amount: '', date: '', category: 'Gıda' });

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const categories = ['Gıda', 'Fatura', 'Eğlence', 'Ulaşım', 'Diğer'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) return;
    
    addExpense({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setFormData({ title: '', amount: '', date: '', category: 'Gıda' });
  };

  const filteredExpenses = expenses.filter(e => filterCategory === 'Hepsi' || e.category === filterCategory);
  
  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category for chart
  const chartData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const COLORS = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header section with Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col justify-end">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Hoş Geldiniz, {user?.name?.split(' ')[0]}</h2>
          <p className="text-muted-foreground mt-1">Finansal durumunuzun özeti aşağıdadır.</p>
        </div>
        
        <div className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative z-10 flex flex-col">
            <span className="text-sm font-medium opacity-80 flex items-center gap-2"><TrendingDown className="h-4 w-4"/> Toplam Harcama</span>
            <span className="text-4xl font-extrabold mt-2 tracking-tight">{formatCurrency(totalAmount)}</span>
            <span className="text-xs opacity-70 mt-2">Seçili filtre: {filterCategory}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Form & Chart */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Add Expense Form */}
          <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5 flex items-center gap-2"><Plus className="h-5 w-5 text-primary"/> Yeni Harcama Ekle</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Başlık</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Örn: Market"
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Tutar (₺)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Tarih</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full pl-9 pr-2 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Kategori</label>
                  <select 
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg font-medium transition-all shadow-sm mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Ekle
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Chart */}
          <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">Harcama Dağılımı</h3>
            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                Henüz veri yok.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: List */}
        <div className="xl:col-span-2">
          <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-semibold">Harcamalar</h3>
              
              <div className="flex items-center gap-2 bg-background border border-input rounded-lg p-1 w-full sm:w-auto">
                <button 
                  onClick={() => setFilterCategory('Hepsi')}
                  className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", filterCategory === 'Hepsi' ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}
                >
                  Hepsi
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", filterCategory === cat ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:block")}
                  >
                    {cat}
                  </button>
                ))}
                {/* Mobile select fallback for categories */}
                <select 
                  className="sm:hidden bg-transparent outline-none text-sm px-2 text-foreground"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80">
                    <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tarih</th>
                    <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Açıklama</th>
                    <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori</th>
                    <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Tutar</th>
                    <th className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors group">
                        <td className="py-4 px-4 text-sm whitespace-nowrap text-muted-foreground">{new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                        <td className="py-4 px-4 text-sm font-medium text-foreground">{expense.title}</td>
                        <td className="py-4 px-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-right text-foreground">{formatCurrency(expense.amount)}</td>
                        <td className="py-4 px-4 text-sm text-right">
                          <button 
                            onClick={() => removeExpense(expense.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-muted-foreground text-sm">
                        Bu filtreye uygun harcama bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
