import { processTextFile, extractMinistryDetails } from '../src/utils/textProcessor.js';
import fs from 'fs/promises';
import path from 'path';

const PDFS_DIR = path.join(process.cwd(), 'PDFS');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/processed');

/**
 * Organize all budget data into a structured format
 */
async function organizeData() {
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Process abstract first to get overall structure
    console.log('Processing abstract...');
    const abstractData = await processTextFile(path.join(PDFS_DIR, 'fe25 01 Abstracts final.txt'));
    
    // Create organized data structure
    const organizedData = {
      summary: abstractData.summary,
      ministries: {},
      votes: {},
      categories: {},
      years: {
        2023: { actual: true },
        2024: { estimate: true },
        2025: { estimate: true }
      }
    };

    // Process each ministry text file
    const files = await fs.readdir(PDFS_DIR);
    const textFiles = files.filter(file => 
      file.endsWith('.txt') && 
      !file.includes('Abstracts') &&
      !file.includes('Appendices')
    );

    console.log(`Processing ${textFiles.length} ministry files...`);
    
    for (const file of textFiles) {
      console.log(`Processing ${file}...`);
      const text = await fs.readFile(path.join(PDFS_DIR, file), 'utf-8');
      const ministryData = extractMinistryDetails(text);
      
      // Extract ministry code from filename
      const codeMatch = file.match(/fe25\s+(\d+)/);
      const code = codeMatch ? codeMatch[1] : null;
      
      if (code) {
        // Add ministry details
        organizedData.ministries[code] = {
          code,
          name: ministryData.name,
          votes: ministryData.votes.map(v => v.code),
          totalBudget: ministryData.votes.reduce((sum, v) => 
            sum + v.recurrent + v.capital, 0
          )
        };

        // Add vote details
        ministryData.votes.forEach(vote => {
          organizedData.votes[vote.code] = {
            code: vote.code,
            name: vote.name,
            ministry: code,
            recurrent: vote.recurrent,
            capital: vote.capital,
            total: vote.recurrent + vote.capital,
            categories: vote.categories.map(c => ({
              name: c.name,
              amount: c.amount
            }))
          };

          // Add category details
          vote.categories.forEach(category => {
            const categoryKey = category.name.toLowerCase();
            if (!organizedData.categories[categoryKey]) {
              organizedData.categories[categoryKey] = {
                name: category.name,
                totalAmount: 0,
                votes: []
              };
            }
            organizedData.categories[categoryKey].totalAmount += category.amount;
            organizedData.categories[categoryKey].votes.push({
              code: vote.code,
              amount: category.amount
            });
          });
        });
      }
    }

    // Save organized data
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'organized_data.json'),
      JSON.stringify(organizedData, null, 2)
    );

    // Create summary files for different views
    await createSummaryFiles(organizedData);

    console.log('Data organization complete!');
  } catch (error) {
    console.error('Error organizing data:', error);
    process.exit(1);
  }
}

/**
 * Create summary files for different data views
 * @param {Object} data - Organized data
 */
async function createSummaryFiles(data) {
  // Create ministry summary
  const ministrySummary = Object.values(data.ministries)
    .sort((a, b) => b.totalBudget - a.totalBudget)
    .map(ministry => ({
      ...ministry,
      voteCount: ministry.votes.length,
      percentageOfTotal: (ministry.totalBudget / data.summary.finance['total expenditure'][2025]) * 100
    }));

  // Create category summary
  const categorySummary = Object.values(data.categories)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .map(category => ({
      ...category,
      percentageOfTotal: (category.totalAmount / data.summary.finance['total expenditure'][2025]) * 100
    }));

  // Create vote summary
  const voteSummary = Object.values(data.votes)
    .sort((a, b) => b.total - a.total)
    .map(vote => ({
      ...vote,
      percentageOfTotal: (vote.total / data.summary.finance['total expenditure'][2025]) * 100
    }));

  // Save summary files
  await Promise.all([
    fs.writeFile(
      path.join(OUTPUT_DIR, 'ministry_summary.json'),
      JSON.stringify(ministrySummary, null, 2)
    ),
    fs.writeFile(
      path.join(OUTPUT_DIR, 'category_summary.json'),
      JSON.stringify(categorySummary, null, 2)
    ),
    fs.writeFile(
      path.join(OUTPUT_DIR, 'vote_summary.json'),
      JSON.stringify(voteSummary, null, 2)
    )
  ]);
}

organizeData(); 