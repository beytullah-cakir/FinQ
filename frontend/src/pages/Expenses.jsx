import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Expenses() {
  const { expenses, fetchExpenses, removeExpense, isLoading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Hepsi');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const categories = ['Gıda', 'Fatura', 'Eğlence', 'Ulaşım', 'Diğer'];

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Hepsi' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Tüm İşlemler</h2>
          <p className="text-muted-foreground mt-1">Harcamalarınızı detaylıca inceleyin ve yönetin.</p>
        </div>
      </div>

      <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="İşlem ara..." 
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
              <button 
                onClick={() => setFilterCategory('Hepsi')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all", 
                  filterCategory === 'Hepsi' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Hepsi
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap", 
                    filterCategory === cat ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80">
                <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tarih</th>
                <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Açıklama</th>
                <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori</th>
                <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Tutar</th>
                <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors group">
                    <td className="py-4 px-4 text-sm whitespace-nowrap text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-foreground">{expense.title}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-right text-foreground">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-4 px-4 text-sm text-right">
                      <button 
                        onClick={() => removeExpense(expense.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-muted-foreground text-sm">
                    {isLoading ? "Yükleniyor..." : "Aranan kriterlere uygun işlem bulunamadı."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Toplam <span className="font-medium text-foreground">{filteredExpenses.length}</span> işlem gösteriliyor
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
