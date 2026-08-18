const https = require('https');
const fs = require('fs');
const path = require('path');

// Image URLs organized by category
const images = {
  hero: [
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05022.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/4.png',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05005.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2024/03/Copie-de-Co-May-Product4699.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/03/Web-Aurora.jpg',
  ],
  products: [
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05097.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05037.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/13.png',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/DSC05109.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Thiet-ke-chua-co-ten-5.png',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05066.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/3.png',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05022-den.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05029-den.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC04964.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/DSC04942.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/5.png',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05007-den.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/Copie-de-DSC05005-vang.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/DSC05086.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/07/tanya-brown-side.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/03/da%CC%83-up-FB.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/02/CoMay7th4860.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/02/CoMay7th4872-1.jpg',
  ],
  materials: [
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/IMG_3189-1-edited-scaled.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/COMAY_lookbook_SS20258466-copy-1-edited-1-scaled.jpeg',
    'https://comaycraft.com.vn/wp-content/uploads/2025/03/comay8423-1-1-edited.jpg',
  ],
  about: [
    'https://comaycraft.com.vn/wp-content/uploads/2024/09/comay8249-1-VUONG.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2024/09/IMG_2375.jpg',
  ],
  blog: [
    'https://comaycraft.com.vn/wp-content/uploads/2023/10/IMG_1823.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/05/1710SIXDO-SYDNEY-foto-KIENGCAN-.jpeg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/05/1306SIXDO-SYDNEY-foto-KIENGCAN-1.jpeg',
    'https://comaycraft.com.vn/wp-content/uploads/2023/04/CMxPDH.jpg',
    'https://comaycraft.com.vn/wp-content/uploads/2024/05/STELLA-3-1.jpg',
  ],
};

// Function to download an image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        console.error(`✗ Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`✗ Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Main function to download all images
async function downloadAll() {
  for (const [category, urls] of Object.entries(images)) {
    console.log(`\nDownloading ${category} images...`);
    const categoryDir = path.join(__dirname, 'public', 'images', category);
    
    // Ensure directory exists
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `${category}-${i + 1}${path.extname(url).split('?')[0]}`;
      const filepath = path.join(categoryDir, filename);

      try {
        await downloadImage(url, filepath);
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to download ${url}`);
      }
    }
  }

  console.log('\n✓ All images downloaded successfully!');
}

downloadAll().catch(console.error);
