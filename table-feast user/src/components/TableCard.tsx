import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Table } from '@/types';
import { cn } from '@/lib/utils';

interface TableCardProps {
  table: Table;
  isSelected: boolean;
  onClick: () => void;
}

export function TableCard({ table, isSelected, onClick }: TableCardProps) {
  const isDisabled = !table.isAvailable;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200",
        isSelected && "border-primary bg-primary/10 shadow-glow",
        !isSelected && !isDisabled && "border-border bg-card hover:border-primary/50 hover:bg-accent",
        isDisabled && "cursor-not-allowed border-border bg-muted opacity-50"
      )}
    >
      {/* Table number */}
      <div className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold transition-colors",
        isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      )}>
        A-{table.number}
      </div>
      
      {/* Capacity */}
      <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{table.capacity} seats</span>
      </div>
      
      {/* Status indicator */}
      {isDisabled && (
        <span className="mt-2 text-xs font-medium text-destructive">Occupied</span>
      )}
      
      {/* Selected checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
        >
          <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
