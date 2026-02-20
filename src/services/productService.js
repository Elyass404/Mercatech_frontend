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
    }, 

    getProductById: async(id) =>{
      const response = await api.get(`/products/${id}`);
      return response.data
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }

};