import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  BarChart3, 
  Menu, 
  LogOut
} from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  const { setSidebarOpen } = useMainLayout();

  return (
    <Link
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-teal-700 text-white'
          : 'text-gray-300 hover:bg-teal-800 hover:text-white'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

// Criar um contexto para compartilhar o estado do menu
const MainLayoutContext = React.createContext<{
  setSidebarOpen: (open: boolean) => void;
}>({ setSidebarOpen: () => {} });

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Painel' },
    { to: '/companies', icon: <Building2 size={20} />, label: 'Empresas' },
    { to: '/members', icon: <Users size={20} />, label: 'Associados' },
    { to: '/referrals', icon: <Briefcase size={20} />, label: 'Indicações' },
    { to: '/areas', icon: <BarChart3 size={20} />, label: 'Áreas' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <MainLayoutContext.Provider value={{ setSidebarOpen }}>
      <div className="flex h-screen bg-gray-100">
        {/* Mobile menu button */}
        <button
          className={`fixed z-50 lg:hidden top-4 left-4 bg-teal-600 text-white p-2 rounded-md shadow-md transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 bg-teal-900 w-64 text-white transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-6 border-b border-teal-800">
              <h1 className="text-2xl font-bold text-white">RESI</h1>
            </div>

            <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>

            <div className="px-4 py-4 border-t border-teal-800">
              <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-teal-800 hover:text-white transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="py-4 px-6 lg:pl-6 pl-16">
              <h2 className="text-xl font-semibold text-gray-800">
                {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </MainLayoutContext.Provider>
  );
};

// Hook para usar o contexto
export const useMainLayout = () => {
  const context = React.useContext(MainLayoutContext);
  if (!context) {
    throw new Error('useMainLayout must be used within a MainLayoutProvider');
  }
  return context;
};

export default MainLayout;