import { RouterProvider } from "react-router-dom";
import { router } from "./routers/router";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";

export const App = () => {
  return (
    <AppSettingsProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AppSettingsProvider>
  );
};
