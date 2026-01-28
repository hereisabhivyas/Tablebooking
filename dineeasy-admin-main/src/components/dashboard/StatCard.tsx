import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className,
  iconClassName 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn('overflow-hidden border border-border bg-card hover:shadow-card transition-all duration-300', className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
              {trend && (
                <div className={cn(
                  'flex items-center gap-1 text-sm font-semibold',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}>
                  <span>{trend.isPositive ? '↑' : '↓'}</span>
                  <span>{Math.abs(trend.value)}%</span>
                  <span className="text-muted-foreground font-normal">vs last week</span>
                </div>
              )}
            </div>
            <div className={cn(
              'flex items-center justify-center flex-shrink-0 rounded-xl',
              iconClassName || 'bg-primary/15 w-14 h-14'
            )}>
              <Icon className="w-7 h-7 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
