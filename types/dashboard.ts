export interface DeliveryStats {
  total_orders: number;
  delivered_orders: number;
  pending_orders: number;
}

export interface StockNeed {
  id: string;
  name: string;
  current_stock: number;
  needed_quantity: number;
  remaining_stock: number;
  min_stock: number;
}

export interface DashboardData {
  deliveryStats: DeliveryStats;
  stockNeeds: StockNeed[];
}
