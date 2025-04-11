#!/usr/bin/env node

import { processPDF } from '../src/utils/pdfProcessor.js';
import { transformMinistryData } from '../src/utils/dataTransformer.js';
import { validateAll } from '../src/utils/validators.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDFS_DIR = path.join(process.cwd(), 'PDFS');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/processed');

async function processAllPDFs() {
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get all PDF files
    const files = await fs.readdir(PDFS_DIR);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    // Process abstract first
    const abstractFile = pdfFiles.find(file => file.includes('01 Abstracts'));
    if (abstractFile) {
      console.log('Processing abstract file...');
      const abstractData = await processPDF(path.join(PDFS_DIR, abstractFile));
      await fs.writeFile(
        path.join(OUTPUT_DIR, 'abstract.json'),
        JSON.stringify(abstractData, null, 2)
      );
    }

    // Process ministry files
    const ministryData = [];
    for (const file of pdfFiles) {
      if (file.includes('01 Abstracts')) continue; // Skip abstract file
      
      console.log(`Processing ${file}...`);
      const data = await processPDF(path.join(PDFS_DIR, file));
      const transformedData = transformMinistryData(data);
      ministryData.push(transformedData);
      
      // Save individual ministry data
      const ministryName = file.split(' ')[2]; // Extract ministry name from filename
      await fs.writeFile(
        path.join(OUTPUT_DIR, `${ministryName.toLowerCase()}.json`),
        JSON.stringify(transformedData, null, 2)
      );
    }

    // Save combined data
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'all_ministries.json'),
      JSON.stringify(ministryData, null, 2)
    );

    console.log('All PDFs processed successfully!');
  } catch (error) {
    console.error('Error processing PDFs:', error);
    process.exit(1);
  }
}

// Run the script
processAllPDFs(); 