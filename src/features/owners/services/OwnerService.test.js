jest.mock('axios', () => {
  const create = jest.fn();
  return { __esModule: true, default: { create } };
});

function withService(setupApi) {
  let svc, api;
  jest.isolateModules(() => {
    const axiosDefault = require('axios').default;

    api = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    axiosDefault.create.mockReturnValue(api);

    svc = require('./OwnerService.js').ownerService;

    if (setupApi) setupApi(api);
  });
  return { ownerService: svc, api };
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('ownerService', () => {
  test('getOwners llama GET /Owner con params y devuelve data', async () => {
    const { ownerService, api } = withService((api) => {
      api.get.mockResolvedValue({ data: [{ idOwner: '1', name: 'A' }] });
    });

    const res = await ownerService.getOwners({ page: 2 });
    expect(api.get).toHaveBeenCalledWith('/Owner', { params: { page: 2 } });
    expect(res).toEqual([{ idOwner: '1', name: 'A' }]);
  });

  test('getOwnerById llama GET /Owner/:id y devuelve data', async () => {
    const id = 'abc 1/ç';
    const { ownerService, api } = withService((api) => {
      api.get.mockResolvedValue({ data: { idOwner: id } });
    });

    const res = await ownerService.getOwnerById(id);
    expect(api.get).toHaveBeenCalledWith(`/Owner/${encodeURIComponent(id)}`);
    expect(res).toEqual({ idOwner: id });
  });

  test('createOwner llama POST /Owner con payload y devuelve data', async () => {
    const payload = { name: 'Neo' };
    const { ownerService, api } = withService((api) => {
      api.post.mockResolvedValue({ data: { idOwner: '123', ...payload } });
    });

    const res = await ownerService.createOwner(payload);
    expect(api.post).toHaveBeenCalledWith('/Owner', payload);
    expect(res).toEqual({ idOwner: '123', ...payload });
  });

  test('updateOwner llama PUT /Owner/:id con payload + id y devuelve data', async () => {
    const id = '42';
    const payload = { name: 'Trinity' };
    const { ownerService, api } = withService((api) => {
      api.put.mockResolvedValue({ data: { ok: true } });
    });

    const res = await ownerService.updateOwner(id, payload);
    expect(api.put).toHaveBeenCalledWith(`/Owner/${encodeURIComponent(id)}`, {
      ...payload,
      id,
    });
    expect(res).toEqual({ ok: true });
  });

  test('deleteOwner devuelve true con 200/204 y false en otro status', async () => {
    const { ownerService, api } = withService();

    api.delete.mockResolvedValueOnce({ status: 204 });
    await expect(ownerService.deleteOwner('x')).resolves.toBe(true);

    api.delete.mockResolvedValueOnce({ status: 200 });
    await expect(ownerService.deleteOwner('y')).resolves.toBe(true);

    api.delete.mockResolvedValueOnce({ status: 202 });
    await expect(ownerService.deleteOwner('z')).resolves.toBe(false);
  });
});
