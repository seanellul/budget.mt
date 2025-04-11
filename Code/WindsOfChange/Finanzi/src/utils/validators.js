import { z } from 'zod';

/**
 * Zod schema for yearly amounts
 */
const YearlyAmountSchema = z.object({
  2023: z.number().min(0),
  2024: z.number().min(0),
  2025: z.number().min(0)
});

/**
 * Zod schema for measures
 */
const MeasureSchema = z.object({
  description: z.string().min(1),
  allocation: z.number().min(0),
  status: z.enum(['ongoing', 'new', 'completed'])
});

/**
 * Zod schema for programs
 */
const ProgramSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  allocation: z.number().min(0),
  measures: z.array(MeasureSchema)
});

/**
 * Zod schema for categories
 */
const CategorySchema = z.object({
  name: z.string().min(1),
  amount: z.number().min(0),
  percentage: z.number().min(0).max(100),
  programs: z.array(ProgramSchema)
});

/**
 * Zod schema for votes
 */
const VoteSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  recurrent: YearlyAmountSchema,
  capital: YearlyAmountSchema,
  total: z.number().min(0),
  categories: z.array(CategorySchema)
});

/**
 * Zod schema for ministry data
 */
const MinistrySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  code: z.string().min(1),
  totalBudget: z.number().min(0),
  votes: z.array(VoteSchema)
});

/**
 * Validates ministry data against schema
 * @param {Object} data - Ministry data to validate
 * @returns {Object} - Validation result
 */
export function validateMinistryData(data) {
  try {
    MinistrySchema.parse(data);
    return {
      isValid: true,
      errors: null
    };
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors
    };
  }
}

/**
 * Validates financial totals
 * @param {Object} data - Ministry data to validate
 * @returns {Object} - Validation result
 */
export function validateFinancialTotals(data) {
  const errors = [];
  
  // Validate ministry total budget
  const calculatedTotalBudget = data.votes.reduce((total, vote) => total + vote.total, 0);
  if (Math.abs(calculatedTotalBudget - data.totalBudget) > 0.01) {
    errors.push({
      type: 'TOTAL_MISMATCH',
      message: 'Ministry total budget does not match sum of votes',
      expected: data.totalBudget,
      calculated: calculatedTotalBudget
    });
  }
  
  // Validate vote totals
  data.votes.forEach((vote, index) => {
    // Validate vote total matches sum of recurrent and capital
    const voteTotal = Object.values(vote.recurrent)[2] + Object.values(vote.capital)[2]; // 2025 values
    if (Math.abs(voteTotal - vote.total) > 0.01) {
      errors.push({
        type: 'VOTE_TOTAL_MISMATCH',
        message: `Vote ${vote.name} total does not match sum of recurrent and capital`,
        voteIndex: index,
        expected: vote.total,
        calculated: voteTotal
      });
    }
    
    // Validate categories total matches vote total
    const categoriesTotal = vote.categories.reduce((total, cat) => total + cat.amount, 0);
    if (Math.abs(categoriesTotal - vote.total) > 0.01) {
      errors.push({
        type: 'CATEGORIES_TOTAL_MISMATCH',
        message: `Vote ${vote.name} categories total does not match vote total`,
        voteIndex: index,
        expected: vote.total,
        calculated: categoriesTotal
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates historical data consistency
 * @param {Object} data - Ministry data to validate
 * @returns {Object} - Validation result
 */
export function validateHistoricalData(data) {
  const errors = [];
  
  data.votes.forEach((vote, voteIndex) => {
    // Check if all years are present
    const years = ['2023', '2024', '2025'];
    years.forEach(year => {
      if (typeof vote.recurrent[year] !== 'number') {
        errors.push({
          type: 'MISSING_YEAR_DATA',
          message: `Missing recurrent data for year ${year} in vote ${vote.name}`,
          voteIndex,
          year
        });
      }
      if (typeof vote.capital[year] !== 'number') {
        errors.push({
          type: 'MISSING_YEAR_DATA',
          message: `Missing capital data for year ${year} in vote ${vote.name}`,
          voteIndex,
          year
        });
      }
    });
    
    // Check for unreasonable year-over-year changes (e.g., >100% increase or >50% decrease)
    const checkYearOverYear = (type, amounts) => {
      for (let i = 1; i < years.length; i++) {
        const prevYear = amounts[years[i - 1]];
        const currYear = amounts[years[i]];
        const change = ((currYear - prevYear) / prevYear) * 100;
        
        if (change > 100 || change < -50) {
          errors.push({
            type: 'SUSPICIOUS_CHANGE',
            message: `Suspicious ${type} change between ${years[i-1]} and ${years[i]} in vote ${vote.name}`,
            voteIndex,
            yearFrom: years[i-1],
            yearTo: years[i],
            changePercent: change
          });
        }
      }
    };
    
    checkYearOverYear('recurrent', vote.recurrent);
    checkYearOverYear('capital', vote.capital);
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Performs comprehensive validation of ministry data
 * @param {Object} data - Ministry data to validate
 * @returns {Object} - Validation result
 */
export function validateAll(data) {
  const schemaValidation = validateMinistryData(data);
  if (!schemaValidation.isValid) {
    return schemaValidation;
  }
  
  const financialValidation = validateFinancialTotals(data);
  const historicalValidation = validateHistoricalData(data);
  
  const allErrors = [
    ...(financialValidation.errors || []),
    ...(historicalValidation.errors || [])
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
} 