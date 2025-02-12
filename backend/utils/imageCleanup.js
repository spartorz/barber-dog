const fs = require('fs').promises;
const path = require('path');

const cleanupUnusedImages = async () => {
  try {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const files = await fs.readdir(uploadDir);

    // Get list of images referenced in database
    const usedImages = await Service.distinct('imageUrl');

    // Delete unused files
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      if (!usedImages.includes(file)) {
        await fs.unlink(filePath);
        console.log(`Deleted unused file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up images:', error);
  }
};

// Run cleanup daily
setInterval(cleanupUnusedImages, 24 * 60 * 60 * 1000);

module.exports = { cleanupUnusedImages }; 