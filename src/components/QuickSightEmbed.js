import { useState } from 'react';
import { Loader2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';

const QuickSightEmbed = ({ 
  embedUrl = "https://ap-southeast-2.quicksight.aws.amazon.com/sn/embed/share/accounts/472461109027/dashboards/30ac898d-9944-4828-be94-bbc8177a58ef/sheets/30ac898d-9944-4828-be94-bbc8177a58ef_9801bf00-4a8a-4bfa-86ee-13bd9ac80af1/visuals/30ac898d-9944-4828-be94-bbc8177a58ef_5eb21c3f-f632-4f22-a731-584a4ef66262?directory_alias=jelmeydizon",
  height = '800px',
  title = 'QuickSight Dashboard'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8" style={{ height }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 font-medium mb-2">Configuration Error</p>
          <p className="text-gray-500 text-sm">QuickSight embed URL is not configured</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Container for iframe and loading/error states */}
      <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 60px)' : height }}>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center bg-gray-50 absolute inset-0 z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading QuickSight Dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center bg-white absolute inset-0 z-10">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 font-medium mb-2">Failed to Load Dashboard</p>
              <p className="text-gray-500 text-sm">Please check your QuickSight permissions and embed settings</p>
            </div>
          </div>
        )}

        {/* QuickSight iFrame - FIXED */}
        <iframe 
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          title={title}
          className="w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

// Demo wrapper
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QuickSight Analytics Dashboard</h1>
        <QuickSightEmbed />
      </div>
    </div>
  );
}