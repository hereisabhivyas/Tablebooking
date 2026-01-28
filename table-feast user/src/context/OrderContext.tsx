import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Order, OrderStatus, CartItem } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (
    restaurantId: string,
    tableId: string,
    tableNumber: number,
    items: CartItem[],
    totalAmount: number,
    notes?: string
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrdersByTable: (tableId: string) => Order[];
  getOrdersByRestaurant: (restaurantId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = 'dineease_orders';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Persist orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to localStorage:', error);
    }
  }, [orders]);

  const placeOrder = useCallback(
    async (
      restaurantId: string,
      tableId: string,
      tableNumber: number,
      items: CartItem[],
      totalAmount: number,
      notes?: string
    ) => {
      try {
        if (!restaurantId || !tableId || typeof tableNumber !== 'number' || items.length === 0 || typeof totalAmount !== 'number') {
          throw new Error(`Missing or invalid required order information: restaurantId=${restaurantId}, tableId=${tableId}, tableNumber=${tableNumber}, items.length=${items.length}, totalAmount=${totalAmount}`);
        }

        const itemsMapped = items.map((item, idx) => {
          console.log(`[Item ${idx}] Raw item:`, item);
          console.log(`[Item ${idx}] menuItem:`, item.menuItem);
          console.log(`[Item ${idx}] menuItem.id:`, item.menuItem.id);
          console.log(`[Item ${idx}] menuItem.price:`, item.menuItem.price);
          
          const mappedItem = {
            menuItemId: item.menuItem.id,
            name: item.menuItem.name,
            quantity: Number(item.quantity),
            price: Number(item.menuItem.price),
            notes: item.notes || undefined,
          };
          console.log(`[Item ${idx}] Mapped item:`, mappedItem);
          return mappedItem;
        });

        const orderData = {
          restaurantId,
          tableNumber: Number(tableNumber),
          items: itemsMapped,
          status: 'placed',
          totalAmount: Number(totalAmount),
          notes: notes || undefined,
        };

        console.log('=== FINAL ORDER DATA ===');
        console.log('Sending order data:', JSON.stringify(orderData, null, 2));
        const response = await api.orders.create(orderData);
        console.log('Order response:', response);
        
        const newOrder = response as any as Order;
        
        // Convert date strings to Date objects
        const order: Order = {
          ...newOrder,
          createdAt: new Date(newOrder.createdAt),
          updatedAt: new Date(newOrder.updatedAt),
          tableId,
        };

        setOrders(prev => [order, ...prev]);
        setCurrentOrder(order);
        toast.success('Order placed successfully!');
        return order;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to place order';
        console.error('Order placement error:', error);
        toast.error(message);
        throw error;
      }
    },
    []
  );

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      await api.orders.update(orderId, { status });
      
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date() }
            : order
        )
      );
      setCurrentOrder(prev =>
        prev?.id === orderId ? { ...prev, status, updatedAt: new Date() } : prev
      );
      toast.success('Order status updated!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update order';
      toast.error(message);
      throw error;
    }
  }, []);

  const getOrdersByTable = useCallback(
    (tableId: string) => orders.filter(o => o.tableId === tableId),
    [orders]
  );

  const getOrdersByRestaurant = useCallback(
    (restaurantId: string) => orders.filter(o => o.restaurantId === restaurantId),
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        placeOrder,
        updateOrderStatus,
        getOrdersByTable,
        getOrdersByRestaurant,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
