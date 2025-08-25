import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:53815/api', 
  timeout: 15000
});

const RESOURCE = '/PropertyTraces';  

export const propertyTraceService = {
  async list(params = {}) {
    const { data } = await api.get(RESOURCE, { params });
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`${RESOURCE}/${encodeURIComponent(id)}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post(RESOURCE, payload);
    return data;
  },
  async update(id, payload) {
    const body = { id, ...payload };  
    const { data } = await api.put(`${RESOURCE}/${encodeURIComponent(id)}`, body);
    return data;
  },
  async remove(id) {
    const res = await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
    return res.status === 200 || res.status === 204;
  }
};
