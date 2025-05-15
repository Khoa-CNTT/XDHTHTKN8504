import { Profile } from "./profile";
import {Package} from "./PackageService"
import { Service } from "./Service";

export type StepFormData = {
  profile: Profile | null;
  service: Service | null;
  packageService: Package| null;
  startTime?: string;
  startDate?: string;
  note?: string;
};
