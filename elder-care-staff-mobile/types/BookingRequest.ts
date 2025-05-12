import { Control } from "react-hook-form";

export interface BookingFormData {
  name: string;
  phone: string;
  service: string;
  paymentMethod: string;
}

export interface StepProps {
  control: Control<BookingFormData>;
  getValues?: () => BookingFormData;
}
