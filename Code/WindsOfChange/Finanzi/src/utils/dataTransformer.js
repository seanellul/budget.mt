/**
 * Data transformer utility for converting raw PDF data into application data structure
 */

import { validateBudgetData } from './validation.js';

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-MT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Transforms raw ministry data into the application data structure
 * @param {Object} rawData - Raw data extracted from PDF
 * @returns {Object} - Transformed ministry data
 */
export const transformMinistryData = (rawData) => {
  const transformed = {
    id: parseInt(rawData.code.replace(/\D/g, ''), 10),
    name: rawData.name.trim().replace(/\s+/g, ' '),
    code: rawData.code,
    totalBudget: 0,
    votes: rawData.votes.map(vote => {
      const voteTotal = vote.recurrent + vote.capital;
      return {
        name: vote.name.trim().replace(/\s+/g, ' '),
        code: vote.code,
        recurrent: vote.recurrent,
        capital: vote.capital,
        total: voteTotal,
        categories: vote.categories.map(category => ({
          name: category.name.trim().replace(/\s+/g, ' '),
          amount: category.amount,
          percentage: (category.amount / voteTotal) * 100,
          programs: [] // We'll add program data in a future iteration
        }))
      };
    })
  };

  // Calculate total budget
  transformed.totalBudget = transformed.votes.reduce((total, vote) => total + vote.total, 0);

  return transformed;
};

/**
 * Extracts ministry ID from ministry code
 * @param {string} code - Ministry code
 * @returns {number} - Ministry ID
 */
