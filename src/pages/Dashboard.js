import { TrendingUp, DollarSign, BarChart3, Percent } from "lucide-react"
import { StatCard } from "../components/StatCard"
import { useState, useEffect } from "react"
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts"
import {
  getServiceProfitability,
  calculateTotalMetrics,
  prepareChartData,
  formatCurrency,
  formatNumber,
  formatPercentage
} from "../components/profitabilityModel"

const Dashboard = () => {
  const [chartData, setChartData] = useState([])
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadServiceProfitability = async () => {
      try {
        setLoading(true)
        
        // Fetch data from API
        const result = await getServiceProfitability()
        
        // Prepare chart data (top 10 services)
        const formattedChartData = prepareChartData(result.data, 10)
        setChartData(formattedChartData)

        // Calculate summary statistics
        const totals = calculateTotalMetrics(result.data)
        
        setStatsData([
          { 
            label: "Total Revenue", 
            value: formatCurrency(totals.totalRevenue),
            icon: DollarSign,
            color: "text-blue-500"
          },
          { 
            label: "Total Cost", 
            value: formatCurrency(totals.totalCost),
            icon: TrendingUp,
            color: "text-red-500"
          },
          { 
            label: "Total Profit", 
            value: formatCurrency(totals.totalProfit),
            icon: TrendingUp,
            color: "text-green-500"
          },
          { 
            label: "Overall Margin", 
            value: formatPercentage(totals.overallMargin),
            icon: Percent,
            color: "text-purple-500"
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
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          <p className="text-sm text-muted-foreground mt-2">
            Projects: {payload[0]?.payload?.projects || 0}
          </p>
          <p className="text-sm text-muted-foreground">
            Margin: {formatPercentage(payload[0]?.payload?.margin || 0)}
          </p>
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
                    <Tooltip content={<CustomTooltip />} />
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="profit" 
                      name="Profit" 
                      fill="#10b981" 
                      radius={[8, 8, 0, 0]} 
                    />
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