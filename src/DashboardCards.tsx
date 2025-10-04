import React from 'react';
import { Package, ShoppingBag, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, bgColor, textColor, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
          <div className={textColor}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {trend.value}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const DashboardCards: React.FC = () => {
  const metrics = [
    {
      title: 'Total Medicines',
      value: '12,450',
      icon: <Package className="w-6 h-6" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      trend: { value: '+5.2%', isPositive: true }
    },
    {
      title: "Today's Sales",
      value: '152',
      icon: <ShoppingBag className="w-6 h-6" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      trend: { value: '+12.5%', isPositive: true }
    },
    {
      title: 'Total Revenue',
      value: '₹1,89,756',
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      trend: { value: '+8.1%', isPositive: true }
    },
    {
      title: 'Expiring Soon',
      value: '78',
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      trend: { value: 'Critical', isPositive: false }
    },
    {
      title: 'Low Stock',
      value: '15',
      icon: <AlertTriangle className="w-6 h-6" />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      trend: { value: 'Alert', isPositive: false }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default DashboardCards;