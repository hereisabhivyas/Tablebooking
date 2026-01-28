import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { QrCode, Table2, Search, ShoppingCart, Utensils, X, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Check for recent order
  useEffect(() => {
    const orderId = localStorage.getItem('dineease_last_order_id');
    setLastOrderId(orderId);
  }, [location.pathname]);

  const handleScanQR = () => {
    toast.info('QR Scanner', {
      description: 'Camera access required. Please allow camera permissions.',
    });
    // TODO: Implement QR code scanner functionality
  };

  const handleSelectTable = () => {
    // Get current restaurantId from URL params if on a menu page
    const pathParts = location.pathname.split('/');
    const restaurantId = pathParts[2]; // /restaurant/:restaurantId/...

    if (restaurantId && restaurantId !== '') {
      // If on a menu page, get the restaurant name from the page (we'll need to extract it from session or URL)
      navigate('/tables', { 
        state: { 
          restaurantId,
          restaurantName: 'Restaurant', // Will be populated dynamically
          returnPath: location.pathname
        } 
      });
    } else {
      navigate('/tables', {
        state: {
          returnPath: location.pathname
        }
      });
    }
  };

  const handleCartClick = () => {
    if (totalItems > 0) {
      navigate('/cart');
    } else {
      toast.info('Cart is empty', {
        description: 'Add some items to your cart first',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success('Search', {
        description: `Searching for "${searchQuery}"`,
      });
      // TODO: Implement search functionality
    }
  };

  // Don't show navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Utensils className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">DineIn</span>
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Track Order - only show if there's a recent order */}
            {lastOrderId && !location.pathname.includes('/order/') && (
              <button
                onClick={() => navigate(`/order/${lastOrderId}`)}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-primary px-3 text-white transition-all hover:bg-primary/90 active:scale-95"
                title="Track your order"
              >
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">Track</span>
              </button>
            )}

            {/* QR Scanner */}
            <button
              onClick={handleScanQR}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-all hover:bg-accent active:scale-95"
              title="Scan QR Code"
            >
              <QrCode className="h-5 w-5 text-foreground" />
            </button>

            {/* Select Table */}
            <button
              onClick={handleSelectTable}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-all hover:bg-accent active:scale-95"
              title="Select Table"
            >
              <Table2 className="h-5 w-5 text-foreground" />
            </button>

            {/* Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-all hover:bg-accent active:scale-95"
              title="Search"
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-secondary transition-all hover:bg-accent active:scale-95"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-2 p-4">
                <Input
                  type="text"
                  placeholder="Search restaurants, dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-accent"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
