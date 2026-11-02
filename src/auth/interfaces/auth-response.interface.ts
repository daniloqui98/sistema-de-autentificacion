export interface AuthResponse {
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
  token: string;
}