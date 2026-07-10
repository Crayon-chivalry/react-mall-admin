import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/api/types";

interface MenuStateInterface {
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;
  clearMenus: () => void;
}

const useMenuStore = create<MenuStateInterface>()(
  // 持久化
  persist(
    (set) => ({
      menus: [],
      setMenus: (menus: MenuItem[]) => set({ menus }),
      clearMenus: () => set({ menus: [] }),
    }),
    {
      name: "menu-storage",
    },
  ),
);

export default useMenuStore;