import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 10000,
});

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401 && !window.location.href.includes('/login')) {
//             localStorage.clear();
//             window.location.href = '/login';
//         }
//     }
// );

export default api;
