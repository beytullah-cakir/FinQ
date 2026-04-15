import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5124/api/';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Ekstra işlemler veya token eklemek için
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Hata yönetimi için (örn. 401 Unauthorized log out)
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    // Backend: { Email, Password }
    const response = await apiService.post('auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },
  register: async (userData) => {
    // Backend expects: FullName, Email, Password
    const response = await apiService.post('auth/register', {
      fullName: userData.name,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  },
};

export const expensesAPI = {
  getAll: async () => {
    const response = await apiService.get('transactions');
    return response.data;
  },
  create: async (data) => {
    // API expects Title and Amount
    const payload = {
      title: data.title,
      amount: parseFloat(data.amount),
      transactionDate: data.date
    };
    const response = await apiService.post('transactions', payload);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiService.delete(`transactions/${id}`);
    return response.data;
  },
};

export const profileAPI = {
  update: async (data) => {
    // API expects FullName, Email, Password (optional)
    const response = await apiService.put('profile/update', data);
    return response.data;
  },
};

export default apiService;
