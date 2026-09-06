/**
 * Affiliation Hospitals and Duty Commute Guide Metadata
 * Extracted from Clinical Duty Orientation slide and student commute memo.
 */

export const CLINICAL_HOSPITALS = [
  {
    id: "east_ave_med_ctr",
    name: "East Avenue Medical Center (EAMC)",
    shortName: "East Avenue",
    area: "Diliman, Quezon City",
    highlighted: true, // Marked with yellow line on orientation slide
    colorBadge: "#FF8DA1",
    memoRoutes: [
      {
        title: "Route 1: Via SM North",
        steps: [
          "Ride jeep or EDSA Carousel to SM North EDSA",
          "Tawid to SM North",
          "Find jeep terminal going to UP Diliman (passes East Avenue)"
        ],
        caution: "✨ Matagal mapuno ang jeep to UP if morning duty rush!"
      },
      {
        title: "Route 2: Via Quezon Ave Centris",
        steps: [
          "Ride EDSA Carousel to Quezon Avenue Station",
          "Walk until Eton Centris",
          "Take tricycle directly to East Avenue Medical Center"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'East Avenue Medical Center po'."
  },
  {
    id: "val_med_ctr",
    name: "Valenzuela Medical Center (VMC)",
    shortName: "Valenzuela Med",
    area: "Karuhatan, Valenzuela City",
    highlighted: true, // Marked with yellow line on orientation slide
    colorBadge: "#F59E0B",
    memoRoutes: [
      {
        title: "From McArthur Highway / Karuhatan",
        steps: [
          "Ride Malanday-Monumento jeep along McArthur Highway",
          "Drop off at Karuhatan Junction (Padrigal St)",
          "Walk 3 minutes along Padrigal St to VMC entrance (or take local tricycle)"
        ],
        caution: "Located right by Karuhatan Junction along McArthur Highway! Ideal for morning shift call time."
      }
    ],
    studentTips: "Sabihin sa jeepney driver: 'Karuhatan Padrigal po, Valenzuela Med.'"
  },
  {
    id: "justice_abad_santos",
    name: "Justice Jose Abad Santos General Hospital",
    shortName: "Justice Abad Santos",
    area: "Binondo / San Nicolas, Manila",
    highlighted: true, // Marked with yellow line on orientation slide
    colorBadge: "#8B5CF6",
    memoRoutes: [
      {
        title: "Via Recto / Divisoria",
        steps: [
          "LRT-1 to Doroteo Jose or jeep to Recto / Divisoria",
          "Drop off at Divisoria / Binondo area",
          "Walk 6-7 minutes along Numancia Street directly to hospital gates"
        ],
        caution: "Keep valuables secure while walking along the Divisoria/Binondo corridor."
      }
    ],
    studentTips: "Sabihin: 'Divisoria Numancia po' or walk from Binondo church."
  },
  {
    id: "tondo_med_ctr",
    name: "Tondo Medical Center (TMC)",
    shortName: "Tondo Med",
    area: "Honorio Lopez Blvd, Tondo, Manila",
    highlighted: false,
    colorBadge: "#3B82F6",
    memoRoutes: [
      {
        title: "Route 1: Via Tayuman LRT (from memo)",
        steps: [
          "Ride jeep or LRT-1 to Tayuman Station",
          "Ride jeep bound for Pritil",
          "From Pritil, ride jeep bound for Gasak (along Honorio Lopez Blvd)"
        ],
        caution: "Double transfer route, prepare exact coins for quick boarding!"
      },
      {
        title: "Route 2: Via Monumento Hypermarket (from memo)",
        steps: [
          "Baba sa Hypermarket Monumento",
          "Tawid footbridge to Puregold Monumento",
          "Ride jeep going to Bayan Malabon",
          "Ride jeep bound for Divisoria (passes Honorio Lopez Blvd / Tondo Med)"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'Tondo Med / Honorio Lopez po'."
  },
  {
    id: "ospital_ng_sampaloc",
    name: "Ospital ng Sampaloc",
    shortName: "Ospital ng Sampaloc",
    area: "Geronimo St, Sampaloc, Manila",
    highlighted: false,
    colorBadge: "#10B981",
    memoRoutes: [
      {
        title: "Via Tayuman LRT (from memo)",
        steps: [
          "Ride LRT-1 to Tayuman Station",
          "Tawid until the stoplight intersection",
          "Ride jeep bound for Sampaloc / Lardizabal directly to Geronimo Street"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'Geronimo Ospital ng Sampaloc'."
  },
  {
    id: "qc_gen_hosp",
    name: "Quezon City General Hospital (QCGH)",
    shortName: "QC General",
    area: "Seminary Rd, Project 8, Quezon City",
    highlighted: false,
    colorBadge: "#06B6D4",
    memoRoutes: [
      {
        title: "Via SM North or Balintawak",
        steps: [
          "From SM North or Balintawak, ride jeep bound for Project 8 / Muñoz",
          "Pass through Seminary Road",
          "Alight right in front of QCGH gate"
        ],
        caution: "Watch out for heavy traffic along EDSA Muñoz intersection in the morning."
      }
    ],
    studentTips: "Sabihin: 'Seminary QC General Hospital po'."
  },
  {
    id: "fabella_med_ctr",
    name: "Dr. Jose Fabella Memorial Hospital",
    shortName: "Fabella Hospital",
    area: "San Lazaro Compound, Sta. Cruz, Manila",
    highlighted: false,
    colorBadge: "#EC4899",
    memoRoutes: [
      {
        title: "Via Tayuman / San Lazaro",
        steps: [
          "LRT-1 to Tayuman Station",
          "Walk 5 minutes along Rizal Ave / Lope de Vega into San Lazaro Compound"
        ],
        caution: "National maternity hospital — allow extra minutes for hospital security check-in."
      }
    ],
    studentTips: "Sabihin: 'San Lazaro Compound / Fabella Hospital'."
  },
  {
    id: "malabon_health_dept",
    name: "Malabon Health Department",
    shortName: "Malabon Health Dept",
    area: "F. Sevilla Blvd, San Agustin, Malabon",
    highlighted: false,
    colorBadge: "#14B8A6",
    memoRoutes: [
      {
        title: "Via Monumento to Malabon Bayan",
        steps: [
          "From Monumento, board jeep bound for Malabon Bayan",
          "Alight at Malabon City Hall / San Agustin",
          "Walk along F. Sevilla Boulevard"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'Bayan Malabon City Hall / Health Dept'."
  },
  {
    id: "ospital_ng_malabon",
    name: "Ospital ng Malabon",
    shortName: "Ospital ng Malabon",
    area: "Maya-maya St, Longos, Malabon",
    highlighted: false,
    colorBadge: "#0284C7",
    memoRoutes: [
      {
        title: "Via Monumento or Malabon Bayan",
        steps: [
          "Ride jeep bound for Dagat-Dagatan / Longos from Monumento or Bayan Malabon",
          "Alight at Maya-maya Street intersection"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'Ospital ng Malabon / Maya-maya St'."
  },
  {
    id: "ospital_ng_tondo",
    name: "Ospital ng Tondo",
    shortName: "Ospital ng Tondo",
    area: "Jose Abad Santos Ave, Tondo, Manila",
    highlighted: false,
    colorBadge: "#6366F1",
    memoRoutes: [
      {
        title: "Via Tayuman / Abad Santos",
        steps: [
          "LRT-1 to Tayuman Station",
          "Ride jeep along Jose Abad Santos Ave heading south to Ospital ng Tondo"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'Ospital ng Tondo po'."
  },
  {
    id: "city_care_valenzuela",
    name: "City Care Valenzuela",
    shortName: "City Care",
    area: "McArthur Highway, Valenzuela City",
    highlighted: false,
    colorBadge: "#EAB308",
    memoRoutes: [
      {
        title: "Along McArthur Highway",
        steps: [
          "Walk or take local tricycle / jeep along McArthur Highway",
          "Quick 3-5 minute transit along the highway corridor"
        ],
        caution: null
      }
    ],
    studentTips: "Super convenient access along McArthur Highway in Valenzuela!"
  },
  {
    id: "meycauayan_doctors",
    name: "Meycauayan Doctors Hospital and Medical Center",
    shortName: "Meycauayan Doctors",
    area: "Iba / Camalig Rd, Meycauayan, Bulacan",
    highlighted: false,
    colorBadge: "#D97706",
    memoRoutes: [
      {
        title: "From Malanday / McArthur Highway",
        steps: [
          "Ride jeep from Malanday Terminal heading Meycauayan Bayan",
          "Take tricycle from highway junction directly to Meycauayan Doctors"
        ],
        caution: "Provincial route — allow allowance for highway choke points during rush hour."
      }
    ],
    studentTips: "Sabihin: 'Meycauayan Doctors Hospital po'."
  },
  {
    id: "st_michael_marilao",
    name: "St. Michael Hospital (Marilao)",
    shortName: "St. Michael Marilao",
    area: "Abangan Sur, McArthur Highway, Marilao, Bulacan",
    highlighted: false,
    colorBadge: "#9333EA",
    memoRoutes: [
      {
        title: "Direct Highway Jeep",
        steps: [
          "Board jeep along McArthur Highway bound for Marilao / Bocaue / Balagtas",
          "Alight at Abangan Sur in front of St. Michael Hospital"
        ],
        caution: null
      }
    ],
    studentTips: "Sabihin: 'St. Michael Hospital Abangan Sur po'."
  },
  {
    id: "kairos_maternity",
    name: "Kairos Maternity & Medical Center",
    shortName: "Kairos Maternity",
    area: "Marilao / Muzon, Bulacan",
    highlighted: false,
    colorBadge: "#F43F5E",
    memoRoutes: [
      {
        title: "Via Marilao or Novaliches",
        steps: [
          "From Marilao highway or Novaliches Terminal, ride jeep / tricycle heading towards Muzon",
          "Drop off at Kairos Maternity & Medical Center"
        ],
        caution: "Maternity facility rotation duty — bring extra duty scrub sets!"
      }
    ],
    studentTips: "Sabihin: 'Kairos Maternity Center po'."
  }
];
