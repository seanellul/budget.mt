import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs/promises';
import path from 'path';

// Import PDF.js using require for better compatibility
const pdfjsLib = require('pdfjs-dist');

const PDFS_DIR = path.join(process.cwd(), 'PDFS');

/**
 * Convert a PDF file to text
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
async function convertPDFToText(pdfPath) {
  try {
    // Read file and convert Buffer to Uint8Array
    const buffer = await fs.readFile(pdfPath);
    const data = new Uint8Array(buffer);
    
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Extract text and maintain some basic formatting
      let lastY = null;
      let text = '';
      
      for (const item of content.items) {
        // Add newline if Y position changes significantly
        if (lastY !== null && Math.abs(lastY - item.transform[5]) > 5) {
          text += '\n';
        }
        text += item.str + ' ';
        lastY = item.transform[5];
      }
      
      fullText += text + '\n';
    }
    
    // Clean up the text
    return fullText
      .replace(/\s+/g, ' ')   // Normalize whitespace
      .replace(/\n\s+/g, '\n')  // Remove leading whitespace after newlines
      .replace(/\n{3,}/g, '\n\n')  // Limit consecutive newlines
      .trim();
  } catch (error) {
    console.error(`Error converting ${path.basename(pdfPath)}:`, error);
    throw error;
  }
}

/**
 * Convert all PDFs in directory to text files
 */
async function convertAllPDFs() {
  try {
    // Get list of PDF files
    const files = await fs.readdir(PDFS_DIR);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    console.log(`Found ${pdfFiles.length} PDF files to convert`);
    
    // Process each PDF
    for (const file of pdfFiles) {
      const pdfPath = path.join(PDFS_DIR, file);
      const txtPath = pdfPath.replace('.pdf', '.txt');
      
      // Skip if text file already exists
      try {
        await fs.access(txtPath);
        console.log(`Skipping ${file} - text file already exists`);
        continue;
      } catch {
        // File doesn't exist, proceed with conversion
      }
      
      console.log(`Converting ${file}...`);
      try {
        const text = await convertPDFToText(pdfPath);
        await fs.writeFile(txtPath, text);
        console.log(`Successfully converted ${file}`);
      } catch (error) {
        console.error(`Failed to convert ${file}:`, error);
        // Continue with next file
        continue;
      }
    }
    
    console.log('PDF conversion process completed!');
  } catch (error) {
    console.error('Error converting PDFs:', error);
    process.exit(1);
  }
}

// Make sure we're using the right version of PDF.js
console.log('Using PDF.js version:', pdfjsLib.version);

convertAllPDFs(); 