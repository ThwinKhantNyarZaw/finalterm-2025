import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { seedData, resetData } from './lib/seed';

// Initialize sample data on first load
seedData();

// Expose resetData globally for easy debugging
(window as any).resetData = resetData;

console.log('💡 Tip: If login fails, run window.resetData() in console and refresh');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);