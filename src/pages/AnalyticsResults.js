import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus, DollarSign, Clock, Target } from "lucide-react";

const kpiComparison = [
  {
    metric: "Profit Margin",
    projectValue: 22.5,
    companyAverage: 18.3,
    unit: "%",
    variance: "positive",
  },
  {
    metric: "Timeline Adherence",
    projectValue: 85,
    companyAverage: 78,
    unit: "%",
    variance: "positive",
  },
  {
    metric: "Cost Overrun",
    projectValue: 8.2,
    companyAverage: 12.5,
    unit: "%",
    variance: "positive",
  },
  {
    metric: "Client Satisfaction",
    projectValue: 4.2,
    companyAverage: 4.5,
    unit: "/5",
    variance: "negative",
  },
  {
    metric: "Resource Utilization",
    projectValue: 88,
    companyAverage: 85,
    unit: "%",
    variance: "positive",
  },
  {
    metric: "Quality Score",
    projectValue: 92,
    companyAverage: 89,
    unit: "%",
    variance: "positive",
  },
];

const chartData = kpiComparison.map((item) => ({
  metric: item.metric,
  project: item.projectValue,
  company: item.companyAverage,
}));

const financialIndicators = [
  {
    name: "Time-Adjusted ROI",
    value: "24.8%",
    benchmark: "18.5%",
    status: "positive",
    description: "ROI adjusted for project duration and risk factors",
  },
  {
    name: "Payback Period",
    value: "14.2 months",
    benchmark: "18.0 months",
    status: "positive",
    description: "Time required to recover initial investment",
  },
  {
    name: "Net Present Value",
    value: "₱2.4M",
    benchmark: "₱1.8M",
    status: "positive",
    description: "Present value of future cash flows minus initial investment",
  },
  {
    name: "Internal Rate of Return",
    value: "28.5%",
    benchmark: "22.0%",
    status: "positive",
    description: "Rate at which NPV equals zero",
  },
];

const getVarianceIcon = (variance) => {
  switch (variance) {
    case "positive":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-yellow-500" />;
  }
};

const getVarianceColor = (variance) => {
  switch (variance) {
    case "positive":
      return "text-green-600 bg-green-50 border-green-200";
    case "negative":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
  }
};

export default function AnalyticsResults() {
  return (
    <div className="min-h-screen rounded-2xl bg-background p-8 space-y-8">
      {/* Header */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Analytics Results</h1>
        </div>
        <p className="text-muted-foreground">Compare new project metrics against historical benchmarks and company averages</p>
      </div>

      {/* KPI Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiComparison.map((kpi, index) => (
          <div key={index} className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{kpi.metric}</h3>
              {getVarianceIcon(kpi.variance)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Project Value</span>
                <span className="font-bold text-lg text-foreground">
                  {kpi.projectValue}
                  {kpi.unit}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Company Average</span>
                <span className="font-medium text-foreground">
                  {kpi.companyAverage}
                  {kpi.unit}
                </span>
              </div>

              <div className={`px-3 py-2 rounded-lg border ${getVarianceColor(kpi.variance)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Variance</span>
                  <span className="font-bold">
                    {kpi.variance === "positive" ? "+" : ""}
                    {(kpi.projectValue - kpi.companyAverage).toFixed(1)}
                    {kpi.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison Chart */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Project vs Company Benchmarks</h2>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="metric" 
              angle={-45} 
              textAnchor="end" 
              height={100} 
              fontSize={12}
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
            <Bar dataKey="project" fill="hsl(var(--primary))" name="Project Value" />
            <Bar dataKey="company" fill="hsl(var(--muted-foreground))" name="Company Average" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Indicators */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold text-foreground">Derived Financial Indicators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financialIndicators.map((indicator, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{indicator.name}</h3>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="font-bold text-lg text-foreground">{indicator.value}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Benchmark</span>
                  <span className="font-medium text-foreground">{indicator.benchmark}</span>
                </div>

                <div className="px-3 py-2 rounded-lg border bg-green-50 border-green-200 text-green-600">
                  <span className="text-sm font-medium">Above Benchmark</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">{indicator.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-semibold text-foreground">Performance Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">5/6</div>
            <div className="text-sm text-green-700">KPIs Above Benchmark</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">83%</div>
            <div className="text-sm text-blue-700">Overall Performance Score</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">A-</div>
            <div className="text-sm text-purple-700">Project Grade</div>
          </div>
        </div>
      </div>
    </div>
  );
}