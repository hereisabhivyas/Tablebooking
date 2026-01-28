import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  LogOut, 
  LayoutDashboard, 
  ChefHat, 
  Grid3X3, 
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderStatus } from '@/types';
import { restaurants, menuItems, tables } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'orders' | 'menu' | 'tables';

const statusColors: Record<OrderStatus, string> = {
  placed: 'bg-warning/20 text-warning',
  confirmed: 'bg-blue-500/20 text-blue-600',
  preparing: 'bg-purple-500/20 text-purple-600',
  ready: 'bg-success/20 text-success',
  served: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/20 text-destructive',
};

const statusLabels: Record<OrderStatus, string> = {
  placed: 'New Order',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  cancelled: 'Cancelled',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Default to first restaurant for demo
  const restaurant = restaurants[0];
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant.id);
  const restaurantMenu = menuItems.filter(m => m.restaurantId === restaurant.id);
  const restaurantTables = tables.filter(t => t.restaurantId === restaurant.id);

  const handleLogout = () => {
    toast.success('Logged out');
    navigate('/admin');
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: Record<string, OrderStatus> = {
      placed: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'served',
    };
    return flow[currentStatus] || null;
  };

  const handleUpdateStatus = (orderId: string, currentStatus: OrderStatus) => {
    const next = getNextStatus(currentStatus);
    if (next) {
      updateOrderStatus(orderId, next);
      toast.success(`Order updated to "${statusLabels[next]}"`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">{restaurant.name}</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border">
          {[
            { key: 'orders' as Tab, label: 'Orders', icon: ClipboardList },
            { key: 'menu' as Tab, label: 'Menu', icon: ChefHat },
            { key: 'tables' as Tab, label: 'Tables', icon: Grid3X3 },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {activeTab === 'orders' && (
          <OrdersTab
            orders={restaurantOrders}
            onUpdateStatus={handleUpdateStatus}
            onCancel={(id) => {
              updateOrderStatus(id, 'cancelled');
              toast.success('Order cancelled');
            }}
          />
        )}

        {activeTab === 'menu' && (
          <MenuTab items={restaurantMenu} />
        )}

        {activeTab === 'tables' && (
          <TablesTab tables={restaurantTables} />
        )}
      </main>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ 
  orders, 
  onUpdateStatus,
  onCancel 
}: { 
  orders: ReturnType<typeof useOrders>['orders'];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onCancel: (orderId: string) => void;
}) {
  const activeOrders = orders.filter(o => !['served', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => ['served', 'cancelled'].includes(o.status));

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Bell className="mb-4 h-16 w-16 text-muted-foreground/50" />
        <h2 className="mb-2 text-xl font-bold text-foreground">No orders yet</h2>
        <p className="text-muted-foreground">Orders will appear here when customers place them</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active orders */}
      {activeOrders.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-foreground">Active Orders ({activeOrders.length})</h2>
          <div className="grid gap-3">
            {activeOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-card p-4 shadow-card"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                      T{order.tableNumber}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">#{order.id.slice(-6)}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <span className={cn("status-badge", statusColors[order.status])}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <Separator className="my-3" />

                <div className="mb-3 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.quantity}× {item.menuItem.name}
                      </span>
                      <span className="text-muted-foreground">₹{item.menuItem.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mb-3 rounded-lg bg-accent p-2 text-sm text-muted-foreground">
                    <span className="font-medium">Note:</span> {order.notes}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">₹{order.totalAmount}</p>
                  
                  <div className="flex gap-2">
                    {order.status === 'placed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel(order.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    )}
                    
                    {order.status !== 'served' && order.status !== 'cancelled' && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, order.status)}
                        className="btn-warm"
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        {order.status === 'placed' && 'Accept'}
                        {order.status === 'confirmed' && 'Start Prep'}
                        {order.status === 'preparing' && 'Mark Ready'}
                        {order.status === 'ready' && 'Mark Served'}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Completed orders */}
      {completedOrders.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-muted-foreground">Completed ({completedOrders.length})</h2>
          <div className="grid gap-2">
            {completedOrders.slice(0, 5).map(order => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">T{order.tableNumber}</span>
                  <span className="text-sm text-muted-foreground">#{order.id.slice(-6)}</span>
                </div>
                <span className={cn("status-badge text-xs", statusColors[order.status])}>
                  {statusLabels[order.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Menu Tab Component
function MenuTab({ items }: { items: typeof menuItems }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Menu Items ({items.length})</h2>
        <Button size="sm" className="btn-warm">
          + Add Item
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-soft"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-sm border",
                  item.isVeg ? "border-success" : "border-destructive"
                )}>
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    item.isVeg ? "bg-success" : "bg-destructive"
                  )} />
                </div>
                <h3 className="font-medium text-foreground">{item.name}</h3>
              </div>
              <p className="text-sm font-semibold text-primary">₹{item.price}</p>
            </div>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              item.isAvailable
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            )}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tables Tab Component  
function TablesTab({ tables: tablesList }: { tables: typeof tables }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Tables ({tablesList.length})</h2>
        <Button size="sm" className="btn-warm">
          + Add Table
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tablesList.map(table => (
          <div
            key={table.id}
            className="flex flex-col items-center rounded-xl bg-card p-4 shadow-soft"
          >
            <div className={cn(
              "mb-2 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold",
              table.isAvailable
                ? "bg-success/20 text-success"
                : "bg-warning/20 text-warning"
            )}>
              {table.number}
            </div>
            <p className="text-sm text-muted-foreground">{table.capacity} seats</p>
            <span className={cn(
              "mt-2 rounded-full px-2 py-0.5 text-xs font-medium",
              table.isAvailable
                ? "bg-success/20 text-success"
                : "bg-warning/20 text-warning"
            )}>
              {table.isAvailable ? 'Available' : 'Occupied'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
