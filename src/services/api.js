import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:53815/api",
});

export default api;
