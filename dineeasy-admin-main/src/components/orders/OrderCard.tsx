import { motion } from 'framer-motion';
import { Clock, Check, X, ChefHat, Bell, UtensilsCrossed } from 'lucide-react';
import { Order } from '@/data/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onViewDetails: (order: Order) => void;
}

const statusConfig = {
  placed: { 
    label: 'New Order', 
    color: 'bg-info text-info-foreground',
    icon: Bell,
    nextStatus: 'confirmed' as const,
    nextLabel: 'Accept'
  },
  new: { 
    label: 'New', 
    color: 'bg-info text-info-foreground',
    icon: Bell,
    nextStatus: 'confirmed' as const,
    nextLabel: 'Accept'
  },
  confirmed: { 
    label: 'Confirmed', 
    color: 'bg-primary text-primary-foreground',
    icon: Check,
    nextStatus: 'preparing' as const,
    nextLabel: 'Start Preparing'
  },
  preparing: { 
    label: 'Preparing', 
    color: 'bg-warning text-warning-foreground',
    icon: ChefHat,
    nextStatus: 'ready' as const,
    nextLabel: 'Mark Ready'
  },
  ready: { 
    label: 'Ready', 
    color: 'bg-success text-success-foreground',
    icon: UtensilsCrossed,
    nextStatus: 'served' as const,
    nextLabel: 'Mark Served'
  },
  served: { 
    label: 'Served', 
    color: 'bg-muted text-muted-foreground',
    icon: Check,
    nextStatus: null,
    nextLabel: null
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-destructive text-destructive-foreground',
    icon: X,
    nextStatus: null,
    nextLabel: null
  }
};

export function OrderCard({ order, onStatusChange, onViewDetails }: OrderCardProps) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <Card 
        className={cn(
          'cursor-pointer hover:border-primary/50 transition-all duration-200',
          (order.status === 'new' || order.status === 'placed') && 'border-info/50 shadow-lg shadow-info/10'
        )}
        onClick={() => onViewDetails(order)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">T{order.tableNumber}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Table {order.tableNumber}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                </div>
              </div>
            </div>
            <Badge className={cn('flex items-center gap-1', config.color)}>
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-foreground font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{order.items.length - 3} more items
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">₹{order.totalAmount}</p>
            </div>
            
            {config.nextStatus && (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {(order.status === 'new' || order.status === 'placed') && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button 
                  size="sm"
                  onClick={() => onStatusChange(order.id, config.nextStatus!)}
                  className="bg-primary hover:bg-primary/90"
                >
                  {config.nextLabel}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
