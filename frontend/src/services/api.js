import axios from 'axios';

const api = axios.create({
    // baseURL: "http://localhost:8000"
    baseURL: "https://sports-events-app.herokuapp.com/"
});

export default api;