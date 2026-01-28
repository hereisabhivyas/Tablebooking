// DineIn Types

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine: string[];
  rating?: number;
  image?: string;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  address?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  isAvailable: boolean;
  restaurantId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  restaurantId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  restaurantId: string;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot';
  preparationTime?: number; // in minutes
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

// API order item format (from database)
export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: number;
  items: CartItem[] | OrderItem[]; // Support both formats
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface OrderSession {
  restaurantId?: string;
  restaurantName?: string;
  tableId: string;
  tableNumber: number;
}
