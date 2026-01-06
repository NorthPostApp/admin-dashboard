import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function ProtectedRoute() {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!user && location.pathname !== "/login") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
