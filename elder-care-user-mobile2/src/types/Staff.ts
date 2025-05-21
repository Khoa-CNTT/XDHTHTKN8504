export interface Staff {
    _id: string;
    userId: {
      _id: string;
      phone: string;
      password: string;
      role: "doctor";
      avatar: string;
      profiles: any[]; // Có thể khai báo kỹ hơn nếu biết cấu trúc của profiles
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    firstName: string;
    lastName: string;
    email: string;
    specialization: string;
    licenseNumber: string;
    experience: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
