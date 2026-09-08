import { computeDashboardMetrics, detectOutliers } from '../utils/analytics.js';

export function getDashboardMetrics(invoices) {
  return computeDashboardMetrics(invoices);
}

export function getOutliers(invoices) {
  return detectOutliers(invoices);
}
