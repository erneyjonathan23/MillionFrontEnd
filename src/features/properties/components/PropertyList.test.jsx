import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import PropertyList from './PropertyList.jsx';

const mkProp = (
  i,
  {
    idKey = 'idProperty',      
    images = [],            
    price = 1000 * i,         
    year = 2000 + i,
  } = {}
) => {
  const base = {
    name: `Prop ${i}`,
    address: `Dir ${i}`,
    price,
    year,
    images,
  };
  if (idKey === 'id') return { ...base, id: `pid${i}` };
  if (idKey === '_id') return { ...base, _id: `pid${i}` };
  return { ...base, idProperty: `pid${i}` };
};

describe('PropertyList', () => {
  test('renderiza encabezado, pagina 1 y 5 filas por página', () => {
    const props = Array.from({ length: 7 }, (_, i) => mkProp(i + 1));
    render(<PropertyList properties={props} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('heading', { name: /lista de propiedades/i })).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 2/i)).toBeInTheDocument();

    expect(screen.getByText('Prop 1')).toBeInTheDocument();
    expect(screen.getByText('Prop 5')).toBeInTheDocument();
    expect(screen.queryByText('Prop 6')).not.toBeInTheDocument();
  });

  test('cambia a la página 2 al hacer click en el paginador', async () => {
    const user = userEvent.setup();
    const props = Array.from({ length: 7 }, (_, i) => mkProp(i + 1));
    render(<PropertyList properties={props} onEdit={jest.fn()} onDelete={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByText(/Página 2 de 2/i)).toBeInTheDocument();
    expect(screen.getByText('Prop 6')).toBeInTheDocument();
    expect(screen.getByText('Prop 7')).toBeInTheDocument();
    expect(screen.queryByText('Prop 5')).not.toBeInTheDocument();
  });

  test('botón Editar dispara onEdit con el objeto completo', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const p1 = mkProp(1);
    const p2 = mkProp(2);
    render(<PropertyList properties={[p1, p2]} onEdit={onEdit} onDelete={jest.fn()} />);

    const row = screen.getByText('Prop 2').closest('tr');
    await user.click(within(row).getByRole('button', { name: /editar/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Prop 2', address: 'Dir 2' }));
  });

  test('botón Eliminar pasa idProperty | id | _id según corresponda', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    const p1 = mkProp(1, { idKey: 'idProperty' }); 
    const p2 = mkProp(2, { idKey: 'id' });         
    const p3 = mkProp(3, { idKey: '_id' });      

    render(<PropertyList properties={[p1, p2, p3]} onEdit={jest.fn()} onDelete={onDelete} />);

    for (const name of ['Prop 1', 'Prop 2', 'Prop 3']) {
      const row = screen.getByText(name).closest('tr');
      await user.click(within(row).getByRole('button', { name: /eliminar/i }));
    }

    expect(onDelete).toHaveBeenCalledTimes(3);
    expect(onDelete).toHaveBeenNthCalledWith(1, 'pid1');
    expect(onDelete).toHaveBeenNthCalledWith(2, 'pid2');
    expect(onDelete).toHaveBeenNthCalledWith(3, 'pid3');
  });

  test('muestra hasta 4 imágenes por propiedad', () => {
    const images = Array.from({ length: 6 }, (_, i) => ({ file: `https://img/${i}.jpg` }));
    const prop = mkProp(1, { images });
    render(<PropertyList properties={[prop]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const row = screen.getByText('Prop 1').closest('tr');
    const imgs = within(row).getAllByAltText('property');
    expect(imgs).toHaveLength(4); 
  });

  test('si no hay imágenes, muestra "N/A"', () => {
    const prop = mkProp(1, { images: [] });
    render(<PropertyList properties={[prop]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const row = screen.getByText('Prop 1').closest('tr');
    expect(within(row).getByText('N/A')).toBeInTheDocument();
  });

  test('estado vacío cuando no hay propiedades', () => {
    render(<PropertyList properties={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/no hay propiedades registradas/i)).toBeInTheDocument();
    expect(screen.getByText(/Página 1 de 1/i)).toBeInTheDocument();
  });

  test('si price no es número, se muestra tal cual (fallback)', () => {
    const prop = mkProp(1, { price: '12345' }); // string => no formatea
    render(<PropertyList properties={[prop]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const row = screen.getByText('Prop 1').closest('tr');
    expect(within(row).getByText('12345')).toBeInTheDocument();
  });
});
