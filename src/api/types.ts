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
}

export interface TotalRevenueData {
  title: string;
  value: string;
  growthIndicator: string;
  companyGrowth: string;
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
  };
  profitReport: ProfitReportData;
  totalRevenue: TotalRevenueData;
  payments: PaymentsData;
  transactions: MemberTransaction[];
  activities: MemberActivity[];
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
