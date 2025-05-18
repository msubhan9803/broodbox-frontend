import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import App from "./App";
import "./index.css";
import "preline/preline";
import "intro.js/introjs.css";
import "leaflet/dist/leaflet.css";
import { LOGIN_PAGE_REDIRECT_TYPES } from 'utils/constants'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Do not retry by default
      onError: (error) => {
        // Global error handler for all queries
        if (error.response?.status === 447) {
          // Status Code 447 = Custom error code for deactivated/deleted account
          // persistor.flush();
          // queryClient.clear();
          localStorage.clear();
          window.location.href = `/auth/signin?redirectType=${LOGIN_PAGE_REDIRECT_TYPES.accountNoLongerExists}`;
        }
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);
