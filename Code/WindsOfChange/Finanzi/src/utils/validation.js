import Joi from 'joi';

// Define validation schemas
const programSchema = Joi.object({
  name: Joi.string().required(),
  allocation: Joi.number().min(0).required()
});

const categorySchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  programs: Joi.array().items(programSchema).required()
});

const voteSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  recurrent: Joi.number().min(0).required(),
  capital: Joi.number().min(0).required(),
  categories: Joi.array().items(categorySchema).required()
});

const ministrySchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  votes: Joi.array().items(voteSchema).required()
});

const budgetDataSchema = Joi.object({
  ministries: Joi.array().items(ministrySchema).required()
});

// Validation functions
export const validateBudgetData = (data) => {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data structure');
    return false;
  }

  if (!data.name || typeof data.name !== 'string') {
    console.error('Invalid ministry name');
    return false;
  }

  if (!data.code || typeof data.code !== 'string') {
    console.error('Invalid ministry code');
    return false;
  }

  if (!Array.isArray(data.votes)) {
    console.error('Invalid votes array');
    return false;
  }

  for (const vote of data.votes) {
    if (!vote.name || typeof vote.name !== 'string') {
      console.error('Invalid vote name');
      return false;
    }

    if (typeof vote.recurrent !== 'number' || typeof vote.capital !== 'number') {
      console.error('Invalid vote amounts');
      return false;
    }

    if (!Array.isArray(vote.categories)) {
      console.error('Invalid categories array');
      return false;
    }

    for (const category of vote.categories) {
      if (!category.name || typeof category.name !== 'string') {
        console.error('Invalid category name');
        return false;
      }

      if (typeof category.amount !== 'number') {
        console.error('Invalid category amount');
        return false;
      }
    }
  }

  return true;
};

export const validateMinistryData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Validate ministry structure
  if (!data.ministry || !data.ministry.name || !data.ministry.code) return false;
  
  // Validate total budget structure
  const totalBudget = data.ministry.totalBudget;
  if (!totalBudget || !totalBudget.recurrent || !totalBudget.capital) return false;
  
  // Validate votes array
  if (!Array.isArray(data.votes)) return false;
  
  // Validate each vote
  for (const vote of data.votes) {
    if (!vote.name || !vote.code) return false;
    if (!vote.recurrent || !vote.capital) return false;
    if (!Array.isArray(vote.categories)) return false;
    
    // Validate categories
    for (const category of vote.categories) {
      if (!category.name || !category.code) return false;
      if (!Array.isArray(category.programs)) return false;
      
      // Validate programs
      for (const program of category.programs) {
        if (!program.name || !program.code) return false;
      }
    }
  }
  
  return true;
};

export const validateVoteData = (data) => {
  return voteSchema.validate(data, { abortEarly: false });
};

// Helper functions for data integrity checks
export const checkTotals = (ministry) => {
  const errors = [];
  
  // Check vote totals
  ministry.votes.forEach(vote => {
    const categoryTotal = vote.categories.reduce((sum, cat) => sum + cat.amount, 0);
    const voteTotal = vote.recurrent + vote.capital;
    
    if (Math.abs(categoryTotal - voteTotal) > 0.01) {
      errors.push(`Vote ${vote.code} total mismatch: categories sum to ${categoryTotal} but vote total is ${voteTotal}`);
    }
    
    // Check program allocations
    vote.categories.forEach(category => {
      const programTotal = category.programs.reduce((sum, prog) => sum + prog.allocation, 0);
      if (Math.abs(programTotal - category.amount) > 0.01) {
        errors.push(`Category ${category.name} total mismatch: programs sum to ${programTotal} but category amount is ${category.amount}`);
      }
    });
  });
  
  return errors;
};

export const checkDataConsistency = (data) => {
  const validation = validateBudgetData(data);
  if (validation.error) {
    return {
      isValid: false,
      errors: validation.error.details.map(detail => detail.message)
    };
  }
  
  const integrityErrors = data.ministries.flatMap(checkTotals);
  
  return {
    isValid: integrityErrors.length === 0,
    errors: integrityErrors
  };
};

