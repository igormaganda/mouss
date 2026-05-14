import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function analyzePDF() {
  const zai = await ZAI.create();
  
  const pagesDir = './upload/pdf_images';
  const pages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.png'))
    .sort();
  
  console.log('=== ANALYSE DU DOCUMENT CSC_CCFT-1.pdf ===\n');
  
  for (const pageFile of pages) {
    const pagePath = path.join(pagesDir, pageFile);
    const imageBuffer = fs.readFileSync(pagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log(`\n--- ${pageFile} ---`);
    
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyse cette page de document et extrais tout le contenu textuel et les éléments visuels (diagrammes, flowcharts, listes). Décris en détail ce que contient cette page. Réponds en français.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });
    
    console.log(response.choices[0]?.message?.content);
  }
}

analyzePDF().catch(console.error);
