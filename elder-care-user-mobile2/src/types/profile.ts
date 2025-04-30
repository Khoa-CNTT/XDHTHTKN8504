export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface HealthCondition {
  condition: string;
  notes: string;
}

export interface Profile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  address: string;
  emergencyContact: EmergencyContact;
  healthConditions: HealthCondition[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
