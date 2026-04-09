import { NavLink } from 'react-router-dom';
import { 
  User,  Users,  Clapperboard,
  Images,  Newspaper, Palette, TrendingUp, Calendar, CalendarDays,
  Users2
} from 'lucide-react';

// 選單資料結構
const menuItems = [
  { path: '/', label: '使用者', icon: User },
  { path: '/admins', label: '管理員', icon: Users2 },
  { path: '/news', label: '新聞', icon: Newspaper },
  { path: '/members', label: '成員介紹', icon: Users },
  { path: '/fashion', label: '氛圍時尚', icon: Palette },
  { path: '/events', label: '活動花絮', icon: Clapperboard },
  { path: '/ranking', label: '人氣排行', icon: TrendingUp },
  { path: '/calendar', label: '活動日曆', icon: Calendar },
  // { path: '/sales', label: '銷售管理', icon: DollarSign },
  // { path: '/products', label: '商品', icon: Package },
  // { path: '/points', label: '點數管理', icon: Gift },
  // { path: '/marketing', label: '行銷', icon: Megaphone },
  { path: '/schedule', label: '班表', icon: CalendarDays },
  { path: '/banners', label: '輪播 Banner', icon: Images },
];

interface SidebarProps {
  isCollapsed: boolean;
}
export default function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[240px]'} bg-white border-r border-gray-100 flex flex-col h-screen transition-all duration-300`}>
      <div className="h-[80px] flex items-center px-6 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
            Wing Star TSG
          </span>
        </div>
      </div>
      
      {/* Danh sách Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <div className="text-xs font-semibold text-gray-400 mb-4 px-2">Main Menu</div>
        
        <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
            const Icon = item.icon;
            return (
            <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ""}
                className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2.5 rounded-xl transition-colors duration-200 ${
                    isActive
                    ? 'bg-pink-50 text-[var(--color-primary)]' 
                    : 'text-gray-500 hover:bg-gray-50' 
                }`
                }
            >
                {({ isActive }) => (
                <div className="flex items-center gap-3">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {!isCollapsed && (
                    <span className={`text-[15px] whitespace-nowrap ${isActive ? 'font-medium' : 'font-normal'}`}>
                        {item.label}
                    </span>
                  )}
                </div>
                )}
            </NavLink>
          );
        })}
        </nav>
      </div>
    </aside>
  );
}