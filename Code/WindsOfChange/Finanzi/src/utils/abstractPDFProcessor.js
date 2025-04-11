import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
import { validateAbstractData } from './validation.js';
import fs from 'fs/promises';

// Disable worker to run in Node.js
pdfjsLib.GlobalWorkerOptions.disableWorker = true;

/**
 * Process the abstract PDF to extract budget data
 * @param {string} pdfPath - Path to the abstract PDF file
 * @returns {Promise<Object>} - Processed abstract data
 */
export async function processAbstractPDF(pdfPath) {
  try {
    // Load the PDF document
    const data = await fs.readFile(pdfPath);
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
    const pdf = await loadingTask.promise;
    
    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }

    // Parse the extracted text
    const abstractData = parseAbstractData(fullText);
    
    // Validate the data
    if (!validateAbstractData(abstractData)) {
      throw new Error('Abstract data validation failed');
    }

    return abstractData;
  } catch (error) {
    console.error('Error processing abstract PDF:', error);
    throw error;
  }
}

/**
 * Parse the abstract data from text
 * @param {string} text - Extracted text from PDF
 * @returns {Object} - Parsed abstract data
 */
function parseAbstractData(text) {
  const lines = text.split('\n');
  const data = {
    totalRevenue: {
      actual: 0,
      estimate: 0,
      projections: []
    },
    totalExpenditure: {
      actual: 0,
      estimate: 0,
      projections: []
    },
    ministryData: []
  };

  let currentMinistry = null;

  for (const line of lines) {
    // Extract total revenue
    if (line.includes('Total Revenue')) {
      const amounts = extractAmounts(line);
      data.totalRevenue = amounts;
    }
    
    // Extract total expenditure
    if (line.includes('Total Expenditure')) {
      const amounts = extractAmounts(line);
      data.totalExpenditure = amounts;
    }

    // Extract ministry data
    if (line.match(/^MINISTRY OF/i)) {
      if (currentMinistry) {
        data.ministryData.push(currentMinistry);
      }
      currentMinistry = {
        name: line.trim(),
        code: extractCode(line),
        recurrent: { actual: 0, estimate: 0, projections: [] },
        capital: { actual: 0, estimate: 0, projections: [] }
      };
    }

    // Extract ministry amounts
    if (currentMinistry) {
      if (line.includes('Recurrent')) {
        currentMinistry.recurrent = extractAmounts(line);
      }
      if (line.includes('Capital')) {
        currentMinistry.capital = extractAmounts(line);
      }
    }
  }

  // Add the last ministry
  if (currentMinistry) {
    data.ministryData.push(currentMinistry);
  }

  return data;
}

/**
 * Extract amounts from a line
 * @param {string} line - Line containing amounts
 * @returns {Object} - Extracted amounts
 */
function extractAmounts(line) {
  const numbers = line.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g) || [];
  return {
    actual: parseAmount(numbers[0] || '0'),
    estimate: parseAmount(numbers[1] || '0'),
    projections: numbers.slice(2).map(parseAmount)
  };
}

/**
 * Extract code from a line
 * @param {string} line - Line containing code
 * @returns {string} - Extracted code
 */
function extractCode(line) {
  const match = line.match(/\(([A-Z0-9]+)\)/);
  return match ? match[1] : '';
}

/**
 * Parse amount string to number
 * @param {string} amount - Amount string
 * @returns {number} - Parsed amount
 */
function parseAmount(amount) {
  return parseFloat(amount.replace(/,/g, '')) || 0;
} 