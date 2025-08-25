import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkipToContent from './SkipToContent';

describe('SkipToContent', () => {
  test('renderiza un enlace accesible que apunta a #main', () => {
    render(<SkipToContent />);

    const link = screen.getByRole('link', { name: /saltar al contenido/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main');
  });

  test('inicia fuera de pantalla (left/top -9999px)', () => {
    render(<SkipToContent />);

    const link = screen.getByRole('link', { name: /saltar al contenido/i });
    expect(link).toHaveStyle({ left: '-9999px', top: '-9999px' });
  });

  test('al recibir foco se muestra en pantalla (left/top 8px)', async () => {
    const user = userEvent.setup();
    render(<SkipToContent />);

    await user.tab();

    const link = screen.getByRole('link', { name: /saltar al contenido/i });
    expect(link).toHaveFocus();
    expect(link).toHaveStyle({ left: '8px', top: '8px' });
  });
});
