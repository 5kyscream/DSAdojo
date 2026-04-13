import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import GlobalShell from './components/GlobalShell';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Arena from './components/Arena';
import Workspace from './components/Workspace';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobalShell />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="arena" element={<Arena />} />
          <Route path="workspace" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
