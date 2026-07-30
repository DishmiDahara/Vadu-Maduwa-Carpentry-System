import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  Package, 
  Image, 
  Star, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export default function AdminDashboard({ adminUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Orders', count: 45, change: '+12% from last month', icon: ShoppingBag, color: 'text-amber-500' },
    { label: 'Inquiries', count: 32, change: '+8% from last month', icon: MessageSquare, color: 'text-blue-500' },
    { label: 'Products', count: 78, change: '+5% from last month', icon: Package, color: 'text-emerald-500' },
    { label: 'Reviews', count: 25, change: '+15% from last month', icon: Star, color: 'text-purple-500' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Dinesh Perera', product: 'Dining Table', status: 'Pending', date: '2024-06-01' },
    { id: '#ORD-002', customer: 'Nimal Fernando', product: 'Wardrobe', status: 'In Progress', date: '2024-06-01' },
    { id: '#ORD-003', customer: 'Kumari Jayawardena', product: 'Bed Set', status: 'Completed', date: '2024-05-31' },
    { id: '#ORD-004', customer: 'Sarath Silva', product: 'Office Table', status: 'Pending', date: '2024-05-31' }
  ];

  const recentInquiries = [
    { customer: 'Dinesh Perera', topic: 'Dining Table Quote', time: '2h ago' },
    { customer: 'S. Aravinth', topic: 'Custom Chair', time: '5h ago' },
    { customer: 'Nimal Fernando', topic: 'Wardrobe Design', time: '1d ago' }
  ];

  return (
    <div className="bg-[#FAF4EB] min-h-screen text-[#2B190E] flex">
      
      {/* ========================================================
          LEFT DARK SIDEBAR NAVIGATION (Matching Mockup)
         ======================================================== */}
      <aside className="w-64 bg-[#1D1109] text-amber-100/90 border-r border-[#3D2415] flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-screen">
        <div className="space-y-6">
          
          {/* Admin Header */}
          <div className="px-2 pt-2 flex items-center gap-3 border-b border-[#3D2415] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#8B5E3C] text-white flex items-center justify-center font-bold text-sm">
              WM
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white block">WADU MADUWA</span>
              <span className="text-[9px] tracking-widest text-amber-400 uppercase font-bold block">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'custom-orders', label: 'Custom Orders', icon: ShoppingBag },
              { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'gallery', label: 'Gallery', icon: Image },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const IconComp = item.icon;
              const isSel = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isSel
                      ? 'bg-[#3D2415] text-white font-bold border border-amber-500/30'
                      : 'text-amber-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComp className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-[#3D2415]">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          RIGHT MAIN CONTENT AREA (Matching Mockup)
         ======================================================== */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4">
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-[#2B190E]">Dashboard Overview</h1>
            <p className="text-xs text-[#7A6252] mt-0.5">Welcome back, {adminUser?.fullName || 'Admin'}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8B5E3C] text-white font-bold text-xs flex items-center justify-center shadow">
              Admin
            </div>
          </div>
        </div>

        {/* 4 Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div key={idx} className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A6252]">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4EB] flex items-center justify-center">
                    <IconComp className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#2B190E] font-heading">{s.count}</div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{s.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid: Orders Table + Inquiries & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Recent Custom Orders Table (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-sm text-[#2B190E]">Recent Custom Orders</h3>
              <button className="text-xs font-bold text-[#8B5E3C] hover:underline">View All Orders</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF4EB] text-[#7A6252] uppercase font-bold text-[10px] border-b border-[#E8DEC8]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC8]">
                  {recentOrders.map(o => (
                    <tr key={o.id} className="hover:bg-[#FAF4EB]/50">
                      <td className="p-3 font-mono font-bold text-[#8B5E3C]">{o.id}</td>
                      <td className="p-3 font-semibold text-[#2B190E]">{o.customer}</td>
                      <td className="p-3 text-[#7A6252]">{o.product}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          o.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-[#7A6252]">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Recent Inquiries & Quick Actions (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Recent Inquiries List */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2">
                <h3 className="font-bold text-sm text-[#2B190E]">Recent Inquiries</h3>
                <button className="text-[11px] font-bold text-[#8B5E3C]">View All</button>
              </div>

              <div className="space-y-2.5">
                {recentInquiries.map((inq, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-[#FAF4EB] rounded-xl border border-[#E8DEC8]">
                    <div>
                      <h4 className="font-bold text-[#2B190E]">{inq.customer}</h4>
                      <p className="text-[10px] text-[#7A6252]">{inq.topic}</p>
                    </div>
                    <span className="text-[10px] text-[#7A6252] font-medium">{inq.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#2B190E] border-b border-[#E8DEC8] pb-2">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => alert('Add New Product modal opened')}
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2 rounded-xl font-bold text-xs transition-all shadow"
                >
                  Add New Product
                </button>
                <button
                  onClick={() => alert('Add Gallery Image modal opened')}
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2 rounded-xl font-bold text-xs transition-all shadow"
                >
                  Add Gallery Image
                </button>
                <button
                  onClick={() => alert('Manage Reviews panel opened')}
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2 rounded-xl font-bold text-xs transition-all shadow"
                >
                  Manage Reviews
                </button>
                <button
                  onClick={() => alert('All inquiries opened')}
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2 rounded-xl font-bold text-xs transition-all shadow"
                >
                  View All Inquiries
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
