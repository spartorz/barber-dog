import React, { useState, useRef, useEffect } from 'react';
import { compressImage } from '../../utils/imageCompression';

const ImageUpload = ({ currentImage, onImageUpload }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    // Cleanup preview URL on component unmount
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const processImage = async (file) => {
    if (file && file.type.startsWith('image/')) {
      try {
        setIsProcessing(true);

        // Compress and optimize image
        const compressedFile = await compressImage(file);

        // Create optimized preview
        if (previewRef.current) {
          URL.revokeObjectURL(previewRef.current);
        }
        const previewUrl = URL.createObjectURL(compressedFile);
        previewRef.current = previewUrl;
        setPreview(previewUrl);

        // Generate image metadata for SEO
        const metadata = {
          alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          width: 1200, // Max width from compression
          height: 'auto',
          loading: 'lazy'
        };

        // Send compressed file and metadata to parent
        onImageUpload(compressedFile, metadata);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processImage(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    processImage(file);
  };

  return (
    <div 
      className={`image-upload ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isProcessing && (
        <div className="processing-overlay">
          <div className="spinner"></div>
          <p>Optimizing image...</p>
        </div>
      )}
      
      {preview ? (
        <div className="image-preview">
          <img 
            src={preview} 
            alt="Preview" 
            loading="lazy"
            width="300"
            height="200"
          />
          <div className="image-actions">
            <button 
              type="button"
              className="change-image"
              onClick={() => fileInputRef.current.click()}
              disabled={isProcessing}
            >
              Change Image
            </button>
            <button 
              type="button"
              className="remove-image"
              onClick={() => {
                setPreview(null);
                if (previewRef.current) {
                  URL.revokeObjectURL(previewRef.current);
                }
                onImageUpload(null);
              }}
              disabled={isProcessing}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-prompt" onClick={() => !isProcessing && fileInputRef.current.click()}>
          <span className="upload-icon">📁</span>
          <p>Drag and drop an image here or click to select</p>
          <span className="upload-hint">Recommended: 1200x800px, max 1MB</span>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        style={{ display: 'none' }}
        disabled={isProcessing}
      />
    </div>
  );
};

export default ImageUpload; 