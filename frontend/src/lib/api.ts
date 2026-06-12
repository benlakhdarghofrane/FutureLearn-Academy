import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fl_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('fl_token');
      localStorage.removeItem('fl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Courses
export const coursesApi = {
  getAll: (params?: any) => api.get('/courses', { params }),
  getOne: (id: string) => api.get(`/courses/${id}`),
  getMy: () => api.get('/courses/my'),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.patch(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};

// Enrollments
export const enrollmentsApi = {
  enroll: (courseId: string) => api.post(`/enrollments/${courseId}`),
  getMy: () => api.get('/enrollments/my'),
};

// Progress
export const progressApi = {
  complete: (lessonId: string, watchedSeconds?: number) =>
    api.post(`/progress/lesson/${lessonId}/complete`, { watchedSeconds }),
  getMy: () => api.get('/progress/my'),
  getVelocity: () => api.get('/progress/velocity'),
};

// Certificates
export const certificatesApi = {
  getMy: () => api.get('/certificates/my'),
  issue: (courseId: string) => api.post(`/certificates/issue/${courseId}`),
};

// Users
export const usersApi = {
  getStats: () => api.get('/users/stats'),
  updateMe: (data: any) => api.patch('/users/me', data),
  getOne: (id: string) => api.get(`/users/${id}`),
};
