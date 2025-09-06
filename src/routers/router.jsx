import { createBrowserRouter } from "react-router-dom";
import { LayoutComponent } from "../MainComponent/LayoutComponent";
import { MainShowStatusAndStory } from "../MainComponent/MainShowStatusAndStory";
import { FriendOrMyProfileComponent } from "../MainComponent/FriendOrMyProfileComponent";
import { LoginComponent } from "../MainComponent/LoginComponent";
import AuthGuard from "../MainComponent/ProtectedRouteComponent";
import { CreateNewAccountComponent } from "../MainComponent/CreateNewAccountComponent";

// Define your routes
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AuthGuard> <LayoutComponent /> </AuthGuard>,
      children: [
        {
          index: true,
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
    {
      path: "/login",
      element: <LoginComponent />
    },
    {
      path:"/register",
      element:<CreateNewAccountComponent />
    }
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);