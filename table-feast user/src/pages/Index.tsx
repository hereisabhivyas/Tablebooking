import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useRestaurants } from '@/hooks/useApiData';

const Index = () => {
  const navigate = useNavigate();
  const { data: restaurants = [], isLoading, isError } = useRestaurants();

  const handleSelectRestaurant = (restaurantId: string, restaurantName: string) => {
    navigate(`/restaurant/${restaurantId}/menu`, {
      state: { restaurantId, restaurantName }
    });
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-orange-600 px-4 pb-12 pt-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 top-10 h-32 w-32 rounded-full bg-white" />
          <div className="absolute -right-8 top-20 h-48 w-48 rounded-full bg-white" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-white" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h2 className="mb-2 text-3xl font-bold text-white">
            Order to your table
          </h2>
          <p className="mb-6 text-white/80">
            Scan. Browse. Order. No waiting, no hassle.
          </p>
        </motion.div>
      </div>
      
      {/* Restaurants Section */}
      <div className="px-4">
        <div id="restaurants-section" className="-mt-4 rounded-t-2xl bg-background pt-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Nearby Restaurants</h3>
          </div>
          
          {isLoading && (
            <p key="loading" className="text-sm text-muted-foreground">Loading restaurants...</p>
          )}
          {isError && (
            <p key="error" className="text-sm text-destructive">Failed to load restaurants. Please try again.</p>
          )}
          {!isLoading && !isError && (
            <motion.div
              key="restaurants-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4"
            >
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <RestaurantCard
                    restaurant={restaurant}
                    onClick={() => handleSelectRestaurant(restaurant.id, restaurant.name)}
                  />
                </motion.div>
              ))}
              {restaurants.length === 0 && (
                <p className="text-sm text-muted-foreground">No restaurants available yet.</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Admin Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 px-4"
      >
        <button
          onClick={() => navigate('/admin')}
          className="w-full rounded-xl border border-border bg-card p-4 text-center transition-colors hover:bg-accent"
        >
          <span className="text-sm text-muted-foreground">Restaurant Owner? </span>
          <span className="font-semibold text-primary">Login to Dashboard →</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Index;
