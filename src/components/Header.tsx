import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Mail, Inbox, ChevronDown, LogOut, User } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('wingstars_token');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/banners')) return '輪播 Banner';
    if (path.includes('/members')) return '成員介紹';
    if (path.includes('/events')) return '活動花絮';
    
    return '使用者'; 
  };

  return (
    <header className="h-[80px] flex items-center justify-between px-8 bg-[#FDFBFC]">
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-[22px] font-bold text-gray-800 tracking-wide">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-8">
        
        <div className="flex items-center gap-5">
          <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1.5 bg-[#1890FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#FDFBFC]">23</span>
          </button>
          <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Mail size={22} />
            <span className="absolute -top-1 -right-1.5 bg-[#52C41A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#FDFBFC]">68</span>
          </button>
          <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Inbox size={22} />
            <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#FDFBFC]">14</span>
          </button>
        </div>

        <div className="w-[1px] h-8 bg-gray-200"></div>

        <div className="relative">
          
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-extrabold text-gray-800">Designluch</p>
              <p className="text-[11px] font-medium text-gray-400 mt-0.5">Super Admin</p>
            </div>
            
            <div className="w-10 h-10 bg-[#E8E1D9] rounded-xl flex items-center justify-center text-gray-700 font-bold text-lg shadow-sm">
              ._.
            </div>

            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors">
                <User size={16} />
                <span>個人檔案</span>
              </button>
              
              <div className="h-[1px] bg-gray-100 my-1"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="font-medium">登出</span>
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}