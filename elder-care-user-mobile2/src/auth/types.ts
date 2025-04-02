export type LoginFormData = {
  phone: string;
  password: string;
};

export type RegisterFormData = {
  phone: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormData = {
  phone: string;
};

export type OTPVerificationData = {
  otp: string[];
}; 