/**
 * Validate a single ministry object
 * @param {Object} ministry - The ministry object to validate
 * @returns {boolean} - Whether the ministry is valid
 */
const validateMinistry = (ministry) => {
  const requiredFields = ['id', 'name', 'code', 'totalBudget'];
  for (const field of requiredFields) {
    if (!(field in ministry)) {
      console.error(`Missing required field ${field} in ministry`);
      return false;
    }
  }

  if (typeof ministry.id !== 'number' || ministry.id <= 0) {
    console.error(`Invalid ministry ID: ${ministry.id}`);
    return false;
  }

  if (typeof ministry.name !== 'string' || ministry.name.trim() === '') {
    console.error(`Invalid ministry name: ${ministry.name}`);
    return false;
  }

  if (typeof ministry.code !== 'string' || !ministry.code.match(/^M\d+$/)) {
    console.error(`Invalid ministry code: ${ministry.code}`);
    return false;
  }

  if (typeof ministry.totalBudget !== 'number' || ministry.totalBudget < 0) {
    console.error(`Invalid ministry total budget: ${ministry.totalBudget}`);
    return false;
  }

  return true;
};

/**
 * Validate a single vote object
 * @param {Object} vote - The vote object to validate
 * @returns {boolean} - Whether the vote is valid
 */
const validateVote = (vote) => {
  const requiredFields = ['name', 'code', 'recurrent', 'capital'];
  for (const field of requiredFields) {
    if (!(field in vote)) {
      console.error(`Missing required field ${field} in vote`);
      return false;
    }
  }

  if (typeof vote.name !== 'string' || vote.name.trim() === '') {
    console.error(`Invalid vote name: ${vote.name}`);
    return false;
  }

  if (typeof vote.code !== 'string' || !vote.code.match(/^V\d+$/)) {
    console.error(`Invalid vote code: ${vote.code}`);
    return false;
  }

  // Validate recurrent and capital amounts for each year
  const years = ['2023', '2024', '2025'];
  for (const year of years) {
    if (!(year in vote.recurrent) || !(year in vote.capital)) {
      console.error(`Missing year ${year} in vote financial data`);
      return false;
    }

    if (typeof vote.recurrent[year] !== 'number' || vote.recurrent[year] < 0) {
      console.error(`Invalid recurrent amount for year ${year}: ${vote.recurrent[year]}`);
      return false;
    }

    if (typeof vote.capital[year] !== 'number' || vote.capital[year] < 0) {
      console.error(`Invalid capital amount for year ${year}: ${vote.capital[year]}`);
      return false;
    }
  }

  return true;
};

/**
 * Validate a single category object
 * @param {Object} category - The category object to validate
 * @returns {boolean} - Whether the category is valid
 */
const validateCategory = (category) => {
  if (!category || typeof category !== 'object') return false;
  
  const requiredFields = ['name', 'amount', 'programs'];
  if (!requiredFields.every(field => field in category)) return false;
  
  if (typeof category.amount !== 'number') return false;
  
  return Array.isArray(category.programs) && category.programs.every(validateProgram);
};

/**
 * Validate a single program object
 * @param {Object} program - The program object to validate
 * @returns {boolean} - Whether the program is valid
 */
const validateProgram = (program) => {
  if (!program || typeof program !== 'object') return false;
  
  const requiredFields = ['name', 'description', 'allocation'];
  if (!requiredFields.every(field => field in program)) return false;
  
  return typeof program.allocation === 'number';
};

/**
 * Get validation errors for a ministry
 * @param {Object} ministry - The ministry object to validate
 * @returns {string[]} - Array of validation errors
 */
