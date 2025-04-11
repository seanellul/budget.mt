import fs from 'fs/promises';

/**
 * Process a budget text file and extract structured data
 * @param {string} filePath - Path to the text file
 * @returns {Promise<Object>} - Structured budget data
 */
export const processTextFile = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return parseText(text);
  } catch (error) {
    console.error('Error processing text file:', error);
    throw error;
  }
};

/**
 * Parse text content into structured data
 * @param {string} text - Text content to parse
 * @returns {Object} - Structured budget data
 */
function parseText(text) {
  const lines = text.split('\n');
  const data = {
    summary: {
      finance: {},
      revenue: {
        tax: {},
        nonTax: {},
        total: {}
      },
      expenditure: {
        recurrent: {},
        capital: {},
        total: {}
      }
    },
    ministries: new Map() // Use Map to avoid duplicates
  };

  let currentSection = null;
  let currentSubsection = null;

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;

    // Determine sections
    if (line.includes('Statement of Public Finance')) {
      currentSection = 'finance';
      continue;
    } else if (line.includes('Abstract of Revenue')) {
      currentSection = 'revenue';
      currentSubsection = null;
      continue;
    } else if (line.includes('Tax Revenue')) {
      currentSubsection = 'tax';
      continue;
    } else if (line.includes('Non-Tax Revenue')) {
      currentSubsection = 'nonTax';
      continue;
    } else if (line.includes('Abstract of Recurrent Expenditure')) {
      currentSection = 'expenditure';
      currentSubsection = 'recurrent';
      continue;
    } else if (line.includes('Abstract of Capital Expenditure')) {
      currentSection = 'expenditure';
      currentSubsection = 'capital';
      continue;
    }

    // Process Statement of Public Finance
    if (currentSection === 'finance') {
      const match = line.match(/([A-Za-z\s]+)\s+([\d,]+)\s+([\d,]+)/);
      if (match) {
        const [, item, value2024, value2025] = match;
        data.summary.finance[item.trim().toLowerCase()] = {
          2024: parseNumber(value2024),
          2025: parseNumber(value2025)
        };
      }
    }

    // Process Revenue
    if (currentSection === 'revenue' && currentSubsection) {
      const match = line.match(/([A-Za-z\s]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)/);
      if (match) {
        const [, item, actual2023, estimate2024, estimate2025] = match;
        const itemName = item.trim();
        data.summary.revenue[currentSubsection][itemName] = {
          actual2023: parseNumber(actual2023),
          estimate2024: parseNumber(estimate2024),
          estimate2025: parseNumber(estimate2025)
        };
      }
    }

    // Process Expenditure
    if (currentSection === 'expenditure' && currentSubsection) {
      const ministryMatch = line.match(/^(\d+)\s+(.+?)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)/);
      if (ministryMatch) {
        const [, code, name, actual2023, estimate2024, estimate2025] = ministryMatch;
        const ministryName = name.trim();
        
        // Get or create ministry entry
        let ministry = data.ministries.get(code) || {
          code,
          name: ministryName,
          expenditure: {
            recurrent: {},
            capital: {},
            total: {}
          }
        };

        // Update expenditure data
        ministry.expenditure[currentSubsection] = {
          actual2023: parseNumber(actual2023),
          estimate2024: parseNumber(estimate2024),
          estimate2025: parseNumber(estimate2025)
        };

        // Calculate totals
        ministry.expenditure.total = calculateTotals(ministry.expenditure);
        
        data.ministries.set(code, ministry);
      }
    }
  }

  // Convert Map to array for final output
  return {
    ...data,
    ministries: Array.from(data.ministries.values())
  };
}

/**
 * Parse number from string, handling thousands separators
 * @param {string} value - Number string to parse
 * @returns {number} - Parsed number
 */
function parseNumber(value) {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

/**
 * Calculate totals from recurrent and capital expenditure
 * @param {Object} expenditure - Expenditure object
 * @returns {Object} - Totals object
 */
function calculateTotals(expenditure) {
  return {
    actual2023: (expenditure.recurrent?.actual2023 || 0) + (expenditure.capital?.actual2023 || 0),
    estimate2024: (expenditure.recurrent?.estimate2024 || 0) + (expenditure.capital?.estimate2024 || 0),
    estimate2025: (expenditure.recurrent?.estimate2025 || 0) + (expenditure.capital?.estimate2025 || 0)
  };
}

/**
 * Extract ministry details from text
 * @param {string} text - Text content to parse
 * @returns {Object} - Ministry details
 */
export const extractMinistryDetails = (text) => {
  const lines = text.split('\n');
  const details = {
    name: '',
    votes: []
  };

  let currentVote = null;

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;

    // Extract ministry name
    if (line.includes('Ministry') && !line.includes('Vote')) {
      details.name = line.trim();
      continue;
    }

    // Match vote headers
    const voteMatch = line.match(/^Vote\s+(\d+)\s+(.+)/i);
    if (voteMatch) {
      if (currentVote) {
        details.votes.push(currentVote);
      }
      currentVote = {
        code: voteMatch[1],
        name: voteMatch[2].trim(),
        recurrent: 0,
        capital: 0,
        categories: []
      };
      continue;
    }

    // Match financial data
    const financeMatch = line.match(/Recurrent\s+€([\d,]+)|Capital\s+€([\d,]+)/i);
    if (financeMatch && currentVote) {
      if (financeMatch[1]) {
        currentVote.recurrent = parseNumber(financeMatch[1]);
      }
      if (financeMatch[2]) {
        currentVote.capital = parseNumber(financeMatch[2]);
      }
    }

    // Match categories
    const categoryMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+€([\d,]+)/);
    if (categoryMatch && currentVote) {
      currentVote.categories.push({
        name: categoryMatch[1].trim(),
        amount: parseNumber(categoryMatch[2])
      });
    }
  }

  // Add the last vote
  if (currentVote) {
    details.votes.push(currentVote);
  }

  return details;
}; 