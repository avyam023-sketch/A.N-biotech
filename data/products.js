// Product catalogue. Every price, spec and photo comes from the IndiaMART listings at
// https://www.indiamart.com/anbiotech/ - edit here, then run `npm run build`.
//
// images: number of photos in assets/products, named <slug>-<n>.jpg and <slug>-<n>-t.jpg
// price:  null shows "Price on request"
// photoNote: shown under the gallery when the photo is not the exact model

const categories = [
  { id: 'immunoassay', name: 'Immunoassay and ELISA', image: 'maglumi-800-1' },
  { id: 'hematology', name: 'Hematology and ESR', image: 'yumizen-h500-1' },
  { id: 'biochemistry', name: 'Biochemistry and electrolytes', image: 'labmate-biochemistry-1' },
  { id: 'point-of-care', name: 'Point-of-care testing', image: 'finecare-hba1c-2' },
  {
    id: 'reagents',
    name: 'Reagents',
    image: 'abx-minidil-lmg-1',
    note: 'Other reagents are supplied on order, including Trivitron SGOT kits (4 x 25 mL). Send us the kit name and quantity you need.'
  },
  { id: 'beds', name: 'Hospital beds and ward furniture', image: 'icu-electric-bed-1' },
  { id: 'operation-theatre', name: 'Operation theatre and disinfection', image: 'led-ot-light-1' }
];

