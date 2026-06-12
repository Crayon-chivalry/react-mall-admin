import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStateInterface {
  token: string | null;
  user: UserDataInterface | null;
  isLoggedIn: boolean;
  signIn: (token: string, user: UserDataInterface) => void;
  signOut: () => void;
  updateUser: (userData: UserDataInterface) => void;
}

interface UserDataInterface {
  userId: string;
  phone: string | number;
  id: number;
  nickname: string;
  role: string;
}

const useUserStore = create<UserStateInterface>()(
  // 持久化
  persist((set) => ({
    token: null,
    user: null,
    isLoggedIn: false,
    // 保持登录信息
    signIn: (token: string, user: UserDataInterface) =>
      set({ token, user, isLoggedIn: true }),
    // 清除登录信息
    signOut: () => set({ token: null, user: null, isLoggedIn: false }),
    // 更新用户信息
    updateUser: (userData: UserDataInterface) =>
      set((state: UserStateInterface) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
  }),
  {
    name: 'user-storage'
  }
)
);

export default useUserStore;
