# Malta Budget 2025 Explorer - Data Processing Documentation

## Overview
This document outlines the data processing pipeline for the Malta Budget 2025 Explorer application. The pipeline extracts, transforms, and validates data from official government PDF documents to ensure accurate representation of budget information.

## Core Principles

### 1. Data Integrity
- All data must be traceable back to source PDFs
- Validation at each processing step
- Checksums for financial totals
- Version control for data updates
- Audit trail for data transformations

### 2. Data Structure
```typescript
interface Ministry {
  id: number;
  name: string;
  code: string;
  totalBudget: number;
  votes: Vote[];
}

interface Vote {
  name: string;
  code: string;
  recurrent: YearlyAmount;
  capital: YearlyAmount;
  total: number;
  categories: Category[];
}

interface YearlyAmount {
  2023: number;
  2024: number;
  2025: number;
}

interface Category {
  name: string;
  amount: number;
  percentage: number;
  programs: Program[];
}

interface Program {
  name: string;
  description: string;
  allocation: number;
  measures: Measure[];
}

interface Measure {
  description: string;
  allocation: number;
  status: 'ongoing' | 'new' | 'completed';
}
```

## Implementation Phases

### Phase 1: PDF Processing Infrastructure
1. PDF Text Extraction
   - Tool: PDF.js for reliable text extraction
   - Character encoding handling (UTF-8)
   - Page structure preservation
   - Table data recognition

2. Data Validation
   - Schema validation using Zod/TypeScript
   - Financial total cross-checking
   - Ministry/Vote code verification
   - Historical data consistency checks

### Phase 2: Data Transformation
1. Raw Data Extraction
   ```javascript
   // Example pattern for financial data
   const FINANCIAL_PATTERN = /€\s*([\d,]+)/g;
   const CODE_PATTERN = /Vote\s+(\d+)/i;
   ```

2. Data Normalization
   - Currency standardization
   - Consistent naming conventions
   - Code standardization
   - Date formatting

3. Validation Rules
   - Total budget must match sum of votes
   - Vote totals must match sum of categories
   - Historical data must be present for all years
   - All required fields must be populated

### Phase 3: Data Integration
1. File Structure
   ```
   src/
   ├── data/
   │   ├── raw/              # Raw extracted data
   │   ├── processed/        # Normalized data
   │   ├── validated/        # Final validated data
   │   └── budgetData.js     # Production data file
   ├── utils/
   │   ├── pdfProcessor.js   # PDF processing utilities
   │   ├── dataTransformer.js # Data transformation logic
   │   └── validators.js     # Validation functions
   ```

2. Processing Pipeline
   ```mermaid
   graph TD
   A[PDF Files] --> B[Text Extraction]
   B --> C[Data Parsing]
   C --> D[Normalization]
   D --> E[Validation]
   E --> F[Final Data]
   ```

## Quality Assurance

### 1. Validation Checks
- Financial totals reconciliation
- Data completeness verification
- Code consistency checks
- Historical data validation

### 2. Error Handling
- Detailed error logging
- Processing retry mechanisms
- Data inconsistency alerts
- Manual review flags

### 3. Performance Metrics
- Processing time tracking
- Memory usage monitoring
- Error rate tracking
- Data accuracy metrics

## Usage

### 1. Processing New Data
```bash
# Process all PDF files
npm run process-budget-data

# Process specific ministry
npm run process-budget-data --ministry=education
```

### 2. Validation
```bash
# Validate processed data
npm run validate-budget-data

# Generate validation report
npm run generate-validation-report
```

### 3. Data Updates
```bash
# Update production data
npm run update-budget-data

# Generate change log
npm run generate-changelog
```

## Monitoring and Maintenance

### 1. Regular Checks
- Daily data integrity verification
- Weekly validation reports
- Monthly data audits

### 2. Error Resolution
- Error classification system
- Resolution procedures
- Escalation paths

### 3. Documentation Updates
- Change log maintenance
- Processing documentation updates
- API documentation synchronization

## Security Considerations

### 1. Data Protection
- Source file integrity verification
- Processed data backup
- Access control implementation

### 2. Audit Trail
- Processing log maintenance
- Change tracking
- User action logging

## Next Steps
1. Implement PDF processing infrastructure
2. Create data transformation pipeline
3. Set up validation system
4. Update UI components
5. Implement monitoring tools

## Version History
- v1.0.0 - Initial documentation
- Current Version: 1.0.0
