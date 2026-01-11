import type { AdminUserData } from "@/schemas/user";

type ServiceError = { error: string };
type SignInAdminUserResponse = { data: AdminUserData };

const BASE_URL = import.meta.env.VITE_ADMIN_ENDPOINT;

async function signInAdminUser(idToken: string, uid: string) {
  if (idToken.length === 0 || uid.length === 0) {
    throw new Error("Invalid id token or uid");
  }
  const response = await fetch(BASE_URL + "/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ uid: uid }),
  });
  if (!response.ok) {
    const errorData = (await response.json()) as ServiceError;
    const errorMessage = errorData.error || `Error signing in user: ${response.status}`;
    throw new Error(errorMessage);
  }
  return (await response.json()) as SignInAdminUserResponse;
}

export { signInAdminUser };
