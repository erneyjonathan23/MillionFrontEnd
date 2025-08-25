
describe('propertyTraceService', () => {
  let propertyTraceService;
  let axiosMod;  
  let api; 
  let mockHttp;  

  const RESOURCE = '/PropertyTraces';

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    mockHttp = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    jest.doMock('axios', () => ({
      __esModule: true,
      default: { create: jest.fn(() => mockHttp) },
      create: jest.fn(() => mockHttp), 
    }));

    jest.isolateModules(() => {
      axiosMod = require('axios'); 
      propertyTraceService = require('./PropertyTraceService.js').propertyTraceService;
      api = (axiosMod.default ?? axiosMod).create.mock.results[0].value;
    });
  });

  test('list llama GET /PropertyTraces con params y devuelve data', async () => {
    const params = { page: 2, q: 'x' };
    const data = [{ id: 't1' }, { id: 't2' }];
    api.get.mockResolvedValueOnce({ data });

    const res = await propertyTraceService.list(params);

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith(RESOURCE, { params });
    expect(res).toBe(data);
  });

  test('getById llama GET /PropertyTraces/:id (encodeURIComponent) y devuelve data', async () => {
    const rawId = 'a b/ç?';
    const encoded = encodeURIComponent(rawId);
    const data = { id: rawId };
    api.get.mockResolvedValueOnce({ data });

    const res = await propertyTraceService.getById(rawId);

    expect(api.get).toHaveBeenCalledWith(`${RESOURCE}/${encoded}`);
    expect(res).toBe(data);
  });

  test('create llama POST /PropertyTraces con payload y devuelve data', async () => {
    const payload = { name: 'venta', value: 123, tax: 10, idProperty: 'p1' };
    const data = { id: 't9', ...payload };
    api.post.mockResolvedValueOnce({ data });

    const res = await propertyTraceService.create(payload);

    expect(api.post).toHaveBeenCalledWith(RESOURCE, payload);
    expect(res).toBe(data);
  });

  test('update llama PUT /PropertyTraces/:id con body {id, ...payload} y devuelve data', async () => {
    const rawId = 'x y';
    const encoded = encodeURIComponent(rawId);
    const payload = { name: 'update', value: 999 };
    const expectedBody = { id: rawId, ...payload };
    const data = { id: rawId, ok: true };
    api.put.mockResolvedValueOnce({ data });

    const res = await propertyTraceService.update(rawId, payload);

    expect(api.put).toHaveBeenCalledWith(`${RESOURCE}/${encoded}`, expectedBody);
    expect(res).toBe(data);
  });

  test('remove devuelve true con 200/204 y false con otro status', async () => {
    const id = 'abc';
    const encoded = encodeURIComponent(id);

    api.delete.mockResolvedValueOnce({ status: 204 });
    await expect(propertyTraceService.remove(id)).resolves.toBe(true);
    expect(api.delete).toHaveBeenCalledWith(`${RESOURCE}/${encoded}`);

    api.delete.mockResolvedValueOnce({ status: 200 });
    await expect(propertyTraceService.remove(id)).resolves.toBe(true);

    api.delete.mockResolvedValueOnce({ status: 202 });
    await expect(propertyTraceService.remove(id)).resolves.toBe(false);
  });
});
