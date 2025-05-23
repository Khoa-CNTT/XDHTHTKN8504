export default interface User {
    _id: string;
    avatarUrl?: string;
    name: string;
    phone: string;
    
 }
  
  export default interface LoginResponse {
    user: User;
    token: string;
    
  }
  