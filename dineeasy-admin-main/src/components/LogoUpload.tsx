import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  currentLogo?: string;
  onUpload: (imageUrl: string) => void;
  loading?: boolean;
}

export function LogoUpload({ currentLogo, onUpload, loading = false }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
      toast.error('Image must be less than 5MB');
      return false;
    }

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return false;
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const response = await fetch('http://localhost:4000/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onUpload(data.secure_url);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload logo');
      setPreview(currentLogo || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-colors p-8',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-secondary/30 hover:bg-secondary/50'
        )}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="Logo preview"
              className="h-32 w-32 rounded-lg object-cover"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || loading}
              >
                Change Logo
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading || loading}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || loading}
            className="flex w-full flex-col items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF or WebP (max. 5MB)</p>
            </div>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading || loading}
        />
      </div>
    </div>
  );
}
