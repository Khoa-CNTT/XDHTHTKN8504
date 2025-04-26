export default interface User {
  id: string;
  avatarUrl?: string;
  name: string;
  phone: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}
