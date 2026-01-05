import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import RootLayout from "./layouts/RootLayout";

// lazy imports for chunk size reduction
// home
const Home = lazy(() => import("@/pages/home/Home"));
// login
const Login = lazy(() => import("@/pages/auth/Login"));
// address
const ViewAddresses = lazy(() => import("@/pages/addresses/ViewAddresses"));
const AddressRequests = lazy(() => import("@/pages/addresses/AddressRequests"));
const CreateAddresses = lazy(() => import("@/pages/addresses/CreateAddresses"));
const AddressOverview = lazy(() => import("@/pages/addresses/Overview"));

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/",
        Component: AppLayout,
        children: [
          { index: true, Component: Home },
          {
            path: "addresses",
            children: [
              { index: true, Component: AddressOverview },
              { path: "view", Component: ViewAddresses },
              { path: "requests", Component: AddressRequests },
              { path: "create", Component: CreateAddresses },
              { path: "overview", Component: AddressOverview },
            ],
          },
        ],
      },
    ],
  },
]);
