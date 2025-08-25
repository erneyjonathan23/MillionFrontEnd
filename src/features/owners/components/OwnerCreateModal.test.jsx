import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

jest.mock('../services/OwnerService.js', () => ({
  ownerService: {
    createOwner: jest.fn(),
    updateOwner: jest.fn(),
  },
}));

import { ownerService } from '../services/OwnerService.js';

import OwnerCreateModal from './OwnerCreateModal.jsx';

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const fillCommonFields = async ({ name = 'Ada Lovelace', address = 'Calle 1', birthday = '2000-01-20', photo = 'https://img.test/1.jpg' } = {}) => {
  const u = userEvent.setup();
  await u.clear(screen.getByLabelText(/nombre \*/i));
  await u.type(screen.getByLabelText(/nombre \*/i), name);

  await u.clear(screen.getByLabelText(/dirección/i));
  await u.type(screen.getByLabelText(/dirección/i), address);

  await u.clear(screen.getByLabelText(/fecha de nacimiento/i));
  await u.type(screen.getByLabelText(/fecha de nacimiento/i), birthday);

  await u.clear(screen.getByLabelText(/foto \(url\)/i));
  await u.type(screen.getByLabelText(/foto \(url\)/i), photo);
};

test('render create: envía createOwner y dispara onSuccess/onHide', async () => {
  ownerService.createOwner.mockResolvedValueOnce({ ok: true });

  const onHide = jest.fn();
  const onSuccess = jest.fn();

  render(
    <OwnerCreateModal show mode="create" onHide={onHide} onSuccess={onSuccess} />
  );

  // Título correcto
  expect(screen.getByText(/nuevo owner/i)).toBeInTheDocument();

  await fillCommonFields();

  const submit = screen.getByRole('button', { name: /crear/i });
  await userEvent.click(submit);

  await waitFor(() => {
    expect(ownerService.createOwner).toHaveBeenCalledTimes(1);
  });

  expect(ownerService.createOwner).toHaveBeenCalledWith({
    name: 'Ada Lovelace',
    address: 'Calle 1',
    email: '',          
    birthday: '2000-01-20',
    photo: 'https://img.test/1.jpg',
  });

  expect(onSuccess).toHaveBeenCalledTimes(1);
  expect(onHide).toHaveBeenCalledTimes(1);
});

test('render edit: precarga datos y llama updateOwner con el id', async () => {
  ownerService.updateOwner.mockResolvedValueOnce({ ok: true });

  const initialData = {
    idOwner: 'abc123',
    name: 'Grace Hopper',
    address: 'Av. 456',
    birthday: '1992-01-15T12:00:00.000Z',
    photo: 'https://img.test/grace.jpg',
  };

  const onHide = jest.fn();
  const onSuccess = jest.fn();

  render(
    <OwnerCreateModal show mode="edit" initialData={initialData} onHide={onHide} onSuccess={onSuccess} />
  );

  expect(screen.getByText(/editar owner/i)).toBeInTheDocument();

  expect(screen.getByLabelText(/nombre \*/i)).toHaveValue('Grace Hopper');
  expect(screen.getByLabelText(/dirección/i)).toHaveValue('Av. 456');
  expect(screen.getByLabelText(/fecha de nacimiento/i)).toHaveValue('1992-01-15');
  expect(screen.getByLabelText(/foto \(url\)/i)).toHaveValue('https://img.test/grace.jpg');

  const submit = screen.getByRole('button', { name: /guardar cambios/i });
  await userEvent.click(submit);

  await waitFor(() => {
    expect(ownerService.updateOwner).toHaveBeenCalledTimes(1);
  });

  expect(ownerService.updateOwner).toHaveBeenCalledWith('abc123', {
    name: 'Grace Hopper',
    address: 'Av. 456',
    email: '',
    birthday: '1992-01-15',
    photo: 'https://img.test/grace.jpg',
  });

  expect(onSuccess).toHaveBeenCalledTimes(1);
  expect(onHide).toHaveBeenCalledTimes(1);
});

test('muestra alerta de error si createOwner falla', async () => {
  ownerService.createOwner.mockRejectedValueOnce(new Error('boom'));

  render(<OwnerCreateModal show mode="create" />);

  await fillCommonFields({ name: 'X', address: 'Y', birthday: '2010-10-10', photo: 'https://x/y.jpg' });

  await userEvent.click(screen.getByRole('button', { name: /crear/i }));

  expect(await screen.findByText(/no se pudo crear el owner\./i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /crear/i })).toBeEnabled();
});
