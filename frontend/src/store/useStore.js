import { create } from 'zustand';
import { expensesAPI, authAPI, profileAPI } from '../services/apiService';

const storedUser = localStorage.getItem('user_info');

export const useStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!localStorage.getItem('jwt_token'),
  expenses: [],
  isLoading: false,
  isAdding: false,
  isDeleting: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      // Backend returns: { Token, FullName, Email, Id }
      
      const token = data.Token || data.token;
      const userObj = { 
        name: data.FullName || data.fullName, 
        email: data.Email || data.email, 
        id: data.Id || data.id 
      };

      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_info', JSON.stringify(userObj));

      set({ 
        user: userObj,
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Giriş başarısız';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.register(userData);
      // Depending on backend, we might auto-login or redirect.
      // Current backend says "Kayıt başarılı! Giriş yapabilirsiniz."
      set({ isLoading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Kayıt başarısız';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    set({ user: null, isAuthenticated: false, expenses: [] });
  },

  updateUser: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      // Backend expects: FullName, Email, Password (optional)
      const data = await profileAPI.update({
        fullName: updateData.name,
        email: updateData.email,
        password: updateData.password
      });
      
      const updatedUser = {
        name: data.user.FullName || data.user.fullName,
        email: data.user.Email || data.user.email,
        id: data.user.Id || data.user.id
      };

      localStorage.setItem('user_info', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Güncelleme başarısız';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  fetchExpenses: async () => {
    console.log('Fetching expenses...');
    set({ isLoading: true, error: null });
    try {
      const data = await expensesAPI.getAll();
      console.log('Expenses received raw:', data);
      
      // Backend returns fields like 'title', 'amount', 'id', 'createdAt'
      // Mapping 'createdAt' to 'date' for UI compatibility
      const mappedData = data.map(item => ({
        ...item,
        date: item.transactionDate || item.createdAt || new Date().toISOString(),
        category: 'Diğer' // Default since backend doesn't have category yet
      }));
      console.log('Expenses mapped:', mappedData);
      set({ expenses: mappedData, isLoading: false });
    } catch (err) {
      console.error('Fetch expenses error:', err);
      set({ error: err.message || 'Veriler alınamadı', isLoading: false });
    }
  },

  addExpense: async (expenseData) => {
    set({ isAdding: true, error: null });
    try {
      const newExpense = await expensesAPI.create(expenseData);
      const mappedExpense = {
        ...newExpense,
        date: newExpense.transactionDate || newExpense.createdAt || expenseData.date,
        category: expenseData.category || 'Diğer'
      };
      set((state) => ({
        expenses: [mappedExpense, ...state.expenses],
        isAdding: false
      }));
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Ekleme başarısız';
      set({ error: message, isAdding: false });
    }
  },

  removeExpense: async (id) => {
    set({ isDeleting: true, error: null });
    try {
      await expensesAPI.delete(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        isDeleting: false
      }));
    } catch (err) {
      set({ error: err.message || 'Silme başarısız', isDeleting: false });
    }
  }
}));
