// ============================================================
// QUESTION BANK — edit this array to add/remove/modify questions
// Each question belongs to a category and has an optional weight
// Weight 1 = standard, Weight 2 = critical (counts double)
// ============================================================

export type Category =
  | "Front End"
  | "GI / Goods In"
  | "Service Desk"
  | "General Store"
  | "Security"
  | "Team Compliance";

export interface Question {
  id: string;
  text: string;
  category: Category;
  weight: 1 | 2; // 1 = standard, 2 = critical
  hint?: string;
}

export const QUESTIONS: Question[] = [
  // ── Front End ──────────────────────────────────────────────────
  {
    id: "fe_01",
    text: "Monitor the people greeter for 10 customers exiting the store. Were they in position and did they complete bag and receipt checks?",
    category: "Front End",
    weight: 2,
    hint: "Observe 10 consecutive exits. Both position AND check required for a pass.",
  },
  {
    id: "fe_02",
    text: "Are all self-checkout lanes marked in red paint?",
    category: "Front End",
    weight: 2,
    hint: "No lane should be left unattended for more than 2 minutes.",
  },
  {
    id: "fe_03",
    text: "Are checkout operators following the 'scan all items' policy with no items left in the trolley?",
    category: "Front End",
    weight: 2,
    hint: "Observe at least 2 operators during live transactions.",
  },
  {
    id: "fe_04",
    text: "Is the till float secure and are cash handling procedures being followed correctly?",
    category: "Front End",
    weight: 1,
  },

  // ── GI / Goods In ─────────────────────────────────────────────
  {
    id: "gi_01",
    text: "Have there been any short supply claims raised with the GI team this week?",
    category: "GI / Goods In",
    weight: 1,
    hint: "A 'Yes' means no claims — compliance is the absence of issues.",
  },
  {
    id: "gi_02",
    text: "Is the goods-in area secure with no unauthorised access points left open?",
    category: "GI / Goods In",
    weight: 2,
  },
  {
    id: "gi_03",
    text: "Are all deliveries being checked against purchase orders before being processed?",
    category: "GI / Goods In",
    weight: 2,
    hint: "Spot check the last 3 delivery notes against stock received.",
  },
  {
    id: "gi_04",
    text: "Is waste and returns stock being processed and recorded correctly?",
    category: "GI / Goods In",
    weight: 1,
  },

  // ── Service Desk ───────────────────────────────────────────────
  {
    id: "sd_01",
    text: "Is the service desk following refund verification procedures (receipt or loyalty card required)?",
    category: "Service Desk",
    weight: 2,
    hint: "Test with a hypothetical refund scenario if no live example is available.",
  },
  {
    id: "sd_02",
    text: "Are all exchanges being processed through the till with a printed record?",
    category: "Service Desk",
    weight: 2,
  },
  {
    id: "sd_03",
    text: "Is customer returns stock being quarantined and inspected before going back to the shop floor?",
    category: "Service Desk",
    weight: 1,
  },

  // ── General Store ──────────────────────────────────────────────
  {
    id: "gs_01",
    text: "Are high-theft items secured correctly (locked cases, spider wraps, or secure fixtures)?",
    category: "General Store",
    weight: 2,
    hint: "Check all high-value categories: electronics, spirits, cosmetics.",
  },
  {
    id: "gs_02",
    text: "Are empty security packaging cases disposed of in a secure area (not left on shelves)?",
    category: "General Store",
    weight: 1,
  },
  {
    id: "gs_03",
    text: "Are all stock-room doors locked when not in active use?",
    category: "General Store",
    weight: 2,
  },
  {
    id: "gs_04",
    text: "Is the store CCTV system operational and covering all required zones with no blind spots?",
    category: "General Store",
    weight: 2,
    hint: "Check the monitoring screen for all camera feeds.",
  },

  // ── Security ───────────────────────────────────────────────────
  {
    id: "sec_01",
    text: "Was the fire exit alarm active and functioning correctly at last test?",
    category: "Security",
    weight: 2,
    hint: "Check the alarm test log — must have been tested within the last 7 days.",
  },
  {
    id: "sec_02",
    text: "Are all EAS (Electronic Article Surveillance) pedestals powered on and alarming correctly?",
    category: "Security",
    weight: 2,
    hint: "Test with a tagged item. Both entrance and exit pedestals must pass.",
  },
  {
    id: "sec_03",
    text: "Is the panic alarm system tested and accessible to team members at the service desk and checkouts?",
    category: "Security",
    weight: 2,
  },
  {
    id: "sec_04",
    text: "Have all security incidents from the past 7 days been logged in the incident management system?",
    category: "Security",
    weight: 1,
  },

  // ── Team Compliance ─────────────────────────────────────────────
  {
    id: "tc_01",
    text: "Were all team members on the shop floor wearing their radios and using correct communication?",
    category: "Team Compliance",
    weight: 1,
  },
  {
    id: "tc_02",
    text: "Have all team members completed their mandatory loss prevention e-learning in the last quarter?",
    category: "Team Compliance",
    weight: 1,
    hint: "Check the LMS (Learning Management System) completion report.",
  },
  {
    id: "tc_03",
    text: "Have team members been briefed on the current top-5 theft methods relevant to this store?",
    category: "Team Compliance",
    weight: 1,
  },
  {
    id: "tc_04",
    text: "Are team members following the 'Challenge 25' policy for age-restricted products?",
    category: "Team Compliance",
    weight: 2,
    hint: "Observe at least 2 age-restricted purchases or review the refusal log.",
  },
];

export const CATEGORIES: Category[] = [
  "Front End",
  "GI / Goods In",
  "Service Desk",
  "General Store",
  "Security",
  "Team Compliance",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  "Front End": "🏪",
  "GI / Goods In": "📦",
  "Service Desk": "🎫",
  "General Store": "🛒",
  "Security": "🔒",
  "Team Compliance": "👥",
};
