import { io, Socket } from 'socket.io-client';

function getBackendUrl() {
  if (import.meta.env.VITE_BACKEND_URL) {
    // Allows explicit override via .env
    return import.meta.env.VITE_BACKEND_URL;
  }
  if (typeof window !== 'undefined') {
    // Standardizes local networking. We use localhost rather than dynamic hostnames
    // to prevent mobile debugging from targeting unroutable Vite host IPs on dev servers.
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    } else {
      // If deployed on Vercel but connecting to a standalone backend, 
      // replace this branch or set VITE_BACKEND_URL. 
      // Default to same origin on port 4000 for LAN testing.
      return `${window.location.protocol}//${window.location.hostname}:4000`;
    }
  }
  return 'http://localhost:4000';
}

export const BACKEND_URL = getBackendUrl();
export const socket: Socket = io(BACKEND_URL);
