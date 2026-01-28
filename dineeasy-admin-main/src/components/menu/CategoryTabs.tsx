import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Category } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={selectedCategory === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className={cn(
          'flex-shrink-0',
          selectedCategory === null && 'bg-primary hover:bg-primary/90'
        )}
      >
        All Items
      </Button>
      
      {categories.map((category) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group flex-shrink-0"
        >
          <Button
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              'gap-2',
              selectedCategory === category.id && 'bg-primary hover:bg-primary/90'
            )}
          >
            <span>{category.icon}</span>
            {category.name}
          </Button>
          
          {/* Edit/Delete on hover */}
          <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditCategory(category);
              }}
              className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center hover:bg-muted"
            >
              <Edit className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCategory(category.id);
              }}
              className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center hover:bg-destructive/30"
            >
              <Trash2 className="w-2.5 h-2.5 text-destructive" />
            </button>
          </div>
        </motion.div>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onAddCategory}
        className="flex-shrink-0 border-dashed"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Category
      </Button>
    </div>
  );
}
