import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 flex flex-col lg:ml-0'>
          <Header />
          <main className='flex-1 overflow-auto bg-sophia-bg'>{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
