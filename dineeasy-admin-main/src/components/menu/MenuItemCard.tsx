import { motion } from 'framer-motion';
import { Clock, Flame, Edit, Trash2, Star } from 'lucide-react';
import { MenuItem } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

const spiceLevelConfig = {
  mild: { label: 'Mild', color: 'text-green-500' },
  medium: { label: 'Medium', color: 'text-yellow-500' },
  hot: { label: 'Hot', color: 'text-red-500' },
};

export function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  const spiceConfig = spiceLevelConfig[item.spiceLevel];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card className={cn(
        'overflow-hidden transition-all duration-200 hover:border-primary/50',
        !item.isAvailable && 'opacity-60'
      )}>
        <div className="relative">
          {/* Image or Placeholder */}
          <div className="h-32 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🍽️</span>
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge className={cn(
              'text-xs',
              item.isVeg 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            )}>
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge>
            {item.isBestseller && (
              <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Bestseller
              </Badge>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="absolute top-2 right-2">
            <Switch
              checked={item.isAvailable}
              onCheckedChange={() => onToggleAvailability(item.id)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.prepTime} min
            </div>
            <div className={cn('flex items-center gap-1', spiceConfig.color)}>
              <Flame className="w-3 h-3" />
              {spiceConfig.label}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-lg font-bold text-primary">₹{item.price}</span>
            <div className="flex gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={() => onEdit(item)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
