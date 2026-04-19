import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { queryClient } from "@/lib/queryClient";
import { typesenseInfoLoader } from "@/hooks/loaders/typesenseInfoLoader";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";

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
// music
const MusicList = lazy(() => import("@/pages/musics/MusicList"));

export const router = createBrowserRouter([
  {
    Component: ProtectedRoute,
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
              {
                index: true,
                Component: AddressOverview,
                loader: typesenseInfoLoader(queryClient),
                HydrateFallback: Spinner,
              },

              {
                path: "overview",
                Component: AddressOverview,
                loader: typesenseInfoLoader(queryClient),
                HydrateFallback: Spinner,
              },
              { path: "view", Component: ViewAddresses },
              { path: "requests", Component: AddressRequests },
              { path: "create", Component: CreateAddresses },
            ],
          },
          {
            path: "musics",
            children: [
              { index: true, Component: MusicList },
              { path: "list", Component: MusicList },
            ],
          },
        ],
      },
    ],
  },
]);
