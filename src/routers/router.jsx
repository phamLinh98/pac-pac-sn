import { createBrowserRouter } from "react-router-dom";
import { LayoutComponent } from "../MainComponent/LayoutComponent";
import { MainShowStatusAndStory } from "../MainComponent/MainShowStatusAndStory";
import { FriendOrMyProfileComponent } from "../MainComponent/FriendOrMyProfileComponent";

// Define your routes
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LayoutComponent />,
      children: [
        {
          index: true, // để hiển thị mặc định
          element: <MainShowStatusAndStory />,
        },
        {
          path: "/home",
          element: <MainShowStatusAndStory />,
        },
        {
          path: "/profile/:id",
          element: <FriendOrMyProfileComponent />
        }
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Enables relative paths in nested routes
      v7_fetcherPersist: true,   // Retains fetcher state during navigation
      v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
      v7_partialHydration: true, // Supports partial hydration for server-side rendering
      v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
    },
  }
);
