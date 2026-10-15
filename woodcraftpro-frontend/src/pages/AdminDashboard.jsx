import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  Package, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Eye,
  Trash2,
  Edit,
  Phone,
  MapPin,
  RotateCcw,
  Menu,
  X,
  Search,
  Check,
  Send,
  Building,
  Save,
  Globe,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ adminUser, setActiveTab, onLogout }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Data states
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalInquiries: 0,
    newInquiries: 0,
    totalProducts: 0,
    totalQuotations: 0,
    totalRevenue: 0
  });
  const [customOrders, setCustomOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [workshopSettings, setWorkshopSettings] = useState({
    workshopName: 'වඩු මඩුව | Wadu Maduwa Carpentry Workshop',
    phone: '077 974 3901',
    whatsapp: '94779743901',
    address: 'Bandaragama Road, Kesbewa, Sri Lanka',
    openingHours: 'Mon - Sat: 8:00 AM - 6:30 PM',
    leadCarpenter: 'Master Craftsman Somadasa Silva'
  });

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [inquiryFilter, setInquiryFilter] = useState('ALL');

  // Modals
  const [selectedOrderForView, setSelectedOrderForView] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    productName: '',
    categoryId: 1,
    basePrice: '',
    description: '',
    imageUrl: '',
    available: true
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'doors',
    imageUrl: '/images/doors/IMG_6930.PNG',
    description: ''
  });

  const [quotationForm, setQuotationForm] = useState({
    customerName: '',
    customerPhone: '',
    projectTitle: '',
    timberType: 'Teak Wood (තේක්ක)',
    materialCost: '',
    labourCost: '',
    transportCost: '',
    status: 'DRAFT',
    notes: ''
  });

  // Load all data
  const refreshData = async () => {
    try {
      const [ord, prod, inq, gal, quot, sett, st] = await Promise.all([
        api.getCustomOrders(),
        api.getProducts(),
        api.getInquiries(),
        api.getGallery(),
        api.getQuotations(),
        api.getSettings(),
        api.getStats()
      ]);
      setCustomOrders(ord || []);
      setProducts(prod || []);
      setInquiries(inq || []);
      setGallery(gal || []);
      setQuotations(quot || []);
      if (sett) setWorkshopSettings(sett);
      if (st) setStats(st);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Status Handlers
  const handleUpdateOrderStatus = async (id, newStatus) => {
    await api.updateCustomOrderStatus(id, newStatus);
    showToast(`Order status updated to "${newStatus}"`);
    refreshData();
    if (selectedOrderForView && selectedOrderForView.id === id) {
      setSelectedOrderForView(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom order?')) {
      await api.deleteCustomOrder(id);
      showToast('Order deleted successfully');
      if (selectedOrderForView && selectedOrderForView.id === id) {
        setSelectedOrderForView(null);
      }
      refreshData();
    }
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    await api.updateInquiryStatus(id, newStatus);
    showToast(`Inquiry marked as "${newStatus}"`);
    refreshData();
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Delete this inquiry record?')) {
      await api.deleteInquiry(id);
      showToast('Inquiry removed');
      refreshData();
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      productName: '',
      categoryId: 1,
      basePrice: '',
      description: '',
      imageUrl: '/images/cupboards/IMG_7175.PNG',
      available: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      productName: prod.productName,
      categoryId: prod.categoryId || 1,
      basePrice: prod.basePrice,
      description: prod.description || '',
      imageUrl: prod.imageUrl || '',
      available: prod.available ?? true
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.productName || !productForm.basePrice) {
      alert('Please provide product name and base price');
      return;
    }
    const payload = {
      productName: productForm.productName,
      categoryId: Number(productForm.categoryId),
      basePrice: Number(productForm.basePrice),
      description: productForm.description,
      imageUrl: productForm.imageUrl || '/images/doors/IMG_6930.PNG',
      available: Boolean(productForm.available)
    };

    if (editingProduct) {
      await api.updateProduct(editingProduct.id, payload);
      showToast('Product updated successfully');
    } else {
      await api.createProduct(payload);
      showToast('New product added to catalog');
    }
    setIsProductModalOpen(false);
    refreshData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      showToast('Product removed from catalog');
      refreshData();
    }
  };

  // Gallery CRUD
  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.imageUrl) {
      alert('Please fill in title and image URL');
      return;
    }
    await api.createGalleryItem(galleryForm);
    showToast('Showcase item added to gallery');
    setIsGalleryModalOpen(false);
    setGalleryForm({
      title: '',
      category: 'doors',
      imageUrl: '/images/doors/IMG_6930.PNG',
      description: ''
    });
    refreshData();
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm('Delete this showcase photo?')) {
      await api.deleteGalleryItem(id);
      showToast('Showcase item deleted');
      refreshData();
    }
  };

  // Quotation CRUD
  const handleSaveQuotation = async (e) => {
    e.preventDefault();
    const mat = Number(quotationForm.materialCost) || 0;
    const lab = Number(quotationForm.labourCost) || 0;
    const trans = Number(quotationForm.transportCost) || 0;
    const total = mat + lab + trans;

    const payload = {
      customerName: quotationForm.customerName,
      customerPhone: quotationForm.customerPhone,
      projectTitle: quotationForm.projectTitle,
      timberType: quotationForm.timberType,
      materialCost: mat,
      labourCost: lab,
      transportCost: trans,
      totalAmount: total,
      status: quotationForm.status,
      notes: quotationForm.notes,
      date: new Date().toISOString().split('T')[0]
    };

    await api.createQuotation(payload);
    showToast('Quotation created successfully');
    setIsQuotationModalOpen(false);
    setQuotationForm({
      customerName: '',
      customerPhone: '',
      projectTitle: '',
      timberType: 'Teak Wood (තේක්ක)',
      materialCost: '',
      labourCost: '',
      transportCost: '',
      status: 'DRAFT',
      notes: ''
    });
    refreshData();
  };

  const handleUpdateQuotationStatus = async (id, status) => {
    await api.updateQuotationStatus(id, status);
    showToast(`Quotation status updated to ${status}`);
    refreshData();
  };

  const handleDeleteQuotation = async (id) => {
    if (window.confirm('Delete this quotation?')) {
      await api.deleteQuotation(id);
      showToast('Quotation removed');
      refreshData();
    }
  };

  // Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await api.saveSettings(workshopSettings);
    showToast('Workshop settings saved successfully');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo orders, products, and inquiries back to original sample data?')) {
      api.resetDemoData();
      refreshData();
      showToast('Demo data reset successfully');
    }
  };

  // Nav items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'custom-orders', label: 'Custom 3D Orders', badge: customOrders.length, icon: ShoppingBag },
    { id: 'inquiries', label: 'Customer Inquiries', badge: inquiries.filter(i => i.status === 'NEW').length, icon: MessageSquare },
    { id: 'products', label: 'Catalog Products', badge: products.length, icon: Package },
    { id: 'gallery', label: 'Showcase Gallery', badge: gallery.length, icon: ImageIcon },
    { id: 'quotations', label: 'Quotations & Bills', badge: quotations.length, icon: FileText },
    { id: 'settings', label: 'Workshop Settings', icon: Settings },
  ];

  // Filtered lists
  const filteredOrders = customOrders.filter(order => {
    const matchesFilter = orderFilter === 'ALL' || order.status === orderFilter;
    const matchesSearch = !orderSearch || 
      (order.customerName && order.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (order.furnitureType && order.furnitureType.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredProducts = products.filter(p => {
    const matchesCat = productCategoryFilter === 'ALL' || String(p.categoryId) === String(productCategoryFilter);
    const matchesSearch = !productSearch || p.productName.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredInquiries = inquiries.filter(inq => {
    return inquiryFilter === 'ALL' || inq.status === inquiryFilter;
  });

  return (
    <div className="bg-[#FAF4EB] min-h-screen text-[#2B190E] flex flex-col md:flex-row relative font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[999] bg-[#2B190E] text-amber-200 px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          LEFT DARK SIDEBAR NAVIGATION
         ======================================================== */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-[#180E07] text-amber-100/90 border-r border-[#3D2415] 
        flex flex-col justify-between p-4 shrink-0 transition-transform duration-300
        ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-5">
          
          {/* Header Brand */}
          <div className="px-2 pt-2 flex items-center justify-between border-b border-[#3D2415] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#5C3A21] text-white flex items-center justify-center font-black text-base shadow-lg border border-amber-500/30">
                වම
              </div>
              <div>
                <span className="font-heading font-black text-sm text-white tracking-wide block">වඩු මඩුව</span>
                <span className="text-[10px] tracking-widest text-amber-400 uppercase font-extrabold block">Admin Panel</span>
              </div>
            </div>

            <button 
              onClick={() => setIsMobileNavOpen(false)}
              className="md:hidden text-amber-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Return to Public Website shortcut */}
          <button
            onClick={() => setActiveTab('home')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#2B190E] hover:bg-[#3D2415] text-amber-300 text-xs font-bold border border-amber-500/30 transition-all shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Visit Website (මුල් පිටුවට)</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isSel = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isSel
                      ? 'bg-[#3D2415] text-white font-bold border border-amber-500/40 shadow-inner'
                      : 'text-amber-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isSel ? 'text-amber-400' : 'text-amber-300/60'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSel ? 'bg-amber-500 text-black' : 'bg-white/10 text-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Admin Info & Logout */}
        <div className="pt-4 border-t border-[#3D2415] space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5 bg-[#20120A] rounded-xl border border-[#3D2415]">
            <div className="w-8 h-8 rounded-lg bg-[#8B5E3C] text-white font-bold text-xs flex items-center justify-center shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{adminUser?.fullName || 'Workshop Manager'}</p>
              <p className="text-[10px] text-amber-400/80 truncate">@{adminUser?.username || 'admin'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors border border-red-900/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out (පද්ධතියෙන් ඉවත් වන්න)</span>
          </button>
        </div>
      </aside>

      {/* Mobile nav backdrop */}
      {isMobileNavOpen && (
        <div 
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      {/* ========================================================
          RIGHT MAIN CONTENT AREA
         ======================================================== */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white border border-[#E8DEC8] text-[#2B190E]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-heading text-[#2B190E]">
                  {navItems.find(n => n.id === currentTab)?.label || 'Dashboard'}
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live System
                </span>
              </div>
              <p className="text-xs text-[#7A6252] mt-0.5">
                {currentTab === 'dashboard' && 'Workshop performance KPIs & quick management tools'}
                {currentTab === 'custom-orders' && 'Review customer 3D custom furniture orders and manage production lifecycle'}
                {currentTab === 'inquiries' && 'Customer contact inquiries, quote requests and WhatsApp follow-ups'}
                {currentTab === 'products' && 'Manage workshop product catalog, categories and pricing'}
                {currentTab === 'gallery' && 'Showcase completed carpentry projects with full photos'}
                {currentTab === 'quotations' && 'Draft and track client quotation estimates with cost breakdowns'}
                {currentTab === 'settings' && 'Update workshop contact info, working hours and system configurations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-amber-50 text-[#8B5E3C] border border-[#E8DEC8] rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Website</span>
            </button>

            <button
              onClick={refreshData}
              title="Refresh all data"
              className="p-2 bg-white hover:bg-amber-50 text-[#7A6252] border border-[#E8DEC8] rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E8DEC8] shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-[#8B5E3C] text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <span className="text-xs font-bold text-[#2B190E] hidden md:inline">Admin</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            TAB 1: DASHBOARD OVERVIEW
           ======================================================== */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A6252]">Custom 3D Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#2B190E] font-heading">{stats.totalOrders}</div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {stats.pendingOrders} pending review &bull; {stats.completedOrders} completed
                </div>
              </div>

              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A6252]">Customer Inquiries</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#2B190E] font-heading">{stats.totalInquiries}</div>
                <div className="text-[11px] text-blue-700 font-medium">
                  {stats.newInquiries} new uncontacted inquiries
                </div>
              </div>

              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A6252]">Catalog Products</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Package className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#2B190E] font-heading">{stats.totalProducts}</div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Available in live showroom catalog
                </div>
              </div>

              <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A6252]">Total Est. Value</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#2B190E] font-heading">
                  Rs. {stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
                </div>
                <div className="text-[11px] text-purple-700 font-medium">
                  Combined custom orders volume
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Custom Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Recent Orders (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#2B190E]">Recent Custom Orders (3D & Uploaded)</h3>
                    <p className="text-[11px] text-[#7A6252]">Latest carpentry work orders submitted by clients</p>
                  </div>
                  <button 
                    onClick={() => setCurrentTab('custom-orders')}
                    className="text-xs font-bold text-[#8B5E3C] hover:underline cursor-pointer"
                  >
                    View All ({customOrders.length}) &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF4EB] text-[#7A6252] uppercase font-bold text-[10px] border-b border-[#E8DEC8]">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Design / Type</th>
                        <th className="p-3">Wood</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DEC8]">
                      {customOrders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF4EB]/50 transition-colors">
                          <td className="p-3 font-mono font-bold text-[#8B5E3C]">{o.orderNumber || `#${o.id}`}</td>
                          <td className="p-3">
                            <span className="font-semibold text-[#2B190E] block">{o.customerName}</span>
                            <span className="text-[10px] text-[#7A6252]">{o.customerPhone}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-[#2B190E] font-medium block truncate max-w-[180px]">{o.designTitle || o.furnitureType}</span>
                            <span className="text-[10px] text-amber-700 font-semibold">{o.isUploadedDesign ? 'Custom Upload' : 'Catalog 3D'}</span>
                          </td>
                          <td className="p-3 text-[#7A6252] text-[11px] truncate max-w-[120px]">{o.woodType || 'Teak'}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              o.status === 'Ready for Delivery' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedOrderForView(o)}
                              className="text-[11px] font-bold text-[#8B5E3C] hover:underline bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-[#E8DEC8]"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                      {customOrders.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-6 text-center text-xs text-[#7A6252]">
                            No custom orders yet. Try submitting an order from the 3D Custom Order page!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Quick Actions + Recent Inquiries (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Quick Actions Panel */}
                <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="font-bold text-sm text-[#2B190E] border-b border-[#E8DEC8] pb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Quick Actions</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full bg-[#2B190E] hover:bg-[#3D2415] text-white py-2.5 px-3 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Add New Product to Catalog</span>
                    </button>
                    
                    <button
                      onClick={() => setIsGalleryModalOpen(true)}
                      className="w-full bg-white hover:bg-amber-50 text-[#2B190E] border border-[#E8DEC8] py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#8B5E3C]" />
                      <span>Add Project to Showcase</span>
                    </button>

                    <button
                      onClick={() => setIsQuotationModalOpen(true)}
                      className="w-full bg-white hover:bg-amber-50 text-[#2B190E] border border-[#E8DEC8] py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#8B5E3C]" />
                      <span>Create Quotation / Estimate</span>
                    </button>

                    <button
                      onClick={() => setCurrentTab('custom-orders')}
                      className="w-full bg-amber-50 hover:bg-amber-100 text-[#8B4513] border border-amber-200 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Manage All Custom Orders</span>
                    </button>
                  </div>
                </div>

                {/* Recent Inquiries Card */}
                <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-2">
                    <h3 className="font-bold text-sm text-[#2B190E]">New Inquiries</h3>
                    <button 
                      onClick={() => setCurrentTab('inquiries')}
                      className="text-[11px] font-bold text-[#8B5E3C] hover:underline"
                    >
                      View All ({inquiries.length})
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div key={inq.id} className="p-3 bg-[#FAF4EB]/60 rounded-xl border border-[#E8DEC8] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#2B190E]">{inq.name || inq.customerName || 'Inquirer'}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            inq.status === 'NEW' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6252] truncate">{inq.message || inq.topic || 'Inquiry message'}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-gray-500">{inq.phone || inq.createdAt}</span>
                          <a
                            href={`https://wa.me/${(inq.phone || '94779743901').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.name || '')},%20regarding%20your%20carpentry%20inquiry%20at%20Wadu%20Maduwa:`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                    {inquiries.length === 0 && (
                      <p className="text-xs text-[#7A6252] text-center py-4">No recent inquiries.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: CUSTOM 3D ORDERS
           ======================================================== */}
        {currentTab === 'custom-orders' && (
          <div className="space-y-5 animate-fade-in">
            {/* Filter Chips & Search Bar */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#7A6252] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by customer, order #, or item..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF4EB]/60 rounded-xl border border-[#E8DEC8] text-xs font-medium focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {['ALL', 'Pending Review', 'In Progress', 'Ready for Delivery', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderFilter === st
                        ? 'bg-[#2B190E] text-white shadow-sm'
                        : 'bg-[#FAF4EB] text-[#7A6252] hover:bg-amber-100/60 border border-[#E8DEC8]'
                    }`}
                  >
                    {st === 'ALL' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Orders Grid / Table */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E8DEC8] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#2B190E]">Carpentry Custom Orders ({filteredOrders.length})</h3>
                  <p className="text-[11px] text-[#7A6252]">Click "View Full Spec & 3D" to inspect uploaded designs, timber specs and contact customer</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF4EB] text-[#7A6252] uppercase font-bold text-[10px] border-b border-[#E8DEC8]">
                    <tr>
                      <th className="p-3.5">Order Info</th>
                      <th className="p-3.5">Customer & District</th>
                      <th className="p-3.5">Design Preview</th>
                      <th className="p-3.5">Wood & Polish</th>
                      <th className="p-3.5">Price (LKR)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DEC8]">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#FAF4EB]/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-[#8B5E3C] block">{order.orderNumber || `#${order.id}`}</span>
                          <span className="text-[10px] text-[#7A6252]">{order.createdAt || 'Recent'}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#2B190E] block">{order.customerName}</span>
                          <span className="text-[10px] text-[#7A6252] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#8B5E3C]" /> {order.customerPhone}
                          </span>
                          {order.customerDistrict && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {order.customerDistrict}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {order.designImage ? (
                              <img
                                src={order.designImage}
                                alt="Design"
                                className="w-12 h-12 object-cover rounded-lg border border-[#E8DEC8] shadow-sm shrink-0 bg-white"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-amber-100 text-[#8B5E3C] flex items-center justify-center font-bold text-xs shrink-0">
                                3D
                              </div>
                            )}
                            <div className="max-w-[150px]">
                              <p className="font-bold text-[#2B190E] truncate">{order.designTitle || order.furnitureType}</p>
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {order.isUploadedDesign ? 'Customer Upload' : '3D Catalog'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-[#2B190E] block truncate max-w-[140px]">{order.woodType || 'Teak'}</span>
                          <span className="text-[10px] text-[#7A6252] truncate block max-w-[140px]">{order.finish || 'Standard'}</span>
                        </td>
                        <td className="p-3.5 font-bold text-[#2B190E]">
                          Rs. {order.estimatedPrice ? Number(order.estimatedPrice).toLocaleString() : 'Negotiable'}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-lg px-2.5 py-1 text-xs font-bold text-[#2B190E] focus:outline-none focus:border-[#8B5E3C]"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedOrderForView(order)}
                            className="p-1.5 rounded-lg bg-[#FAF4EB] hover:bg-amber-100 text-[#8B5E3C] border border-[#E8DEC8] transition-colors"
                            title="Inspect Order Details & 3D"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`https://wa.me/${(order.customerPhone || '94779743901').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customerName || '')},%20we%20are%20reviewing%20your%20Wadu%20Maduwa%20Order%20${encodeURIComponent(order.orderNumber || '')}:`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors inline-block"
                            title="Chat on WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-xs text-[#7A6252]">
                          No custom orders found matching this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: CUSTOMER INQUIRIES
           ======================================================== */}
        {currentTab === 'inquiries' && (
          <div className="space-y-5 animate-fade-in">
            {/* Filter Tabs */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2B190E]">Customer Inquiry Desk</h3>
                <p className="text-[11px] text-[#7A6252]">Direct quote requests, workshop visits, and custom carpentry queries</p>
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'NEW', 'CONTACTED', 'RESOLVED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setInquiryFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inquiryFilter === st
                        ? 'bg-[#2B190E] text-white'
                        : 'bg-[#FAF4EB] text-[#7A6252] border border-[#E8DEC8] hover:bg-amber-100/60'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInquiries.map(inq => (
                <div key={inq.id} className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#2B190E]">{inq.name || inq.customerName || 'Customer'}</h4>
                        <span className="text-[11px] text-[#8B5E3C] font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {inq.phone || 'No phone'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inq.status === 'NEW' ? 'bg-red-100 text-red-700 border border-red-200' :
                        inq.status === 'CONTACTED' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    {inq.email && (
                      <p className="text-[10px] text-gray-500">{inq.email}</p>
                    )}

                    <div className="bg-[#FAF4EB] p-2.5 rounded-xl border border-[#E8DEC8]">
                      <p className="text-xs text-[#2B190E] leading-relaxed italic">
                        "{inq.message || inq.topic || 'Inquiry message'}"
                      </p>
                    </div>

                    <p className="text-[10px] text-[#7A6252]">Received: {inq.createdAt || 'Recent'}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-between gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                      className="text-[11px] font-bold bg-[#FAF4EB] border border-[#E8DEC8] rounded-lg px-2 py-1 text-[#2B190E] focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <a
                        href={`https://wa.me/${(inq.phone || '94779743901').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.name || '')},%20this%20is%20Wadu%20Maduwa%20Carpentry%20Workshop.%20We%20received%20your%20inquiry:`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" /> WhatsApp
                      </a>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredInquiries.length === 0 && (
                <div className="col-span-full bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center text-xs text-[#7A6252]">
                  No inquiries found in this view.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: CATALOG PRODUCTS CRUD
           ======================================================== */}
        {currentTab === 'products' && (
          <div className="space-y-5 animate-fade-in">
            {/* Header with Search and Add Product Button */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-[#7A6252] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search catalog products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF4EB]/60 rounded-xl border border-[#E8DEC8] text-xs font-medium focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl px-3 py-2 text-xs font-bold text-[#2B190E] focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="1">Beds & Bedroom</option>
                  <option value="2">Dining & Kitchen</option>
                  <option value="3">Living Room</option>
                  <option value="4">Wardrobes & Closets</option>
                  <option value="5">Doors & Windows</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="w-full md:w-auto bg-[#2B190E] hover:bg-[#3D2415] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add New Product (නව භාණ්ඩයක්)</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative h-44 bg-[#FAF4EB] overflow-hidden group">
                      <img
                        src={p.imageUrl}
                        alt={p.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = '/images/doors/IMG_6930.PNG'; }}
                      />
                      <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow ${
                        p.available ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {p.available ? 'In Stock / Ready' : 'Custom Order Only'}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-[#2B190E] line-clamp-1">{p.productName}</h4>
                      <p className="text-[11px] text-[#7A6252] line-clamp-2 leading-relaxed">{p.description}</p>
                      <p className="text-sm font-black text-[#8B5E3C] pt-1">
                        Rs. {Number(p.basePrice).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-[#E8DEC8]/60 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="flex-1 py-1.5 px-3 bg-[#FAF4EB] hover:bg-amber-100 text-[#8B5E3C] font-bold text-xs rounded-xl border border-[#E8DEC8] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center text-xs text-[#7A6252]">
                  No products found. Click "Add New Product" to populate the catalog!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SHOWCASE GALLERY
           ======================================================== */}
        {currentTab === 'gallery' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2B190E]">Completed Works Gallery Showcase</h3>
                <p className="text-[11px] text-[#7A6252]">Photographs displayed in the public workshop showcase portfolio</p>
              </div>

              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="bg-[#2B190E] hover:bg-[#3D2415] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Showcase Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="relative h-48 bg-[#FAF4EB]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/doors/IMG_6930.PNG'; }}
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-[#2B190E]">{item.title}</h4>
                    <p className="text-xs text-[#7A6252] leading-relaxed">{item.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8DEC8]">
                      <span className="text-[10px] text-gray-500">{item.completedDate || '2026 Work'}</span>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: QUOTATIONS & BILLS
           ======================================================== */}
        {currentTab === 'quotations' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#2B190E]">Quotations & Cost Estimates</h3>
                <p className="text-[11px] text-[#7A6252]">Draft timber job estimations with material, labour and transport breakdown</p>
              </div>

              <button
                onClick={() => setIsQuotationModalOpen(true)}
                className="bg-[#2B190E] hover:bg-[#3D2415] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create New Quotation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotations.map(q => (
                <div key={q.id} className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between border-b border-[#E8DEC8] pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#8B5E3C]">{q.quotationNumber || `#QT-${q.id}`}</span>
                      <h4 className="font-bold text-sm text-[#2B190E]">{q.customerName}</h4>
                      <p className="text-[11px] text-[#7A6252]">{q.projectTitle}</p>
                    </div>
                    <select
                      value={q.status}
                      onChange={(e) => handleUpdateQuotationStatus(q.id, e.target.value)}
                      className="text-[10px] font-bold bg-[#FAF4EB] border border-[#E8DEC8] rounded-lg px-2 py-1 text-[#2B190E] focus:outline-none"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="SENT">SENT</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[#7A6252]">
                      <span>Timber:</span>
                      <span className="font-semibold text-[#2B190E]">{q.timberType || 'Teak'}</span>
                    </div>
                    <div className="flex justify-between text-[#7A6252]">
                      <span>Material Cost:</span>
                      <span>Rs. {Number(q.materialCost || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#7A6252]">
                      <span>Labour & Crafting:</span>
                      <span>Rs. {Number(q.labourCost || 0).toLocaleString()}</span>
                    </div>
                    {q.transportCost > 0 && (
                      <div className="flex justify-between text-[#7A6252]">
                        <span>Transport & Delivery:</span>
                        <span>Rs. {Number(q.transportCost).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#2B190E] pt-2 border-t border-[#E8DEC8]">
                      <span>Total Estimate:</span>
                      <span className="text-[#8B5E3C]">Rs. {Number(q.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {q.notes && (
                    <p className="text-[11px] text-[#7A6252] bg-[#FAF4EB] p-2 rounded-lg italic">
                      Note: {q.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">{q.date || '2026'}</span>
                    <button
                      onClick={() => handleDeleteQuotation(q.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {quotations.length === 0 && (
                <div className="col-span-full bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center text-xs text-[#7A6252]">
                  No quotations created yet. Click "Create New Quotation" to draft one!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: WORKSHOP SETTINGS
           ======================================================== */}
        {currentTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-[#E8DEC8] pb-4">
                <h3 className="font-bold text-base text-[#2B190E]">Workshop Profile & Contact Information</h3>
                <p className="text-xs text-[#7A6252]">These details are reflected across the website header, footer, and quotation letters</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Workshop Business Name</label>
                  <input
                    type="text"
                    value={workshopSettings.workshopName}
                    onChange={(e) => setWorkshopSettings({ ...workshopSettings, workshopName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Primary Phone Hotline</label>
                    <input
                      type="text"
                      value={workshopSettings.phone}
                      onChange={(e) => setWorkshopSettings({ ...workshopSettings, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">WhatsApp Direct Number (No +)</label>
                    <input
                      type="text"
                      value={workshopSettings.whatsapp}
                      onChange={(e) => setWorkshopSettings({ ...workshopSettings, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Workshop Physical Address</label>
                  <input
                    type="text"
                    value={workshopSettings.address}
                    onChange={(e) => setWorkshopSettings({ ...workshopSettings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={workshopSettings.openingHours}
                      onChange={(e) => setWorkshopSettings({ ...workshopSettings, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Master Craftsman / Contact Person</label>
                    <input
                      type="text"
                      value={workshopSettings.leadCarpenter}
                      onChange={(e) => setWorkshopSettings({ ...workshopSettings, leadCarpenter: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-[#2B190E] hover:bg-[#3D2415] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Save Workshop Profile</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone / Demo Data Reset */}
            <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Demo Data Management & Reset</span>
              </h4>
              <p className="text-xs text-red-700">
                If you made experimental edits or want to restore default sample custom orders, products, inquiries, and gallery photos, you can reset the store with one click.
              </p>
              <button
                type="button"
                onClick={handleResetDemoData}
                className="bg-white hover:bg-red-50 text-red-700 border border-red-300 px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Original Demo Data</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          MODAL 1: VIEW FULL CUSTOM ORDER SPECIFICATION & 3D
         ======================================================== */}
      {selectedOrderForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8DEC8] space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#8B5E3C]">{selectedOrderForView.orderNumber || `#${selectedOrderForView.id}`}</span>
                <h3 className="font-black text-lg text-[#2B190E]">{selectedOrderForView.designTitle || selectedOrderForView.furnitureType}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForView(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Design Image & Visual Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF4EB] rounded-2xl p-2 border border-[#E8DEC8] flex items-center justify-center">
                {selectedOrderForView.designImage ? (
                  <img
                    src={selectedOrderForView.designImage}
                    alt="Custom Carpentry Design"
                    className="max-h-64 object-contain rounded-xl"
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-xs text-[#7A6252] font-semibold">
                    No Design Image Available
                  </div>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">Client Name</label>
                  <p className="font-bold text-sm text-[#2B190E]">{selectedOrderForView.customerName}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">Phone / WhatsApp</label>
                  <p className="font-semibold text-[#2B190E]">{selectedOrderForView.customerPhone}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">District / Delivery Address</label>
                  <p className="text-[#2B190E]">{selectedOrderForView.customerDistrict || 'Not specified'} &bull; {selectedOrderForView.customerAddress || 'No address'}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">Timber Wood Selection</label>
                  <p className="font-semibold text-[#8B5E3C]">{selectedOrderForView.woodType || 'Teak'}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">Finish & Polish</label>
                  <p className="text-[#2B190E]">{selectedOrderForView.finish || 'Natural PU'}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">Estimated Dimensions</label>
                  <p className="font-mono text-[#2B190E]">{selectedOrderForView.dimensions || 'Custom'}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#7A6252] block">Estimated Cost</label>
                  <p className="text-base font-black text-[#8B5E3C]">
                    Rs. {selectedOrderForView.estimatedPrice ? Number(selectedOrderForView.estimatedPrice).toLocaleString() : 'Negotiable'}
                  </p>
                </div>
              </div>
            </div>

            {selectedOrderForView.orderDescription && (
              <div className="bg-[#FAF4EB] p-3 rounded-2xl border border-[#E8DEC8]">
                <label className="text-[10px] uppercase font-bold text-[#7A6252] block mb-1">Customer Special Requests & Carving Notes</label>
                <p className="text-xs text-[#2B190E] leading-relaxed">{selectedOrderForView.orderDescription}</p>
              </div>
            )}

            {/* Status Changer & WhatsApp Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8DEC8]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2B190E]">Update Status:</span>
                <select
                  value={selectedOrderForView.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrderForView.id, e.target.value)}
                  className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-xs font-bold text-[#2B190E] focus:outline-none"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${(selectedOrderForView.customerPhone || '94779743901').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedOrderForView.customerName || '')},%20this%20is%20Wadu%20Maduwa%20regarding%20Order%20${encodeURIComponent(selectedOrderForView.orderNumber || '')}:`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedOrderForView(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ADD / EDIT PRODUCT MODAL
         ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DEC8] space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#2B190E]">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teak King Size Bed"
                  value={productForm.productName}
                  onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                  >
                    <option value={1}>Beds & Bedroom</option>
                    <option value={2}>Dining & Kitchen</option>
                    <option value={3}>Living Room</option>
                    <option value={4}>Wardrobes & Closets</option>
                    <option value={5}>Doors & Windows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Base Price (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="125000"
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Image URL / Path</label>
                <input
                  type="text"
                  placeholder="/images/doors/IMG_6930.PNG or https://..."
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Description & Wood Species</label>
                <textarea
                  rows="2"
                  placeholder="Crafted with pure solid Ceylon teak, termite resistant..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={productForm.available}
                  onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                  className="w-4 h-4 text-[#8B5E3C] rounded border-gray-300"
                />
                <label htmlFor="inStock" className="text-xs font-bold text-[#2B190E] cursor-pointer">
                  In Stock / Ready in Showroom
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2B190E] hover:bg-[#3D2415] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD GALLERY ITEM MODAL
         ======================================================== */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DEC8] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#2B190E]">Add Project Showcase Photo</h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Kalutara Villa Entrance Door"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                >
                  <option value="doors">Doors & Windows</option>
                  <option value="cupboards">Pantry & Cupboards</option>
                  <option value="stairs">Staircases & Handrails</option>
                  <option value="custom">Custom Carvings & Bedroom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Image URL / File Path</label>
                <input
                  type="text"
                  required
                  placeholder="/images/doors/IMG_6930.PNG or URL"
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Project Description</label>
                <textarea
                  rows="2"
                  placeholder="100% Genuine Sri Lankan Teak with copper-tint varnish..."
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2B190E] hover:bg-[#3D2415] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: CREATE QUOTATION MODAL
         ======================================================== */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8DEC8] space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#2B190E]">Draft New Quotation / Estimate</h3>
              <button
                onClick={() => setIsQuotationModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dinesh Perera"
                    value={quotationForm.customerName}
                    onChange={(e) => setQuotationForm({ ...quotationForm, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Customer Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="077 123 4567"
                    value={quotationForm.customerPhone}
                    onChange={(e) => setQuotationForm({ ...quotationForm, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Project / Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8-Seater Teak Dining Table & Chairs"
                  value={quotationForm.projectTitle}
                  onChange={(e) => setQuotationForm({ ...quotationForm, projectTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none focus:border-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Timber Selection</label>
                <select
                  value={quotationForm.timberType}
                  onChange={(e) => setQuotationForm({ ...quotationForm, timberType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                >
                  <option value="Teak Wood (තේක්ක)">Teak Wood (තේක්ක)</option>
                  <option value="Mahogany (මහෝගනී)">Mahogany (මහෝගනී)</option>
                  <option value="Nadun (නැදුන්)">Nadun (නැදුන්)</option>
                  <option value="Jack Wood (කොස්)">Jack Wood (කොස්)</option>
                  <option value="Mara / Sooriyamara (මාර)">Mara / Sooriyamara (මාර)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#2B190E] uppercase mb-1">Material (LKR)</label>
                  <input
                    type="number"
                    placeholder="80000"
                    value={quotationForm.materialCost}
                    onChange={(e) => setQuotationForm({ ...quotationForm, materialCost: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2B190E] uppercase mb-1">Labour (LKR)</label>
                  <input
                    type="number"
                    placeholder="35000"
                    value={quotationForm.labourCost}
                    onChange={(e) => setQuotationForm({ ...quotationForm, labourCost: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2B190E] uppercase mb-1">Transport (LKR)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={quotationForm.transportCost}
                    onChange={(e) => setQuotationForm({ ...quotationForm, transportCost: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#FAF4EB] p-3 rounded-xl border border-[#E8DEC8] flex items-center justify-between text-xs font-bold text-[#2B190E]">
                <span>Calculated Total Amount:</span>
                <span className="text-[#8B5E3C] text-sm font-black">
                  Rs. {((Number(quotationForm.materialCost) || 0) + (Number(quotationForm.labourCost) || 0) + (Number(quotationForm.transportCost) || 0)).toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B190E] uppercase mb-1">Status</label>
                <select
                  value={quotationForm.status}
                  onChange={(e) => setQuotationForm({ ...quotationForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB]/40 text-xs font-semibold focus:outline-none"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="SENT">SENT</option>
                  <option value="APPROVED">APPROVED</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2B190E] hover:bg-[#3D2415] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
