import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Bell, Volume2 } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';
import { StatCard } from '@/components/dashboard/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ordersAPI } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { ShoppingBag, DollarSign } from 'lucide-react';

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

const statusFilters = [
  { value: 'all', label: 'All Orders' },
  { value: 'placed', label: 'New', color: 'bg-info' },
  { value: 'new', label: 'New', color: 'bg-info' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-primary' },
  { value: 'preparing', label: 'Preparing', color: 'bg-warning' },
  { value: 'ready', label: 'Ready', color: 'bg-success' },
  { value: 'served', label: 'Served', color: 'bg-muted' },
];

export default function Orders() {
  const { currentRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
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
    // Refresh orders every 3 seconds
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [currentRestaurant?.id]);

  // Calculate today's stats
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.tableNumber.toString().includes(searchQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await ordersAPI.update(orderId, { status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  // Group orders by status
  const newOrders = filteredOrders.filter(o => o.status === 'new' || o.status === 'placed');
  const activeOrders = filteredOrders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status));
  const servedOrders = filteredOrders.filter(o => o.status === 'served');

  // Sound notification effect
  useEffect(() => {
    if (soundEnabled && newOrders.length > 0) {
      // Play notification sound for new orders
    }
  }, [newOrders.length, soundEnabled]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage incoming and active orders</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? 'bg-primary' : ''}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Today's Orders"
            value={todayOrders.length}
            icon={ShoppingBag}
          />
          <StatCard
            title="Today's Revenue"
            value={`₹${todayRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconClassName="bg-success/15"
          />
          <StatCard
            title="New Orders"
            value={orders.filter(o => o.status === 'new' || o.status === 'placed').length}
            icon={Bell}
            iconClassName="bg-warning/15"
          />
          <StatCard
            title="Active Orders"
            value={orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status)).length}
            icon={ShoppingBag}
            iconClassName="bg-primary/15"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by table number or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'flex-shrink-0',
                  statusFilter === filter.value && 'bg-primary'
                )}
              >
                {filter.color && (
                  <span className={cn('w-2 h-2 rounded-full mr-2', filter.color)} />
                )}
                {filter.label}
                {filter.value !== 'all' && (
                  <Badge variant="secondary" className="ml-2 bg-secondary/50">
                    {orders.filter(o => o.status === filter.value).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'New orders will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* New Orders Section */}
            {newOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-info" />
                  New Orders ({newOrders.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {newOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onViewDetails={setSelectedOrder}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Active Orders Section */}
            {activeOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Active Orders ({activeOrders.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {activeOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onViewDetails={setSelectedOrder}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Served Orders Section */}
            {servedOrders.length > 0 && statusFilter === 'all' && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 text-muted-foreground">
                  Served Today ({servedOrders.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {servedOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onViewDetails={setSelectedOrder}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
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
