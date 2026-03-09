import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SwatchDetailPage } from "./pages/SwatchDetailPage";
import { LoginPage } from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "swatch-detail",
        Component: SwatchDetailPage,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);