import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import { Target, TrendingUp, Clock, DollarSign } from 'lucide-react';

// Import from your profitabilityModel
import {
  getServiceProfitability,
  performKMeansClustering,
  prepareClusteringChartData,
  getClusterSummary,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from './profitabilityModel';

const ProjectClusteringDashboard = () => {
  const [clusterData, setClusterData] = useState([]);
  const [clusterSummary, setClusterSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numberOfClusters, setNumberOfClusters] = useState(3);

  const clusterColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  
  useEffect(() => {
    loadClusteringData();
  }, [numberOfClusters]);

  const loadClusteringData = async () => {
    try {
      setLoading(true);
      const result = await getServiceProfitability();

      if (result.clusteringData && result.clusteringData.length > 0) {
        // Perform K-means clustering
        const clustered = performKMeansClustering(result.clusteringData, numberOfClusters);
        const chartData = prepareClusteringChartData(clustered);
        const summary = getClusterSummary(clustered);

        setClusterData(chartData);
        setClusterSummary(summary);
        setError(null);
      } else {
        setError('No clustering data available');
      }
    } catch (err) {
      console.error('Error loading clustering data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{data.service}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Cluster:</span> {data.clusterLabel}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Profit Margin:</span> {formatPercentage(data.y)}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Days to Complete:</span> {formatNumber(data.x)} days
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Payment Recovery:</span> {formatNumber(data.z)} days
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Revenue:</span> {formatCurrency(data.revenue)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading clustering analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Performance Clustering (K-Means)
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">Clusters:</label>
            <select
              value={numberOfClusters}
              onChange={(e) => setNumberOfClusters(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={3}>3 Clusters</option>
              <option value={4}>4 Clusters</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Projects grouped by profit margin, completion time, and payment recovery speed
        </p>
      </div>

      {/* Cluster Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clusterSummary.map((cluster, index) => (
          <div
            key={cluster.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 p-6"
            style={{ borderColor: clusterColors[index] }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{cluster.label}</h3>
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: clusterColors[index] }}
              />
            </div>
            <p className="text-2xl font-bold mb-3" style={{ color: clusterColors[index] }}>
              {cluster.count} projects
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Profit Margin:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPercentage(cluster.avgProfitMargin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Days:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(cluster.avgDaysToCompletion, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Payment:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(cluster.avgPaymentRecovery, 0)} days
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Revenue:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(cluster.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scatter Plot */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Project Performance Scatter Plot
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            X-axis: Days to Completion | Y-axis: Profit Margin % | Size: Payment Recovery Days
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              name="Days to Completion"
              label={{ value: 'Days to Completion', position: 'bottom', offset: 40 }}
              stroke="#6b7280"
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Profit Margin %"
              label={{ value: 'Profit Margin %', angle: -90, position: 'insideLeft', offset: 10 }}
              stroke="#6b7280"
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} name="Payment Recovery Days" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value, entry) => {
                const clusterLabel = clusterSummary[entry.value]?.label || `Cluster ${entry.value + 1}`;
                return clusterLabel;
              }}
            />
            {[...Array(numberOfClusters)].map((_, i) => (
              <Scatter
                key={i}
                name={String(i)}
                data={clusterData.filter(d => d.cluster === i)}
                fill={clusterColors[i]}
                opacity={0.7}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">Best Performers</h4>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">
              Projects in the "High Performer" cluster show strong profit margins with efficient delivery times.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Completion Time</h4>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Analyze the relationship between project duration and profitability to optimize scheduling.
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-900 dark:text-orange-100">Payment Recovery</h4>
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              Faster payment recovery correlates with better cash flow and project success rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectClusteringDashboard;