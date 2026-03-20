import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SwatchDetailPage } from "./pages/SwatchDetailPage";
import { BrandDetailPage } from "./pages/BrandDetailPage";
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
        path: "brand/:slug",
        Component: BrandDetailPage,
      },
      {
        path: "product/:slug",
        Component: ProductDetailPage,
      },
      {
        path: "swatch/:id",
        Component: SwatchDetailPage,
      }
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);