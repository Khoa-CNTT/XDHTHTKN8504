export default interface User {
  id: string;
  name: string;
  email: string;
}

export default interface LoginResponse {
  user: User;
  token: string;
}
