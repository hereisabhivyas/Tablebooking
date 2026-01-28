import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import { Order } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
}

const statusConfig = {
  new: { label: 'New Order', color: 'bg-info text-info-foreground' },
  confirmed: { label: 'Confirmed', color: 'bg-primary text-primary-foreground' },
  preparing: { label: 'Preparing', color: 'bg-warning text-warning-foreground' },
  ready: { label: 'Ready to Serve', color: 'bg-success text-success-foreground' },
  served: { label: 'Served', color: 'bg-muted text-muted-foreground' },
};

const statusFlow: Order['status'][] = ['new', 'confirmed', 'preparing', 'ready', 'served'];

export function OrderDetailsModal({ order, open, onOpenChange, onStatusChange }: OrderDetailsModalProps) {
  if (!order) return null;

  const currentStatusIndex = statusFlow.indexOf(order.status);
  const nextStatus = statusFlow[currentStatusIndex + 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Order #{order.id.slice(-4)}</DialogTitle>
            <Badge className={cn(statusConfig[order.status].color)}>
              {statusConfig[order.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">T{order.tableNumber}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Table {order.tableNumber}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {format(order.createdAt, 'h:mm a, MMM d')}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {item.quantity}
                    </span>
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-primary">₹{order.totalAmount}</span>
          </div>

          {/* Status Progress */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Order Progress</h4>
            <div className="flex items-center gap-1">
              {statusFlow.map((status, index) => (
                <div
                  key={status}
                  className={cn(
                    'flex-1 h-2 rounded-full transition-colors',
                    index <= currentStatusIndex ? 'bg-primary' : 'bg-secondary'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          {nextStatus && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => {
                onStatusChange(order.id, nextStatus);
                onOpenChange(false);
              }}
            >
              Move to {statusConfig[nextStatus].label}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
