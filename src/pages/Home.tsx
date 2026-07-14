import React, { useState } from 'react';
import { useBeadStore } from '../store/useBeadStore';
import { LogIn, LogOut, Sparkles, Gift, Crown } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user, login, logout, beads } = useBeadStore();
  const [loginName, setLoginName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const totalBeads = beads.reduce((sum, bead) => sum + bead.quantity, 0);
  const totalColors = beads.length;

  const quickActions = [
    {
      id: 'text',
      title: '文字清单识色号',
      description: '粘贴图纸文字清单，自动提取色号',
      icon: '📝',
      action: () => onNavigate('tool'),
    },
    {
      id: 'image',
      title: '图纸图片识别',
      description: '上传像素图纸，自动识别全部色号',
      icon: '🖼️',
      action: () => onNavigate('tool'),
    },
    {
      id: 'warehouse',
      title: '我的拼豆仓库',
      description: '管理个人库存，查看现有色号',
      icon: '📦',
      action: () => onNavigate('warehouse'),
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 fade-in-up">
          <div className="text-6xl mb-4 animate-float">🐱</div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
            Hello！小看拼豆仓
          </h1>
          <p className="text-light">轻松管理你的拼豆库存</p>
        </div>

        {!user.isLoggedIn ? (
          <div
            className="card mb-8 fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                <LogIn className="w-6 h-6" style={{ color: 'var(--text-main)' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-main)' }}>
                  登录解锁更多功能
                </h3>
                <p className="text-sm text-light">
                  图纸云存档、囤货容量扩容、无广告识别
                </p>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn-primary text-sm px-4 py-2"
              >
                登录
              </button>
            </div>
          </div>
        ) : (
          <div
            className="card mb-8 fade-in-up flex items-center justify-between"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
                <Crown className="w-6 h-6" style={{ color: '#FFD700' }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-main)' }}>
                  Hi, {user.username}
                </h3>
                <p className="text-sm text-light">已解锁全部功能</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn-outline text-sm px-4 py-2"
            >
              退出
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className="card text-center fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary)' }}>
              {totalColors}
            </div>
            <div className="text-sm text-light">种颜色</div>
          </div>
          <div
            className="card text-center fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--secondary)' }}>
              {totalBeads}
            </div>
            <div className="text-sm text-light">颗豆子</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
          <Sparkles className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          快捷功能
        </h2>

        <div className="space-y-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.action}
              className="card w-full text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 fade-in-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{action.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text-main)' }}>
                    {action.title}
                  </h3>
                  <p className="text-sm text-light">{action.description}</p>
                </div>
                <div className="text-2xl">→</div>
              </div>
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
          <Gift className="w-5 h-5" style={{ color: '#FFB6C1' }} />
          会员专区
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            { title: '图纸云存档', icon: '☁️', color: 'var(--primary)' },
            { title: '囤货容量扩容', icon: '📦', color: 'var(--secondary)' },
            { title: '无广告识别', icon: '✨', color: '#FFB6C1' },
          ].map((item, index) => (
            <div
              key={index}
              className="card text-center p-4 fade-in-up"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs font-medium" style={{ color: item.color }}>
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {showLoginModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <div
              className="card w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: 'var(--text-main)' }}>
                登录小看拼豆仓
              </h3>
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                placeholder="输入你的昵称"
                className="input-field mb-4"
              />
              <button
                onClick={() => {
                  if (loginName.trim()) {
                    login(loginName.trim());
                    setShowLoginModal(false);
                  }
                }}
                className="btn-primary w-full"
              >
                登录
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;