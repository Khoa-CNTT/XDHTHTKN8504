import { Doctor } from "./Doctor";
import { Nurse } from "./Nurse";
export interface User {
  _id: string;
  avatar?: string;
  name: string;
  phone: string;
  role: "family_member" | "nurse" | "doctor" | "admin";
}
export type ExtraInfo = Doctor | Nurse | null;
