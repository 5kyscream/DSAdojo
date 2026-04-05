import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'black', color: '#ff003c', fontFamily: 'monospace', fontSize: '2rem', textAlign: 'center', padding: '2rem' }}>
      <h1>SYSTEM OFFLINE</h1>
      <p style={{ fontSize: '1rem', marginTop: '1rem' }}>Maintenance in progress. Please check back later.</p>
    </div>
  </StrictMode>
);
