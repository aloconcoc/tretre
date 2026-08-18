'use client';

import { Icon } from '@iconify/react';
import StatCard from '@/components/admin/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data - in production, this would come from an API
const weeklyRevenueData = [
  { day: 'Thứ 2', revenue: 458000 },
  { day: 'Thứ 3', revenue: 320000 },
  { day: 'Thứ 4', revenue: 510000 },
  { day: 'Thứ 5', revenue: 590000 },
  { day: 'Thứ 6', revenue: 710000 },
  { day: 'Thứ 7', revenue: 820000 },
  { day: 'CN', revenue: 930000 },
];

const recentOrders = [
  { id: '#ORD001', customer: 'Nguyễn Văn A', product: 'Túi Xách Lục Bình', amount: '1,250,000₫', status: 'completed' },
  { id: '#ORD002', customer: 'Trần Thị B', product: 'Bình Hoa Tre', amount: '850,000₫', status: 'pending' },
  { id: '#ORD003', customer: 'Lê Văn C', product: 'Giỏ Cói Premium', amount: '1,450,000₫', status: 'shipping' },
  { id: '#ORD004', customer: 'Phạm Thị D', product: 'Khay Tre Mini', amount: '350,000₫', status: 'completed' },
  { id: '#ORD005', customer: 'Hoàng Văn E', product: 'Set Đĩa Lục Bình', amount: '950,000₫', status: 'pending' },
];

const statusColor = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  shipping: 'bg-blue-100 text-blue-700',
};

const statusLabel = {
  completed: 'Hoàn thành',
  pending: 'Chờ xử lý',
  shipping: 'Đang giao',
};

export default function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-comay-charcoal mb-2">Dashboard</h1>
        <p className="text-gray-500">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Doanh Thu"
          value="3,150,000₫"
          icon="solar:wallet-money-bold"
          iconBg="bg-comay-green"
          trend={{ value: '+12.5%', isPositive: true }}
        />
        <StatCard
          title="Đơn Hàng"
          value="127"
          icon="solar:bag-4-bold"
          iconBg="bg-blue-500"
          trend={{ value: '+8.3%', isPositive: true }}
        />
        <StatCard
          title="Sản Phẩm"
          value="48"
          icon="solar:box-bold"
          iconBg="bg-purple-500"
        />
        <StatCard
          title="Voucher Hiệu Lực"
          value="12"
          icon="solar:ticket-bold"
          iconBg="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:chart-2-bold" className="w-5 h-5 text-comay-green" />
            Doanh Thu Theo Tuần
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" fontSize={12} stroke="#999" />
              <YAxis fontSize={12} stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => `${value?.toLocaleString('vi-VN')}₫`}
              />
              <Bar dataKey="revenue" fill="#355e3b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-comay-charcoal mb-6 flex items-center gap-2">
            <Icon icon="solar:widget-2-bold" className="w-5 h-5 text-comay-green" />
            Thao Tác Nhanh
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-comay-green/5 hover:bg-comay-green/10 rounded-xl transition-colors group">
              <div className="w-12 h-12 bg-comay-green/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-comay-green/20 transition-colors">
                <Icon icon="solar:add-circle-bold" className="w-6 h-6 text-comay-green" />
              </div>
              <span className="text-sm font-semibold text-comay-charcoal">Thêm Sản Phẩm</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                <Icon icon="solar:ticket-sale-bold" className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-comay-charcoal">Tạo Voucher</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Icon icon="solar:clipboard-list-bold" className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-comay-charcoal">Xem Đơn Hàng</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <Icon icon="solar:chart-square-bold" className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-comay-charcoal">Báo Cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-comay-charcoal flex items-center gap-2">
            <Icon icon="solar:notes-bold" className="w-5 h-5 text-comay-green" />
            Đơn Hàng Gần Đây
          </h3>
          <button className="text-sm text-comay-green font-semibold hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã Đơn</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Khách Hàng</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sản Phẩm</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Số Tiền</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-semibold text-comay-charcoal">{order.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.product}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-comay-charcoal">{order.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status as keyof typeof statusColor]}`}>
                      {statusLabel[order.status as keyof typeof statusLabel]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
