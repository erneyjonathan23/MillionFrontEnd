import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

jest.mock('../services/PropertyTraceService.js', () => {
  const create = jest.fn();
  const update = jest.fn();
  return { propertyTraceService: { create, update } };
});

import { propertyTraceService as svc } from '../services/PropertyTraceService.js';

import PropertyTraceFormModal from './PropertyTraceFormModal.jsx';

const PROPS = [
  { idProperty: 'p1', name: 'Prop 1', email: 'p1@x.test' },
  { idProperty: 'p2', name: 'Prop 2', email: 'p2@x.test' },
];

const expectIsoEqual = (gotIso, localLike) => {
  expect(new Date(gotIso).toISOString()).toBe(new Date(localLike).toISOString());
};

describe('PropertyTraceFormModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('modo create: renderiza título, select y respeta defaultIdProperty; envía payload normalizado', async () => {
    const user = userEvent.setup();
    const onHide = jest.fn();
    const onSuccess = jest.fn();

    render(
      <PropertyTraceFormModal
        show
        onHide={onHide}
        onSuccess={onSuccess}
        mode="create"
        defaultIdProperty="p2"
        owners={PROPS}
      />
    );

    expect(screen.getByText(/nueva traza/i)).toBeInTheDocument();

    const combo = screen.getByRole('combobox');
    const options = within(combo).getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options.map(o => o.value)).toEqual(['p1', 'p2']);

    await user.selectOptions(combo, 'p2');

    await user.type(screen.getByLabelText(/fecha de venta/i), '2023-04-15T10:20');
    await user.type(screen.getByLabelText(/^nombre/i), 'Venta Lote');
    await user.type(screen.getByLabelText(/^valor/i), '123.45');
    await user.type(screen.getByLabelText(/^impuesto/i), '7');

    svc.create.mockResolvedValueOnce({ ok: true });
    await user.click(screen.getByRole('button', { name: /crear/i }));

    expect(svc.create).toHaveBeenCalledTimes(1);
    const payload = svc.create.mock.calls[0][0];

    expect(payload).toMatchObject({
      idProperty: 'p2',
      name: 'Venta Lote',
      value: 123.45,
      tax: 7,
    });
    expectIsoEqual(payload.dateSale, '2023-04-15T10:20');
    expect(onSuccess).toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });

  test('modo create: si create rechaza, muestra alerta', async () => {
    const user = userEvent.setup();

    render(
      <PropertyTraceFormModal
        show
        onHide={jest.fn()}
        onSuccess={jest.fn()}
        mode="create"
        defaultIdProperty="p1"
        owners={PROPS}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), 'p1');
    await user.type(screen.getByLabelText(/fecha de venta/i), '2024-02-02T09:00');
    await user.type(screen.getByLabelText(/^nombre/i), 'Venta X');
    await user.type(screen.getByLabelText(/^valor/i), '10');

    svc.create.mockRejectedValueOnce(new Error('boom'));
    await user.click(screen.getByRole('button', { name: /crear/i }));

    expect(await screen.findByText(/no se pudo crear la traza/i)).toBeInTheDocument();
  });

  test('modo edit: precarga valores y hace update con payload normalizado', async () => {
    const user = userEvent.setup();

    const initialData = {
      id: 't-1',
      idProperty: 'p1',
      dateSale: '2022-12-01T12:30:00.000Z',
      name: 'Venta Inicial',
      value: 999.99,
      tax: 0.5,
    };

    render(
      <PropertyTraceFormModal
        show
        onHide={jest.fn()}
        onSuccess={jest.fn()}
        mode="edit"
        initialData={initialData}
        owners={PROPS}
      />
    );

    expect(screen.getByText(/editar traza/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nombre/i)).toHaveValue('Venta Inicial');
    expect(screen.getByLabelText(/^valor/i)).toHaveValue(999.99);
    expect(screen.getByLabelText(/^impuesto/i)).toHaveValue(0.5);

    await user.clear(screen.getByLabelText(/^nombre/i));
    await user.type(screen.getByLabelText(/^nombre/i), 'Venta Editada');

    svc.update.mockResolvedValueOnce({ ok: true });
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(svc.update).toHaveBeenCalledTimes(1);
    const [sentId, payload] = svc.update.mock.calls[0];

    expect(sentId).toBe('t-1');
    expect(payload).toEqual(
      expect.objectContaining({
        idProperty: 'p1',
        name: 'Venta Editada',
        value: 999.99,
        tax: 0.5,
      })
    );
    expectIsoEqual(payload.dateSale, initialData.dateSale);
  });
});
