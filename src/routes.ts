import { createBrowserRouter } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/pages/home/Home";
import {
  ViewAddresses,
  AddressRequests,
  CreateAddresses,
  AddressOverview,
} from "@/pages/addresses";

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
