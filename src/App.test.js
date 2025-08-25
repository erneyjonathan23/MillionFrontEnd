import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

test('App se monta sin crashear', () => {
  render(<App />);
});
