'use client';

import { Icon } from '@iconify/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBg: string;
}

export default function StatCard({ title, value, icon, trend, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-comay-charcoal mb-2">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <Icon icon={trend.isPositive ? 'solar:arrow-up-linear' : 'solar:arrow-down-linear'} className="w-4 h-4" />
              <span>{trend.value}</span>
              <span className="text-gray-400 font-normal">vs. tuần trước</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center`}>
          <Icon icon={icon} className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}
