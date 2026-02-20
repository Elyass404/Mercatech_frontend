// src/services/clientService.js
import api from './api';

export const clientService = {
    getAllClients: async () => {
        const response = await api.get('/clients');
        return response.data; // Returns a list of ClientResponse
    },
    
    getClientById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    createClient: async (clientUserRequest) => {
        const response = await api.post('/clients', clientUserRequest);
        return response.data;
    },

    updateClient: async (id, clientRequest) => {
        const response = await api.put(`/clients/${id}`, clientRequest);
        return response.data;
    },

    deleteClient: async (id) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    }
};