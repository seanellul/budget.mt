import { processAbstractPDF } from '../utils/abstractPDFProcessor.js';
import { processMinistryPDF } from '../utils/ministryPDFProcessor.js';
import { validateMinistryData, validateAbstractData, crossReferenceData } from '../utils/validation.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Process all PDFs and generate the data structure
 */
async function processAllPDFs() {
  try {
    // Read the PDFs directory
    const pdfsDir = path.join(__dirname, '../../../PDFS');
    const files = await fs.readdir(pdfsDir);
    
    // Find abstract and ministry PDFs
    const abstractPDF = files.find(f => f.toLowerCase().includes('abstract'));
    const ministryPDFs = files.filter(f => 
      f.toLowerCase().includes('ministry') || 
      (f.toLowerCase().includes('final') && !f.toLowerCase().includes('abstract'))
    );

    if (!abstractPDF) {
      throw new Error('Abstract PDF not found');
    }

    console.log('Processing abstract PDF:', abstractPDF);
    console.log('Found ministry PDFs:', ministryPDFs);

    // Process abstract PDF
    const abstractData = await processAbstractPDF(
      path.join(pdfsDir, abstractPDF)
    );

    if (!validateAbstractData(abstractData)) {
      throw new Error('Abstract data validation failed');
    }

    // Process ministry PDFs
    const ministries = [];
    for (const pdf of ministryPDFs) {
      console.log('Processing ministry PDF:', pdf);
      const ministryData = await processMinistryPDF(
        path.join(pdfsDir, pdf)
      );

      if (!validateMinistryData(ministryData)) {
        console.error(`Validation failed for ${pdf}`);
        continue;
      }

      // Cross-reference with abstract data
      if (!crossReferenceData(ministryData, abstractData)) {
        console.error(`Data mismatch for ${pdf}`);
        continue;
      }

      ministries.push(ministryData);
    }

    // Generate the final data structure
    const budgetData = {
      abstract: abstractData,
      ministries: ministries.map(m => ({
        id: parseInt(m.ministry.code.replace('M', '')),
        name: m.ministry.name,
        code: m.ministry.code,
        totalBudget: m.ministry.totalBudget,
        votes: m.votes.map(v => ({
          name: v.name,
          code: v.code,
          recurrent: v.recurrent,
          capital: v.capital,
          categories: v.categories.map(c => ({
            name: c.name,
            code: c.code,
            amount: c.amount,
            programs: c.programs.map(p => ({
              name: p.name,
              code: p.code,
              description: p.description,
              allocation: p.allocation
            }))
          }))
        }))
      }))
    };

    // Write the data to a file
    await fs.writeFile(
      path.join(__dirname, '../data/budgetData.js'),
      `export const budgetData = ${JSON.stringify(budgetData, null, 2)};`
    );

    console.log('Data processing completed successfully');
  } catch (error) {
    console.error('Error processing PDFs:', error);
  }
}

// Run the script
processAllPDFs(); 