
import api from './api';

export const orderService = {
    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },
    
    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    getOrdersByClient: async (clientId) => {
        const response = await api.get(`/orders/client/${clientId}`);
        return response.data;
    },

    createOrder: async (orderRequest) => {
        const response = await api.post('/orders', orderRequest);
        return response.data;
    },

    // Matches your @PatchMapping with @RequestParam
    updateOrderStatus: async (id, newStatus) => {
        const response = await api.patch(`/orders/${id}/status?newStatus=${newStatus}`);
        return response.data;
    }
};