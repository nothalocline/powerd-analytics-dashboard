import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, AlertCircle, Percent, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KPIDashboard = () => {
  const [activeTab, setActiveTab] = useState('Profit Margin');
  const [activeView, setActiveView] = useState(1);

  // Data for charts
  const profitMarginData = [
    { month: 'Jan', value: 16 },
    { month: 'Feb', value: 17 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 18.5 },
    { month: 'May', value: 19 },
    { month: 'Jun', value: 18.5 }
  ];

  const cashFlowData = [
    { month: 'Jan', value: 10 },
    { month: 'Feb', value: 9 },
    { month: 'Mar', value: 8 },
    { month: 'Apr', value: 7.5 },
    { month: 'May', value: 8 },
    { month: 'Jun', value: 8.2 }
  ];

  const resourceUtilizationData = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 92 },
    { month: 'Apr', value: 88 },
    { month: 'May', value: 95 },
    { month: 'Jun', value: 87 }
  ];

  const costToRevenueData = [
    { month: 'Jan', value: 0.78 },
    { month: 'Feb', value: 0.76 },
    { month: 'Mar', value: 0.74 },
    { month: 'Apr', value: 0.73 },
    { month: 'May', value: 0.72 },
    { month: 'Jun', value: 0.73 }
  ];

  const KPICard = ({ title, value, baseline, change, icon: Icon, unit = '', positive = true }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="text-3xl font-semibold text-gray-900 mb-2">
        {value}{unit}
      </div>
      <div className="flex items-center text-sm">
        <span className="text-gray-500 mr-2">
          Baseline: {baseline}{unit}
        </span>
        <span className={`flex items-center ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </span>
      </div>
    </div>
  );

  const getChartData = () => {
    switch(activeTab) {
      case 'Profit Margin':
        return profitMarginData;
      case 'Cash Flow Recovery':
        return cashFlowData;
      case 'Resource Utilization':
        return resourceUtilizationData;
      case 'Cost-to-Revenue':
        return costToRevenueData;
      default:
        return profitMarginData;
    }
  };

  const getChartTitle = () => {
    switch(activeTab) {
      case 'Profit Margin':
        return 'Profit Margin Trend';
      case 'Cash Flow Recovery':
        return 'Cash Flow Recovery Time';
      case 'Resource Utilization':
        return 'Resource Utilization Rate';
      case 'Cost-to-Revenue':
        return 'Cost-to-Revenue Ratio';
      default:
        return 'Profit Margin Trend';
    }
  };

  const getChartSubtitle = () => {
    switch(activeTab) {
      case 'Profit Margin':
        return 'Current performance vs historical baseline (6-month view)';
      case 'Cash Flow Recovery':
        return 'Payback period in months - lower is better';
      case 'Resource Utilization':
        return 'Effectiveness of labor, materials, and equipment usage';
      case 'Cost-to-Revenue':
        return 'Lower ratio indicates better efficiency';
      default:
        return 'Current performance vs historical baseline';
    }
  };

  return (
    <div className="min-h-screen rounded-2xl bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b rounded-2xl border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KPI Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Compare current metrics against historical benchmarks</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveView(1)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              View 1
            </button>
            <button 
              onClick={() => setActiveView(2)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 2 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              View 2
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPICard
            title="Profit Margin"
            value="18.5"
            baseline="16.5%"
            change="+3.0%"
            icon={Percent}
            unit="%"
            positive={true}
          />
          <KPICard
            title="Cash Flow Recovery"
            value="8.2"
            baseline="8.5 mo"
            change="-0.3 mo"
            icon={Clock}
            unit=" mo"
            positive={true}
          />
          <KPICard
            title="Cost-to-Revenue Ratio"
            value="0.73"
            baseline="0.78"
            change="-0.05"
            icon={DollarSign}
            positive={true}
          />
          <KPICard
            title="Resource Utilization"
            value="87"
            baseline="82%"
            change="+6%"
            icon={Users}
            unit="%"
            positive={true}
          />
          <KPICard
            title="Time-Adjusted ROI"
            value="24.3"
            baseline="21.8%"
            change="+2.5%"
            icon={TrendingUp}
            unit="%"
            positive={true}
          />
          <KPICard
            title="Project Delay Rate"
            value="12"
            baseline="15%"
            change="-3%"
            icon={AlertCircle}
            unit="%"
            positive={true}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {['Profit Margin', 'Cash Flow Recovery', 'Resource Utilization', 'Cost-to-Revenue'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Content */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{getChartTitle()}</h3>
              <p className="text-sm text-gray-600">{getChartSubtitle()}</p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              {activeView === 1 ? (
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6b7280" 
                    strokeWidth={2}
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={resourceUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" fill="#1f2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;