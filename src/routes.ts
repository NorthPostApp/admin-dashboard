import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import AppLayout from "@/layouts/AppLayout";

// lazy imports for chunk size reduction
// home
const Home = lazy(() => import("@/pages/home/Home"));
// address
const ViewAddresses = lazy(() => import("@/pages/addresses/ViewAddresses"));
const AddressRequests = lazy(() => import("@/pages/addresses/AddressRequests"));
const CreateAddresses = lazy(() => import("@/pages/addresses/CreateAddresses"));
const AddressOverview = lazy(() => import("@/pages/addresses/Overview"));

export const router = createBrowserRouter([
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
]);
