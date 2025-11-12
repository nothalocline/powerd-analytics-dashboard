/**
 * Service Profitability Model
 * Handles API interactions for service profitability analytics
 */

const API_ENDPOINT = process.env.REACT_APP_ATHENA_API_ENDPOINT;

/**
 * Fetch service profitability data from the API
 * @returns {Promise<Object>} Service profitability data with Pareto analysis
 * @throws {Error} If the API request fails
 */
export const getServiceProfitability = async () => {
  try {
    // Check if API endpoint is configured
    if (!API_ENDPOINT) {
      throw new Error('API endpoint not configured. Please set REACT_APP_ATHENA_API_ENDPOINT in your .env file');
    }

    const url = `${API_ENDPOINT}/descriptive`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    let data = await response.json();
    console.log('=== RAW RESPONSE ===');
    console.log('Response type:', typeof data);
    console.log('Has body?', 'body' in data);
    
    // API Gateway wraps Lambda responses - unwrap if needed
    if (data.body && typeof data.body === 'string') {
      console.log('Unwrapping API Gateway response...');
      data = JSON.parse(data.body);
    }
    
    console.log('=== PARSED DATA ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('Success status:', data.success);
    console.log('Record count:', data.record_count);
    
    // If data.data exists, show first item
    if (data.data && Array.isArray(data.data)) {
      console.log('First item:', data.data[0]);
      console.log('Data length:', data.data.length);
    }

    // Check if the response has the expected structure
    if (data.success === false) {
      const errorMsg = data.error || 'API returned unsuccessful response';
      console.error('API Error Details:', errorMsg);
      throw new Error(`API Error: ${errorMsg}`);
    }

    // Handle empty or missing data
    if (!data.data) {
      console.warn('No data returned from API');
      return {
        success: true,
        timestamp: data.timestamp,
        recordCount: 0,
        data: [],
      };
    }

    // Validate data is an array
    if (!Array.isArray(data.data)) {
      console.error('Invalid data structure received:', data);
      console.error('Expected array, got:', typeof data.data);
      throw new Error(`API returned invalid data structure. Expected array, got ${typeof data.data}`);
    }

    console.log('Data records received:', data.data.length);

    // Return normalized response
    return {
      success: true,
      timestamp: data.timestamp,
      recordCount: data.record_count,
      data: data.data,
    };
  } catch (error) {
    console.error('Error fetching service profitability data:', error);
    
    // Provide more helpful error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to reach API. Check your API endpoint URL and CORS settings.');
    }
    
    throw error;
  }
};

/**
 * Format currency values
 * @param {number} value - Numeric value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '₱0.00';
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(value);
};

/**
 * Format percentage values
 * @param {number} value - Numeric value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.00%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with thousand separators
 * @param {number} value - Numeric value to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Get top N services by profit
 * @param {Array} data - Service profitability data
 * @param {number} n - Number of top services to return
 * @returns {Array} Top N services
 */
export const getTopServices = (data, n = 5) => {
  if (!data || !Array.isArray(data)) return [];
  return data.slice(0, n);
};

/**
 * Calculate total metrics across all services
 * @param {Array} data - Service profitability data
 * @returns {Object} Aggregated metrics
 */
export const calculateTotalMetrics = (data) => {
  if (!data || !Array.isArray(data)) {
    return {
      totalProjects: 0,
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      overallMargin: 0,
    };
  }

  const totals = data.reduce(
    (acc, service) => ({
      totalProjects: acc.totalProjects + (service.project_count || 0),
      totalRevenue: acc.totalRevenue + (service.total_revenue || 0),
      totalCost: acc.totalCost + (service.total_cost || 0),
      totalProfit: acc.totalProfit + (service.total_profit || 0),
    }),
    { totalProjects: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0 }
  );

  totals.overallMargin =
    totals.totalCost !== 0
      ? (totals.totalProfit / totals.totalCost) * 100
      : 0;

  return totals;
};

/**
 * Identify services contributing to the 80% of profit (Pareto principle)
 * @param {Array} data - Service profitability data (must be sorted by profit DESC)
 * @returns {Array} Services in the 80% threshold
 */
export const getParetoServices = (data) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(service => 
    service.cumulative_percentage && service.cumulative_percentage <= 80
  );
};

/**
 * Prepare data for chart visualization
 * @param {Array} data - Service profitability data
 * @param {number} limit - Maximum number of services to include
 * @returns {Array} Chart-ready data
 */
export const prepareChartData = (data, limit = 10) => {
  if (!data || !Array.isArray(data)) return [];
  
  const chartData = data.slice(0, limit).map(service => ({
    name: service.service_name || 'Unknown',
    revenue: service.total_revenue || 0,
    cost: service.total_cost || 0,
    profit: service.total_profit || 0,
    margin: service.avg_profit_margin_pct || 0,
    projects: service.project_count || 0,
    cumulativePercentage: service.cumulative_percentage || 0,
  }));

  return chartData;
};

/**
 * Export data to CSV format
 * @param {Array} data - Service profitability data
 * @returns {string} CSV string
 */
export const exportToCSV = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) return '';

  const headers = [
    'Service Name',
    'Project Count',
    'Total Revenue',
    'Total Cost',
    'Total Profit',
    'Avg Revenue per Project',
    'Avg Cost per Project',
    'Avg Profit Margin (%)',
    'Avg Profit per Project',
    'Cumulative Percentage',
  ];

  const rows = data.map(service => [
    service.service_name || '',
    service.project_count || 0,
    service.total_revenue || 0,
    service.total_cost || 0,
    service.total_profit || 0,
    service.avg_revenue_per_project || 0,
    service.avg_cost_per_project || 0,
    service.avg_profit_margin_pct || 0,
    service.avg_profit_per_project || 0,
    service.cumulative_percentage || 0,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
};

export default {
  getServiceProfitability,
  formatCurrency,
  formatPercentage,
  formatNumber,
  getTopServices,
  calculateTotalMetrics,
  getParetoServices,
  prepareChartData,
  exportToCSV,
};