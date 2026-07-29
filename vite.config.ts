import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import { execSync } from 'child_process'
import AdmZip from 'adm-zip'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      name: 'export-middleware',
      configureServer(server) {
        server.middlewares.use('/api/export', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const config = JSON.parse(body);
                const zip = new AdmZip();
                
                // Extract images to the zip and update references
                if (config.scenes) {
                  for (let i = 0; i < config.scenes.length; i++) {
                    const scene = config.scenes[i];
                    
                    const processImage = (imgUrl: string, suffix: string) => {
                      if (!imgUrl) return imgUrl;
                      const fileName = `images/${scene.id}_${suffix}.jpg`;
                      if (imgUrl.startsWith('data:image/')) {
                        const base64Data = imgUrl.split(',')[1];
                        zip.addFile(fileName, Buffer.from(base64Data, 'base64'));
                        return fileName;
                      } else if (imgUrl.startsWith('/')) {
                        const filePath = path.join(__dirname, 'public', imgUrl);
                        if (fs.existsSync(filePath)) {
                          zip.addLocalFile(filePath, 'images', `${scene.id}_${suffix}.jpg`);
                          return fileName;
                        }
                      }
                      return imgUrl;
                    };
                    scene.img = processImage(scene.img, 'img');
                    if (scene.img4k) {
                      scene.img4k = processImage(scene.img4k, 'img4k');
                    }
                    scene.thumb = processImage(scene.thumb, 'thumb');
                  }
                }
                
                // Extract 3D models to zip if present
                if (config.modelUrl && config.modelUrl.startsWith('data:')) {
                  const base64Data = config.modelUrl.split(',')[1];
                  const mimeMatch = config.modelUrl.match(/^data:([^;]+);/);
                  const ext = mimeMatch && mimeMatch[1].includes('gltf') ? 'gltf' : 'glb';
                  const modelFileName = `model/textured_scene.${ext}`;
                  zip.addFile(modelFileName, Buffer.from(base64Data, 'base64'));
                  config.modelUrl = modelFileName;
                }
                if (config.untexturedModelUrl && config.untexturedModelUrl.startsWith('data:')) {
                  const base64Data = config.untexturedModelUrl.split(',')[1];
                  const mimeMatch = config.untexturedModelUrl.match(/^data:([^;]+);/);
                  const ext = mimeMatch && mimeMatch[1].includes('gltf') ? 'gltf' : 'glb';
                  const modelFileName = `model/untextured_scene.${ext}`;
                  zip.addFile(modelFileName, Buffer.from(base64Data, 'base64'));
                  config.untexturedModelUrl = modelFileName;
                }
                
                const finalConfigJson = JSON.stringify(config);
                
                // Write config to temp file
                fs.writeFileSync(path.resolve(__dirname, 'src/export-config.json'), finalConfigJson);
                
                // Run build synchronously
                console.log('Building for export...');
                execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
                console.log('Build completed.');
                
                // Read the single built html file
                let html = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
                
                // Inject the configuration
                const scriptTag = `<script>window.__TOUR_CONFIG__ = ${finalConfigJson};</script>`;
                html = html.replace('<head>', '<head>' + scriptTag);
                
                zip.addFile('index.html', Buffer.from(html, 'utf-8'));
                const zipBuffer = zip.toBuffer();
                
                // Send response
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename="tour.zip"');
                res.end(zipBuffer);
                
                // Clean up temp file
                fs.unlinkSync(path.resolve(__dirname, 'src/export-config.json'));
              } catch (e: any) {
                console.error(e);
                res.statusCode = 500;
                res.end(e.toString());
              }
            });
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
