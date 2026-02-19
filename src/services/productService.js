// src/services/productService.js
import api from './api';

export const productService = {
    getAllProducts: async (page = 0, size = 10) => {
        const response = await api.get(`/products?page=${page}&size=${size}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    }

};