const products = [
  // Immunoassay and ELISA
  {
    slug: 'maglumi-x3',
    name: 'Snibe Maglumi X3 Immunoassay Analyzer',
    category: 'immunoassay',
    brand: 'Snibe',
    price: '₹17,00,000',
    unit: 'piece',
    images: 1,
    summary: 'Fully automatic chemiluminescence immunoassay analyzer. Ask us for the specification sheet.',
    specs: [['Brand', 'Snibe'], ['Model', 'Maglumi X3'], ['Operation', 'Fully automatic']],
    features: []
  },
  {
    slug: 'maglumi-1000',
    name: 'Snibe Maglumi 1000 Immunoassay Analyzer',
    category: 'immunoassay',
    brand: 'Snibe',
    price: '₹13,00,000',
    unit: 'piece',
    images: 1,
    photoNote: 'Photo shows the Maglumi 800 from the same range.',
    summary: 'Fully automated immunoassay analyzer with capacity for 144 sample tubes and 15 reagents on board.',
    specs: [
      ['Brand', 'Snibe'],
      ['Model', 'Maglumi 1000'],
      ['Throughput', 'Up to 120 tests/hour'],
      ['Time to first result', '17 minutes'],
      ['Modes of operation', 'Random, batch and STAT'],
      ['Calibration stability', 'Up to 4 weeks'],
      ['Ready to use', '24 hours'],
      ['Dimensions', '135 x 64 x 87 cm'],
      ['Weight', '148 kg'],
      ['Operating temperature', '15-30 °C']
    ],
    features: [
      'Up to 144 sample tubes, continuous loading, STAT available',
      '15 reagents on board, continuous loading',
      'Refrigerated sample and reagent areas',
      'Integrated ready-to-use kits, including calibrators',
      'RFID tag stores reagent information and master curve',
      '2-point calibration to adjust the master curve',
      'Clot detection and reagent liquid level detection',
      'Auto dilution for high-concentration samples',
      'Constant 37 °C incubation',
      'LIS connection through COM port or network card'
    ]
  },
  {
    slug: 'maglumi-800',
    name: 'Snibe Maglumi 800 Immunoassay Analyzer',
    category: 'immunoassay',
    brand: 'Snibe',
    price: '₹9,50,000',
    unit: 'piece',
    images: 4,
    summary: 'Flash chemiluminescence immunoassay analyzer with 40 sample positions and 9 reagents on board.',
    specs: [
      ['Brand', 'Snibe'],
      ['Model', 'Maglumi 800'],
      ['Throughput', 'Up to 180 tests/hour'],
      ['Time to first result', '17 minutes'],
      ['Modes of operation', 'Random, batch and STAT'],
      ['Calibration stability', 'Up to 4 weeks'],
      ['Ready to use', '24 hours'],
      ['Dimensions', '102 x 72 x 56 cm'],
      ['Weight', '73 kg'],
      ['Operating temperature', '15-30 °C']
    ],
    features: [
      'Non-enzyme flash chemiluminescence, long reagent stability',
      'Up to 40 sample tubes, continuous loading, STAT available',
      '9 reagents on board, continuous loading',
      'Refrigerated sample and reagent areas',
      'Integrated ready-to-use kits, including calibrators',
      'Superparamagnetic microbeads',
      'RFID tag stores reagent information and master curve',
      '2-point calibration to adjust the master curve',
      'Clot detection and reagent liquid level detection',
      'Auto dilution for high-concentration samples',
      'Constant 37 °C incubation',
      'LIS connection through COM port or network card'
    ]
  },
  {
    slug: 'maglumi-600',
    name: 'Snibe Maglumi 600 Immunoassay Analyzer',
    category: 'immunoassay',
    brand: 'Snibe',
    price: '₹8,00,000',
    unit: 'piece',
    images: 1,
    summary: 'Compact flash chemiluminescence immunoassay analyzer for hospitals and clinical laboratories, with 16 sample positions and 4 reagents on board.',
    specs: [
      ['Brand', 'Snibe'],
      ['Model', 'Maglumi 600'],
      ['Application', 'Hospital, clinical laboratory'],
      ['Throughput', 'Up to 180 tests/hour'],
      ['Time to first result', '17 minutes'],
      ['Modes of operation', 'Random, batch and STAT'],
      ['Calibration stability', 'Up to 4 weeks'],
      ['Ready to use', '24 hours'],
      ['Dimensions', '88 x 56 x 50 cm'],
      ['Weight', '56 kg'],
      ['Operating temperature', '15-30 °C']
    ],
    features: [
      'Non-enzyme flash chemiluminescence, long reagent stability',
      'Up to 16 sample tubes, continuous loading, STAT available',
      '4 reagents on board, continuous loading',
      'Refrigerated sample and reagent areas',
      'Integrated ready-to-use kits, including calibrators',
      'Superparamagnetic microbeads',
      'RFID tag stores reagent information and master curve',
      'Clot detection and reagent liquid level detection',
      'Auto dilution for high-concentration samples',
      'LIS connection through COM port or network card'
    ]
  },
  {
    slug: 'elisa-reader',
    name: 'ELISA Microplate Reader',
    category: 'immunoassay',
    brand: '',
    price: '₹1,50,000',
    unit: 'piece',
    images: 2,
    photoNote: 'Photos show two reader models. Ask which is currently available.',
    summary: 'Semi-automatic microplate reader with LCD display, for hospital laboratories.',
    specs: [['Model', 'LDX1'], ['Operation', 'Semi-automatic'], ['Display', 'LCD'], ['Application', 'Hospital laboratory']],
    features: []
  },

  // Hematology and ESR
  {
    slug: 'yumizen-h2500',
    name: 'Horiba Yumizen H2500 / H1500 Hematology Analyzer',
    category: 'hematology',
    brand: 'Horiba',
    price: '₹60,00,000',
    unit: 'piece',
    images: 1,
    summary: 'High-volume hematology system for large laboratories. Ask us for the specification sheet.',
    specs: [['Brand', 'Horiba'], ['Model', 'Yumizen H2500 / H1500']],
    features: []
  },
  {
    slug: 'yumizen-h500',
    name: 'Horiba Yumizen H500 CT Hematology Analyzer',
    category: 'hematology',
    brand: 'Horiba',
    price: '₹8,00,000',
    unit: 'piece',
    images: 1,
    summary: 'Compact 5-part analyzer for small and mid-sized laboratories, satellite laboratories, emergency departments and physician offices.',
    specs: [
      ['Brand', 'Horiba'],
      ['Model', 'Yumizen H500 CT'],
      ['Differential', '5-part'],
      ['Parameters', '27'],
      ['Throughput', '50 tests/hour'],
      ['Sample', 'Whole blood, 20 µL'],
      ['Reagents', '2 for CBC and DIFF analysis'],
      ['Operation', 'Fully automatic'],
      ['Data storage', '10,000 patient files']
    ],
    features: [
      'Impedance and optical detection',
      'Flags and alarms expert system',
      'Compact system with a simple user interface'
    ]
  },
  {
    slug: 'abx-micros-es60',
    name: 'Horiba ABX Micros ES 60 Hematology Analyzer',
    category: 'hematology',
    brand: 'Horiba',
    price: '₹3,50,000',
    unit: 'piece',
    images: 2,
    summary: 'CBC and 3-part differential analyzer, available in open tube and closed tube versions.',
    specs: [
      ['Brand', 'Horiba'],
      ['Model', 'ABX Micros ES 60'],
      ['Differential', 'CBC and 3-part'],
      ['Parameters', '19'],
      ['Throughput', '60 samples/hour open tube, 50 samples/hour closed tube'],
      ['Operation', 'Fully automatic']
    ],
    features: []
  },
  {
    slug: 'micros-es60-counter',
    name: 'Horiba Micros ES 60 Blood Cell Counter',
    category: 'hematology',
    brand: 'Horiba',
    price: '₹3,30,000',
    unit: 'piece',
    images: 1,
    summary: '3-part blood cell counter using electrical impedance, with a 10 µL whole blood sample.',
    specs: [
      ['Brand', 'Horiba'],
      ['Model', 'Micros ES 60'],
      ['Differential', '3-part'],
      ['Method', 'Electrical impedance'],
      ['Throughput', '60 tests/hour'],
      ['Sample', 'Whole blood, 10 µL'],
      ['Reagents', '3'],
      ['Chambers', '2'],
      ['Operation', 'Fully automatic']
    ],
    features: []
  },
  {
    slug: 'micros-60',
    name: 'Horiba Micros 60 Hematology Analyzer',
    category: 'hematology',
    brand: 'Horiba',
    price: '₹3,30,000',
    unit: 'piece',
    images: 1,
    summary: '3-part analyzer for pathology laboratories, reporting 19 parameters from a 10 µL sample.',
    specs: [
      ['Brand', 'Horiba'],
      ['Model', 'Micros 60'],
      ['Differential', '3-part'],
      ['Parameters', '19'],
      ['Method', 'Electrical impedance'],
      ['Throughput', '60 tests/hour'],
      ['Sample', 'Whole blood, 10 µL'],
      ['Chambers', '2'],
      ['Cost per test', '₹12-13'],
      ['Operation', 'Fully automatic'],
      ['Application', 'Pathology laboratory']
    ],
    features: []
  },
  {
    slug: 'mindray-cell-counter',
    name: 'Mindray 3-Part Cell Counter',
    category: 'hematology',
    brand: 'Mindray',
    price: '₹3,00,000',
    unit: 'piece',
    images: 1,
    summary: 'Automatic 3-part cell counter for hospitals and laboratories.',
    specs: [
      ['Brand', 'Mindray'],
      ['Differential', '3-part'],
      ['Operation', 'Automatic'],
      ['Operating temperature', '15-30 °C'],
      ['Application', 'Hospital, laboratory']
    ],
    features: []
  },
  {
    slug: '3-part-cell-counter',
    name: '3-Part Automatic Blood Cell Counter',
    category: 'hematology',
    brand: '',
    price: '₹2,90,000',
    unit: 'piece',
    images: 1,
    summary: 'Automatic 3-part counter with built-in printer, for hospitals and laboratories.',
    specs: [
      ['Differential', '3-part'],
      ['Operation', 'Automatic'],
      ['Sample', 'Whole blood'],
      ['Application', 'Hospital, laboratory']
    ],
    features: []
  },
  {
    slug: 'manual-differential-counter',
    name: 'Manual Differential Cell Counter',
    category: 'hematology',
    brand: '',
    price: null,
    unit: '',
    images: 2,
    summary: 'Bench-top key counters for manual differential cell counts.',
    specs: [],
    features: []
  },
  {
    slug: 'roller-mc-esr',
    name: 'Roller MC ESR Analyzer',
    category: 'hematology',
    brand: '',
    price: '₹2,50,000',
    unit: 'piece',
    images: 2,
    photoNote: 'Photos show ESR analyzers from the same range.',
    summary: 'Fully automatic ESR analyzer.',
    specs: [['Model', 'Roller MC'], ['Type', 'ESR analyzer'], ['Operation', 'Fully automatic']],
    features: []
  },

  // Biochemistry and electrolytes
  {
    slug: 'fully-automatic-biochemistry',
    name: 'Fully Automatic Biochemistry Analyzer',
    category: 'biochemistry',
    brand: '',
    price: '₹5,00,000',
    unit: 'piece',
    images: 3,
    photoNote: 'Photos show different models. Ask which is currently available.',
    summary: 'Fully automatic clinical chemistry analyzer with disposable reaction cuvettes.',
    specs: [['Operation', 'Fully automatic'], ['Assays', 'Clinical chemistry'], ['Reaction cuvette', 'Disposable']],
    features: []
  },
  {
    slug: 'labmate-biochemistry',
    name: 'Labmate Semi-Automatic Biochemistry Analyzer',
    category: 'biochemistry',
    brand: 'Labmate',
    price: '₹1,25,000',
    unit: 'piece',
    images: 3,
    summary: 'Bench-top analyzer with clinical chemistry, turbidimetry and coagulation modes and a multipurpose incubator. Erba models are also available.',
    specs: [
      ['Brand', 'Labmate (Erba also available)'],
      ['Type', 'Bench-top, semi-automatic'],
      ['Photometric range', '0 to 3 OD'],
      ['Resolution', '0.0001 A'],
      ['Wavelengths', '8'],
      ['Interference filters', '340, 405, 450, 505, 546, 578, 630 and 670 nm'],
      ['Light source', 'Halogen lamp'],
      ['Flow cell', '18 µL quartz'],
      ['Reaction cuvette', 'Flow cell, reusable cuvette'],
      ['Square cuvette', '10 mm'],
      ['Round tube with adaptor', '6 mm'],
      ['Peltier temperature control', '25 °C, 30 °C, 37 °C and room temperature']
    ],
    features: [
      '3 reading modes: flow cell, cuvette and tube',
      '7-inch colour touch screen, with mouse, keyboard and barcode reader support',
      'Analysis methods: endpoint with reagent blank, two-point end, kinetic, fixed time, turbidimetry, coagulation and absorbance'
    ]
  },
  {
    slug: 'horiba-semi-auto-biochemistry',
    name: 'Horiba Yumizen Semi-Automatic Biochemistry Analyzer',
    category: 'biochemistry',
    brand: 'Horiba',
    price: '₹1,25,000',
    unit: 'piece',
    images: 1,
    summary: 'Semi-automatic clinical chemistry analyzer with flow cell.',
    specs: [['Brand', 'Horiba'], ['Operation', 'Semi-automatic'], ['Assays', 'Clinical chemistry'], ['Reaction cuvette', 'Flow cell']],
    features: []
  },
  {
    slug: 'st-200-pro',
    name: 'Sensa Core ST-200 Pro Electrolyte Analyzer',
    category: 'biochemistry',
    brand: 'Sensa Core',
    price: '₹1,50,000',
    unit: 'piece',
    images: 1,
    summary: 'Electrolyte analyzer for small and medium-sized laboratories, with snap-in electrodes and a low cost per sample.',
    specs: [
      ['Brand', 'Sensa Core'],
      ['Model', 'ST-200 Pro'],
      ['Measures', 'Cl-, Ca++, Li+, Na+'],
      ['Sample', 'Whole blood from syringe, 140 µL'],
      ['Result time', '65 seconds'],
      ['Throughput', '55 results/hour'],
      ['Sample storage', '2,00,000+ results'],
      ['Display', '7-inch touch screen'],
      ['Operating system', 'Android'],
      ['Printer', '2-inch, 24-column thermal'],
      ['Weight', '4.3 kg'],
      ['Input voltage', '110/115 V AC or 220 V AC, 50-60 Hz, 0.75 A'],
      ['Operating conditions', '5-40 °C, under 85% humidity']
    ],
    features: [
      'Maintenance is limited to replacing the reagent pack, electrodes, disposable valve and pump tube',
      'Available in two variants by sampling procedure'
    ]
  },
  {
    slug: 'prolyte',
    name: 'Diamond Prolyte Automatic Electrolyte Analyzer',
    category: 'biochemistry',
    brand: 'Diamond',
    price: '₹1,50,000',
    unit: 'unit',
    images: 1,
    summary: 'Fully automatic electrolyte analyzer with 65-second results and 12 parameter combinations.',
    specs: [
      ['Brand', 'Diamond (USA)'],
      ['Model', 'Prolyte'],
      ['Operation', 'Fully automatic'],
      ['Sample volume', '140 µL'],
      ['Result time', '65 seconds'],
      ['Parameter combinations', '12'],
      ['Sample storage', '1,00,000 results'],
      ['Display', '128 x 64 graphic display'],
      ['Printer', '2-inch, 24-column thermal'],
      ['Dimensions', '15 W x 12 L x 7 H inches'],
      ['Weight', '6 kg'],
      ['Input voltage', '110/115 V AC or 220 V AC, 50-60 Hz, 0.75 A'],
      ['Operating conditions', '5-40 °C, under 85% humidity']
    ],
    features: []
  },

  // Point-of-care testing
  {
    slug: 'finecare-hba1c',
    name: 'Wondfo Finecare HbA1c Analyzer',
    category: 'point-of-care',
    brand: 'Finecare',
    price: '₹80,000',
    unit: 'unit',
    images: 2,
    summary: 'Portable fluorescence analyzer for quantitative testing. Runs HbA1c and a range of cardiac, infection, tumor, renal and hormone markers on one instrument.',
    specs: [
      ['Brand', 'Finecare'],
      ['Application', 'Hospital'],
      ['Weight', '8 kg'],
      ['Size', '408 x 390 x 230 mm'],
      ['Data storage', '1,000 test reports, including test curves'],
      ['Cardiovascular', 'NT-proBNP, cTnI, Myo, CK-MB, H-FABP, BNP'],
      ['Infection', 'PCT, CRP, hsCRP, SAA'],
      ['Tumor', 'AFP, PSA, CEA'],
      ['Renal', 'MAU, Cys-C, NGAL, β2-MG'],
      ['Hormone', 'T3, T4, TSH, Vitamin D, Progesterone, LH, FSH'],
      ['Coagulation', 'D-Dimer']
    ],
    features: [
      'HbA1c test is IFCC and NGSP certified',
      'No sample or reagent preparation before testing'
    ]
  },
  {
    slug: 'yumizen-g100',
    name: 'Horiba Yumizen G100 Coagulation Analyzer',
    category: 'point-of-care',
    brand: 'Horiba',
    price: '₹80,000',
    unit: 'piece',
    images: 1,
    summary: 'Handheld INR screening analyzer that needs one drop of capillary blood and gives a result within 120 seconds.',
    specs: [
      ['Brand', 'Horiba'],
      ['Model', 'Yumizen G100'],
      ['Measurement time', '120 seconds maximum'],
      ['Sampling volume', '20 µL'],
      ['Data storage', '1,000 results'],
      ['Size', '102 L x 55 H x 165 D mm'],
      ['Weight', '0.38 kg'],
      ['Power', '100-240 V, 50-60 Hz, or 6 x 1.5 V AA batteries'],
      ['Operating temperature', '15-32 °C'],
      ['Printer', 'Optional, with Yumizen G data software']
    ],
    features: [
      'Disposable single-test reagent and single-use reaction cuvette',
      'RFID reagent identification and QC management',
      'Whole blood analysis with a dedicated safety lancet',
      'Connects to laboratory information systems'
    ]
  },
  {
    slug: 'urit-50',
    name: 'URIT 50 Urine Analyzer',
    category: 'point-of-care',
    brand: 'URIT',
    price: '₹45,000',
    unit: 'piece',
    images: 2,
    summary: 'Semi-automatic bench-top urine analyzer with a 60-second reaction time and storage for 5,000 results.',
    specs: [
      ['Model', 'URIT 50'],
      ['Operation', 'Semi-automatic'],
      ['Measuring wavelengths', '3 LED: 550, 620 and 720 nm'],
      ['Reaction time', '60 seconds'],
      ['Memory', '5,000 results'],
      ['Display', 'LCD'],
      ['Size', '290 x 200 x 100 mm'],
      ['Weight', '2 kg'],
      ['Power', '12 V DC, 4 A adaptor']
    ],
    features: []
  },

  // Reagents
  {
    slug: 'abx-minidil-lmg',
    name: 'Horiba ABX Minidil LMG Reagent',
    category: 'reagents',
    brand: 'Horiba',
    price: '₹9,000',
    unit: 'piece',
    images: 1,
    summary: 'Liquid laboratory reagent in a 1 L pack.',
    specs: [['Brand', 'Horiba'], ['Form', 'Liquid'], ['Capacity', '1 L'], ['Grade', 'Laboratory'], ['Store at', '18-25 °C']],
    features: []
  },

  // Hospital beds and ward furniture
  {
    slug: 'icu-electric-bed',
    name: 'Swarnraj ICU Electric Hospital Bed',
    category: 'beds',
    brand: 'Swarnraj',
    price: '₹1,08,000',
    unit: 'piece',
    images: 1,
    summary: 'Electric ICU bed with elevation, Trendelenburg and reverse, back section and foot-end adjustment.',
    specs: [['Brand', 'Swarnraj'], ['Model', 'SR-HB / P-301E'], ['Type', 'Electric'], ['Castors', '125 mm'], ['Application', 'Hospital']],
    features: [
      'M.S. perforated top',
      'ABS plastic head and foot bows',
      'ABS side railing, set of 4',
      'One S.S. telescopic saline rod'
    ]
  },
  {
    slug: 'automatic-icu-bed',
    name: 'Swarnraj Automatic ICU Bed',
    category: 'beds',
    brand: 'Swarnraj',
    price: '₹15,500',
    unit: 'piece',
    images: 1,
    summary: 'ICU bed with remote-operated back section and foot end, and mechanically operated Trendelenburg and reverse.',
    specs: [['Brand', 'Swarnraj'], ['Model', 'SR-HB / P-307EM'], ['Type', 'Electric'], ['Castors', '125 mm'], ['Application', 'Hospital']],
    features: [
      'M.S. perforated top',
      'ABS plastic head and foot bows',
      'Collapsible aluminium or S.S. railing',
      'One S.S. saline rod'
    ]
  },
  {
    slug: 'isolation-bed-electric',
    name: 'Electric Isolation / Quarantine Bed',
    category: 'beds',
    brand: '',
    price: '₹1,08,000',
    unit: 'piece',
    images: 1,
    summary: 'Automatic electric bed with a heavy steel frame, for isolation wards.',
    specs: [['Type', 'Electric'], ['Operation', 'Automatic'], ['Frame', 'Heavy steel'], ['Application', 'Hospital']],
    features: []
  },
  {
    slug: 'isolation-bed-manual',
    name: 'Manual Isolation / Quarantine Bed',
    category: 'beds',
    brand: '',
    price: '₹60,000',
    unit: 'piece',
    images: 2,
    summary: 'Standard manual bed, 6 feet long, for isolation wards.',
    specs: [['Type', 'Standard'], ['Operation', 'Manual'], ['Material', 'Heavy steel'], ['Length', '6 feet'], ['Application', 'Hospital']],
    features: []
  },
  {
    slug: 'bedside-locker',
    name: 'Swarnraj Bedside Locker',
    category: 'beds',
    brand: 'Swarnraj',
    price: '₹8,000',
    unit: 'unit',
    images: 2,
    summary: 'Compact bedside locker with drawer and cupboard, mobile on four castors.',
    specs: [['Brand', 'Swarnraj'], ['Model', 'SR-BL / P-L1'], ['Material', 'Stainless steel'], ['Wheels', '4'], ['Application', 'Hospital']],
    features: ['Compact design', 'ABS plastic moulded locker', 'Drawer and cupboard', 'Mobile on castors']
  },

  // Operation theatre and disinfection
  {
    slug: 'ot-table',
    name: 'Swarnraj Electro-Hydraulic OT Table',
    category: 'operation-theatre',
    brand: 'Swarnraj',
    price: '₹3,00,000',
    unit: 'piece',
    images: 6,
    summary: 'Electro-hydraulic operation theatre table with an SUS 304 stainless steel top frame and column, and a full-length radiolucent cassette tunnel.',
    specs: [
      ['Brand', 'Swarnraj'],
      ['Model', 'SR-OTT / EH-201'],
      ['Table length', '1960 mm'],
      ['Table width', '530 mm'],
      ['Height range', '760 to 1000 mm'],
      ['Trendelenburg', '25°'],
      ['Reverse Trendelenburg', '20°'],
      ['Lateral tilt', '20° left and right'],
      ['Back up / down', '90° / 40°'],
      ['Head up / down', '60° / 90°, manual'],
      ['Leg down', '90°, manual'],
      ['Kidney elevation', '1 to 120 mm']
    ],
    features: [
      'Electro-hydraulic and manual-hydraulic adjustment of height, tilt, back section, floor lock and longitudinal slide',
      'Full-length 14-inch radiolucent cassette tunnel from head section to pelvic section',
      'Runs on AC mains or rechargeable batteries',
      'Supplied with rubber mattress set, anesthetist screen, padded lithotomy crutches, arm rest, and padded shoulder and lateral supports',
      'Optional: universal orthopedic attachment (floor or hanging model), neurosurgery attachment, arm surgery attachment, S.S. urology tray'
    ]
  },
  {
    slug: 'led-ot-light',
    name: 'Swarnraj Ceiling-Mounted LED OT Light',
    category: 'operation-theatre',
    brand: 'Swarnraj',
    price: '₹33,000',
    unit: 'piece',
    images: 3,
    summary: 'Ceiling-mounted LED operation theatre light with adjustable focus and an 8-level intensity controller.',
    specs: [
      ['Brand', 'Swarnraj'],
      ['Model', 'SR-OTL / CL-110'],
      ['Intensity', '1,30,000 + 1,00,000 lux, ±10%'],
      ['Light field', '12-30 cm'],
      ['Colour temperature', '4000-5000 K'],
      ['Colour rendering index', '93 Ra'],
      ['LED life', '50,000 hours'],
      ['Focus', 'Adjustable'],
      ['Brightness control', '8-level intensity controller'],
      ['Power supply', '220 V / 50 Hz AC']
    ],
    features: []
  },
  {
    slug: 'fogging-machine',
    name: 'Nanofog Stainless Steel Fogging Machine',
    category: 'operation-theatre',
    brand: 'Nanofog',
    price: '₹35,000',
    unit: 'unit',
    images: 2,
    summary: 'Automatic electric fogger for disinfecting hospitals, clinics, laboratories and other enclosed spaces.',
    specs: [
      ['Brand', 'Nanofog'],
      ['Type', 'Automatic'],
      ['Power source', 'Electricity'],
      ['Material', 'Stainless steel'],
      ['Application', 'Hospitals, clinics, laboratories, showrooms, schools, malls']
    ],
    features: []
  }
];

