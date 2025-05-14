import { create } from "zustand";
import { Package } from "../types/PackageService";
import { getAllPackages } from "../api/serviceApi"; // API frontend bạn đã viết
import { log } from "../utils/logger";

interface PackageState {
  isLoading: boolean;
  packages: Package[];

  fetchPackages: () => Promise<void>;
  getPackageByServiceId: (serviceId: string) => Package[];
}

export const usePackageStore = create<PackageState>((set, get) => ({
  isLoading: false,
  packages: [],

  fetchPackages: async () => {
    set({ isLoading: true });
    try {
      const data = await getAllPackages();
      set({ packages: data });
    } catch (error) {
      log("Failed to fetch packages:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getPackageByServiceId: (serviceId: string) => {
    const { packages } = get();
    return packages.filter((pkg) => pkg.serviceId === serviceId);
  },
}));
