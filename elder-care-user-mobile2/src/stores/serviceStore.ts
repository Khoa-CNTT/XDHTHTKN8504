import { create } from "zustand";
import { Service } from "../types/Service";
import getServices from "../api/serviceApi";

type ServicesStore = {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
  getServicesByRole: (role: string) => Service[];
};

export const useServicesStore = create<ServicesStore>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getServices();
      
      set({ services: data });
    } catch (err) {
      console.error("Error fetching services:", err);
      set({ error: "Không thể tải danh sách dịch vụ." });
    } finally {
      set({ isLoading: false });
    }
  },

  getServiceById: (id: string) => {
    const services = get().services;
    return services.find((service) => service._id === id);
  },

  getServicesByRole: (role: string) => {
    const services = get().services;
    return services.filter((service) => service.role === role);
  },
}));
