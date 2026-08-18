'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminTopBar from '@/components/admin/TopBar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
