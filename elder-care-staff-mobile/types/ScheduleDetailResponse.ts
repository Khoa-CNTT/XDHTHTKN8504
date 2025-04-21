// src/types/ApiResponse.ts
import { PatientProfile } from "./PatientProfile";

export interface ScheduleResponse {
  message: string;
  patientProfile: PatientProfile;
}
