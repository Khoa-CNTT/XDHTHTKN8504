
import { User, ExtraInfo } from "./User";

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  extraInfo: ExtraInfo; 
}