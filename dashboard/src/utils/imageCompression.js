import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,             // Max file size in MB
    maxWidthOrHeight: 1200,   // Max width/height for SEO-friendly images
    useWebWorker: true,       // Use Web Worker for better performance
    fileType: 'image/webp',   // Convert to WebP for better compression
    initialQuality: 0.8       // Initial quality (0 to 1)
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // Generate SEO-friendly filename
    const timestamp = Date.now();
    const seoFilename = `${timestamp}-${file.name.toLowerCase()}`
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters

    return new File(
      [compressedFile], 
      seoFilename, 
      { type: 'image/webp' }
    );
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}; 