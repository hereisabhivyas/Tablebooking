import { useState, useEffect } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
}

export function ImageUpload({ onImageSelect, currentImage, label = 'Upload Image' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>('');

  // Sync preview with currentImage prop
  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file',
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Maximum file size is 5MB',
      });
      return;
    }

    try {
      setIsUploading(true);

      // Show local preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      onImageSelect(imageUrl);

      toast.success('Image uploaded successfully', {
        description: 'Your image has been uploaded to Cloudinary',
      });
    } catch (error) {
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Failed to upload image',
      });
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      {preview ? (
        <div className="relative w-full">
          <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border bg-secondary">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/50 p-6 transition-colors hover:bg-secondary',
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUploading ? (
              <>
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-foreground">
                  Click to upload image
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
