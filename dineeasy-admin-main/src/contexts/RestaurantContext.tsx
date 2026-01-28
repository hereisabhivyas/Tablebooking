import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  Restaurant, 
  Category, 
  MenuItem, 
  Order, 
  restaurants as initialRestaurants,
  categories as initialCategories,
  menuItems as initialMenuItems,
  orders as initialOrders 
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api-client';
import { toast } from 'sonner';

interface RestaurantContextType {
  currentRestaurant: Restaurant;
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  restaurants: Restaurant[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  loading: boolean;
  error: string | null;
  toggleRestaurantOpen: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateRestaurantInfo: (updates: Partial<Restaurant>) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  fetchCategories: (restaurantId: string) => Promise<void>;
  fetchMenuItems: (restaurantId: string) => Promise<void>;
  fetchOrders: (restaurantId: string) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const { restaurant: authRestaurant, updateRestaurant: updateAuthRestaurant } = useAuth();
  
  const [restaurants] = useState<Restaurant[]>(initialRestaurants);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant>(
    authRestaurant || initialRestaurants[0]
  );
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousOrderCount, setPreviousOrderCount] = useState<number>(0);

  // Update currentRestaurant when auth changes
  useEffect(() => {
    if (authRestaurant) {
      setCurrentRestaurant(authRestaurant);
    }
  }, [authRestaurant]);

  // Fetch categories from API
  const fetchCategories = async (restaurantId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.categoriesAPI.list(restaurantId);
      setCategories(Array.isArray(data) ? data : initialCategories);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
      console.error('Error fetching categories:', err);
      // Fallback to initial data
      setCategories(initialCategories);
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items from API
  const fetchMenuItems = async (restaurantId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.menuItemsAPI.list({ restaurantId });
      setMenuItems(Array.isArray(data) ? data : initialMenuItems);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch menu items';
      setError(message);
      console.error('Error fetching menu items:', err);
      // Fallback to initial data
      setMenuItems(initialMenuItems);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from API
  const fetchOrders = async (restaurantId: string, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await api.ordersAPI.list({ restaurantId });
      const newOrders = Array.isArray(data) ? data : [];
      
      // Check for new orders and show notification
      if (silent && newOrders.length > previousOrderCount) {
        const newOrdersCount = newOrders.length - previousOrderCount;
        toast.success(`${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} received!`, {
          duration: 5000,
        });
        // Play notification sound (optional)
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        } catch (err) {
          console.log('Could not play notification sound');
        }
      }
      
      setPreviousOrderCount(newOrders.length);
      setOrders(newOrders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      if (!silent) {
        setError(message);
        console.error('Error fetching orders:', err);
      }
      setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    fetchCategories(currentRestaurant.id);
    fetchMenuItems(currentRestaurant.id);
    fetchOrders(currentRestaurant.id);
  }, [currentRestaurant.id]);

  // Poll for new orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(currentRestaurant.id, true);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentRestaurant.id, previousOrderCount]);

  const toggleRestaurantOpen = () => {
    setCurrentRestaurant(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const updateRestaurantInfo = async (updates: Partial<Restaurant>) => {
    try {
      const updated = await api.restaurantsAPI.update(currentRestaurant.id, updates);
      setCurrentRestaurant(updated);
      
      // Update AuthContext to sync restaurant state immediately
      updateAuthRestaurant(updated);
      
      toast.success('Restaurant information updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update restaurant';
      toast.error(message);
      console.error('Error updating restaurant:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.ordersAPI.update(orderId, { status });
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success('Order status updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      toast.error(message);
      console.error('Error updating order:', err);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await api.categoriesAPI.create({
        ...category,
        restaurantId: currentRestaurant.id,
      });
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      toast.error(message);
      console.error('Error creating category:', err);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const updated = await api.categoriesAPI.update(id, updates);
      setCategories(prev => prev.map(cat => 
        cat.id === id ? updated : cat
      ));
      toast.success('Category updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category';
      toast.error(message);
      console.error('Error updating category:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.categoriesAPI.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setMenuItems(prev => prev.filter(item => item.categoryId !== id));
      toast.success('Category deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(message);
      console.error('Error deleting category:', err);
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newItem = await api.menuItemsAPI.create({
        ...item,
        restaurantId: currentRestaurant.id,
      });
      setMenuItems(prev => [...prev, newItem]);
      toast.success('Menu item created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create menu item';
      toast.error(message);
      console.error('Error creating menu item:', err);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const updated = await api.menuItemsAPI.update(id, updates);
      setMenuItems(prev => prev.map(item => 
        item.id === id ? updated : item
      ));
      toast.success('Menu item updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update menu item';
      toast.error(message);
      console.error('Error updating menu item:', err);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await api.menuItemsAPI.delete(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menu item deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete menu item';
      toast.error(message);
      console.error('Error deleting menu item:', err);
    }
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  return (
    <RestaurantContext.Provider value={{
      currentRestaurant,
      setCurrentRestaurant,
      restaurants,
      categories,
      setCategories,
      menuItems,
      setMenuItems,
      orders,
      setOrders,
      loading,
      error,
      toggleRestaurantOpen,
      updateRestaurantInfo,
      updateOrderStatus,
      addCategory,
      updateCategory,
      deleteCategory,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      toggleItemAvailability,
      fetchCategories,
      fetchMenuItems,
      fetchOrders,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
