// src/pages/QuickSightPage.js
import { useState } from 'react';
import QuickSightEmbed from '../components/QuickSightEmbed';
import { BarChart3, RefreshCw, Info } from 'lucide-react';

export default function QuickSightPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen rounded-2xl bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">QuickSight Analytics</h1>
                <p className="text-muted-foreground">Real-time business intelligence dashboard</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* QuickSight Dashboard */}
        <QuickSightEmbed 
          key={refreshKey}
          embedUrl={process.env.REACT_APP_QUICKSIGHT_EMBED_URL}
          height="850px"
          title="Power D Analytics Dashboard"
        />

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Interactive Filters</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the filters within the dashboard to customize your data view and insights
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-foreground">Real-time Data</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Dashboard automatically updates with the latest project and financial data
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-foreground">Export Options</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Export charts and data directly from the dashboard using QuickSight tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}