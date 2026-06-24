import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../styles.css';

const { pathname, search } = window.location;
if (pathname === '/auth/setup' || pathname === '/auth/setup/') {
  window.location.replace('/api/auth/setup');
} else if (pathname === '/auth/callback' || pathname === '/auth/callback/') {
  window.location.replace(`/api/auth/callback${search}`);
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}