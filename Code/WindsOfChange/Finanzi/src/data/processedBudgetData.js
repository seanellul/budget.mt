import organizedData from './processed/organized_data.json';

// Temporary static data structure that matches what the frontend expects
export const processedBudgetData = {
  year: 2025,
  total_revenue: organizedData.summary.finance["total recurrent revenue"]["2025"] * 1000,
  total_expenditure: organizedData.summary.finance["total expenditure"]["2025"] * 1000,
  ministries: [
    {
      id: 2,
      name: "Office of the President",
      recurrentExpenditure: {
        personalEmoluments: 2987000,
        operationalAndMaintenance: 2212000,
        programmesAndInitiatives: 279000,
        total: 5478000
      },
      capitalExpenditure: 575000,
      totalExpenditure: 6053000,
      categories: [
        {
          name: "Personal Emoluments",
          amount: 2987000,
          items: [
            { name: "Salaries and Wages", amount: 2987000 }
          ]
        },
        {
          name: "Operational and Maintenance",
          amount: 2212000,
          items: [
            { name: "Utilities", amount: 500000 },
            { name: "Materials and Supplies", amount: 412000 },
            { name: "Repair and Upkeep", amount: 400000 },
            { name: "Office Services", amount: 900000 }
          ]
        },
        {
          name: "Programmes and Initiatives",
          amount: 279000,
          items: [
            { name: "State Events", amount: 279000 }
          ]
        }
      ]
    },
    {
      id: 1,
      name: "Office of the Prime Minister",
      recurrentExpenditure: {
        personalEmoluments: 220750000,
        operationalAndMaintenance: 59750000,
        programmesAndInitiatives: 340000000,
        total: 620500000
      },
      capitalExpenditure: 145000000,
      totalExpenditure: 765500000,
      categories: [
        {
          name: "Personal Emoluments",
          amount: 220750000,
          items: [
            { name: "Central Administration", amount: 125750000 },
            { name: "Government Communications", amount: 95000000 }
          ]
        },
        {
          name: "Operational and Maintenance",
          amount: 59750000,
          items: [
            { name: "Central Administration", amount: 34750000 },
            { name: "Government Communications", amount: 25000000 }
          ]
        },
        {
          name: "Programmes and Initiatives",
          amount: 340000000,
          items: [
            { name: "Central Administration", amount: 160000000 },
            { name: "Government Communications", amount: 180000000 }
          ]
        }
      ]
    },
    {
      id: 22,
      name: "Ministry for Health and Active Ageing",
      recurrentExpenditure: {
        personalEmoluments: 549168000,
        operationalAndMaintenance: 231347000,
        programmesAndInitiatives: 542311000,
        contributionsToEntities: 117369000,
        total: 1440195000
      },
      capitalExpenditure: 88792000,
      totalExpenditure: 1528987000,
      categories: [
        {
          name: "Personal Emoluments",
          amount: 549168000,
          items: [
            { name: "Holders of Political Office", amount: 108852 },
            { name: "Salaries and Wages", amount: 245321148 },
            { name: "Bonus", amount: 2191000 },
            { name: "Income Supplement", amount: 2091000 },
            { name: "Social Security Contributions", amount: 23311000 },
            { name: "Allowances", amount: 178364000 },
            { name: "Overtime", amount: 21551000 }
          ]
        },
        {
          name: "Operational and Maintenance",
          amount: 231347000,
          items: [
            { name: "Utilities", amount: 15564000 },
            { name: "Materials and Supplies", amount: 4299000 },
            { name: "Repair and Upkeep", amount: 7000000 },
            { name: "Rent", amount: 1180000 },
            { name: "International Memberships", amount: 132000 },
            { name: "Office Services", amount: 1899000 },
            { name: "Transport", amount: 5950000 },
            { name: "Travel", amount: 307000 },
            { name: "Information Services", amount: 193000 },
            { name: "Contractual Services", amount: 103973000 },
            { name: "Professional Services", amount: 9302000 },
            { name: "Training", amount: 316000 },
            { name: "Hospitality", amount: 59000 },
            { name: "Incidental Expenses", amount: 17000 }
          ]
        },
        {
          name: "Programmes and Initiatives",
          amount: 542311000,
          items: [
            { name: "National Poison Centre", amount: 100000 },
            { name: "Covid 19 - Supplies", amount: 2000000 },
            { name: "New Medicines", amount: 6500000 },
            { name: "Remote patient monitoring", amount: 10694000 },
            { name: "Specialised Treatment by Foreign Experts", amount: 6000000 },
            { name: "Health Education and Nutrition Unit", amount: 200000 },
            { name: "Specialised Prosthetic/Orthotic Service", amount: 1450000 },
            { name: "Pest Control", amount: 20000 },
            { name: "Acute Psychiatric Hospital", amount: 3660000 },
            { name: "Transgender Services", amount: 100000 },
            { name: "Ex-Gratia Compensation to Haemophiliacs", amount: 100000 },
            { name: "Chief Medical Officer Medicines", amount: 21000000 },
            { name: "Malta Laboratories Network", amount: 128000 },
            { name: "Medicines and Surgical Materials", amount: 153000000 },
            { name: "Pharmacy of Your Choice", amount: 25500000 },
            { name: "Post-Graduate Training", amount: 650000 },
            { name: "National Health Screening", amount: 1400000 },
            { name: "Mater Dei Hospital Non-Medical Equipment", amount: 11000000 },
            { name: "Maintenance of Medical Equipment", amount: 8000000 },
            { name: "Mount Carmel Hospital - Sectorisation Project", amount: 420000 },
            { name: "Mount Carmel Hospital - Crisis Intervention Team", amount: 75000 },
            { name: "Specialist Training", amount: 300000 },
            { name: "New Technology Services", amount: 20000 },
            { name: "Waiting Lists for Medical Services", amount: 14000000 },
            { name: "Strategy on Obesity", amount: 80000 },
            { name: "Sexual Health Policy", amount: 50000 },
            { name: "Care Services - Non-Governmental Organisations", amount: 3300000 },
            { name: "Rare Diseases", amount: 2000000 },
            { name: "In Vitro Fertilization Programme", amount: 4000000 },
            { name: "Kenn Għal Saħħtek", amount: 1000000 },
            { name: "Compensation Payments", amount: 5000 },
            { name: "National Diabetes Strategy", amount: 5000000 },
            { name: "Gozo General Hospital", amount: 34084000 },
            { name: "Karin Grech Rehabilitation Centre", amount: 30371000 },
            { name: "Cancer Treatment", amount: 28000000 },
            { name: "Long Term Medical Beds", amount: 9500000 },
            { name: "Barts Medical School", amount: 1600000 },
            { name: "Paola Secondary Healthcare Services", amount: 5000000 },
            { name: "St Michael's Palliative Care In-Patient Unit", amount: 2100000 },
            { name: "Mental Health Initiatives", amount: 4500000 }
          ]
        },
        {
          name: "Contributions to Government Entities",
          amount: 117369000,
          items: [
            { name: "Mental Health Services", amount: 71000000 },
            { name: "Committee of 'Ta' Braxia' Cemetery", amount: 8000 },
            { name: "Foundation for Medical Services", amount: 5000000 },
            { name: "Karin Grech Rehabilitation Centre", amount: 17678000 },
            { name: "National Blood Transfusion Centre", amount: 4700000 },
            { name: "Office of the Commissioner for Mental Health", amount: 1150000 },
            { name: "Embryo Protection Authority", amount: 500000 },
            { name: "Malta Health Ltd", amount: 14883000 }
          ]
        },
        {
          name: "Capital Expenditure",
          amount: 88792000,
          items: [
            { name: "ICT - Hardware", amount: 2000000 },
            { name: "ICT - Software", amount: 9000000 },
            { name: "ICT - Support", amount: 16000000 },
            { name: "Property, Plant and Equipment", amount: 250000 },
            { name: "National Recovery and Resilience Plan - EU Funds", amount: 12741000 },
            { name: "National Recovery and Resilience Plan - Malta Funds", amount: 336000 },
            { name: "Structural Funds 2021-2027 - EU Funds", amount: 10000000 },
            { name: "Structural Funds 2021-2027 - Malta Funds", amount: 3828000 },
            { name: "EU Territorial Cooperation Programme 2021-2027 - EU Funds", amount: 5000 },
            { name: "EU Territorial Cooperation Programme 2021-2027 - Malta Funds", amount: 2000 },
            { name: "Direct Management Funds 2021-2027 - EU Funds", amount: 3298000 },
            { name: "Direct Management Funds 2021-2027 - Malta Funds", amount: 919000 },
            { name: "Swiss Funds Programme 2021-2027 - Swiss Funds", amount: 1406000 },
            { name: "Swiss Funds Programme 2021-2027 - Malta Funds", amount: 258000 },
            { name: "Pharmacy of Your Choice", amount: 100000 },
            { name: "Replacement of Equipment at End-of-Life", amount: 2000000 },
            { name: "Centralized Stores", amount: 400000 },
            { name: "New MID building", amount: 400000 },
            { name: "New Cath Lab Unit", amount: 500000 },
            { name: "IVF", amount: 500000 },
            { name: "Electricity Distribution Centre", amount: 2000000 },
            { name: "Property, Plant and Equipment - Mater Dei Hospital", amount: 8792000 },
            { name: "Property, Plant and Equipment - Oncology Hospital", amount: 1500000 },
            { name: "Property, Plant and Equipment - Mount Carmel Hospital", amount: 1500000 },
            { name: "Property, Plant and Equipment - National Blood Transfusion Centre", amount: 50000 },
            { name: "Property, Plant and Equipment - Primary Health Care", amount: 1300000 },
            { name: "Construction Works in Government Cemeteries", amount: 300000 },
            { name: "Property, Plant and Equipment - Public Health Regulation", amount: 20000 },
            { name: "Property, Plant and Equipment - Commissioner for Mental Health", amount: 5000 },
            { name: "Property, Plant and Equipment - Foundation for Medical Services", amount: 20000 },
            { name: "Property, Plant and Equipment - Paola Secondary Health Care Services", amount: 500000 },
            { name: "Property, Plant and Equipment - Gozo General Hospital", amount: 3000000 },
            { name: "Property, Plant and Equipment - Karin Grech", amount: 1000000 },
            { name: "Property, Plant and Equipment - Malta Laboratories Network", amount: 100000 }
          ]
        }
      ]
    },
    {
      id: 23,
      name: "Ministry for Transport, Infrastructure and Public Works",
      recurrentExpenditure: {
        personalEmoluments: 27219000,
        operationalAndMaintenance: 5683000,
        programmesAndInitiatives: 135094000,
        contributionsToEntities: 6130000,
        total: 174126000
      },
      capitalExpenditure: 154078000,
      totalExpenditure: 328204000,
      categories: [
        {
          name: "Personal Emoluments",
          amount: 27219000,
          items: [
            { name: "Holders of Political Office", amount: 108852 },
            { name: "Salaries and Wages", amount: 20444148 },
            { name: "Bonus", amount: 240000 },
            { name: "Income Supplement", amount: 215000 },
            { name: "Social Security Contributions", amount: 1942000 },
            { name: "Allowances", amount: 4069000 },
            { name: "Overtime", amount: 200000 }
          ]
        },
        {
          name: "Operational and Maintenance",
          amount: 5683000,
          items: [
            { name: "Utilities", amount: 700000 },
            { name: "Materials and Supplies", amount: 550000 },
            { name: "Repair and Upkeep", amount: 600000 },
            { name: "Rent", amount: 800000 },
            { name: "International Memberships", amount: 13000 },
            { name: "Office Services", amount: 170000 },
            { name: "Transport", amount: 1000000 },
            { name: "Travel", amount: 130000 },
            { name: "Information Services", amount: 100000 },
            { name: "Contractual Services", amount: 700000 },
            { name: "Professional Services", amount: 850000 },
            { name: "Training", amount: 8000 },
            { name: "Hospitality", amount: 50000 },
            { name: "Incidental Expenses", amount: 12000 }
          ]
        },
        {
          name: "Programmes and Initiatives",
          amount: 135094000,
          items: [
            { name: "Damages to Third Parties", amount: 10000 },
            { name: "Maintenance Obligations Salina Salt Pens", amount: 30000 },
            { name: "Grant for Wheelchair Accessible Vehicles", amount: 150000 },
            { name: "National Marine Pollution Contingency Plan", amount: 50000 },
            { name: "Scrappage Scheme to Purchase Motor Cycle", amount: 2000000 },
            { name: "Maintenance of the Ta' Qali National Park", amount: 1500000 },
            { name: "Shore to Ship Supply", amount: 500000 },
            { name: "Training and Upgrading (EV's)", amount: 10000 },
            { name: "Port Workers Aid", amount: 200000 },
            { name: "Road Safety Council", amount: 20000 },
            { name: "Maritime Advisory Committee", amount: 10000 },
            { name: "Repowering for Electric Drive", amount: 10000 },
            { name: "Vehicle Retrofitting (DFA/SCR)", amount: 10000 },
            { name: "Green Travel Plan", amount: 10000 },
            { name: "Local Council Urban Development", amount: 10000 },
            { name: "Proof of Concept", amount: 10000 },
            { name: "Public Service Obligation - Maritime Transportation", amount: 400000 },
            { name: "Environmental Upgrade Campaign", amount: 40000 },
            { name: "Transport Malta - Administrative Fee", amount: 8000000 },
            { name: "Maintenance of Public Fountains", amount: 350000 },
            { name: "Public Service Obligation - Public Transport", amount: 55000000 },
            { name: "Public Service Obligation - Inter-Island Transportation", amount: 14700000 },
            { name: "Artistic Works in Public Spaces", amount: 40000 },
            { name: "Bureau of Air Accident Investigations", amount: 140000 },
            { name: "Payments to Wasteserv Ltd", amount: 50000 },
            { name: "Auto Gas Conversion Scheme", amount: 100000 },
            { name: "Aviation Malta", amount: 50000 },
            { name: "Scrappage Scheme", amount: 300000 },
            { name: "European Mobility Week", amount: 150000 },
            { name: "Grant for Electric Vehicles", amount: 8000000 },
            { name: "Yachting Malta", amount: 270000 },
            { name: "Tal-Linja Card", amount: 27350000 },
            { name: "MCP Car Park Contract", amount: 364000 },
            { name: "Land Reclamation Studies", amount: 10000 },
            { name: "Public Service Obligation - Fast Ferry Service Malta Gozo", amount: 9200000 },
            { name: "Barrakka Lift Contribution", amount: 250000 },
            { name: "Foundation for Transport", amount: 50000 },
            { name: "Free Harbour-Ferry Service", amount: 600000 },
            { name: "Land Transport Initiatives", amount: 5000000 },
            { name: "Kamra tal-Periti", amount: 150000 }
          ]
        },
        {
          name: "Contributions to Government Entities",
          amount: 6130000,
          items: [
            { name: "Transport Safety Investigation Commission", amount: 120000 },
            { name: "International Maritime Law Institute", amount: 10000 },
            { name: "Infrastructure Malta Agency", amount: 6000000 }
          ]
        },
        {
          name: "Capital Expenditure",
          amount: 154078000,
          items: [
            { name: "ICT - Hardware", amount: 310000 },
            { name: "ICT - Software", amount: 290000 },
            { name: "ICT - Support", amount: 1050000 },
            { name: "Property, Plant and Equipment", amount: 600000 },
            { name: "Structural Funds 2014-2020 - EU Funds", amount: 5000 },
            { name: "Structural Funds 2014-2020 - Malta Funds", amount: 7000 },
            { name: "Direct Management Funds - EU Funds", amount: 20000 },
            { name: "Direct Management Funds - Malta Funds", amount: 5000 },
            { name: "Cohesion Fund 2014-2020 - EU Funds", amount: 5000 },
            { name: "Cohesion Fund 2014-2020 - Malta Funds", amount: 502000 },
            { name: "National Recovery and Resilience Plan - EU Funds", amount: 17441000 },
            { name: "National Recovery and Resilience Plan - Malta Funds", amount: 500000 },
            { name: "Just Transition Fund 2021-2027 - EU Funds", amount: 6559000 },
            { name: "Just Transition Fund 2021-2027 - Malta Funds", amount: 481000 },
            { name: "Structural Funds 2021-2027 - EU Funds", amount: 5000 },
            { name: "Structural Funds 2021-2027 - Malta Funds", amount: 2000 },
            { name: "EU Territorial Cooperation Programme 2021-2027 - EU Funds", amount: 5000 },
            { name: "EU Territorial Cooperation Programme 2021-2027 - Malta Funds", amount: 2000 },
            { name: "Direct Management Funds 2021-2027 - EU Funds", amount: 34000 },
            { name: "Direct Management Funds 2021-2027 - Malta Funds", amount: 2000 },
            { name: "Cohesion Fund 2021-2027 - EU Funds", amount: 17684000 },
            { name: "Cohesion Fund 2021-2027 - Malta Funds", amount: 3321000 },
            { name: "Connecting Europe Facility 2021-2027 - EU Funds", amount: 3654000 },
            { name: "Connecting Europe Facility 2021-2027 - Malta Funds", amount: 857000 },
            { name: "European Maritime, Fisheries and Aquaculture Fund 2021-2027 - EU Funds", amount: 5000 },
            { name: "European Maritime, Fisheries and Aquaculture Fund 2021-2027 - Malta Funds", amount: 2000 },
            { name: "Energy Efficiency H2020 - Refurbishment/Upgrading of Public Buildings", amount: 500000 },
            { name: "Enhancement of Public Areas", amount: 3000000 },
            { name: "Upgrading of Existing Storm-Water Systems", amount: 1500000 },
            { name: "Proġett Komunitarju għat-Tfal u għaż-Żgħażagħ", amount: 200000 },
            { name: "Framework Agreement (Local Councils)", amount: 5000000 },
            { name: "Ta' Qali National Park", amount: 8500000 },
            { name: "Coastal and Marine Works and Coastal Studies", amount: 300000 },
            { name: "Property, Plant and Equipment", amount: 400000 },
            { name: "Vehicle Registration and Administration System", amount: 500000 },
            { name: "Vessel Traffic Management System", amount: 500000 },
            { name: "Road Construction/Improvements", amount: 70000000 },
            { name: "Deep Water Quay", amount: 200000 },
            { name: "Reconstruction of Lascaris Wharf", amount: 1000000 },
            { name: "Maritime Facilities", amount: 6000000 }
          ]
        }
      ]
    },
    {
      id: 8,
      name: "Ministry for Foreign and European Affairs and Trade",
      recurrent: 456000000,
      capital: 42000000,
      votes: [
        {
          name: "Foreign Affairs",
          recurrent: 345000000,
          capital: 32000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 196000000
            },
            {
              name: "Operational & Maintenance",
              amount: 54000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 95000000
            }
          ]
        },
        {
          name: "European Affairs and Trade",
          recurrent: 111000000,
          capital: 10000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 67000000
            },
            {
              name: "Operational & Maintenance",
              amount: 14000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 30000000
            }
          ]
        }
      ]
    },
    {
      id: 18,
      name: "Ministry for Finance and Employment",
      recurrent: 1236000000,
      capital: 345000000,
      votes: [
        {
          name: "Finance",
          recurrent: 836000000,
          capital: 245000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 215000000
            },
            {
              name: "Operational & Maintenance",
              amount: 86000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 535000000
            }
          ]
        },
        {
          name: "Employment",
          recurrent: 400000000,
          capital: 100000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 105000000
            },
            {
              name: "Operational & Maintenance",
              amount: 45000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 250000000
            }
          ]
        }
      ]
    },
    {
      id: 19,
      name: "Ministry for Education, Sport, Youth, Research and Innovation",
      recurrent: 944352000,
      capital: 88074000,
      votes: [
        {
          name: "Ministry",
          recurrent: 484941000,
          capital: 68434000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 42817000
            },
            {
              name: "Operational & Maintenance",
              amount: 2292000
            },
            {
              name: "Programmes & Initiatives",
              amount: 254002000
            },
            {
              name: "Contributions to Government Entities",
              amount: 185830000
            }
          ]
        },
        {
          name: "Education",
          recurrent: 459411000,
          capital: 19640000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 374775000
            },
            {
              name: "Operational & Maintenance",
              amount: 25727000
            },
            {
              name: "Programmes & Initiatives",
              amount: 58909000
            }
          ]
        }
      ]
    },
    {
      id: 16,
      name: "Ministry for Home Affairs",
      recurrent: 356000000,
      capital: 42000000,
      votes: [
        {
          name: "Police",
          recurrent: 156000000,
          capital: 22000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 96000000
            },
            {
              name: "Operational & Maintenance",
              amount: 35000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 25000000
            }
          ]
        },
        {
          name: "Civil Protection",
          recurrent: 200000000,
          capital: 20000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 120000000
            },
            {
              name: "Operational & Maintenance",
              amount: 45000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 35000000
            }
          ]
        }
      ]
    },
    {
      id: 17,
      name: "Ministry for Energy",
      recurrent: 425000000,
      capital: 125000000,
      votes: [
        {
          name: "Energy",
          recurrent: 275000000,
          capital: 85000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 85000000
            },
            {
              name: "Operational & Maintenance",
              amount: 65000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 125000000
            }
          ]
        },
        {
          name: "Sustainable Development",
          recurrent: 150000000,
          capital: 40000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 45000000
            },
            {
              name: "Operational & Maintenance",
              amount: 35000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 70000000
            }
          ]
        }
      ]
    },
    {
      id: 9,
      name: "Ministry for the National Heritage, the Arts and Local Government",
      recurrent: 146977000,
      capital: 63210000,
      votes: [
        {
          name: "Ministry",
          recurrent: 82717000,
          capital: 60300000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 11279000
            },
            {
              name: "Operational & Maintenance",
              amount: 1966000
            },
            {
              name: "Programmes & Initiatives",
              amount: 25897000
            },
            {
              name: "Contributions to Government Entities",
              amount: 43575000
            }
          ]
        },
        {
          name: "Local Government",
          recurrent: 64260000,
          capital: 2910000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 2198000
            },
            {
              name: "Operational & Maintenance",
              amount: 466000
            },
            {
              name: "Programmes & Initiatives",
              amount: 61596000
            }
          ]
        }
      ]
    },
    {
      id: 21,
      name: "Ministry for Justice and Reform of the Construction Sector",
      recurrentExpenditure: {
        personalEmoluments: 6037000,
        operationalAndMaintenance: 5949000,
        programmesAndInitiatives: 12041000,
        contributionsToEntities: 50355000,
        total: 74382000
      },
      capitalExpenditure: 9899000,
      totalExpenditure: 84281000,
      categories: [
        {
          name: "Personal Emoluments",
          amount: 6037000,
          items: [
            { name: "Holders of Political Office", amount: 55692 },
            { name: "Salaries and Wages", amount: 4283308 },
            { name: "Bonus", amount: 35000 },
            { name: "Income Supplement", amount: 32000 },
            { name: "Social Security Contributions", amount: 407000 },
            { name: "Allowances", amount: 1182000 },
            { name: "Overtime", amount: 42000 }
          ]
        },
        {
          name: "Operational and Maintenance",
          amount: 5949000,
          items: [
            { name: "Utilities", amount: 81000 },
            { name: "Materials and Supplies", amount: 37000 },
            { name: "Repair and Upkeep", amount: 23000 },
            { name: "Rent", amount: 474000 },
            { name: "International Memberships", amount: 125000 },
            { name: "Office Services", amount: 66000 },
            { name: "Transport", amount: 66000 },
            { name: "Travel", amount: 113000 },
            { name: "Information Services", amount: 60000 },
            { name: "Contractual Services", amount: 1324000 },
            { name: "Professional Services", amount: 3530000 },
            { name: "Training", amount: 8000 },
            { name: "Hospitality", amount: 41000 },
            { name: "Incidental Expenses", amount: 1000 }
          ]
        },
        {
          name: "Programmes and Initiatives",
          amount: 12041000,
          items: [
            { name: "Local Tribunals", amount: 200000 },
            { name: "Judicial Studies Committee", amount: 70000 },
            { name: "Compensation to Victims of Crime", amount: 1000 },
            { name: "Summoning and Expenses of witnesses, Jurors and Experts in Criminal Court Trials", amount: 8000000 },
            { name: "Building and Construction Initiatives", amount: 3000000 },
            { name: "Review of Notarial Acts (Pre-2012)", amount: 120000 },
            { name: "Judicial Reform", amount: 200000 },
            { name: "Building and Construction Tribunal", amount: 450000 }
          ]
        },
        {
          name: "Contributions to Government Entities",
          amount: 50355000,
          items: [
            { name: "Academy of Criminal Justice", amount: 50000 },
            { name: "Building and Construction Authority", amount: 7500000 },
            { name: "Court Services Agency", amount: 25000000 },
            { name: "Office of the State Advocate", amount: 3500000 },
            { name: "Information and Data Protection Commission", amount: 800000 },
            { name: "Asset Recovery Bureau", amount: 1400000 },
            { name: "Malta Arbitration Centre", amount: 125000 },
            { name: "Occupational Health and Safety Authority", amount: 2700000 },
            { name: "Permanent Commission Against Corruption", amount: 230000 },
            { name: "Mediation Centre", amount: 200000 },
            { name: "Attorney General's Office", amount: 5500000 },
            { name: "Law Commissioner", amount: 350000 },
            { name: "Legal Aid Agency", amount: 1100000 },
            { name: "Property Malta Foundation", amount: 300000 },
            { name: "Property Market Agency", amount: 1600000 }
          ]
        },
        {
          name: "Capital Expenditure",
          amount: 9899000,
          items: [
            { name: "ICT - Hardware", amount: 190000 },
            { name: "ICT - Software", amount: 1530000 },
            { name: "ICT - Support", amount: 480000 },
            { name: "Property, Plant and Equipment", amount: 120000 },
            { name: "National Recovery and Resilience Plan - EU Funds", amount: 4168000 },
            { name: "National Recovery and Resilience Plan - Malta Funds", amount: 100000 },
            { name: "Structural Funds 2021-2027 - EU Funds", amount: 5000 },
            { name: "Structural Funds 2021-2027 - Malta Funds", amount: 2000 },
            { name: "EU Territorial Cooperation Programme 2021-2027 - EU Funds", amount: 5000 },
            { name: "EU Territorial Cooperation Programme 2021-2027 - Malta Funds", amount: 2000 },
            { name: "Direct Management Funds 2021-2027 - EU Funds", amount: 5000 },
            { name: "Direct Management Funds 2021-2027 - Malta Funds", amount: 2000 },
            { name: "Office of the Attorney General - Property, Plant and Equipment", amount: 50000 },
            { name: "Notary to Government - Property, Plant and Equipment", amount: 50000 },
            { name: "Malta Arbitration Centre - Property, Plant and Equipment", amount: 10000 },
            { name: "Asset Recovery Bureau - Property, Plant and Equipment", amount: 200000 },
            { name: "Court Services Agency - Premises at Strait Street, Valletta", amount: 1000000 },
            { name: "Court Services Agency - Property, Plant and Equipment", amount: 390000 },
            { name: "State Advocate - Property, Plant and Equipment", amount: 400000 },
            { name: "Legal Aid Agency - Property, Plant and Equipment", amount: 15000 },
            { name: "Building and Construction Authority - Property, Plant and Equipment", amount: 1000000 },
            { name: "Awtorità għas-Saħħa u s-Sigurtà fuq il-Post tax-Xogħol - Property, Plant and Equipment", amount: 175000 }
          ]
        }
      ]
    },
    {
      id: 20,
      name: "Ministry for Lands",
      recurrent: 95000000,
      capital: 25000000,
      votes: [
        {
          name: "Lands",
          recurrent: 95000000,
          capital: 25000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 45000000
            },
            {
              name: "Operational & Maintenance",
              amount: 20000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 30000000
            }
          ]
        }
      ]
    },
    {
      id: 15,
      name: "Ministry for Gozo",
      recurrent: 185000000,
      capital: 45000000,
      votes: [
        {
          name: "Gozo Administration",
          recurrent: 185000000,
          capital: 45000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 85000000
            },
            {
              name: "Operational & Maintenance",
              amount: 35000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 65000000
            }
          ]
        }
      ]
    },
    {
      id: 14,
      name: "Ministry for Inclusion",
      recurrent: 165000000,
      capital: 35000000,
      votes: [
        {
          name: "Social Inclusion",
          recurrent: 165000000,
          capital: 35000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 75000000
            },
            {
              name: "Operational & Maintenance",
              amount: 25000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 65000000
            }
          ]
        }
      ]
    },
    {
      id: 13,
      name: "Ministry for Economy",
      recurrent: 245000000,
      capital: 85000000,
      votes: [
        {
          name: "Economic Development",
          recurrent: 245000000,
          capital: 85000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 95000000
            },
            {
              name: "Operational & Maintenance",
              amount: 45000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 105000000
            }
          ]
        }
      ]
    },
    {
      id: 12,
      name: "Ministry for Social Accommodation",
      recurrent: 125000000,
      capital: 45000000,
      votes: [
        {
          name: "Housing",
          recurrent: 125000000,
          capital: 45000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 45000000
            },
            {
              name: "Operational & Maintenance",
              amount: 25000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 55000000
            }
          ]
        }
      ]
    },
    {
      id: 11,
      name: "Ministry for Agriculture",
      recurrent: 165000000,
      capital: 55000000,
      votes: [
        {
          name: "Agriculture",
          recurrent: 165000000,
          capital: 55000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 75000000
            },
            {
              name: "Operational & Maintenance",
              amount: 35000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 55000000
            }
          ]
        }
      ]
    },
    {
      id: 10,
      name: "Ministry for Social Policy",
      recurrent: 285000000,
      capital: 65000000,
      votes: [
        {
          name: "Social Policy",
          recurrent: 285000000,
          capital: 65000000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 125000000
            },
            {
              name: "Operational & Maintenance",
              amount: 45000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 115000000
            }
          ]
        }
      ]
    },
    {
      id: 6,
      name: "Office of Standards for Public Life",
      recurrent: 3500000,
      capital: 500000,
      votes: [
        {
          name: "Standards in Public Life",
          recurrent: 3500000,
          capital: 500000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 1500000
            },
            {
              name: "Operational & Maintenance",
              amount: 1000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 1000000
            }
          ]
        }
      ]
    },
    {
      id: 5,
      name: "National Audit Office",
      recurrent: 4500000,
      capital: 750000,
      votes: [
        {
          name: "Audit and Control",
          recurrent: 4500000,
          capital: 750000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 2500000
            },
            {
              name: "Operational & Maintenance",
              amount: 1000000
            },
            {
              name: "Programmes & Initiatives",
              amount: 1000000
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: "Office of the Ombudsman",
      recurrent: 2500000,
      capital: 250000,
      votes: [
        {
          name: "Ombudsman Services",
          recurrent: 2500000,
          capital: 250000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 1500000
            },
            {
              name: "Operational & Maintenance",
              amount: 500000
            },
            {
              name: "Programmes & Initiatives",
              amount: 500000
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "House of Representatives",
      recurrent: 12500000,
      capital: 2500000,
      votes: [
        {
          name: "Parliamentary Services",
          recurrent: 12500000,
          capital: 2500000,
          categories: [
            {
              name: "Personal Emoluments",
              amount: 7500000
            },
            {
              name: "Operational & Maintenance",
              amount: 2500000
            },
            {
              name: "Programmes & Initiatives",
              amount: 2500000
            }
          ]
        }
      ]
    }
  ],
  revenue_sources: [
    {
      name: "Income Tax",
      amount: organizedData.summary.revenue.tax["Income Tax"].estimate2025 * 1000
    },
    {
      name: "Value Added Tax",
      amount: organizedData.summary.revenue.tax["Value Added Tax"].estimate2025 * 1000
    },
    {
      name: "Customs & Excise Duties",
      amount: organizedData.summary.revenue.tax["Customs and Excise Duties"].estimate2025 * 1000
    },
    {
      name: "Licenses, Taxes & Fines",
      amount: organizedData.summary.revenue.tax["Taxes and Fines"].estimate2025 * 1000
    },
    {
      name: "Social Security Contributions",
      amount: organizedData.summary.revenue.tax["Social Security"].estimate2025 * 1000
    },
    {
      name: "Grants & EU Funds",
      amount: organizedData.summary.revenue.tax["Grants"].estimate2025 * 1000
    },
    {
      name: "Fees & Sales",
      amount: (
        organizedData.summary.revenue.tax["Fees of Office"].estimate2025 +
        organizedData.summary.revenue.tax["Sales"].estimate2025
      ) * 1000
    },
    {
      name: "Other Revenue",
      amount: organizedData.summary.revenue.tax["Miscellaneous Receipts"].estimate2025 * 1000
    }
  ]
}; 