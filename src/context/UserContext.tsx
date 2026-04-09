import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserFormData } from '../components/pages/user-page/AddUserModal';

// Định nghĩa kiểu dữ liệu User
export type UserType = UserFormData & { id: number, articles: number, points: number };

interface UserContextType {
  usersList: UserType[];
  updatePoints: (id: number, amount: number) => void;
  setUsersList: React.Dispatch<React.SetStateAction<UserType[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Dữ liệu ban đầu (Move từ UsersPage sang đây)
const initialData: UserType[] = [
  { id: 1, username: 'Jinxiaoshi', phone: '0970000002', displayName: '金小士', email: 'jinxiaoshi01@gmail.com', articles: 0, points: 100, role: ['管理員'] },
  { id: 2, username: 'Ruandaren', phone: '0970000003', displayName: '阮大仁', email: 'ruandaren01@gmail.com', articles: 1, points: 0, role: ['網站管理員', '客戶', '管理員'] },
  { id: 3, username: 'Xiaoling', phone: '0970000001', displayName: '小玲', email: 'xiaoling01@gmail.com', articles: 0, points: 20, role: ['客戶'] },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [usersList, setUsersList] = useState<UserType[]>(initialData);

  // Hàm dùng chung để cộng/trừ điểm
  const updatePoints = (id: number, amount: number) => {
    setUsersList(prev => prev.map(u => 
      u.id === id ? { ...u, points: Math.max(0, u.points + amount) } : u
    ));
  };

  return (
    <UserContext.Provider value={{ usersList, updatePoints, setUsersList }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook để các trang con gọi dữ liệu nhanh
// Thêm dòng comment này vào để tắt cảnh báo của ESLint cho riêng hàm dưới đây:
// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers must be used within UserProvider');
  return context;
};