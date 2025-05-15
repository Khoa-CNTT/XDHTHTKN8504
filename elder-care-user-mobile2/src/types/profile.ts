export type HealthCondition = {
  name: string;
  description: string;
};

export type HealthInfo = {
  condition: HealthCondition[];
  height?: number;
  weight?: number;
  typeBlood: string;
  notes?: string;
};

export type Profile = {
  avartar?: string;
  _id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string
  sex: "male" | "female" | "other";
  relationship: string;
  address?: string;
  phone?: string;
  healthInfo?: HealthInfo[];
  createdAt?: string;
  updatedAt?: string;
};
