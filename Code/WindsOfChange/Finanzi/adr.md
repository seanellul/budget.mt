**Architectural Design Record (ADR)**

**Title**: Interactive Visualization Platform for Malta's 2025 National Budget
**Status**: Proposed
**Date**: 2025-04-11
**Owner**: Sean Ellul

---

## Context

Malta's national budget for 2025 is published as a comprehensive, highly structured PDF document that includes:
- Revenue breakdowns by type and source
- Recurrent and capital expenditure projections by ministry, vote, and item
- Standardized classification of spending types (emoluments, maintenance, programmes, etc.)
- Multi-year forecasts and fund flows

Understanding public sector resource allocation is essential for civic transparency, fiscal awareness, and government accountability.

This ADR proposes a hierarchical data extraction and visualization platform using React, enabling users to explore Malta's budget interactively via tables, graphs, and drill-down views.

---

## Decision

We will build a **React-based budget explorer** that ingests structured JSON datasets (manually extracted or automatically parsed from the official budget PDF). The platform will offer a macro-to-micro data exploration model across ministries, categories, and items.

---

## Architecture Overview

### 1. **Frontend: React with TailwindCSS + Recharts**
- **React**: Component-based architecture
- **TailwindCSS**: Utility-first styling for clean UIs
- **Recharts**: Pie, bar, and stacked charts for visual summaries

### 2. **Data Format (Fake Data Template)**
```json
{
  "year": 2025,
  "total_revenue": 9019711988,
  "total_expenditure": 8991843308,
  "ministries": [
    {
      "id": 39,
      "name": "Ministry for Education, Sport, Youth, Research and Innovation",
      "recurrent": 944352000,
      "capital": 88074000,
      "votes": [
        {
          "name": "Education",
          "recurrent": 459411000,
          "capital": 0,
          "categories": [
            {
              "name": "Personal Emoluments",
              "amount": 374775000
            },
            {
              "name": "Programmes & Initiatives",
              "amount": 58909000
            }
          ]
        },
        {
          "name": "Youth, Sport, Research",
          "recurrent": 485000000,
          "capital": 88074000,
          "categories": [
            {
              "name": "Programmes & Initiatives",
              "amount": 254002000
            },
            {
              "name": "Contributions to Entities",
              "amount": 185830000
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Features & Views

### 1. **Landing Dashboard (National Overview)**
- Pie chart: % share of each ministry in total expenditure
- Bar chart: Revenue vs Expenditure
- KPI cards: Surplus/Deficit, Total Revenue, Total Spending

### 2. **Ministry View**
- Table of Votes with expandable rows
- Pie chart of ministry breakdown (e.g. Education vs Youth)
- Drill-down by standard category (Personal Emoluments, Programmes, etc.)

### 3. **Vote Detail View**
- Stacked bar of category spending (2023-2025)
- Table view of initiatives within vote
- Filters by spending type, cost centre, etc.

### 4. **Searchable Budget Explorer**
- Typeahead for programme names
- Result shows matching programme, ministry, vote, and 2025 value

---

## Data Requirements

- JSON exports from the `Abstracts Final` document
- Key tables:
  - Recurrent & capital by vote
  - Recurrent expenditure by category
  - Revenue projections by head/item
  - Public debt and surplus

---

## Agentic Integration (Optional)

Future integrations can include:
- Natural language Q&A with RAG (retrieval-augmented generation)
- Automated updates from yearly PDFs
- Predictive analytics (budget forecasting, anomaly detection)

---

## Next Steps
1. Complete parser to extract all relevant tables from Abstracts Final
2. Generate fake data files (like the template) to scaffold UI
3. Begin React component development
4. Build first national overview page
5. Integrate ministry drill-down and vote-level pages

---

## Notes
- Each component (vote, category, programme) should be **deeply linkable** via URL routing
- Charts must adapt to new data easily
- Budget sources and references should be easily viewable for validation

---

## Status
This ADR is in "Proposed" status and serves as the reference for building the Malta Budget 2025 explorer platform.

