import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Grid, List } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { MenuItemModal } from '@/components/menu/MenuItemModal';
import { CategoryModal } from '@/components/menu/CategoryModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MenuItem, Category } from '@/data/mockData';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Menu() {
  const { 
    currentRestaurant,
    categories, 
    menuItems,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Filter items for current restaurant
  const restaurantCategories = categories.filter(c => c.restaurantId === currentRestaurant.id);
  const restaurantItems = menuItems.filter(i => i.restaurantId === currentRestaurant.id);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return restaurantItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [restaurantItems, searchQuery, selectedCategory]);

  const handleAddItem = () => {
    setEditingItem(null);
    setItemModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemModalOpen(true);
  };

  const handleSaveItem = (item: Omit<MenuItem, 'id'> | MenuItem) => {
    if ('id' in item) {
      updateMenuItem(item.id, item);
      toast.success('Item updated successfully');
    } else {
      addMenuItem(item);
      toast.success('Item added successfully');
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteMenuItem(id);
    toast.success('Item deleted');
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (category: Omit<Category, 'id'> | Category) => {
    if ('id' in category) {
      updateCategory(category.id, category);
      toast.success('Category updated');
    } else {
      addCategory(category);
      toast.success('Category added');
    }
  };

  const handleDeleteCategory = (id: string) => {
    const itemCount = restaurantItems.filter(i => i.categoryId === id).length;
    if (itemCount > 0) {
      toast.error(`Cannot delete category with ${itemCount} items`);
      return;
    }
    deleteCategory(id);
    toast.success('Category deleted');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground">
              {restaurantItems.length} items across {restaurantCategories.length} categories
            </p>
          </div>
          
          <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Categories */}
        <CategoryTabs
          categories={restaurantCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* Search & View Toggle */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory
                ? 'Try adjusting your filters'
                : 'Start by adding your first menu item'}
            </p>
            <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        ) : (
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}>
            <AnimatePresence>
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onToggleAvailability={toggleItemAvailability}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <MenuItemModal
        item={editingItem}
        categories={restaurantCategories}
        open={itemModalOpen}
        onOpenChange={setItemModalOpen}
        onSave={handleSaveItem}
        restaurantId={currentRestaurant.id}
      />

      <CategoryModal
        category={editingCategory}
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        onSave={handleSaveCategory}
        restaurantId={currentRestaurant.id}
        nextOrder={restaurantCategories.length + 1}
      />
    </MainLayout>
  );
}
