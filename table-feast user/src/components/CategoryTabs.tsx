import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category.id)}
            className={cn(
              "category-pill flex shrink-0 items-center gap-2 whitespace-nowrap",
              activeCategory === category.id ? "category-pill-active" : "category-pill-inactive"
            )}
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
