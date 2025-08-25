import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import About from '../pages/About.jsx';
import Home from '../pages/Home.jsx';
import NotFound from '../pages/NotFound.jsx';
import OwnersPage from '../pages/OwnersPage.jsx';
import PropertiesPage from '../pages/PropertiesPage.jsx';
import PropertyTracesPage from '../pages/PropertyTracesPage.jsx';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/owners', element: <OwnersPage /> },
  { path: '/properties', element: <PropertiesPage /> },
  { path: '/property-traces', element: <PropertyTracesPage /> }, // ⬅️ nueva
  { path: '*', element: <NotFound /> }
]);
