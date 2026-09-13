import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#111214',
            color: '#e5e5e5',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            borderRadius: '4px',
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
