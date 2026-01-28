import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ImageUpload } from '@/components/ImageUpload';

// Mock the cloudinary upload function
vi.mock('@/lib/cloudinary', () => ({
  uploadToCloudinary: vi.fn(async (_file: File) => {
    return 'https://res.cloudinary.com/dct31ldaa/image/upload/v1234567890/test.jpg';
  }),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ImageUpload Component', () => {
  const mockOnImageSelect = vi.fn();

  beforeEach(() => {
    mockOnImageSelect.mockClear();
  });

  it('renders upload area with label', () => {
    render(
      React.createElement(ImageUpload, {
        onImageSelect: mockOnImageSelect,
        label: 'Test Upload',
      })
    );

    expect(screen.getByText('Test Upload')).toBeInTheDocument();
    expect(screen.getByText('Click to upload image')).toBeInTheDocument();
  });

  it('shows preview when currentImage is provided', () => {
    render(
      React.createElement(ImageUpload, {
        onImageSelect: mockOnImageSelect,
        currentImage: 'https://example.com/image.jpg',
        label: 'Test Upload',
      })
    );

    const img = screen.getByAltText('Preview') as HTMLImageElement;
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('validates file type', async () => {
    const { toast } = await import('sonner');

    render(
      React.createElement(ImageUpload, {
        onImageSelect: mockOnImageSelect,
        label: 'Test Upload',
      })
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input).toBeTruthy();

    if (input) {
      const file = new File(['text'], 'test.txt', { type: 'text/plain' });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Invalid file type',
          expect.objectContaining({
            description: 'Please upload an image file',
          })
        );
      });
    }
  });

  it('validates file size', async () => {
    const { toast } = await import('sonner');

    render(
      React.createElement(ImageUpload, {
        onImageSelect: mockOnImageSelect,
        label: 'Test Upload',
      })
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(input).toBeTruthy();

    if (input) {
      // Create a file larger than 5MB
      const largeFile = new File(
        ['x'.repeat(6 * 1024 * 1024)],
        'large.jpg',
        { type: 'image/jpeg' }
      );

      fireEvent.change(input, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'File too large',
          expect.objectContaining({
            description: 'Maximum file size is 5MB',
          })
        );
      });
    }
  });

  it('calls onImageSelect when valid image is uploaded', async () => {
    const { uploadToCloudinary } = await import('@/lib/cloudinary');

    render(
      React.createElement(ImageUpload, {
        onImageSelect: mockOnImageSelect,
        label: 'Test Upload',
      })
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (input) {
      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        expect(uploadToCloudinary).toHaveBeenCalledWith(file);
      });

      await waitFor(() => {
        expect(mockOnImageSelect).toHaveBeenCalledWith(
          'https://res.cloudinary.com/dct31ldaa/image/upload/v1234567890/test.jpg'
        );
      });
    }
  });
});
