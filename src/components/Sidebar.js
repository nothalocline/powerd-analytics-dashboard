import { LayoutDashboard, Sparkles, TrendingUp, Users, FileSearch } from "lucide-react";

const navItems = [
  { label: "Executive Summary", page: "overview", icon: LayoutDashboard },
  { label: "Project Simulator & Historical Insight", page: "project-input", icon: Sparkles },
  { label: "Cash Flow", page: "analytics", icon: TrendingUp },
  { label: "Vendor & Client Ledger", page: "quicksight", icon: Users },
  { label: "Project Drilldown", page: "drilldown", icon: FileSearch },
];

export default function Sidebar({ currentPage, onPageChange }) {
  return (
    <aside className="w-64 bg-[#e8e8e8] min-h-screen flex flex-col p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <img 
            src="logo.png" 
            alt="Power D's Electrical Services" 
            className="w-16 h-16 object-contain"
          />
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 leading-tight">Power D's</div>
          <div className="text-md text-orange-600 font-medium leading-tight">Electrical Services</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              className={`w-full px-4 py-3 rounded-lg text-left text-sm transition-colors flex items-center gap-3 ${
                currentPage === item.page
                  ? "bg-gray-300 text-gray-900 font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}