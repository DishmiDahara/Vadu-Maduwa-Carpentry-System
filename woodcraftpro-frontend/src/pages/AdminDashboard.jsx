import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Inbox,
  FileText,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  Phone,
  Mail,
  DollarSign,
  UserCheck,
  Printer,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ adminUser }) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [stats, setStats] = useState(null);

  // Module Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  // Modals & Form States
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    categoryId: 1,
    productName: '',
    description: '',
    basePrice: '',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  });

  const [showAddQuoteModal, setShowAddQuoteModal] = useState(false);
  const [newQuote, setNewQuote] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    materialCost: 0,
    labourCost: 0,
    additionalCharges: 0,
    items: [{ itemName: 'Custom Woodwork', quantity: 1, unitPrice: 50000, totalPrice: 50000 }]
  });

  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    billId: '',
    amount: '',
    paymentMethod: 'CASH',
    notes: ''
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      const [st, pr, ct, sv, gl, inq, qt, bl, py] = await Promise.all([
        api.getStats(),
        api.getProducts(),
        api.getCategories(),
        api.getServices(),
        api.getGallery(),
        api.getInquiries(),
        api.getQuotations(),
        api.getBills(),
        api.getPayments()
      ]);
      setStats(st);
      setProducts(pr);
      setCategories(ct);
      setServices(sv);
      setGallery(gl);
      setInquiries(inq);
      setQuotations(qt);
      setBills(bl);
      setPayments(py);
    } catch (err) {
      console.error(err);
    }
  };

  // Actions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct({
        ...newProduct,
        categoryId: Number(newProduct.categoryId),
        basePrice: Number(newProduct.basePrice)
      });
      setShowAddProductModal(false);
      loadAllAdminData();
    } catch {
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      await api.deleteProduct(id);
      loadAllAdminData();
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    await api.updateInquiryStatus(id, status);
    loadAllAdminData();
  };

  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    try {
      await api.createQuotation(newQuote);
      setShowAddQuoteModal(false);
      loadAllAdminData();
    } catch {
      alert('Failed to create quotation');
    }
  };

  const handleGenerateBillFromQuote = async (quote) => {
    try {
      await api.createBill({
        quotationId: quote.id,
        customerName: quote.customerName,
        totalAmount: quote.totalAmount,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      alert(`Invoice generated successfully for ${quote.customerName}`);
      loadAllAdminData();
      setActiveSubTab('billing');
    } catch {
      alert('Failed to generate bill');
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await api.recordPayment({
        billId: Number(paymentForm.billId),
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        notes: paymentForm.notes
      });
      setShowRecordPaymentModal(false);
      loadAllAdminData();
    } catch {
      alert('Failed to record payment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="bg-[#1C1F26] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-800">
        <div>
          <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Admin Command Center</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
            Workshop Management Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">Logged in as: {adminUser?.fullName || 'System Administrator'}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="bg-[#C68B59] hover:bg-[#b07646] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setShowAddQuoteModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <FileText className="w-4 h-4" /> New Quotation
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
          { id: 'quotations', label: `Quotations (${quotations.length})`, icon: FileText },
          { id: 'billing', label: `Bills & Payments (${bills.length})`, icon: CreditCard },
          { id: 'services-gallery', label: 'Services & Gallery', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-gray-900">
                LKR {Number(stats?.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Recorded payment receipts</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Balance</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-gray-900">
                LKR {Number(stats?.outstandingBalance || 0).toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Uncollected invoice balance</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Inquiries</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-gray-900">
                {stats?.newInquiries || 0}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Customer requests pending contact</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Catalog Items</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold font-heading text-gray-900">
                {stats?.totalProducts || 0}
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Active furniture products</p>
            </div>

          </div>

          {/* Recent Inquiries Table Preview */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-gray-900">Recent Customer Inquiries</h3>
              <button onClick={() => setActiveSubTab('inquiries')} className="text-xs font-bold text-[#C68B59] hover:underline">
                View All Desk
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.slice(0, 5).map(inq => (
                    <tr key={inq.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-gray-900">{inq.customerName}</td>
                      <td className="p-3 text-gray-600">{inq.customerPhone}</td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">{inq.message}</td>
                      <td className="p-3">
                        <span className={`badge badge-${inq.status.toLowerCase()}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'CONTACTED')}
                          className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-semibold"
                        >
                          Mark Contacted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: PRODUCTS MANAGER */}
      {activeSubTab === 'products' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-heading text-gray-900">Furniture Product Management</h3>
              <p className="text-xs text-gray-500">Manage ready-made furniture catalog, base prices and availability.</p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-[#C68B59] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Base Price (LKR)</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <img src={p.imageUrl} alt="" className="w-12 h-12 object-cover rounded-xl border" />
                    </td>
                    <td className="p-3 font-bold text-gray-900">{p.productName}</td>
                    <td className="p-3 text-gray-600 text-xs font-medium">Category ID #{p.categoryId}</td>
                    <td className="p-3 font-bold text-gray-900">LKR {Number(p.basePrice).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        AVAILABLE
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: INQUIRIES DESK */}
      {activeSubTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-xl font-bold font-heading text-gray-900">Customer Inquiries Desk</h3>
            <p className="text-xs text-gray-500">Track and respond to customer custom furniture requests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inquiries.map(inq => (
              <div key={inq.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-base">{inq.customerName}</h4>
                  <span className={`badge badge-${inq.status.toLowerCase()}`}>{inq.status}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#C68B59]" /> {inq.customerPhone}</p>
                  {inq.customerEmail && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#C68B59]" /> {inq.customerEmail}</p>}
                </div>
                <p className="text-sm bg-white p-3 rounded-xl border border-gray-100 text-gray-700 leading-relaxed italic">
                  "{inq.message}"
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'CONTACTED')}
                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-semibold"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'COMPLETED')}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-semibold"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: QUOTATIONS */}
      {activeSubTab === 'quotations' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-heading text-gray-900">Quotation Management</h3>
              <p className="text-xs text-gray-500">Generate formal price quotes for materials and labor costs.</p>
            </div>
            <button
              onClick={() => setShowAddQuoteModal(true)}
              className="bg-[#C68B59] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Quotation
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3">Quote #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Material Cost</th>
                  <th className="p-3">Labour Cost</th>
                  <th className="p-3">Total (LKR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-xs font-bold text-gray-700">{q.quotationNumber}</td>
                    <td className="p-3 font-bold text-gray-900">{q.customerName}</td>
                    <td className="p-3 text-gray-600">LKR {Number(q.materialCost || 0).toLocaleString()}</td>
                    <td className="p-3 text-gray-600">LKR {Number(q.labourCost || 0).toLocaleString()}</td>
                    <td className="p-3 font-extrabold text-gray-900">LKR {Number(q.totalAmount || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleGenerateBillFromQuote(q)}
                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        Convert to Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: BILLS & PAYMENTS */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-gray-900">Billing & Invoices</h3>
                <p className="text-xs text-gray-500">Track total invoices, collected payments and pending balances.</p>
              </div>
              <button
                onClick={() => setShowRecordPaymentModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <DollarSign className="w-4 h-4" /> Record Payment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Balance Due</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bills.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-xs font-bold text-gray-700">{b.billNumber}</td>
                      <td className="p-3 font-bold text-gray-900">{b.customerName}</td>
                      <td className="p-3 font-semibold text-gray-900">LKR {Number(b.totalAmount).toLocaleString()}</td>
                      <td className="p-3 text-emerald-600 font-bold">LKR {Number(b.paidAmount).toLocaleString()}</td>
                      <td className="p-3 text-amber-700 font-bold">LKR {Number(b.balanceAmount).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Receipts Ledger */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold font-heading text-gray-900">Payment Receipt Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Receipt #</th>
                    <th className="p-3">Bill Ref ID</th>
                    <th className="p-3">Amount (LKR)</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(py => (
                    <tr key={py.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-xs font-bold text-[#8B4513]">{py.receiptNumber}</td>
                      <td className="p-3 font-mono text-xs text-gray-600">Invoice #{py.billId}</td>
                      <td className="p-3 font-extrabold text-emerald-600">LKR {Number(py.amount).toLocaleString()}</td>
                      <td className="p-3 text-xs font-semibold text-gray-700">{py.paymentMethod}</td>
                      <td className="p-3 text-xs text-gray-500">{py.paymentDate}</td>
                      <td className="p-3 text-xs text-gray-600">{py.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 6: SERVICES & GALLERY */}
      {activeSubTab === 'services-gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold font-heading text-gray-900">Services Offered</h3>
            <div className="space-y-3">
              {services.map(s => (
                <div key={s.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{s.serviceName}</h4>
                    <p className="text-xs text-gray-500">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold font-heading text-gray-900">Project Gallery Items</h3>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map(g => (
                <div key={g.id} className="rounded-xl overflow-hidden border border-gray-200 relative group">
                  <img src={g.imageUrl} alt="" className="w-full h-28 object-cover" />
                  <div className="p-2 bg-white text-xs">
                    <p className="font-bold truncate">{g.title}</p>
                    <p className="text-[10px] text-gray-400">{g.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading">Add New Furniture Product</h3>
              <button onClick={() => setShowAddProductModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teak Nightstand"
                  value={newProduct.productName}
                  onChange={e => setNewProduct({ ...newProduct, productName: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                <select
                  value={newProduct.categoryId}
                  onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Base Price (LKR)</label>
                <input
                  type="number"
                  required
                  placeholder="85000"
                  value={newProduct.basePrice}
                  onChange={e => setNewProduct({ ...newProduct, basePrice: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>
              <button type="submit" className="w-full bg-[#C68B59] text-white py-3 rounded-xl font-bold text-sm">
                Save Furniture Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE QUOTATION */}
      {showAddQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading">Generate New Quotation</h3>
              <button onClick={() => setShowAddQuoteModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateQuotation} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Customer Name"
                value={newQuote.customerName}
                onChange={e => setNewQuote({ ...newQuote, customerName: e.target.value })}
                className="w-full p-2.5 border rounded-xl text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Phone"
                  value={newQuote.customerPhone}
                  onChange={e => setNewQuote({ ...newQuote, customerPhone: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newQuote.customerEmail}
                  onChange={e => setNewQuote({ ...newQuote, customerEmail: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Material Cost</label>
                  <input
                    type="number"
                    value={newQuote.materialCost}
                    onChange={e => setNewQuote({ ...newQuote, materialCost: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Labour Cost</label>
                  <input
                    type="number"
                    value={newQuote.labourCost}
                    onChange={e => setNewQuote({ ...newQuote, labourCost: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Additional</label>
                  <input
                    type="number"
                    value={newQuote.additionalCharges}
                    onChange={e => setNewQuote({ ...newQuote, additionalCharges: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#C68B59] text-white py-3 rounded-xl font-bold text-sm">
                Generate Quotation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD PAYMENT */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading">Record Payment Receipt</h3>
              <button onClick={() => setShowRecordPaymentModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Bill / Invoice</label>
                <select
                  required
                  value={paymentForm.billId}
                  onChange={e => setPaymentForm({ ...paymentForm, billId: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                >
                  <option value="">Select Invoice...</option>
                  {bills.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.billNumber} - {b.customerName} (Bal: LKR {b.balanceAmount})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment Amount (LKR)</label>
                <input
                  type="number"
                  required
                  placeholder="50000"
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                >
                  <option value="CASH">Cash Payment</option>
                  <option value="BANK_TRANSFER">Bank Transfer / Online</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CARD">Credit / Debit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Advance payment"
                  value={paymentForm.notes}
                  onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full p-2.5 border rounded-xl text-sm"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm">
                Record Transaction
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
