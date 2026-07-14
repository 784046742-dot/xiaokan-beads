import React from 'react';
import { Home, ScanLine, FileImage, Package } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'tool', label: '色号识别', icon: ScanLine },
  { id: 'designs', label: '我的图纸', icon: FileImage },
  { id: 'warehouse', label: '我的仓库', icon: Package },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 rounded-t-3xl z-50 px-4 py-2 shadow-[0_-4px_20px_rgba(165,228,224,0.2)]"
      style={{ borderColor: 'var(--secondary)' }}
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-[var(--secondary)]' : 'hover:bg-[var(--bg-base)]'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors duration-300 ${
                  isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-light)]'
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-[var(--text-main)]' : 'text-[var(--text-light)]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;