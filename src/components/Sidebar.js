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
      <div className="mb-8">
        <img 
          src="/powerd-logo.png" 
          alt="Power D's Electrical Services" 
          className="w-full h-auto max-w-[200px]"
        />
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