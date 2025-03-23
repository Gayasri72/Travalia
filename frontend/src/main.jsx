import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store, persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './components/ThemeProvider.jsx';
import './index.css';
import App from './App.jsx';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
      
       <ThemeProvider>
        <App />
       </ThemeProvider>
      </Provider>
    </PersistGate>
    ,
  </QueryClientProvider>,
);
