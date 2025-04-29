
import { User, ExtraInfo } from "./User";

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  extraInfo: ExtraInfo; // Có thể null nếu là family_member
}