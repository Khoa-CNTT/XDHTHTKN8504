// src/types/PatientProfile.ts
import { HealthCondition } from "./HealthCondition";
import { EmergencyContact } from "./EmergencyContact";

export interface PatientProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  address: string;
  healthConditions: HealthCondition[];
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
