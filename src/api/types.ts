export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface MemberTransaction {
  id: number;
  type: string;
  description: string;
  amount: string;
  currency: string;
  isCredit: boolean;
}

export interface MemberActivity {
  id: number;
  title: string;
  timeLabel: string;
  description: string;
  statusColor: string;
}

export interface MetricItem {
  label: string;
  value: string;
  numericValue?: number;
  growth?: string;
  growthDirection?: "up" | "down";
}

export interface ProfitReportData {
  title: string;
  year: string;
  growth: string;
  growthDirection: "up" | "down";
  profitValue: string;
  numericValue: number;
  curveData?: number[];
  years?: Record<
    string,
    {
      year?: string;
      growth?: string;
      growthDirection?: "up" | "down";
      profitValue?: string;
      numericValue?: number;
      curveData?: number[];
    }
  >;
}

export interface TotalRevenueData {
  title: string;
  value: string;
  growthIndicator: string;
  companyGrowth: string;
  legend?: string[];
  series?: Array<{
    name: string;
    data: number[];
  }>;
  comparison?: Array<{
    year: string;
    amount: string;
  }>;
  years?: Record<
    string,
    {
      value: string;
      growthIndicator: string;
      companyGrowth: string;
      legend?: string[];
      series?: Array<{
        name: string;
        data: number[];
      }>;
      comparison?: Array<{
        year: string;
        amount: string;
      }>;
    }
  >;
}

export interface PaymentsData {
  title: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  welcomeGreeting: string;
  welcomeDescription: string;
  growthPercentage: number;
  availableYears?: string[];
  orders: {
    label: string;
    value: string;
    numericValue: number;
  };
  sales: {
    label: string;
    value: string;
    numericValue: number;
    growth: string;
    growthDirection: "up" | "down";
    years?: Record<string, { value: string; growth?: string; numericValue?: number }>;
  };
  profitReport: ProfitReportData;
  totalRevenue: TotalRevenueData;
  payments: PaymentsData & {
    years?: Record<string, { value: string; change?: string; changeDirection?: "up" | "down" }>;
  };
  transactions: MemberTransaction[];
  transactionsYears?: Record<string, MemberTransaction[]>;
  activities: MemberActivity[];
  activitiesYears?: Record<string, MemberActivity[]>;
  orderStatisticsYears?: Record<
    string,
    {
      totalSales?: string;
      totalOrders?: string;
      growth?: string;
      chartSeries?: Array<{
        name: string;
        y: number;
        color?: string;
      }>;
      categories?: Array<{
        name: string;
        description: string;
        value: string;
        icon?: string;
        bg?: string;
      }>;
    }
  >;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  active?: boolean;
  icon?: string;
  hasSubmenu?: boolean;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface DashboardOverview {
  navigation: {
    dashboardGroup: {
      title: string;
      items: NavigationItem[];
    };
    sections: NavigationSection[];
  };
  orderStatistics: {
    title: string;
    totalSales: string;
    totalOrders: string;
    growthIndicator: string;
    categories: Array<{
      name: string;
      description: string;
      icon: string;
    }>;
  };
  incomeChart: {
    tabs: string[];
    activeTab: string;
    totalIncome: string;
    growth: string;
    months: string[];
    activeDataPoint: {
      month: string;
      sales: number;
    };
    weeklyIncome: {
      indicator: string;
      summary: string;
    };
  };
  browserStatistics: {
    tabs: string[];
    activeTab: string;
    entries: Array<{
      rank: number;
      browser: string;
      visits: string;
      percentage: string;
    }>;
  };
}

export interface CustomerRatingsData {
  rating: number;
  maxRating: number;
  badge: string;
  categories: string[];
  primarySeries: number[];
  secondarySeries: number[];
  highlightedIndex: number;
  years?: Record<string, { rating: number; badge?: string; primarySeries?: number[]; secondarySeries?: number[] }>;
}

export interface OverviewSalesActivityData {
  subtitle: string;
  categories: string[];
  sales: number[];
  overview: number[];
  years?: Record<string, { subtitle?: string; categories?: string[]; sales?: number[]; overview?: number[] }>;
}

export interface SessionsData {
  value: string;
  series: number[];
  years?: Record<string, { value: string; series: number[] }>;
}

export interface OrderData {
  amount: string;
  change: string;
  isPositive: boolean;
  years?: Record<string, { amount: string; change: string; isPositive: boolean }>;
}

export interface GeneratedLeadsData {
  title: string;
  subtitle: string;
  value: string;
  change: string;
  percentage: number;
  years?: Record<string, { value: string; change: string; percentage: number }>;
}

export interface TopProductSales {
  id: number;
  name: string;
  brand: string;
  amount: string;
  icon: string;
  bg: string;
}

export interface TopProductVolume {
  id: number;
  name: string;
  brand: string;
  volume: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface EarningReportData {
  netProfit: { label: string; subLabel: string; amount: string };
  totalIncome: { label: string; subLabel: string; amount: string };
  totalExpenses: { label: string; subLabel: string; amount: string };
  weeklyReport: {
    days: string[];
    values: number[];
    highlightDayIndex: number;
  };
  years?: Record<string, {
    netProfit: { label: string; subLabel: string; amount: string };
    totalIncome: { label: string; subLabel: string; amount: string };
    totalExpenses: { label: string; subLabel: string; amount: string };
    weeklyReport: {
      days: string[];
      values: number[];
      highlightDayIndex: number;
    };
  }>;
}

export interface SalesAnalyticsYearData {
  badge: string;
  badgeText?: string;
  matrix: number[][];
}

export interface SalesAnalyticsData {
  selectedYear: string;
  availableYears: string[];
  badge?: string;
  badgeText?: string;
  months: string[];
  yCategories: string[];
  matrix?: number[][];
  years?: Record<string, SalesAnalyticsYearData>;
}

export interface CountrySales {
  id: number;
  country: string;
  sales: string;
  total: string;
  flag: string;
}

export interface SalesStatusData {
  percentage: number;
  title: string;
  legends: Array<{ label: string; color: string }>;
  years?: Record<string, { percentage: number; title?: string }>;
}

export interface EmployeePerformance {
  id: number;
  name: string;
  role: string;
  avatar: string;
  project: string;
  projectBg: string;
  tasks: string;
  progress: number;
  progressColor: string;
}

export interface CustomerTransaction {
  id: number;
  name: string;
  email: string;
  avatar: string;
  amount: string;
  status: string;
  statusColor: string;
  paymentMethod: string;
}

export interface CrmDashboardData {
  availableYears?: string[];
  customerRatings: CustomerRatingsData;
  overviewSalesActivity: OverviewSalesActivityData;
  sessions: SessionsData;
  order: OrderData;
  generatedLeads: GeneratedLeadsData;
  topProductsBySales: TopProductSales[];
  topProductsBySalesYears?: Record<string, TopProductSales[]>;
  topProductsByVolume: TopProductVolume[];
  topProductsByVolumeYears?: Record<string, TopProductVolume[]>;
  earningReport: EarningReportData;
  salesAnalytics: SalesAnalyticsData;
  salesByCountries: CountrySales[];
  salesByCountriesYears?: Record<string, CountrySales[]>;
  salesStatus: SalesStatusData;
  employeePerformance: EmployeePerformance[];
  employeePerformanceYears?: Record<string, EmployeePerformance[]>;
  customerTransactions: CustomerTransaction[];
  customerTransactionsYears?: Record<string, CustomerTransaction[]>;
}

