import { motion } from 'framer-motion';
import { Plus, Minus, Flame, Clock, Leaf } from 'lucide-react';
import { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="food-card flex gap-3 p-3"
    >
      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Veg/Non-veg indicator & badges */}
        <div className="mb-1 flex items-center gap-2">
          <div className={cn(
            "flex h-4 w-4 items-center justify-center rounded-sm border-2",
            item.isVeg ? "border-success" : "border-destructive"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full",
              item.isVeg ? "bg-success" : "bg-destructive"
            )} />
          </div>
          
          {item.isBestseller && (
            <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold text-warning">
              ★ BESTSELLER
            </span>
          )}
        </div>
        
        {/* Name */}
        <h3 className="font-semibold text-card-foreground">{item.name}</h3>
        
        {/* Price */}
        <p className="mt-1 text-base font-bold text-foreground">₹{item.price}</p>
        
        {/* Description */}
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        
        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {item.spiceLevel && (
            <span className="flex items-center gap-0.5">
              <Flame className={cn(
                "h-3 w-3",
                item.spiceLevel === 'hot' && "text-destructive",
                item.spiceLevel === 'medium' && "text-warning",
                item.spiceLevel === 'mild' && "text-muted-foreground"
              )} />
              {item.spiceLevel}
            </span>
          )}
          {item.preparationTime && (
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {item.preparationTime} min
            </span>
          )}
          {item.isVeg && (
            <span className="flex items-center gap-0.5 text-success">
              <Leaf className="h-3 w-3" />
              Veg
            </span>
          )}
        </div>
      </div>
      
      {/* Image & Add button */}
      <div className="relative flex flex-col items-center">
        <div className="h-24 w-24 overflow-hidden rounded-lg">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        
        {/* Add/Quantity controls */}
        <div className="absolute -bottom-3">
          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className={cn(
                "rounded-lg border-2 border-primary bg-card px-5 py-1.5 text-sm font-bold text-primary shadow-soft transition-all",
                "hover:bg-primary hover:text-primary-foreground",
                !item.isAvailable && "cursor-not-allowed border-muted text-muted-foreground opacity-50"
              )}
            >
              {item.isAvailable ? 'ADD' : 'N/A'}
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 rounded-lg bg-primary px-1 py-1 shadow-soft"
            >
              <button
                onClick={handleDecrement}
                className="flex h-6 w-6 items-center justify-center rounded text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[1.5rem] text-center font-bold text-primary-foreground">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="flex h-6 w-6 items-center justify-center rounded text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