function extractMinistryId(code) {
  const match = code.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Calculates total budget from votes
 * @param {Array} votes - Array of votes
 * @returns {number} - Total budget
 */
function calculateTotalBudget(votes) {
  return votes.reduce((total, vote) => {
    const voteTotal = (vote.recurrent?.['2025'] || 0) + (vote.capital?.['2025'] || 0);
    return total + voteTotal;
  }, 0);
}

/**
 * Transforms vote data
 * @param {Array} votes - Array of raw vote data
 * @returns {Array} - Transformed votes
 */
function transformVotes(votes) {
  return votes.map(vote => ({
    name: vote.name,
    code: vote.code,
    recurrent: transformYearlyAmount(vote.recurrent),
    capital: transformYearlyAmount(vote.capital),
    total: calculateVoteTotal(vote),
    categories: transformCategories(vote.categories)
  }));
}

/**
 * Transforms yearly amount data
 * @param {Object} amount - Raw yearly amount data
 * @returns {Object} - Transformed yearly amount
 */
function transformYearlyAmount(amount) {
  return {
    2023: normalizeAmount(amount?.['2023']),
    2024: normalizeAmount(amount?.['2024']),
    2025: normalizeAmount(amount?.['2025'])
  };
}

/**
 * Calculates total for a vote
 * @param {Object} vote - Vote data
 * @returns {number} - Vote total
 */
function calculateVoteTotal(vote) {
  const recurrent2025 = vote.recurrent?.['2025'] || 0;
  const capital2025 = vote.capital?.['2025'] || 0;
  return recurrent2025 + capital2025;
}

/**
 * Transforms category data
 * @param {Array} categories - Array of raw category data
 * @returns {Array} - Transformed categories
 */
function transformCategories(categories = []) {
  return categories.map(category => ({
    name: category.name,
    amount: normalizeAmount(category.amount),
    percentage: calculatePercentage(category.amount, category.total),
    programs: transformPrograms(category.programs)
  }));
}

/**
 * Transforms program data
 * @param {Array} programs - Array of raw program data
 * @returns {Array} - Transformed programs
 */
function transformPrograms(programs = []) {
  return programs.map(program => ({
    name: program.name,
    description: program.description,
    allocation: normalizeAmount(program.allocation),
    measures: transformMeasures(program.measures)
  }));
}

/**
 * Transforms measure data
 * @param {Array} measures - Array of raw measure data
 * @returns {Array} - Transformed measures
 */
function transformMeasures(measures = []) {
  return measures.map(measure => ({
    description: measure.description,
    allocation: normalizeAmount(measure.allocation),
    status: normalizeMeasureStatus(measure.status)
  }));
}

/**
 * Normalizes amount values
 * @param {number|string} amount - Raw amount value
 * @returns {number} - Normalized amount
 */
function normalizeAmount(amount) {
  if (typeof amount === 'number') {
    return amount;
  }
  if (typeof amount === 'string') {
    // Remove currency symbols and commas, then convert to number
    return parseFloat(amount.replace(/[€,]/g, '')) || 0;
  }
  return 0;
}

/**
 * Calculates percentage
 * @param {number} amount - Amount value
 * @param {number} total - Total value
 * @returns {number} - Calculated percentage
 */
function calculatePercentage(amount, total) {
  if (!total) return 0;
  return (amount / total) * 100;
}

/**
 * Normalizes measure status
 * @param {string} status - Raw status value
 * @returns {string} - Normalized status
 */
function normalizeMeasureStatus(status) {
  const normalized = status?.toLowerCase()?.trim() || '';
  if (['ongoing', 'new', 'completed'].includes(normalized)) {
    return normalized;
  }
  return 'ongoing';
}

/**
 * Validates transformed data
 * @param {Object} data - Transformed data
 * @returns {boolean} - Validation result
 */
export function validateTransformedData(data) {
  // Ensure required fields are present
  if (!data.id || !data.name || !data.code) {
    return false;
  }
  
  // Validate votes
  if (!Array.isArray(data.votes)) {
    return false;
  }
  
  // Validate total budget
  const calculatedTotal = calculateTotalBudget(data.votes);
  if (Math.abs(calculatedTotal - data.totalBudget) > 0.01) {
    return false;
  }
  
  return true;
}

/**
 * Calculate totals for a ministry
 * @param {Object} ministry - The ministry data
 * @returns {Object} - Totals object with recurrent, capital, and total budget
 */
export const calculateMinistryTotals = (ministry) => {
  const totalRecurrent = ministry.votes.reduce((sum, vote) => sum + vote.recurrent, 0);
  const totalCapital = ministry.votes.reduce((sum, vote) => sum + vote.capital, 0);
  const totalBudget = totalRecurrent + totalCapital;

  return {
    totalRecurrent,
    totalCapital,
    totalBudget,
    formatted: {
      totalRecurrent: formatCurrency(totalRecurrent),
      totalCapital: formatCurrency(totalCapital),
      totalBudget: formatCurrency(totalBudget)
    }
  };
};

/**
 * Calculate totals for ministries and votes
 * @param {Object} data - The budget data
 * @returns {Object} - Budget data with calculated totals
 */
export const calculateTotals = (data) => {
  for (const ministry of data.ministries) {
    ministry.totalBudget = {
      2023: 0,
      2024: 0,
      2025: 0
    };

    for (const vote of ministry.votes) {
      for (const year of ['2023', '2024', '2025']) {
        const total = vote.recurrent[year] + vote.capital[year];
        vote.total = vote.total || {};
        vote.total[year] = total;
        ministry.totalBudget[year] += total;
      }

      for (const category of vote.categories) {
        category.total = category.programs.reduce((sum, program) => sum + program.allocation, 0);
      }
    }
  }

  return data;
};

/**
 * Calculate percentages for a ministry's data
 * @param {Object} ministry - Ministry data
 * @returns {Object} - Ministry data with percentages
 */
export const calculatePercentages = (ministry) => {
  const total = ministry.totalBudget;
  
  return {
    ...ministry,
    votes: ministry.votes.map(vote => ({
      ...vote,
      percentage: (vote.total / total) * 100,
      categories: vote.categories.map(category => ({
        ...category,
        percentage: (category.amount / vote.total) * 100
      }))
    }))
  };
};

export const transformForCharts = (ministry) => {
  return {
    votes: ministry.votes.map(vote => ({
      name: vote.name,
      recurrent: vote.recurrent,
      capital: vote.capital
    })),
    categories: ministry.votes.flatMap(vote => 
      vote.categories.map(category => ({
        name: category.name,
        amount: category.amount,
        vote: vote.name
      }))
    )
  };
};

/**
 * Transform raw PDF text into structured budget data
 * @param {string} text - The raw text extracted from PDF
 * @returns {Object} - Structured budget data
 */
export const transformPDFText = (text) => {
  const lines = text.split('\n');
  const data = {
    ministries: []
  };

  let currentMinistry = null;
  let currentVote = null;
  let currentCategory = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Ministry detection
    if (line.match(/^MINISTRY OF/i)) {
      currentMinistry = {
        id: data.ministries.length + 1,
        name: line,
        code: extractCode(line),
        votes: []
      };
      data.ministries.push(currentMinistry);
      continue;
    }

    // Vote detection
    if (line.match(/^VOTE/i)) {
      if (currentMinistry) {
        currentVote = {
          name: line,
          code: extractCode(line),
          recurrent: {
            2023: 0,
            2024: 0,
            2025: 0
          },
          capital: {
            2023: 0,
            2024: 0,
            2025: 0
          },
          categories: []
        };
        currentMinistry.votes.push(currentVote);
      }
      continue;
    }

    // Category detection
    if (line.match(/^[A-Z\s]+$/)) {
      if (currentVote) {
        currentCategory = {
          name: line,
          amount: 0,
          programs: []
        };
        currentVote.categories.push(currentCategory);
      }
      continue;
    }

    // Program detection
    if (line.match(/^\d+\./)) {
      if (currentCategory) {
        const program = {
          name: line.replace(/^\d+\.\s*/, ''),
          description: '',
          allocation: 0
        };
        currentCategory.programs.push(program);
      }
      continue;
    }

    // Financial data detection
    if (line.match(/^\d{4}/)) {
      const [year, recurrent, capital] = line.split(/\s+/);
      if (currentVote && year && recurrent && capital) {
        currentVote.recurrent[year] = parseAmount(recurrent);
        currentVote.capital[year] = parseAmount(capital);
      }
      continue;
    }

    // Program description
    if (currentCategory && currentCategory.programs.length > 0) {
      const lastProgram = currentCategory.programs[currentCategory.programs.length - 1];
      if (!lastProgram.description) {
        lastProgram.description = line;
      }
    }
  }

  return data;
};

/**
 * Extract code from a line of text
 * @param {string} text - The text to extract code from
 * @returns {string} - The extracted code
 */
const extractCode = (text) => {
  const match = text.match(/\(([A-Z0-9]+)\)/);
  return match ? match[1] : '';
};

/**
 * Parse amount string into number
 * @param {string} amount - The amount string to parse
 * @returns {number} - The parsed amount
 */
const parseAmount = (amount) => {
  return parseFloat(amount.replace(/[^0-9.-]+/g, '')) || 0;
};

// Combine multiple PDF data sets
export const combinePDFData = (pdfDataSets) => {
  const combined = {};
  
  for (const dataSet of pdfDataSets) {
    for (const ministry of dataSet) {
      if (!combined[ministry.code]) {
        combined[ministry.code] = ministry;
      } else {
        // Merge votes if they don't exist
        for (const vote of ministry.votes) {
          const existingVote = combined[ministry.code].votes.find(v => v.code === vote.code);
          if (!existingVote) {
            combined[ministry.code].votes.push(vote);
          }
        }
      }
    }
  }

  return Object.values(combined);
}; 