export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  lowStockCount: number;
  criticalStockCount: number;
  totalMovementsToday: number;
  totalEntriesToday: number;
  totalExitsToday: number;
  pendingAlertsCount: number;
}

export interface CategoryStock {
  name: string;
  color: string;
  totalStock: number;
}

export interface DailyMovements {
  date: string;
  entries: number;
  exits: number;
}
