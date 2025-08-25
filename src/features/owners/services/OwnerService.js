import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:53815/api', 
  timeout: 15000
});

const RESOURCE = '/Owner';

export const ownerService = {
  async getOwners(params = {}) {
    const { data } = await api.get(RESOURCE, { params });
    return data;
  },

  async getOwnerById(id) {
    const { data } = await api.get(`${RESOURCE}/${encodeURIComponent(id)}`);
    return data;
  },

  async createOwner(payload) {
    const { data } = await api.post(RESOURCE, payload);
    return data;
  },

  async updateOwner(id, payload) {
    const { data } = await api.put(`${RESOURCE}/${encodeURIComponent(id)}`, {...payload,id});
    return data;
  },

  async deleteOwner(id) {
    const res = await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
    return res.status === 200 || res.status === 204;
  }
};
