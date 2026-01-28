import { useState, useEffect } from 'react';
import { Category } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';

interface CategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (category: Omit<Category, 'id'> | Category) => void;
  restaurantId: string;
  nextOrder: number;
}

const emojiOptions = ['🥗', '🍛', '🫓', '🍚', '🍮', '🥤', '🍗', '🍕', '🍔', '🌮', '🍜', '🍱'];

export function CategoryModal({
  category,
  open,
  onOpenChange,
  onSave,
  restaurantId,
  nextOrder,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍽️');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setImage(category.image || '');
    } else {
      setName('');
      setIcon('🍽️');
      setImage('');
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onSave({ ...category, name, icon, image });
    } else {
      onSave({ name, icon, image, order: nextOrder, restaurantId });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Starters"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    icon === emoji
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : 'bg-secondary hover:bg-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <ImageUpload
            currentImage={image}
            onImageSelect={setImage}
            label="Category Image"
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {category ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
