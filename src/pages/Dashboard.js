import {AlertTriangle, TrendingUp, Clock, Target, DollarSign, Gauge } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { 
  statsData, 
  projectsAtRisk, 
  profitMarginData, 
  cashFlowData, 
  revenueSpeedData,
  roiData,
  delayData 
} from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from "recharts";

const Dashboard = () => {
  return (
    <div className="min-h-screen rounded-2xl bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground pt-7 pl-7">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted/40 rounded-full transition-colors">
            </button>
            <button className="p-2 hover:bg-muted/40 rounded-full transition-colors">
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        {/* Projects at Risk */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-foreground">Projects at Risk</h2>
          </div>
          <div className="space-y-3">
            {projectsAtRisk.map((project, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div>
                  <h3 className="font-medium text-foreground">{project.project}</h3>
                  <p className="text-sm text-red-600">{project.issue}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-700">{project.impact}</p>
                  <p className="text-xs text-red-500">Potential Loss</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Profit Margin per Project */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-foreground">Profit Margin per Project</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitMarginData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 30]} stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="project" 
                  type="category" 
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Margin"]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="margin" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Recovery Time */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-foreground">Cash Flow Recovery Time</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value) => [`${value} days`, "Recovery Time"]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="recovery" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Grid - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                <div
                  className="bg-secondary h-4 rounded-full relative"
                  style={{ width: "68%" }}
                >
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
                <XAxis 
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Recovery Speed"]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Grid - Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time Adjusted ROI */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-foreground">Time Adjusted ROI</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="investment" 
                  name="Investment" 
                  unit="k"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  dataKey="roi" 
                  name="ROI" 
                  unit="%"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Scatter data={roiData} fill="#f97316" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Utilization Rate */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-foreground">Resource Utilization Rate</h2>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${85 * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">85%</div>
                    <div className="text-sm text-muted-foreground">Utilization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Delay Rate */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-foreground">Project Delay Rate</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={delayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="project"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
              <Bar dataKey="delayed" stackId="a" fill="#f59e0b" name="Delayed" />
              <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;