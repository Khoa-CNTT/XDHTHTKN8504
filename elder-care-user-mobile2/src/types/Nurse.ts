export interface Nurse {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
  rating?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  isAvailable: boolean;
}
