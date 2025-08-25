jest.mock('axios', () => ({ __esModule: true, default: { create: jest.fn() } }));

describe('propertyService', () => {
  let api;
  let propertyService;

  beforeEach(() => {
    jest.resetModules();

    api = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    const axiosMod = require('axios').default;
    axiosMod.create.mockReturnValue(api);

    propertyService = require('./PropertyService.js').propertyService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getProperties llama GET /Property con params y devuelve data', async () => {
    const fake = [{ idProperty: 'p1' }];
    api.get.mockResolvedValueOnce({ data: fake });

    const out = await propertyService.getProperties({ q: 'algo' });

    expect(api.get).toHaveBeenCalledWith('/Property', { params: { q: 'algo' } });
    expect(out).toBe(fake);
  });

  test('getById llama GET /Property/:id (encodeURIComponent) y devuelve data', async () => {
    const fake = { idProperty: 'x y' };
    api.get.mockResolvedValueOnce({ data: fake });

    const out = await propertyService.getById('x y');

    expect(api.get).toHaveBeenCalledWith('/Property/x%20y');
    expect(out).toBe(fake);
  });

  test('create llama POST /Property con payload y devuelve data', async () => {
    const payload = { name: 'Casa' };
    const fake = { idProperty: 'p9', ...payload };
    api.post.mockResolvedValueOnce({ data: fake });

    const out = await propertyService.create(payload);

    expect(api.post).toHaveBeenCalledWith('/Property', payload);
    expect(out).toBe(fake);
  });

  test('update llama PUT /Property/:id con payload + id y devuelve data', async () => {
    const payload = { name: 'Depto' };
    const fake = { ok: true };
    api.put.mockResolvedValueOnce({ data: fake });

    const out = await propertyService.update('a b', payload);

    expect(api.put).toHaveBeenCalledWith('/Property/a%20b', { ...payload, id: 'a b' });
    expect(out).toBe(fake);
  });

  test('delete devuelve true con 200/204 y false con otro status', async () => {
    api.delete.mockResolvedValueOnce({ status: 204 });
    await expect(propertyService.delete('x')).resolves.toBe(true);

    api.delete.mockResolvedValueOnce({ status: 200 });
    await expect(propertyService.delete('y')).resolves.toBe(true);

    api.delete.mockResolvedValueOnce({ status: 202 });
    await expect(propertyService.delete('z')).resolves.toBe(false);

    expect(api.delete).toHaveBeenNthCalledWith(1, '/Property/x');
    expect(api.delete).toHaveBeenNthCalledWith(2, '/Property/y');
    expect(api.delete).toHaveBeenNthCalledWith(3, '/Property/z');
  });
});