export const getMinistryValidationErrors = (ministry) => {
  const errors = [];

  if (!ministry.id || typeof ministry.id !== 'number') {
    errors.push('Invalid ministry ID');
  }

  if (!ministry.name || typeof ministry.name !== 'string') {
    errors.push('Invalid ministry name');
  }

  if (!ministry.code || typeof ministry.code !== 'string') {
    errors.push('Invalid ministry code');
  }

  if (!Array.isArray(ministry.votes)) {
    errors.push('Invalid votes array');
  } else {
    for (const vote of ministry.votes) {
      const voteErrors = getVoteValidationErrors(vote);
      if (voteErrors.length > 0) {
        errors.push(`Vote ${vote.code || 'unknown'}: ${voteErrors.join(', ')}`);
      }
    }
  }

  return errors;
};

/**
 * Get validation errors for a vote
 * @param {Object} vote - The vote object to validate
 * @returns {string[]} - Array of validation errors
 */
const getVoteValidationErrors = (vote) => {
  const errors = [];

  if (!vote.name || typeof vote.name !== 'string') {
    errors.push('Invalid vote name');
  }

  if (!vote.code || typeof vote.code !== 'string') {
    errors.push('Invalid vote code');
  }

  if (!vote.recurrent || typeof vote.recurrent !== 'object') {
    errors.push('Invalid recurrent data');
  } else {
    for (const year of ['2023', '2024', '2025']) {
      if (typeof vote.recurrent[year] !== 'number') {
        errors.push(`Invalid recurrent amount for ${year}`);
      }
    }
  }

  if (!vote.capital || typeof vote.capital !== 'object') {
    errors.push('Invalid capital data');
  } else {
    for (const year of ['2023', '2024', '2025']) {
      if (typeof vote.capital[year] !== 'number') {
        errors.push(`Invalid capital amount for ${year}`);
      }
    }
  }

  if (!Array.isArray(vote.categories)) {
    errors.push('Invalid categories array');
  } else {
    for (const category of vote.categories) {
      const categoryErrors = getCategoryValidationErrors(category);
      if (categoryErrors.length > 0) {
        errors.push(`Category ${category.name || 'unknown'}: ${categoryErrors.join(', ')}`);
      }
    }
  }

  return errors;
};

/**
 * Get validation errors for a category
 * @param {Object} category - The category object to validate
 * @returns {string[]} - Array of validation errors
 */
const getCategoryValidationErrors = (category) => {
  const errors = [];

  if (!category.name || typeof category.name !== 'string') {
    errors.push('Invalid category name');
  }

  if (typeof category.amount !== 'number') {
    errors.push('Invalid category amount');
  }

  if (!Array.isArray(category.programs)) {
    errors.push('Invalid programs array');
  } else {
    for (const program of category.programs) {
      const programErrors = getProgramValidationErrors(program);
      if (programErrors.length > 0) {
        errors.push(`Program ${program.name || 'unknown'}: ${programErrors.join(', ')}`);
      }
    }
  }

  return errors;
};

/**
 * Get validation errors for a program
 * @param {Object} program - The program object to validate
 * @returns {string[]} - Array of validation errors
 */
const getProgramValidationErrors = (program) => {
  const errors = [];

  if (!program.name || typeof program.name !== 'string') {
    errors.push('Invalid program name');
  }

  if (!program.description || typeof program.description !== 'string') {
    errors.push('Invalid program description');
  }

  if (typeof program.allocation !== 'number') {
    errors.push('Invalid program allocation');
  }

  return errors;
};

/**
 * Validate abstract data structure
 * @param {Object} data - The abstract data to validate
 * @returns {boolean} - Whether the data is valid
 */
export const validateAbstractData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Validate total revenue and expenditure
  if (!data.totalRevenue || !data.totalExpenditure) return false;
  
  // Validate ministry data array
  if (!Array.isArray(data.ministryData)) return false;
  
  // Validate each ministry entry
  for (const ministry of data.ministryData) {
    if (!ministry.name || !ministry.code) return false;
    if (!ministry.recurrent || !ministry.capital) return false;
  }
  
  return true;
};

