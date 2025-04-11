import * as pdfjsLib from 'pdfjs-dist/build/pdf.js';
import { validateMinistryData } from './validation.js';
import fs from 'fs/promises';

// Disable worker to run in Node.js
pdfjsLib.GlobalWorkerOptions.disableWorker = true;

/**
 * Process a ministry PDF to extract budget data
 * @param {string} pdfPath - Path to the ministry PDF file
 * @returns {Promise<Object>} - Processed ministry data
 */
export async function processMinistryPDF(pdfPath) {
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
    const ministryData = parseMinistryData(fullText);
    
    // Validate the data
    if (!validateMinistryData(ministryData)) {
      throw new Error('Ministry data validation failed');
    }

    return ministryData;
  } catch (error) {
    console.error('Error processing ministry PDF:', error);
    throw error;
  }
}

/**
 * Parse the ministry data from text
 * @param {string} text - Extracted text from PDF
 * @returns {Object} - Parsed ministry data
 */
function parseMinistryData(text) {
  const lines = text.split('\n');
  const data = {
    ministry: {
      name: '',
      code: '',
      totalBudget: {
        recurrent: { actual: 0, estimate: 0, projections: [] },
        capital: { actual: 0, estimate: 0, projections: [] }
      }
    },
    votes: []
  };

  let currentVote = null;
  let currentCategory = null;

  for (const line of lines) {
    // Extract ministry name and code
    if (line.match(/^MINISTRY OF/i)) {
      data.ministry.name = line.trim();
      data.ministry.code = extractCode(line);
    }

    // Extract total budget
    if (line.includes('Total Budget')) {
      if (line.includes('Recurrent')) {
        data.ministry.totalBudget.recurrent = extractAmounts(line);
      }
      if (line.includes('Capital')) {
        data.ministry.totalBudget.capital = extractAmounts(line);
      }
    }

    // Extract vote data
    if (line.match(/^VOTE/i)) {
      if (currentVote) {
        data.votes.push(currentVote);
      }
      currentVote = {
        name: line.trim(),
        code: extractCode(line),
        recurrent: { actual: 0, estimate: 0, projections: [] },
        capital: { actual: 0, estimate: 0, projections: [] },
        categories: []
      };
    }

    // Extract vote amounts
    if (currentVote) {
      if (line.includes('Recurrent')) {
        currentVote.recurrent = extractAmounts(line);
      }
      if (line.includes('Capital')) {
        currentVote.capital = extractAmounts(line);
      }

      // Extract category data
      if (line.match(/^\d{2}\s/)) { // Category lines start with a two-digit number
        if (currentCategory) {
          currentVote.categories.push(currentCategory);
        }
        currentCategory = {
          name: line.trim(),
          code: extractCode(line),
          amount: 0,
          programs: []
        };
      }

      // Extract program data
      if (line.match(/^\d{4}\s/)) { // Program lines start with a four-digit number
        if (currentCategory) {
          currentCategory.programs.push({
            name: line.trim(),
            code: extractCode(line),
            description: '',
            allocation: extractAmount(line)
          });
        }
      }
    }
  }

  // Add the last vote and category
  if (currentCategory) {
    currentVote.categories.push(currentCategory);
  }
  if (currentVote) {
    data.votes.push(currentVote);
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
 * Extract a single amount from a line
 * @param {string} line - Line containing amount
 * @returns {number} - Extracted amount
 */
function extractAmount(line) {
  const match = line.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
  return match ? parseAmount(match[1]) : 0;
}

/**
 * Parse amount string to number
 * @param {string} amount - Amount string
 * @returns {number} - Parsed amount
 */
function parseAmount(amount) {
  return parseFloat(amount.replace(/,/g, '')) || 0;
} 