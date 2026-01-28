import { useState, useEffect } from 'react';
import { MenuItem, Category } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';

interface MenuItemModalProps {
  item: MenuItem | null;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
  restaurantId: string;
}

const defaultItem: Omit<MenuItem, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image: '/placeholder.svg',
  categoryId: '',
  isVeg: true,
  spiceLevel: 'mild',
  prepTime: 15,
  isAvailable: true,
  isBestseller: false,
  restaurantId: '',
};

export function MenuItemModal({
  item,
  categories,
  open,
  onOpenChange,
  onSave,
  restaurantId,
}: MenuItemModalProps) {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'> | MenuItem>(() => {
    if (item) {
      return item;
    }
    return {
      ...defaultItem,
      restaurantId,
      categoryId: categories[0]?.id || '',
      image: '',
    };
  });

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData(item);
      } else {
        setFormData({
          ...defaultItem,
          restaurantId,
          categoryId: categories[0]?.id || '',
          image: '',
        });
      }
    }
  }, [item, restaurantId, categories, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Item name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Item description"
              rows={3}
            />
          </div>

          <ImageUpload
            currentImage={formData.image}
            onImageSelect={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
            label="Item Image"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min={0}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Prep Time (min)</Label>
              <Input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })}
                min={1}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Spice Level</Label>
            <Select
              value={formData.spiceLevel}
              onValueChange={(value: 'mild' | 'medium' | 'hot') => 
                setFormData({ ...formData, spiceLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">🌿 Mild</SelectItem>
                <SelectItem value="medium">🌶️ Medium</SelectItem>
                <SelectItem value="hot">🔥 Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label>Vegetarian</Label>
              <Switch
                checked={formData.isVeg}
                onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Available</Label>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Bestseller</Label>
              <Switch
                checked={formData.isBestseller}
                onCheckedChange={(checked) => setFormData({ ...formData, isBestseller: checked })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {item ? 'Update' : 'Add'} Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
