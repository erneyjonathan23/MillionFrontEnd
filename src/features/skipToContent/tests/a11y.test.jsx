import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
expect.extend(toHaveNoViolations);

function Dummy() { return <button>Click</button>; }

test('accesibilidad básica', async () => {
  const { container } = render(<Dummy />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