// Every IndiaMART listing (checked 1 Nov 2026) and the product that carries it: [listing name, listed price, slug].
// The names also feed the catalogue search, and the build fails if a slug or price stops matching.
const listings = [
  ['Fine Care Blood HbA1c Analyzer', '₹80,000', 'finecare-hba1c'],
  ['Maglumi X3 Fully Automatic Immunoassay Analyzer', '₹17,00,000', 'maglumi-x3'],
  ['Maglumi 600 Fully Automatic Immunoassay Analyzer', '₹8,00,000', 'maglumi-600'],
  ['YUMIZEN H 2500/1500 Hematology Analyzer', '₹60,00,000', 'yumizen-h2500'],
  ['Yumizen H500 CT Hematology Analyzer', '₹8,00,000', 'yumizen-h500'],
  ['Micros 60 Hematology Analyzer', '₹3,30,000', 'micros-60'],
  ['Blood Coagulation Analyzer', '₹80,000', 'yumizen-g100'],
  ['Urit 50 Urine Analyzer', '₹45,000', 'urit-50'],
  ['ST-200 Pro Electrolyte Analyzer', '₹1,50,000', 'st-200-pro'],
  ['Labmate Biochemistry Analyzer', '₹1,25,000', 'labmate-biochemistry'],
  ['Maglumi 1000 Fully Automated Immunoassay Analyzer', '₹13,00,000', 'maglumi-1000'],
  ['ABX Micros ES 60 Analyzers', '₹3,50,000', 'abx-micros-es60'],
  ['Blood Cell Counter', '₹2,90,000', '3-part-cell-counter'],
  ['Mindray Cell Counter', '₹3,00,000', 'mindray-cell-counter'],
  ['Blood Cell Counter Machine', '₹2,90,000', '3-part-cell-counter'],
  ['Semi Auto Coagulation Analyser', '₹80,000', 'yumizen-g100'],
  ['Chemistry Analyzers', '₹1,25,000', 'labmate-biochemistry'],
  ['Semi Auto Biochemistry Analyzer', '₹1,25,000', 'horiba-semi-auto-biochemistry'],
  ['Automatic Electrolyte Analyzer', '₹1,50,000', 'prolyte'],
  ['Electric Isolation/ Quarantine Beds', '₹1,08,000', 'isolation-bed-electric'],
  ['Manual Isolation/ Quarantine Bed', '₹60,000', 'isolation-bed-manual'],
  ['Fully Automated Biochemistry Analyzer', '₹5,00,000', 'fully-automatic-biochemistry'],
  ['Blood Gas Analyzer', '₹80,000', 'finecare-hba1c'],
  ['ICU Electric Hospital Bed', '₹1,08,000', 'icu-electric-bed'],
  ['Automatic ICU Bed', '₹15,500', 'automatic-icu-bed'],
  ['Blood Cell Counter', '₹3,30,000', 'micros-es60-counter'],
  ['Led Ot Lights', '₹33,000', 'led-ot-light'],
  ['Elisa Microplate Reader', '₹1,50,000', 'elisa-reader'],
  ['ROLLER MC ESR ANSLYSER', '₹2,50,000', 'roller-mc-esr'],
  ['Chemiluminescence Immunoassay Analyzer', '₹9,50,000', 'maglumi-800'],
  ['Bed Side Locker', '₹8,000', 'bedside-locker'],
  ['Fogging Instrument Stainless Steel For Disinfection', '₹35,000', 'fogging-machine'],
  ['ABX Minidil LMG Reagents', '₹9,000', 'abx-minidil-lmg'],
  ['Electro Hydraulic Operation Room Table', '₹3,00,000', 'ot-table'],
  ['Semi Auto Biochemistry Analyzer', '₹1,25,000', 'labmate-biochemistry'],
  ['Mindray Cell Counter', '₹3,00,000', 'mindray-cell-counter']
];

module.exports = { categories, products, listings };
