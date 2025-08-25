jest.mock('axios', () => {
  const create = jest.fn(() => ({
    interceptors: { response: { use: jest.fn() } },
  }));
  return { create };
});

describe('api (axios wrapper)', () => {
  beforeEach(() => {
    jest.resetModules();  
    jest.clearAllMocks();
  });

  test('usa ENV.API_BASE_URL y timeout 15000; registra interceptor', () => {
    jest.doMock('lib/env', () => ({ ENV: { API_BASE_URL: 'https://api.test' } }), {
      virtual: true,
    });

    jest.isolateModules(() => {
      const { api } = require('./client'); 
      const axios = require('axios');

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.test',
        timeout: 15000,
      });

      const instance = axios.create.mock.results[0].value;
      expect(api).toBe(instance);

      expect(instance.interceptors.response.use).toHaveBeenCalledTimes(1);
      const [onFulfilled, onRejected] = instance.interceptors.response.use.mock.calls[0];

      const resp = { ok: true };
      expect(onFulfilled(resp)).toBe(resp);

      const err = new Error('boom');
      return expect(onRejected(err)).rejects.toBe(err);
    });
  });

  test('si ENV.API_BASE_URL es falsy, usa "/"', () => {
    jest.doMock('lib/env', () => ({ ENV: { API_BASE_URL: '' } }), { virtual: true });

    jest.isolateModules(() => {
      require('./client'); 
      const axios = require('axios');

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: '/',
        timeout: 15000,
      });
    });
  });
});