/**
 * Cross-reference ministry data with abstract data
 * @param {Object} ministryData - The ministry-specific data
 * @param {Object} abstractData - The abstract data
 * @returns {boolean} - Whether the data matches
 */
export const crossReferenceData = (ministryData, abstractData) => {
  if (!ministryData || !abstractData) return false;
  
  // Find matching ministry in abstract data
  const abstractMinistry = abstractData.ministryData.find(
    m => m.code === ministryData.ministry.code
  );
  
  if (!abstractMinistry) return false;
  
  // Compare total budgets
  const ministryTotalRecurrent = ministryData.ministry.totalBudget.recurrent.estimate;
  const ministryTotalCapital = ministryData.ministry.totalBudget.capital.estimate;
  
  const abstractTotalRecurrent = abstractMinistry.recurrent.estimate;
  const abstractTotalCapital = abstractMinistry.capital.estimate;
  
  // Allow for small rounding differences
  const tolerance = 0.01;
  const recurrentMatch = Math.abs(ministryTotalRecurrent - abstractTotalRecurrent) / abstractTotalRecurrent < tolerance;
  const capitalMatch = Math.abs(ministryTotalCapital - abstractTotalCapital) / abstractTotalCapital < tolerance;
  
  return recurrentMatch && capitalMatch;
};

/**
 * Validate financial data consistency
 * @param {Object} data - The data to validate
 * @returns {boolean} - Whether the data is consistent
 */
export const validateFinancialConsistency = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Calculate total from votes
  const totalFromVotes = {
    recurrent: {
      actual: 0,
      estimate: 0,
      projections: []
    },
    capital: {
      actual: 0,
      estimate: 0,
      projections: []
    }
  };
  
  // Sum up all vote amounts
  for (const vote of data.votes) {
    totalFromVotes.recurrent.actual += vote.recurrent.actual;
    totalFromVotes.recurrent.estimate += vote.recurrent.estimate;
    totalFromVotes.capital.actual += vote.capital.actual;
    totalFromVotes.capital.estimate += vote.capital.estimate;
    
    // Handle projections
    for (let i = 0; i < vote.recurrent.projections.length; i++) {
      if (!totalFromVotes.recurrent.projections[i]) {
        totalFromVotes.recurrent.projections[i] = 0;
      }
      totalFromVotes.recurrent.projections[i] += vote.recurrent.projections[i];
    }
    
    for (let i = 0; i < vote.capital.projections.length; i++) {
      if (!totalFromVotes.capital.projections[i]) {
        totalFromVotes.capital.projections[i] = 0;
      }
      totalFromVotes.capital.projections[i] += vote.capital.projections[i];
    }
  }
  
  // Compare with ministry totals
  const tolerance = 0.01;
  const ministryTotal = data.ministry.totalBudget;
  
  const recurrentActualMatch = Math.abs(totalFromVotes.recurrent.actual - ministryTotal.recurrent.actual) / ministryTotal.recurrent.actual < tolerance;
  const recurrentEstimateMatch = Math.abs(totalFromVotes.recurrent.estimate - ministryTotal.recurrent.estimate) / ministryTotal.recurrent.estimate < tolerance;
  const capitalActualMatch = Math.abs(totalFromVotes.capital.actual - ministryTotal.capital.actual) / ministryTotal.capital.actual < tolerance;
  const capitalEstimateMatch = Math.abs(totalFromVotes.capital.estimate - ministryTotal.capital.estimate) / ministryTotal.capital.estimate < tolerance;
  
  // Check projections
  const projectionsMatch = ministryTotal.recurrent.projections.every((value, index) => {
    return Math.abs(value - totalFromVotes.recurrent.projections[index]) / value < tolerance;
  }) && ministryTotal.capital.projections.every((value, index) => {
    return Math.abs(value - totalFromVotes.capital.projections[index]) / value < tolerance;
  });
  
  return recurrentActualMatch && recurrentEstimateMatch && 
         capitalActualMatch && capitalEstimateMatch && 
         projectionsMatch;
}; 