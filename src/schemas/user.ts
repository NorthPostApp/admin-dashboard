interface SignInRequest {
  uid: string;
}

interface AdminUserData {
  email: string;
  displayName: string;
  lastLogin: number;
  imageUrl: string | null;
}

export { type AdminUserData, type SignInRequest };
