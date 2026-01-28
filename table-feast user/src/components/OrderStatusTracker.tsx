import { motion } from 'framer-motion';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, ChefHat, Bell, UtensilsCrossed } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const statuses: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'placed', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: Bell },
  { key: 'served', label: 'Served', icon: UtensilsCrossed },
];

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = statuses.findIndex(s => s.key === status);

  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center rounded-xl bg-destructive/10 p-6">
        <p className="text-lg font-semibold text-destructive">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        {statuses.map((s, index) => {
          const Icon = s.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={s.key} className="flex flex-1 flex-col items-center">
              {/* Line connector */}
              {index > 0 && (
                <div className="absolute -translate-x-1/2">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-colors duration-500",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                </div>
              )}
              
              {/* Icon circle */}
              <motion.div
                initial={false}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1 }}
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && "border-success bg-success text-success-foreground",
                  isCurrent && "border-primary bg-primary text-primary-foreground shadow-glow",
                  isPending && "border-border bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-center text-xs font-medium transition-colors",
                  isCompleted && "text-success",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
