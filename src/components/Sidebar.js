import { Zap } from "lucide-react";

const navItems = [
  { label: "Executive Summary", page: "overview" },
  { label: "Project Simulator & Historical Insight", page: "project-input" },
  { label: "Cash Flow", page: "analytics" },
  { label: "Vendor & Client Ledger", page: "quicksight" },
  { label: "Project Drilldown", page: "drilldown" },
];

export default function Sidebar({ currentPage, onPageChange }) {
  return (
    <aside className="w-64 bg-[#e8e8e8] min-h-screen flex flex-col p-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
          <Zap className="w-7 h-7 text-gray-900" fill="currentColor" />
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 leading-tight">Power D's</div>
          <div className="text-sm text-orange-600 font-medium leading-tight">Electrical Services</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm transition-colors ${
              currentPage === item.page
                ? "bg-gray-300 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}