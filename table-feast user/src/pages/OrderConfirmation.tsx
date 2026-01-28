import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home, Clock, Package } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { OrderStatusTracker } from '@/components/OrderStatusTracker';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { toast } from 'sonner';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [showConfetti, setShowConfetti] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch order from API
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        
        // Try to get from context first
        const contextOrder = orders.find(o => o.id === orderId);
        if (contextOrder) {
          setOrder(contextOrder);
          setIsLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const response = await api.orders.get(orderId);
        const apiOrder = response as any;
        
        // Convert to Order type with proper date objects
        const orderData: Order = {
          ...apiOrder,
          createdAt: new Date(apiOrder.createdAt),
          updatedAt: apiOrder.updatedAt ? new Date(apiOrder.updatedAt) : new Date(),
          tableId: apiOrder.tableId || `table-${apiOrder.tableNumber}`,
        };
        
        setOrder(orderData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orders]);

  // Poll for order status updates every 3 seconds
  useEffect(() => {
    if (!orderId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await api.orders.get(orderId);
        const apiOrder = response as any;
        
        // Update order with latest data from API
        const orderData: Order = {
          ...apiOrder,
          createdAt: new Date(apiOrder.createdAt),
          updatedAt: apiOrder.updatedAt ? new Date(apiOrder.updatedAt) : new Date(),
          tableId: apiOrder.tableId || `table-${apiOrder.tableNumber}`,
        };
        
        // Update local state
        setOrder(prevOrder => {
          if (prevOrder && prevOrder.status !== orderData.status) {
            console.log(`✅ Order status updated: ${prevOrder.status} → ${orderData.status}`);
            
            // Show toast notification for status change
            const statusMessages: Record<string, string> = {
              confirmed: 'Your order has been confirmed! 🎉',
              preparing: 'Your order is being prepared 👨‍🍳',
              ready: 'Your order is ready! 🔔',
              served: 'Enjoy your meal! 🍽️',
              cancelled: 'Your order has been cancelled',
            };
            
            if (statusMessages[orderData.status]) {
              toast.success('Order Update', {
                description: statusMessages[orderData.status],
              });
            }
          }
          return orderData;
        });
      } catch (error) {
        console.error('Error polling order status:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [orderId]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Order not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary underline"
          >
            Go to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Success animation */}
      <div className="relative overflow-hidden bg-gradient-to-br from-success via-success to-emerald-600 px-4 pb-8 pt-12">
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: Math.random() * 400, rotate: 0, opacity: 1 }}
                animate={{ y: 600, rotate: 360, opacity: 0 }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
                className={cn(
                  "absolute h-3 w-3 rounded-full",
                  i % 3 === 0 && "bg-yellow-400",
                  i % 3 === 1 && "bg-orange-400",
                  i % 3 === 2 && "bg-pink-400"
                )}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg"
        >
          <Check className="h-10 w-10 text-success" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative text-center"
        >
          <h1 className="mb-2 text-2xl font-bold text-white">Order Placed!</h1>
          <p className="text-white/80">
            Your order #{order.id.slice(-6)} has been received
          </p>
        </motion.div>
      </div>

      <div className="px-4">
        {/* Order status tracker */}
        <div className="-mt-4 mb-6">
          <OrderStatusTracker status={order.status} />
        </div>

        {/* Table info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 flex items-center justify-between rounded-xl bg-primary/10 p-4"
        >
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Table {order.tableNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </motion.div>

        {/* Order items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-card p-4 shadow-card"
        >
          <h3 className="mb-3 font-semibold text-card-foreground">Order Items</h3>
          
          <div className="space-y-3">
            {order.items.map((item, index) => {
              // Handle both API format (name, price directly) and context format (menuItem object)
              const itemName = 'menuItem' in item ? item.menuItem.name : (item as any).name;
              const itemPrice = 'menuItem' in item ? item.menuItem.price : (item as any).price;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-xs font-medium">
                      {item.quantity}×
                    </span>
                    <span className="text-foreground">{itemName}</span>
                  </div>
                  <span className="text-foreground">₹{itemPrice * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <Separator className="my-3" />

          <div className="flex items-center justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">₹{order.totalAmount}</span>
          </div>

          {order.notes && (
            <div className="mt-3 rounded-lg bg-accent p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> {order.notes}
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 space-y-3"
        >
          <Button
            onClick={() => navigate(`/restaurant/${order.restaurantId}/menu`)}
            className="btn-warm w-full py-6 text-base font-semibold"
          >
            Order More Items
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full py-6 text-base"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
