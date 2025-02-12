const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
}).single('image');

// Ensure upload directories exist
const createUploadDirs = async () => {
  const dirs = ['uploads', 'uploads/original', 'uploads/optimized'];
  for (const dir of dirs) {
    await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
  }
};

createUploadDirs();

const imageController = {
  uploadImage: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const timestamp = Date.now();
        const filename = `${timestamp}-${req.file.originalname.toLowerCase()}`
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-\.]/g, '');

        // Process image with Sharp
        const optimizedImage = await sharp(req.file.buffer)
          .resize(1200, null, { // Max width 1200px, maintain aspect ratio
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: 80 }) // Convert to WebP
          .toBuffer();

        // Save original
        await fs.writeFile(
          path.join(process.cwd(), 'uploads/original', filename),
          req.file.buffer
        );

        // Save optimized version
        const optimizedFilename = filename.replace(/\.[^/.]+$/, '.webp');
        await fs.writeFile(
          path.join(process.cwd(), 'uploads/optimized', optimizedFilename),
          optimizedImage
        );

        // Get image dimensions
        const metadata = await sharp(optimizedImage).metadata();

        res.json({
          success: true,
          imageUrl: `/uploads/optimized/${optimizedFilename}`,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: 'webp',
            size: optimizedImage.length
          }
        });
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: 'Error processing image' });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const { filename } = req.params;
      
      // Delete both original and optimized versions
      await Promise.all([
        fs.unlink(path.join(process.cwd(), 'uploads/original', filename)),
        fs.unlink(path.join(process.cwd(), 'uploads/optimized', 
          filename.replace(/\.[^/.]+$/, '.webp')))
      ]);

      res.json({ success: true });
    } catch (error) {
      console.error('Image deletion error:', error);
      res.status(500).json({ error: 'Error deleting image' });
    }
  }
};

module.exports = imageController; 