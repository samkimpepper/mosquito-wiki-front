import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SwatchDetailPage } from "./pages/SwatchDetailPage";
import { LoginPage } from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/swatch-detail",
    Component: SwatchDetailPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);
