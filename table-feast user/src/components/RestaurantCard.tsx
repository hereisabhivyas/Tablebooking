import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const image = restaurant.image;
  const rating = restaurant.rating ?? '-';
  const isOpen = restaurant.isOpen ?? true;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="food-card cursor-pointer overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary to-muted">
        {image ? (
          <img
            src={image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rating badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-success px-2 py-1">
          <span className="text-sm font-bold text-success-foreground">{rating}</span>
          <Star className="h-3 w-3 fill-success-foreground text-success-foreground" />
        </div>
        
        {/* Status badge */}
        <div className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-medium ${
          isOpen 
            ? 'bg-success/90 text-success-foreground' 
            : 'bg-destructive/90 text-destructive-foreground'
        }`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="mb-1 text-lg font-bold text-card-foreground">{restaurant.name}</h3>
        <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{restaurant.description || 'No description available.'}</p>
        {restaurant.cuisine?.length ? (
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisine.slice(0, 3).map(c => (
              <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {c}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
