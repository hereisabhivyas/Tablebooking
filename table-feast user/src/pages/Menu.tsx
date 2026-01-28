import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Leaf } from 'lucide-react';
import { CategoryTabs } from '@/components/CategoryTabs';
import { MenuItemCard } from '@/components/MenuItemCard';
import { FloatingCart } from '@/components/FloatingCart';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useCategories, useMenuItems, useRestaurant } from '@/hooks/useApiData';

export default function Menu() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [vegOnly, setVegOnly] = useState(false);

  const restaurantState = location.state as { restaurantId: string; restaurantName: string } | null;

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(restaurantId);
  const { data: allMenuItems = [], isLoading: itemsLoading } = useMenuItems(restaurantId);

  // Set initial category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Filter menu items
  const filteredItems = useMemo(() => {
    let items = allMenuItems;

    if (activeCategory) {
      items = items.filter(item => item.categoryId === activeCategory);
    }

    if (vegOnly) {
      items = items.filter(item => item.isVeg);
    }

    return items;
  }, [allMenuItems, activeCategory, vegOnly]);

  const handleCallWaiter = () => {
    toast.success('Waiter has been notified!', {
      description: 'Someone will be with you shortly.',
    });
  };

  const handleSelectTable = () => {
    navigate('/tables', { 
      state: { 
        restaurantId: restaurantState?.restaurantId || restaurantId,
        restaurantName: restaurantState?.restaurantName || restaurant?.name || 'Restaurant',
        returnPath: location.pathname
      } 
    });
  };

  // If no session, show prompt to select table
  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="rounded-lg bg-card p-8 shadow-md max-w-sm w-full">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Select Your Table</h2>
          <p className="mb-6 text-muted-foreground">
            Please select your table to continue ordering from {restaurantState?.restaurantName || restaurant?.name || 'this restaurant'}.
          </p>
          <Button
            onClick={handleSelectTable}
            className="btn-warm w-full py-6 text-base font-semibold mb-3"
          >
            Choose Your Table
          </Button>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-lg border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-bold text-foreground">{restaurant?.name || session.restaurantName}</h1>
              <p className="text-xs text-primary font-medium">Table {session.tableNumber}</p>
            </div>
          </div>

          <button
            onClick={handleCallWaiter}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
          >
            <Bell className="h-5 w-5 text-primary" />
          </button>
        </div>

        {/* Veg filter */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-foreground">Veg Only</span>
          </div>
          <Switch
            checked={vegOnly}
            onCheckedChange={setVegOnly}
          />
        </div>

        {/* Category tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Menu items */}
      <div className="px-4 py-4">
        {(restaurantLoading || categoriesLoading || itemsLoading) && (
          <p className="text-sm text-muted-foreground">Loading menu...</p>
        )}
        {!itemsLoading && filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">No items found</p>
            {vegOnly && (
              <button
                onClick={() => setVegOnly(false)}
                className="mt-2 text-sm text-primary underline"
              >
                Show non-veg items
              </button>
            )}
          </div>
        ) : null}
        {!itemsLoading && filteredItems.length > 0 && (
          <div className="grid gap-4">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart */}
      <FloatingCart />
    </div>
  );
}
