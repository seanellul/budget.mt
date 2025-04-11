import { processTextFile, extractMinistryDetails } from '../src/utils/textProcessor.js';
import fs from 'fs/promises';
import path from 'path';

const PDFS_DIR = path.join(process.cwd(), 'PDFS');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/processed');

async function processAllFiles() {
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Process abstract first
    console.log('Processing abstract file...');
    const abstractData = await processTextFile(path.join(PDFS_DIR, 'fe25 01 Abstracts final.txt'));
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'abstract.json'),
      JSON.stringify(abstractData, null, 2)
    );

    // Process each ministry text file
    const files = await fs.readdir(PDFS_DIR);
    const textFiles = files.filter(file => file.endsWith('.txt'));

    for (const file of textFiles) {
      if (file === 'fe25 01 Abstracts final.txt') continue;

      console.log(`Processing ${file}...`);
      const text = await fs.readFile(path.join(PDFS_DIR, file), 'utf-8');
      const ministryData = extractMinistryDetails(text);

      // Extract ministry name from filename
      const ministryName = file.split(' ')[2].toLowerCase();
      await fs.writeFile(
        path.join(OUTPUT_DIR, `${ministryName}.json`),
        JSON.stringify(ministryData, null, 2)
      );
    }

    // Generate combined data file
    const combinedData = {
      abstract: abstractData,
      ministries: []
    };

    // Read all processed ministry files
    const processedFiles = await fs.readdir(OUTPUT_DIR);
    for (const file of processedFiles) {
      if (file === 'abstract.json') continue;

      const ministryData = JSON.parse(
        await fs.readFile(path.join(OUTPUT_DIR, file), 'utf-8')
      );
      combinedData.ministries.push(ministryData);
    }

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'budget_data.json'),
      JSON.stringify(combinedData, null, 2)
    );

    console.log('All files processed successfully!');
  } catch (error) {
    console.error('Error processing files:', error);
    process.exit(1);
  }
}

processAllFiles(); 