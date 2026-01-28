import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Store,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRestaurant, toggleRestaurantOpen } = useRestaurant();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col z-50"
    >
      {/* Logo & Restaurant Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
            {(currentRestaurant.image || currentRestaurant.logo)?.startsWith('http') ? (
              <img 
                src={currentRestaurant.image || currentRestaurant.logo} 
                alt={currentRestaurant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              currentRestaurant.logo || '🍽️'
            )}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-foreground truncate">
                  {currentRestaurant.name}
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  Admin Dashboard
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Open/Closed Toggle */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {currentRestaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <Switch
                  checked={currentRestaurant.isOpen}
                  onCheckedChange={toggleRestaurantOpen}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-sidebar-accent',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn('font-medium', isActive ? 'text-primary-foreground' : 'text-foreground')}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Collapse</span>
            </>
          )}
        </button>
        
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
