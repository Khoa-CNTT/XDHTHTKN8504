export default interface User {
  id: string;
  name: string;
  phone: string;
}

export default interface LoginResponse {
  user: User;
  token: string;
}
