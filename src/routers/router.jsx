import { createBrowserRouter } from "react-router-dom";
import { LayoutComponent } from "../MainComponent/LayoutComponent";

export const router = createBrowserRouter([
    {
        path: "/home",
        element: <LayoutComponent/>
    },
]);