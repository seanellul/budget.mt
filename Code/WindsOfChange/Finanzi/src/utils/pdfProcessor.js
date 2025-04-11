import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';

// Import PDF.js
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');
const pdfjsWorker = require('pdfjs-dist/es5/build/pdf.worker.js');

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Process a PDF file and extract structured budget data
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} - Structured budget data
 */
export const processPDF = async (filePath) => {
  try {
    // Read the PDF file
    const data = await fs.readFile(filePath);
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(data));
    const pdf = await loadingTask.promise;
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      fullText += pageText + '\n';
    }

    // Parse the text into structured data
    return parsePDFText(fullText);
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
};

/**
 * Parse PDF text into structured data
 * @param {string} text - Extracted PDF text
 * @returns {Object} - Structured budget data
 */
function parsePDFText(text) {
  const lines = text.split('\n');
  const data = {
    name: '',
    code: '',
    votes: []
  };

  let currentVote = null;
  let currentCategory = null;

  for (const line of lines) {
    // Extract ministry name and code
    if (line.includes('Ministry')) {
      data.name = line.trim();
      const codeMatch = line.match(/Vote\s+(\d+)/i);
      if (codeMatch) {
        data.code = codeMatch[1];
      }
    }

    // Start new vote
    if (line.match(/^Vote\s+\d+/i)) {
      if (currentVote) {
        data.votes.push(currentVote);
      }
      currentVote = {
        name: line.trim(),
        code: line.match(/Vote\s+(\d+)/i)?.[1] || '',
        recurrent: 0,
        capital: 0,
        categories: []
      };
    }

    // Extract financial data
    if (currentVote) {
      const amountMatch = line.match(/€\s*([\d,]+)/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (line.includes('Recurrent')) {
          currentVote.recurrent = amount;
        } else if (line.includes('Capital')) {
          currentVote.capital = amount;
        }
      }

      // Start new category
      if (line.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/)) {
        if (currentCategory) {
          currentVote.categories.push(currentCategory);
        }
        currentCategory = {
          name: line.trim(),
          amount: 0,
          programs: []
        };
      }

      // Extract category amount
      if (currentCategory && line.includes('€')) {
        const amountMatch = line.match(/€\s*([\d,]+)/);
        if (amountMatch) {
          currentCategory.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        }
      }
    }
  }

  // Add last vote and category
  if (currentCategory) {
    currentVote.categories.push(currentCategory);
  }
  if (currentVote) {
    data.votes.push(currentVote);
  }

  return data;
} 