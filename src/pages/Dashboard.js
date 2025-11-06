import { TrendingUp, Target, DollarSign } from "lucide-react"
import { StatCard } from "../components/StatCard"
import { statsData, revenueSpeedData } from "../data/mockData"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { ServiceTypePieChart } from "../components/ServiceTypePieChart"

const Dashboard = () => {
  return (
    <div className="min-h-screen rounded-2xl bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground pt-7 pl-7">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted/40 rounded-full transition-colors"></button>
            <button className="p-2 hover:bg-muted/40 rounded-full transition-colors"></button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        {/* Charts Grid - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cost-to-Revenue Ratio */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-semibold text-foreground">Cost-to-Revenue Ratio</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Current Ratio</span>
                <span className="text-lg font-bold text-secondary">0.68</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div className="bg-secondary h-4 rounded-full relative" style={{ width: "68%" }}>
                  <div className="absolute right-0 top-0 h-4 w-1 bg-red-500 rounded-r-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Excellent (0.5)</span>
                <span>Target (0.7)</span>
                <span>Poor (1.0)</span>
              </div>
            </div>
          </div>

          {/* Revenue Recovery Speed */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-foreground">Revenue Recovery Speed</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueSpeedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Recovery Speed"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-foreground">Service Type Distribution</h2>
            </div>
            <ServiceTypePieChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
