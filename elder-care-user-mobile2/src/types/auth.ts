export default interface User {
    id: string;
    avatarUrl?: string;
    name: string;
    phone: string;
  }
  
  export default interface LoginResponse {
    user: User;
    token: string;
  }
  