import { useState, useEffect } from 'react';
import { useBeadStore } from './store/useBeadStore';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import DesignsPage from './pages/DesignsPage';
import WarehousePage from './pages/WarehousePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { loadBeadsData, loadDesignsData } = useBeadStore();

  useEffect(() => {
    loadBeadsData();
    loadDesignsData();
  }, [loadBeadsData, loadDesignsData]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'tool':
        return <ToolPage onNavigate={handleNavigate} />;
      case 'designs':
        return <DesignsPage />;
      case 'warehouse':
        return <WarehousePage />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;