export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  username?: string;
  plan?: string;
  billing?: string;
  status?: "Active" | "Pending" | "Inactive";
}

export interface RolePermission {
  module: string;
  read: boolean;
  write: boolean;
  create: boolean;
}

export interface AssignedUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  totalUsers: number;
  assignedUsers?: AssignedUser[];
  permissions: RolePermission[];
  createdAt?: string;
  updatedAt?: string;
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

export interface EcommerceCongratulations {
  sellerName: string;
  subtitle: string;
  salesValue: string;
}

export interface EcommerceNewVisitors {
  title: string;
  timeLabel: string;
  percentage: string;
  change: string;
  changeDirection: "up" | "down";
  days: string[];
  series: number[];
}

export interface EcommerceActivity {
  title: string;
  timeLabel: string;
  percentage: string;
  change: string;
  changeDirection: "up" | "down";
  days: string[];
  series: number[];
}

export interface EcommerceMetricSmall {
  title: string;
  value: string;
  growth: string;
  growthDirection: "up" | "down";
}

export interface EcommerceProfitSmall {
  title: string;
  value: string;
  months: string[];
  series: number[];
  secondarySeries?: number[];
}

export interface EcommerceTotalIncome {
  title: string;
  subtitle: string;
  months: string[];
  series: number[];
}

export interface EcommerceReportItem {
  label: string;
  amount: string;
  change: string;
  changeType: "positive" | "negative";
  type: "income" | "expense" | "profit";
}

export interface EcommerceReport {
  title: string;
  subtitle: string;
  items: EcommerceReportItem[];
}

export interface EcommerceExpensesGauge {
  title: string;
  percentage: number;
  comparisonText: string;
}

export interface EcommercePerformance {
  title: string;
  earning: string;
  sales: string;
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
    color: string;
  }>;
}

export interface EcommerceFunnelMetric {
  label: string;
  subtext: string;
  value: string;
  changeDirection: "up" | "down";
}

export interface EcommerceConversionRate {
  title: string;
  subtitle: string;
  rate: string;
  sparkline: number[];
  lastMonthSparkline?: number[];
  metrics: EcommerceFunnelMetric[];
}

export interface EcommerceSalesSummary {
  title: string;
  value: string;
  growth: string;
  growthDirection: "up" | "down";
}

export interface EcommerceProfitTarget {
  title: string;
  value: string;
  growth: string;
  targetLabel: string;
  targetPercentage: number;
}

export interface EcommerceExpensesComparison {
  title: string;
  value: string;
  growth: string;
  period: string;
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  brand: string;
  icon: string;
  category: string;
  paidAmount: string;
  totalAmount: string;
  paymentStatus: string;
  orderStatus: string;
  statusBadgeColor: string;
}

export interface EcommerceTotalBalance {
  title: string;
  walletBalance: string;
  paypalBalance: string;
  months: string[];
  series: number[];
  salesGrowthMessage: string;
  subMessage: string;
}

export interface EcommerceDashboardData {
  availableYears?: string[];
  selectedYear?: string;
  congratulations: EcommerceCongratulations;
  newVisitors: EcommerceNewVisitors;
  activity: EcommerceActivity;
  salesSmall: EcommerceMetricSmall;
  profitSmall: EcommerceProfitSmall;
  totalIncome: EcommerceTotalIncome;
  report: EcommerceReport;
  expensesGauge: EcommerceExpensesGauge;
  transactionsSmall: EcommerceMetricSmall;
  performance: EcommercePerformance;
  conversionRate: EcommerceConversionRate;
  salesSummary: EcommerceSalesSummary;
  profitTarget: EcommerceProfitTarget;
  expensesComparison: EcommerceExpensesComparison;
  products: EcommerceProduct[];
  totalBalance: EcommerceTotalBalance;
  years?: Record<string, Partial<EcommerceDashboardData>>;
}

export type EmailFolder = "inbox" | "sent" | "draft" | "starred" | "spam" | "trash";
export type EmailLabel = "personal" | "company" | "important" | "private";

export interface EmailSenderRecipient {
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailItem {
  id: string;
  from: EmailSenderRecipient;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  snippet: string;
  message: string;
  timestamp: string;
  date: string;
  folder: "inbox" | "sent" | "draft" | "spam" | "trash";
  originalFolder?: "inbox" | "sent" | "draft" | "spam";
  isRead: boolean;
  isStarred: boolean;
  labels: EmailLabel[];
}

export interface EmailFolderCounts {
  inbox: number;
  sent: number;
  draft: number;
  starred: number;
  spam: number;
  trash: number;
}

export interface EmailComposePayload {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  message: string;
  isDraft?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  createdAt: string;
  status?: "sent" | "delivered" | "read";
  isAi?: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  isAi?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface ChatConversation {
  contactId: string;
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
}

export type CalendarEventCategory =
  | "personal"
  | "business"
  | "family"
  | "holiday"
  | "etc";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  allDay?: boolean;
  category: CalendarEventCategory;
  location?: string;
  color?: string;
  url?: string;
  guests?: string;
}

export interface CalendarFilterState {
  viewAll: boolean;
  personal: boolean;
  business: boolean;
  family: boolean;
  holiday: boolean;
  etc: boolean;
}

export type InvoiceStatus =
  | "Paid"
  | "Unpaid"
  | "Pending"
  | "Overdue"
  | "Draft"
  | "Cancelled"
  | "Downloaded"
  | "Sent";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  total: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceFilterState {
  status: string;
  dateRange: string;
  search: string;
}

export interface Permission {
  id: string;
  name: string;
  assignedTo: string[];
  createdDate: string;
  createdAt?: string;
  category?: "Basic" | "Professional" | "Business";
  isCore?: boolean;
}

export interface ProfileTimelineAttachment {
  name: string;
  type: "pdf" | "excel" | "doc";
  size?: string;
}

export interface ProfileTimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  color: "warning" | "info" | "primary" | "success";
  client?: {
    name: string;
    role: string;
    avatar: string;
  };
  attachments?: ProfileTimelineAttachment[];
}

export interface ProfileConnection {
  id: string;
  name: string;
  connectionsCount: string;
  avatar: string;
  isConnected: boolean;
  department?: string;
  projectsCount?: number;
}

export interface ProfileTeamBadge {
  label: string;
  color?: string;
}

export interface ProfileTeam {
  id: string;
  name: string;
  membersCount: number;
  badge: string;
  badgeColor: string;
  icon: string;
  description?: string;
  avatarGroup?: string[];
  extraMembers?: number;
  badges?: ProfileTeamBadge[];
  isStarred?: boolean;
}

export interface ProfileProject {
  id: string;
  name: string;
  date: string;
  icon: string;
  iconBg: string;
  leader: string;
  team: string[];
  progress: number;
  client?: string;
  totalBudget?: string;
  startDate?: string;
  deadline?: string;
  description?: string;
  allHours?: string;
  daysLeft?: string;
  taskCount?: string;
  completedPercentage?: number;
  commentsCount?: number;
  membersCountLabel?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  location: string;
  joinedDate: string;
  avatar: string;
  isConnected: boolean;
  about: {
    fullName: string;
    status: string;
    role: string;
    country: string;
    language: string;
  };
  contact: {
    phone: string;
    skype: string;
    email: string;
  };
  overview: {
    taskCompiled: string;
    connectionsCount: string;
    projectsCompiled: string;
  };
  sidebarTeams: Array<{
    name: string;
    membersCount: number;
    icon: string;
  }>;
  timeline: ProfileTimelineEvent[];
  connections: ProfileConnection[];
  teams: ProfileTeam[];
  projects: ProfileProject[];
}
