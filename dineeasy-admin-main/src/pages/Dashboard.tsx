import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { OrderCard } from '@/components/orders/OrderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { ordersAPI } from '@/lib/api-client';

interface Order {
  id: string;
  tableNumber: number;
  items: Array<{ menuItemId: string; name: string; quantity: number; price: number }>;
  status: 'placed' | 'new' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  totalAmount: number;
  createdAt: string | Date;
  restaurantId: string;
  notes?: string;
  updatedAt?: string | Date;
}

export default function Dashboard() {
  const { currentRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentRestaurant?.id) return;
        const data = await ordersAPI.list({ restaurantId: currentRestaurant.id });
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Refresh orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [currentRestaurant?.id]);

  // Calculate stats
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const newOrders = orders.filter(o => o.status === 'new' || o.status === 'placed').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const activeOrders = orders.filter(o => !['served', 'cancelled'].includes(o.status));
  const avgOrderValue = todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0;

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await ordersAPI.update(orderId, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Orders"
            value={todayOrders.length}
            subtitle={`${newOrders} new, ${preparingOrders} preparing`}
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${todayRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconClassName="bg-success/15"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${avgOrderValue}`}
            icon={TrendingUp}
            iconClassName="bg-primary/15"
          />
          <StatCard
            title="Active Orders"
            value={activeOrders.length}
            subtitle="In queue"
            icon={Clock}
            iconClassName="bg-warning/15"
          />
        </div>

        {/* Recent Orders */}
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Link to="/orders">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{loading ? 'Loading orders...' : 'No active orders'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.slice(0, 6).map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onViewDetails={setSelectedOrder}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Order Status Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 border border-border/50">
                  <span className="text-muted-foreground font-medium">New Orders</span>
                  <span className="font-bold text-xl text-foreground">{newOrders}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 border border-border/50">
                  <span className="text-muted-foreground font-medium">Preparing</span>
                  <span className="font-bold text-xl text-foreground">{preparingOrders}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 border border-border/50">
                  <span className="text-muted-foreground font-medium">Total Orders</span>
                  <span className="font-bold text-xl text-foreground">{orders.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </MainLayout>
  );
}
