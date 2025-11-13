import ProjectClusteringDashboard from "../components/ProjectClustering"
import { TrendingUp, DollarSign, BarChart3, Percent, TrendingDown, Clock, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  LineChart,
  Cell,
} from "recharts"
import {
  getServiceProfitability,
  calculateTotalMetrics,
  prepareChartData,
  calculateClientTypeProfitability,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatMaterialParetoChartData,
  prepareParetoChartData,
  calculateCostToRevenueRatio,
  preparePaybackPeriodHistogram,
  calculateRecoverySpeedAnalysis,
  preparePaymentWaterfallData,
} from "../components/profitabilityModel"

// Color palette for categorical data
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1']

const Dashboard = () => {
  const [chartData, setChartData] = useState([])
  const [top3Volume, setTop3Volume] = useState([])
  const [top3Revenue, setTop3Revenue] = useState([])
  const [profitMarginData, setProfitMarginData] = useState([])
  const [clientTypeMarginData, setClientTypeMarginData] = useState([])
  const [paretoData, setParetoData] = useState([])
  const [mostProfitable, setMostProfitable] = useState(null)
  const [leastProfitable, setLeastProfitable] = useState(null)
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // New state for additional visualizations
  const [costToRevenueData, setCostToRevenueData] = useState([])
  const [paybackHistogramData, setPaybackHistogramData] = useState([])
  const [recoverySpeedData, setRecoverySpeedData] = useState([])
  const [paymentWaterfallData, setPaymentWaterfallData] = useState([])

  useEffect(() => {
    const loadServiceProfitability = async () => {
      try {
        setLoading(true)

        const result = await getServiceProfitability()

        // Prepare chart data (top 10 services)
        const formattedChartData = prepareChartData(result.data, 10)
        setChartData(formattedChartData)

        const volumeData = result.data.slice(0, 3).map((service) => ({
          name: service.service_name || "Unknown",
          volume: service.project_count || 0,
        }))
        setTop3Volume(volumeData)

        const revenueData = result.data.slice(0, 3).map((service) => ({
          name: service.service_name || "Unknown",
          revenue: service.total_revenue || 0,
        }))
        setTop3Revenue(revenueData)

        const marginData = result.data
          .map((service) => ({
            name: service.service_name || "Unknown",
            margin: service.avg_profit_margin_pct || 0,
            profit: service.total_profit || 0,
            revenue: service.total_revenue || 0,
          }))
          .sort((a, b) => b.margin - a.margin)
          .slice(0, 10)
        setProfitMarginData(marginData)

        const clientTypeData = calculateClientTypeProfitability(result.data)
        setClientTypeMarginData(clientTypeData)

        if (result.materialData && result.materialData.length > 0) {
          const formattedPareto = formatMaterialParetoChartData(result.materialData, 10)
          console.log("[v0] Material Pareto data prepared:", formattedPareto)
          console.log("[v0] Material Pareto data length:", formattedPareto.length)
          setParetoData(formattedPareto)
        } else {
          const pareto = prepareParetoChartData(result.data, 10)
          console.log("[v0] Service-based Pareto data prepared:", pareto)
          console.log("[v0] Service-based Pareto data length:", pareto.length)
          setParetoData(pareto)
        }

        if (result.data.length > 0) {
          const sortedByMargin = [...result.data].sort(
            (a, b) => (b.avg_profit_margin_pct || 0) - (a.avg_profit_margin_pct || 0),
          )
          setMostProfitable({
            name: sortedByMargin[0]?.service_name || "Unknown",
            margin: sortedByMargin[0]?.avg_profit_margin_pct || 0,
            profit: sortedByMargin[0]?.total_profit || 0,
          })
          setLeastProfitable({
            name: sortedByMargin[sortedByMargin.length - 1]?.service_name || "Unknown",
            margin: sortedByMargin[sortedByMargin.length - 1]?.avg_profit_margin_pct || 0,
            profit: sortedByMargin[sortedByMargin.length - 1]?.total_profit || 0,
          })
        }

        // Calculate summary statistics
        const totals = calculateTotalMetrics(result.data)

        setStatsData([
          {
            label: "Total Revenue",
            value: formatCurrency(totals.totalRevenue),
            icon: DollarSign,
            color: "text-blue-500",
          },
          {
            label: "Total Cost",
            value: formatCurrency(totals.totalCost),
            icon: TrendingDown,
            color: "text-red-500",
          },
          {
            label: "Total Profit",
            value: formatCurrency(totals.totalProfit),
            icon: TrendingUp,
            color: "text-green-500",
          },
          {
            label: "Overall Margin",
            value: formatPercentage(totals.overallMargin),
            icon: Percent,
            color: "text-purple-500",
          },
        ])

        // NEW: Calculate Cost to Revenue Ratio data
        const costRevData = calculateCostToRevenueRatio(result.data)
        setCostToRevenueData(costRevData.slice(0, 10))

        // NEW: Prepare Payback Period Histogram
        const paybackHist = preparePaybackPeriodHistogram(result.data)
        setPaybackHistogramData(paybackHist)

        // NEW: Calculate Recovery Speed Analysis
        const recoverySpeed = calculateRecoverySpeedAnalysis(result.data)
        setRecoverySpeedData(recoverySpeed)

        // NEW: Prepare Payment Waterfall Data
        const waterfallData = preparePaymentWaterfallData(recoverySpeed)
        setPaymentWaterfallData(waterfallData)

        setError(null)
      } catch (err) {
        console.error("Error fetching service profitability:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadServiceProfitability()
  }, [])

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.payload?.margin !== undefined ? formatPercentage(entry.value) : formatCurrency(entry.value)}
            </p>
          ))}
          <p className="text-sm text-muted-foreground mt-2">Projects: {payload[0]?.payload?.projects || 0}</p>
          <p className="text-sm text-muted-foreground">Margin: {formatPercentage(payload[0]?.payload?.margin || 0)}</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for Recovery Speed
  const RecoveryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-foreground mb-2">{data.clientType}</p>
          <p className="text-sm text-muted-foreground">{data.milestone}</p>
          <p className="text-sm font-bold text-blue-500 mt-1">{formatPercentage(data.percentage, 0)}</p>
          {data.cumulative && (
            <p className="text-xs text-muted-foreground mt-1">Cumulative: {formatPercentage(data.cumulative, 0)}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen rounded-2xl bg-background p-7">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Service Profitability Dashboard</h1>
            <p className="text-muted-foreground mt-1">Analyze revenue, costs, and profit by service</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-muted/40 rounded-full transition-colors"
              aria-label="Refresh"
              onClick={() => window.location.reload()}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading profitability data...</p>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300">Error loading data: {error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top 3 by Volume */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Top 3 Service Types by Volume</h2>
                </div>
                {top3Volume.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={top3Volume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(value) => formatNumber(value)} />
                      <Bar dataKey="volume" name="Project Count" radius={[8, 8, 0, 0]}>
                        {top3Volume.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>

              {/* Top 3 by Revenue */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Top 3 Service Types by Revenue</h2>
                </div>
                {top3Revenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={top3Revenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" name="Revenue" radius={[8, 8, 0, 0]}>
                        {top3Revenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b'][index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Most Profitable */}
              {mostProfitable && (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 border-l-4 border-l-green-500">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Most Profitable Service</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">{mostProfitable.name}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit Margin:</span>
                      <span className="font-semibold text-foreground">{formatPercentage(mostProfitable.margin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Profit:</span>
                      <span className="font-semibold text-foreground">{formatCurrency(mostProfitable.profit)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Least Profitable */}
              {leastProfitable && (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 border-l-4 border-l-red-500">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Least Profitable Service</h3>
                  <p className="text-2xl font-bold text-red-600 mb-2">{leastProfitable.name}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit Margin:</span>
                      <span className="font-semibold text-foreground">{formatPercentage(leastProfitable.margin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Profit:</span>
                      <span className="font-semibold text-foreground">{formatCurrency(leastProfitable.profit)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Profit Margin Analysis by Service Type</h2>
                <p className="text-sm text-muted-foreground">Top 10 Services</p>
              </div>
              {profitMarginData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={profitMarginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Margin %", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value) => formatPercentage(value)} />
                    <Legend />
                    <Bar dataKey="margin" name="Profit Margin %" radius={[8, 8, 0, 0]}>
                      {profitMarginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>

            {/* Profit Margin Analysis by Client Type */}
            {clientTypeMarginData.length > 0 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Profit Margin Analysis by Client Type</h2>
                  <p className="text-sm text-muted-foreground">Ranked by Margin</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={clientTypeMarginData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Margin %", angle: -90, position: "insideLeft", offset: 10 }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "margin") return [formatPercentage(value), "Margin %"]
                        if (name === "revenue") return [formatCurrency(value), "Revenue"]
                        if (name === "profit") return [formatCurrency(value), "Profit"]
                        return [value, name]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="margin" name="Margin %" radius={[8, 8, 0, 0]}>
                      {clientTypeMarginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clientTypeMarginData.map((ct) => (
                    <div key={ct.name} className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">{ct.name}</p>
                      <p className="text-xl font-bold text-foreground mb-3">{formatPercentage(ct.margin)}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="font-medium">{formatCurrency(ct.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profit:</span>
                          <span className="font-medium">{formatCurrency(ct.profit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Projects:</span>
                          <span className="font-medium">{formatNumber(ct.projects)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paretoData.length > 0 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Material Cost Structure Breakdown</h2>
                  <p className="text-sm text-muted-foreground">Pareto Analysis - Top 10 Categories</p>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Material Cost (₱)", angle: -90, position: "insideLeft", offset: 10 }}
                      tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Cumulative %", angle: 90, position: "insideRight", offset: 10 }}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "cost") return [formatCurrency(value), "Material Cost"]
                        if (name === "percentage") return [formatPercentage(value), "% of Total"]
                        if (name === "cumulativePercentage") return [formatPercentage(value), "Cumulative %"]
                        return [value, name]
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cost" name="Material Cost" radius={[8, 8, 0, 0]}>
                      {paretoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cumulativePercentage"
                      name="Cumulative %"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="mt-6 bg-muted/30 rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Pareto Analysis Summary</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    The chart identifies the top material cost drivers. The line shows cumulative percentage - when it
                    reaches 80%, you've identified the critical cost categories requiring attention.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paretoData.slice(0, 3).map((item, idx) => (
                      <div key={item.name} className="border border-border rounded p-3">
                        <p className="text-xs text-muted-foreground mb-1">#{idx + 1} Cost Driver</p>
                        <p className="font-semibold text-foreground text-sm">{item.name}</p>
                        <p className="text-sm font-bold mt-1" style={{ color: COLORS[idx] }}>{formatCurrency(item.cost)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatPercentage(item.percentage)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Project Performance Clustering */}
            {!loading && !error && (
              <ProjectClusteringDashboard />
            )}

            {/* Main Chart - Revenue vs Cost */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Revenue vs Cost by Service</h2>
                <p className="text-sm text-muted-foreground">Top 10 Services</p>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="cost" name="Cost" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>

            {/* Profit Chart */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Profit by Service</h2>
                <p className="text-sm text-muted-foreground">Top 10 Services</p>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>

            {/* NEW: Cost to Revenue Ratio & Payback Period Analysis - MOVED TO END */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Cost to Revenue Ratio */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Cost to Revenue Ratio by Service</h2>
                  <p className="text-sm text-muted-foreground">Lower is Better</p>
                </div>
                {costToRevenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={costToRevenueData} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: "Cost/Revenue %", angle: -90, position: "insideLeft", offset: 10 }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "costToRevenueRatio") return [formatPercentage(value, 1), "Cost/Revenue Ratio"]
                          return [value, name]
                        }}
                      />
                      <Legend />
                      <Bar dataKey="costToRevenueRatio" name="Cost/Revenue %" radius={[8, 8, 0, 0]}>
                        {costToRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
                <div className="mt-4 bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Interpretation:</strong> Services with lower cost-to-revenue ratios are more efficient. Target ratio should be below 70% for healthy margins.
                  </p>
                </div>
              </div>

              {/* Payback Period Distribution */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Payback Period Distribution</h2>
                  <p className="text-sm text-muted-foreground">By Service Type</p>
                </div>
                {paybackHistogramData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={paybackHistogramData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="range"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        label={{ value: "Project Count", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip formatter={(value) => [formatNumber(value), "Projects"]} />
                      <Legend />
                      <Bar dataKey="count" name="Project Count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
                <div className="mt-4 bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Payback Period:</strong> Time taken to recover initial project costs through revenue. Shorter periods indicate faster cash flow recovery.
                  </p>
                </div>
              </div>
            </div>

            {/* NEW: Recovery Speed Analysis - MOVED TO END */}
            {recoverySpeedData.length > 0 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Payment Recovery Speed Analysis</h2>
                  <p className="text-sm text-muted-foreground">By Client Type</p>
                </div>
                
                {/* Payment Milestone Waterfall */}
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={paymentWaterfallData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="stage"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Payment %", angle: -90, position: "insideLeft", offset: 10 }}
                    />
                    <Tooltip content={<RecoveryTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      name="Payment %"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      name="Cumulative %"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#8b5cf6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Recovery Speed Summary Cards */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recoverySpeedData.map((client) => (
                    <div key={client.name} className="bg-muted/30 rounded-lg p-4 border border-border">
                      <p className="text-sm font-semibold text-foreground mb-3">{client.name}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Upfront Payment:</span>
                          <span className="font-bold text-blue-600">{formatPercentage(client.upfrontPayment, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Avg Completion:</span>
                          <span className="font-medium">{client.avgDaysToCompletion} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Payment Recovery:</span>
                          <span className="font-medium">{client.avgPaymentRecovery} days</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-muted-foreground">Total Projects:</span>
                          <span className="font-medium">{formatNumber(client.projectCount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Key Insights</p>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Commercial clients typically pay higher upfront (40%) but take longer to complete projects</li>
                    <li>Residential clients pay lower upfront (20%) but finish projects faster (6 weeks average)</li>
                    <li>Monitor payment recovery days to optimize cash flow management</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard