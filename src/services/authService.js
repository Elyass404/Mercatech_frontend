// src/services/authService.js
import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        // The backend will set an HTTP-Only cookie automatically.
        // We can optionally save the user info to localStorage if we want to display their name later.
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        return response.data;
    },
    
    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('currentUser');
    }
};