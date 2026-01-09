/**
 * Module and Level Configuration
 * Contains all module metadata, level descriptions, and structure
 */

export type Module = {
  id: string;
  title: string;
  description: string;
  levels: number[];
};

export type LevelDescription = {
  level: number;
  title: string;
  description: string;
};

export const modules: Module[] = [
  {
    id: "financial-basics",
    title: "Financial Basics & Budgeting",
    description: "Foundations of money management, budgeting, saving, and financial decision-making.",
    levels: [1, 2, 3, 4],
  },
  {
    id: "banking-payments",
    title: "Banking & Payments",
    description: "How banks work, digital payments, UPI, loans, and safe banking practices.",
    levels: [5, 6, 7, 8, 9],
  },
  {
    id: "credit-borrowing",
    title: "Credit & Borrowing",
    description: "Understanding loans, credit cards, credit scores, and avoiding debt traps.",
    levels: [10, 11, 12, 13, 14],
  },
  {
    id: "investing-wealth",
    title: "Investing & Wealth",
    description: "Basics of investing, mutual funds, diversification, and long-term wealth building.",
    levels: [15, 16, 17, 18, 19],
  },
  {
    id: "insurance-risk",
    title: "Insurance & Risk Management",
    description: "Managing financial risks using insurance and protection schemes.",
    levels: [20, 21, 22, 23, 24],
  },
  {
    id: "government-taxes",
    title: "Government Schemes & Taxes",
    description: "Government savings schemes, subsidies, taxes, and financial institutions.",
    levels: [25, 26, 27, 28, 29],
  },
];

export const levelDescriptions: Record<number, LevelDescription> = {
  // Module 1: Financial Basics & Budgeting
  1: {
    level: 1,
    title: "Budgeting, Income, Expenses",
    description: "Understand budgeting, income vs expenses, and tracking money.",
  },
  2: {
    level: 2,
    title: "Expenses & Financial Goals",
    description: "Learn fixed vs variable expenses and setting financial goals.",
  },
  3: {
    level: 3,
    title: "Savings vs Investments",
    description: "Compare saving for safety and investing for long-term growth.",
  },
  4: {
    level: 4,
    title: "Risks & Returns",
    description: "Understand how risk affects potential returns.",
  },
  // Module 2: Banking & Payments
  5: {
    level: 5,
    title: "Bank Accounts 101",
    description: "Types of bank accounts and how interest is earned.",
  },
  6: {
    level: 6,
    title: "Mobile & Digital Banking",
    description: "Using UPI, wallets, QR payments, and basic security.",
  },
  7: {
    level: 7,
    title: "Digital Transaction Safety",
    description: "Safe online banking practices and fraud prevention.",
  },
  8: {
    level: 8,
    title: "Loans & Interest",
    description: "How loans work and how interest is calculated.",
  },
  9: {
    level: 9,
    title: "Debit vs Credit Cards",
    description: "Responsible use of debit and credit cards.",
  },
  // Module 3: Credit & Borrowing
  10: {
    level: 10,
    title: "Understanding Credit",
    description: "Basics of credit, debt, interest, and collateral.",
  },
  11: {
    level: 11,
    title: "Managing Loans",
    description: "Repayment planning and loan management.",
  },
  12: {
    level: 12,
    title: "Credit Cards",
    description: "Benefits, risks, and responsible usage.",
  },
  13: {
    level: 13,
    title: "Credit Score",
    description: "What credit scores are and how to improve them.",
  },
  14: {
    level: 14,
    title: "Avoiding Traps",
    description: "Identifying scams and unsafe borrowing.",
  },
  // Module 4: Investing & Wealth
  15: {
    level: 15,
    title: "Investment Vehicles",
    description: "Basics of stocks, bonds, and mutual funds.",
  },
  16: {
    level: 16,
    title: "Mutual Funds & SIPs",
    description: "How pooled investments work.",
  },
  17: {
    level: 17,
    title: "Diversification",
    description: "Spreading risk across assets.",
  },
  18: {
    level: 18,
    title: "Long-term Investing",
    description: "Importance of time and compounding.",
  },
  19: {
    level: 19,
    title: "Market Volatility",
    description: "Handling ups and downs patiently.",
  },
  // Module 5: Insurance & Risk Management
  20: {
    level: 20,
    title: "What is Insurance",
    description: "Risk sharing and protection basics.",
  },
  21: {
    level: 21,
    title: "Life Insurance",
    description: "Protecting family income.",
  },
  22: {
    level: 22,
    title: "Health/Motor/Home Insurance",
    description: "Covering major life risks.",
  },
  23: {
    level: 23,
    title: "Crop & Livestock Insurance",
    description: "Protection for rural livelihoods.",
  },
  24: {
    level: 24,
    title: "Insurance Planning",
    description: "Choosing the right coverage for your needs.",
  },
  // Module 6: Government Schemes & Taxes
  25: {
    level: 25,
    title: "Government Savings Schemes",
    description: "PPF, NPS, Sukanya Samriddhi.",
  },
  26: {
    level: 26,
    title: "Subsidies & Grants",
    description: "Education and agriculture support.",
  },
  27: {
    level: 27,
    title: "Basic Tax Literacy",
    description: "Understanding income tax basics.",
  },
  28: {
    level: 28,
    title: "Cashless Benefits",
    description: "Using vouchers and digital benefits.",
  },
  29: {
    level: 29,
    title: "Financial Institutions",
    description: "RBI, banks, SEBI, and grievance systems.",
  },
};

/**
 * Get the module that contains a specific level
 */
export function getModuleForLevel(level: number): Module | undefined {
  return modules.find((module) => module.levels.includes(level));
}

/**
 * Get all levels for a module
 */
export function getLevelsForModule(moduleId: string): number[] {
  const module = modules.find((m) => m.id === moduleId);
  return module?.levels || [];
}

/**
 * Get level description
 */
export function getLevelDescription(level: number): LevelDescription | undefined {
  return levelDescriptions[level];
}

