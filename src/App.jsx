import { RouterProvider } from "react-router-dom";
import { router } from "./routers/router";

export const App = () => {
  return <RouterProvider router={router} />
};
