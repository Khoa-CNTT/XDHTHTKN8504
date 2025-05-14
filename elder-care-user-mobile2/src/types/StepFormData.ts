import { Profile } from "./profile";

export type StepFormData = {
  profile: Profile | null;
  serviceId: string;
  startTime?: string;
  endTime?: string;
  repeatFrom?: string;
  repeatTo?: string;
  note?: string;
};
