import { LayoutDashboard, FileInput, ChartColumnStacked, TrendingUp, FolderOpen, BarChart3 } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", page: "overview", badge: true },
  { icon: FileInput, label: "Project Input", page: "project-input" },
  { icon: ChartColumnStacked, label: "Analytics Results", page: "analytics" },
  { icon: BarChart3, label: "QuickSight", page: "quicksight" },
  { icon: TrendingUp, label: "KPI Benchmarking", page: "kpi" },
  { icon: FolderOpen, label: "Project Drilldown", page: "drilldown" },
];

export default function Sidebar({ currentPage, onPageChange }) {
  return (
    <aside className="w-64 bg-[#f8f9fa] min-h-screen flex flex-col p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
        </div>
        <span className="text-xl font-bold">Power D</span>
      </div>

      {/* Profile */}
      <div className="mb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
          NF
        </div>
        <h2 className="text-lg font-bold mb-1 font-serif">Nicole Faustino</h2>
        <p className="text-sm text-gray-600">Marketing Director</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onPageChange(item.page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.page
                ? "bg-blue-100 text-blue-900 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {item.badge && currentPage === item.page && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                1
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}