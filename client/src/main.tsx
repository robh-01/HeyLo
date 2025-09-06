import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";
import SignupForm from "@/components/app/SignupForm.tsx";
import LoginForm from "@/components/app/LoginForm.tsx";
import GlobalMessageContainer from "@/components/app/GlobalMessageContainer.tsx";
import DirectMessagePage from "@/components/app/DirectMessagePage.tsx";
import SearchPage from "@/components/app/SearchPage.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <GlobalMessageContainer /> },
      { path: "direct", element: <DirectMessagePage /> },
      { path: "group", element: <DirectMessagePage /> },
      { path: "/search", element: <SearchPage /> },
    ],
  },
  { path: "/login", element: <LoginForm /> },
  { path: "/signup", element: <SignupForm /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
