import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function analyzePDF() {
  const zai = await ZAI.create();
  
  const pagesDir = './upload/pdf_images';
  const pages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.png'))
    .sort()
    .slice(0, 5);  // Only first 5 pages
  
  let fullContent = '';
  
  for (const pageFile of pages) {
    const pagePath = path.join(pagesDir, pageFile);
    const imageBuffer = fs.readFileSync(pagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extrais tout le texte et décris les éléments visuels de cette page. Réponds en français.'
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
    
    fullContent += `\n=== PAGE: ${pageFile} ===\n${response.choices[0]?.message?.content}\n`;
  }
  
  console.log(fullContent);
}

analyzePDF().catch(console.error);
