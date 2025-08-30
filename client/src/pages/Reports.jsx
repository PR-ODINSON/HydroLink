import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  Shield,
  Target
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    // Mock data for demo
    setReportData({
      verificationTrends: [
        { month: 'Jul', verified: 45, rejected: 8, pending: 12 },
        { month: 'Aug', verified: 52, rejected: 6, pending: 18 },
        { month: 'Sep', verified: 48, rejected: 9, pending: 15 },
        { month: 'Oct', verified: 61, rejected: 7, pending: 22 },
        { month: 'Nov', verified: 58, rejected: 5, pending: 19 },
        { month: 'Dec', verified: 67, rejected: 4, pending: 16 }
      ],
      producerDistribution: [
        { source: 'Solar', value: 45, count: 23 },
        { source: 'Wind', value: 30, count: 15 },
        { source: 'Hydro', value: 15, count: 8 },
        { source: 'Nuclear', value: 10, count: 4 }
      ],
      monthlyStats: {
        totalSubmissions: 284,
        verified: 238,
        rejected: 26,
        pending: 20,
        fraudPrevented: 2820000,
        processingTimeImprovement: 18,
        averageProcessingTime: 3.2,
        accuracyRate: 96.8
      }
    });
    setLoading(false);
  }, [selectedPeriod]);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  const generateReport = (type) => {
    console.log(`Generating ${type} report for ${selectedPeriod} period`);
    alert(`${type} report generated successfully!`);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certification Reports</h1>
          <p className="text-gray-600">Analytics and insights for certification activities and performance.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
          <button
            onClick={() => generateReport('Comprehensive')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Submissions</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.monthlyStats.totalSubmissions}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Verification Rate</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {((reportData.monthlyStats.verified / reportData.monthlyStats.totalSubmissions) * 100).toFixed(1)}%
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+3.2% improvement</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Avg Processing Time</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{reportData.monthlyStats.averageProcessingTime} days</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{reportData.monthlyStats.processingTimeImprovement}% faster</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Fraud Prevented</h3>
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(reportData.monthlyStats.fraudPrevented / 1000000).toFixed(1)}M
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15% detection rate</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Verification Trends */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Verification Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.verificationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="verified" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="pending" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="rejected" 
                stackId="1"
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Producer Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Producer Distribution by Energy Source</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reportData.producerDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ source, value }) => `${source}: ${value}%`}
                >
                  {reportData.producerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {reportData.producerDistribution.map((item, index) => (
              <div key={item.source} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{item.source}</span>
                </div>
                <span className="font-medium text-gray-900">{item.count} producers</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateReport('Verification Summary')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Verification Summary</p>
              <p className="text-sm text-gray-600">Monthly verification statistics</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('Fraud Analysis')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-red-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Fraud Analysis</p>
              <p className="text-sm text-gray-600">Detailed fraud prevention report</p>
            </div>
          </button>

          <button
            onClick={() => generateReport('Performance Metrics')}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Target className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Performance Metrics</p>
              <p className="text-sm text-gray-600">KPI and efficiency analysis</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
