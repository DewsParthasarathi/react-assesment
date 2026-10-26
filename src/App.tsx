import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { router } from "./routes/Router";
import { queryClient } from "./lib/queryClient";

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
