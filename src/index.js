import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from './app/ErrorBoundary.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary >
    <Suspense fallback={<div style={{ padding: 24 }}>Cargando…</div>}>
      <App />
    </Suspense>
  </ErrorBoundary>
);
