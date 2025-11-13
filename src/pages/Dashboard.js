import ProjectClusteringDashboard from "../components/ProjectClustering"
import { TrendingUp, DollarSign, BarChart3, Percent, TrendingDown } from "lucide-react"
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
} from "../components/profitabilityModel"

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
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-foreground">Top 3 Service Types by Volume</h2>
                  </div>
                </div>
                {top3Volume.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={top3Volume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(value) => formatNumber(value)} />
                      <Bar dataKey="volume" name="Project Count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
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
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <h2 className="text-lg font-semibold text-foreground">Top 3 Service Types by Revenue</h2>
                  </div>
                </div>
                {top3Revenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={top3Revenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
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
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-foreground">Most Profitable Service</h3>
                  </div>
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
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-foreground">Least Profitable Service</h3>
                  </div>
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
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-purple-500" />
                  <h2 className="text-lg font-semibold text-foreground">Profit Margin Analysis by Service Type</h2>
                </div>
                <p className="text-sm text-muted-foreground">Top 10 Services</p>
              </div>
              {profitMarginData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={profitMarginData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: "Margin %", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value) => formatPercentage(value)} />
                    <Legend />
                    <Bar dataKey="margin" name="Profit Margin %" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
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
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg font-semibold text-foreground">Profit Margin Analysis by Client Type</h2>
                  </div>
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
                    <Bar dataKey="margin" name="Margin %" fill="#6366f1" radius={[8, 8, 0, 0]} />
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
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-semibold text-foreground">Material Cost Structure Breakdown</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">Pareto Analysis - Top 10 Categories</p>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 60, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      angle={-45}
                      textAnchor="end"
                      height={120}
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
                    <Bar yAxisId="left" dataKey="cost" name="Material Cost" fill="#f97316" radius={[8, 8, 0, 0]} />
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
                        <p className="text-sm text-orange-600 font-bold mt-1">{formatCurrency(item.cost)}</p>
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
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-foreground">Revenue vs Cost by Service</h2>
                </div>
                <p className="text-sm text-muted-foreground">Top 10 Services</p>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      angle={-45}
                      textAnchor="end"
                      height={100}
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
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-foreground">Profit by Service</h2>
                </div>
                <p className="text-sm text-muted-foreground">Top 10 Services</p>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      angle={-45}
                      textAnchor="end"
                      height={100}
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
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard