import { useMemo } from 'react';
import * as analyticsService from '../services/analyticsService.js';

export function useDashboardMetrics(invoices) {
  return useMemo(
    () => analyticsService.getDashboardMetrics(invoices),
    [invoices]
  );
}
