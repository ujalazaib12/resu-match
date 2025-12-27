import axios from 'axios';

const museApi = axios.create({
    baseURL: 'https://www.themuse.com/api/public',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for error handling
museApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Muse API Error:', error);
        return Promise.reject(error);
    }
);

export default museApi;
