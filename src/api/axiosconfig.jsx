import axios from 'axios';

// API konfiguratsiyasi
const api = axios.create({
    baseURL: 'https://autoapi.dezinfeksiyatashkent.uz/api/',  
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;  
    },
    (error) => {
        return Promise.reject(error);  
    }
);

export default api;
