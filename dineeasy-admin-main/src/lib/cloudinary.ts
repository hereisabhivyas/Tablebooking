// Cloudinary upload function using backend signed upload
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Call your backend API endpoint instead of Cloudinary directly
    const response = await fetch('http://localhost:4000/upload/image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || `Upload failed with status ${response.status}`;
      console.error('Upload error response:', errorData);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('No secure URL returned from server');
    }
    
    console.log('Image uploaded successfully:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
