import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

export function FloatingCart() {
  const { totalItems, totalAmount, session } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0 || !session) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/cart')}
          className="btn-warm flex w-full items-center justify-between rounded-xl px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-card text-[10px] font-bold text-primary">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs opacity-80">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
              <p className="text-sm font-bold">₹{totalAmount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 font-semibold">
            <span>View Cart</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
