export interface Doctor {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  isAvailable: boolean;
}
