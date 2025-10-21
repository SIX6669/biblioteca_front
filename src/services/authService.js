import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class AuthService {
  async login(email, password) {
    try {

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('bibliotecario', JSON.stringify(response.data.bibliotecario));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al iniciar sesión';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('bibliotecario');
  }

  getCurrentUser() {
    const bibliotecario = localStorage.getItem('bibliotecario');
    return bibliotecario ? JSON.parse(bibliotecario) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();