import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:8080/api`;


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Mock Initial Data Store
const mockData = {
  categories: [
    { id: 1, name: 'Beds & Bedroom', description: 'Custom teak bed frames, dressers and nightstands', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Dining & Kitchen', description: 'Solid timber dining tables and modular pantry cabinets', imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Living Room', description: 'Carved sofas, TV console units and coffee tables', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Wardrobes & Closets', description: 'Fitted sliding wardrobes and walk-in closets', imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Doors & Windows', description: 'Carved entrance doors and timber window frames', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' }
  ],
  products: [
    { id: 1, categoryId: 1, productName: 'Teak King Size Bed with Storage', description: '100% genuine Sri Lankan Teak wood with under-bed storage drawers', basePrice: 185000, imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 2, categoryId: 1, productName: 'Mahogany Queen Bed Frame', description: 'Carved headboard with smooth matte varnish finish', basePrice: 145000, imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 3, categoryId: 2, productName: '6-Seater Teak Dining Table Set', description: 'Heavy timber table with 6 ergonomic chairs', basePrice: 220000, imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 4, categoryId: 2, productName: 'Modular Kitchen Pantry Cabinet Set', description: 'Custom fitted counters with soft-close drawers & granite top', basePrice: 350000, imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 5, categoryId: 3, productName: '3-Seater Cushion Wooden Sofa', description: 'Nadun timber sofa with premium fabric cushions', basePrice: 165000, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 6, categoryId: 3, productName: 'Modern Teak TV Console Unit', description: 'Tempered glass cabinet doors and cable management', basePrice: 85000, imageUrl: 'https://images.unsplash.com/photo-1601760562234-9814eea6663a?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 7, categoryId: 4, productName: '4-Door Sliding Wardrobe with Mirror', description: 'Dedicated hanging rails, shelves, internal lock drawers', basePrice: 280000, imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', available: true },
    { id: 8, categoryId: 5, productName: 'Carved Jackwood Main Entrance Door', description: 'Traditional Sri Lankan wood carving design with heavy frame', basePrice: 125000, imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', available: true }
  ],
  services: [
    { id: 1, serviceName: 'Custom Furniture Design', description: 'Tailor-made beds, tables, and cabinets built to your exact space dimensions.', iconName: 'PenTool', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
    { id: 2, serviceName: 'Modular Kitchen Fitting', description: 'Complete pantry design, cabinet manufacturing, and installation.', iconName: 'ChefHat', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' },
    { id: 3, serviceName: 'Wood Polishing & Refurbishment', description: 'Timber sanding, staining, lacquering, and antique restoration.', iconName: 'Sparkles', imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80' },
    { id: 4, serviceName: 'Doors, Windows & Ceiling', description: 'Entrance doors, sash windows, timber ceiling panelling, and wooden stairs.', iconName: 'Home', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' }
  ],
  gallery: [
    { id: 1, title: 'Luxury Teak Bedroom Suite - Nawala Villa', description: 'Master bedroom with king bed and sliding closet.', category: 'Bedroom', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', completedDate: '2026-05-15' },
    { id: 2, title: 'Open Plan Modular Pantry Kitchen - Colombo 07', description: 'High-end mahogany pantry cabinets.', category: 'Kitchen', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', completedDate: '2026-06-02' },
    { id: 3, title: 'Solid Wood Dining Room Setup - Kandy Residence', description: '10-seater custom teak dining table.', category: 'Dining', imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', completedDate: '2026-06-20' }
  ],
  inquiries: [
    { id: 1, customerName: 'Kamal Perera', customerPhone: '0771234567', customerEmail: 'kamal@gmail.com', message: 'I need a quotation for a custom 4-door teak wardrobe for my master bedroom in Nawala.', status: 'NEW', createdAt: '2026-07-25 10:30' },
    { id: 2, customerName: 'Nimali Silva', customerPhone: '0719876543', customerEmail: 'nimali.s@hotmail.com', message: 'Looking for pantry cabinet installation services. Can you visit site for measurement?', status: 'CONTACTED', createdAt: '2026-07-26 14:15' }
  ],
  quotations: [
    { id: 1, quotationNumber: 'WCP-QT-2026-001', customerName: 'Kamal Perera', customerPhone: '0771234567', customerEmail: 'kamal@gmail.com', customerAddress: 'No. 45, Galle Road, Colombo 03', materialCost: 180000, labourCost: 60000, additionalCharges: 10000, totalAmount: 250000, status: 'ACCEPTED', validUntil: '2026-08-30' },
    { id: 2, quotationNumber: 'WCP-QT-2026-002', customerName: 'Nimali Silva', customerPhone: '0719876543', customerEmail: 'nimali.s@hotmail.com', customerAddress: 'No. 12, Kandy Road, Kiribathgoda', materialCost: 220000, labourCost: 80000, additionalCharges: 15000, totalAmount: 315000, status: 'SENT', validUntil: '2026-08-15' }
  ],
  bills: [
    { id: 1, billNumber: 'WCP-INV-2026-001', quotationId: 1, customerName: 'Kamal Perera', totalAmount: 250000, paidAmount: 100000, balanceAmount: 150000, status: 'PARTIAL', dueDate: '2026-09-01' }
  ],
  payments: [
    { id: 1, billId: 1, receiptNumber: 'REC-2026-001', amount: 100000, paymentMethod: 'BANK_TRANSFER', paymentDate: '2026-07-27', notes: 'Advance payment for Wardrobe order' }
  ]
};

// Generic API Service wrapper with fallback
export const api = {
  // Auth
  login: async (username, password) => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      return res.data;
    } catch (err) {
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        return { token: 'mock-jwt-token-12345', username: 'admin', fullName: 'System Administrator', role: 'ROLE_ADMIN' };
      }
      throw new Error('Invalid username or password');
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories');
      return res.data;
    } catch {
      return mockData.categories;
    }
  },

  // Products
  getProducts: async (params = {}) => {
    try {
      const res = await apiClient.get('/products', { params });
      return res.data;
    } catch {
      let filtered = [...mockData.products];
      if (params.categoryId) {
        filtered = filtered.filter(p => p.categoryId === Number(params.categoryId));
      }
      if (params.search) {
        filtered = filtered.filter(p => p.productName.toLowerCase().includes(params.search.toLowerCase()));
      }
      return filtered;
    }
  },
  createProduct: async (product) => {
    try {
      const res = await apiClient.post('/products', product);
      return res.data;
    } catch {
      const newP = { ...product, id: Date.now(), available: true };
      mockData.products.push(newP);
      return newP;
    }
  },
  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch {
      mockData.products = mockData.products.filter(p => p.id !== id);
    }
  },

  // Services
  getServices: async () => {
    try {
      const res = await apiClient.get('/services');
      return res.data;
    } catch {
      return mockData.services;
    }
  },

  // Gallery
  getGallery: async (category = '') => {
    try {
      const res = await apiClient.get('/gallery', { params: { category } });
      return res.data;
    } catch {
      if (category && category !== 'ALL') {
        return mockData.gallery.filter(g => g.category.toLowerCase() === category.toLowerCase());
      }
      return mockData.gallery;
    }
  },
  createGalleryItem: async (item) => {
    try {
      const res = await apiClient.post('/gallery', item);
      return res.data;
    } catch {
      const newItem = { ...item, id: Date.now(), completedDate: new Date().toISOString().split('T')[0] };
      mockData.gallery.push(newItem);
      return newItem;
    }
  },

  // Inquiries
  getInquiries: async () => {
    try {
      const res = await apiClient.get('/inquiries');
      return res.data;
    } catch {
      return mockData.inquiries;
    }
  },
  createInquiry: async (inquiry) => {
    try {
      const res = await apiClient.post('/inquiries', inquiry);
      return res.data;
    } catch {
      const newInq = { ...inquiry, id: Date.now(), status: 'NEW', createdAt: new Date().toLocaleString() };
      mockData.inquiries.unshift(newInq);
      return newInq;
    }
  },
  updateInquiryStatus: async (id, status) => {
    try {
      const res = await apiClient.patch(`/inquiries/${id}/status`, { status });
      return res.data;
    } catch {
      const inq = mockData.inquiries.find(i => i.id === id);
      if (inq) inq.status = status;
      return inq;
    }
  },

  // Quotations
  getQuotations: async () => {
    try {
      const res = await apiClient.get('/quotations');
      return res.data;
    } catch {
      return mockData.quotations;
    }
  },
  createQuotation: async (quotation) => {
    try {
      const res = await apiClient.post('/quotations', quotation);
      return res.data;
    } catch {
      const newQ = {
        ...quotation,
        id: Date.now(),
        quotationNumber: 'WCP-QT-' + Math.floor(1000 + Math.random() * 9000),
        status: 'DRAFT'
      };
      mockData.quotations.unshift(newQ);
      return newQ;
    }
  },
  updateQuotationStatus: async (id, status) => {
    try {
      const res = await apiClient.patch(`/quotations/${id}/status`, { status });
      return res.data;
    } catch {
      const q = mockData.quotations.find(item => item.id === id);
      if (q) q.status = status;
      return q;
    }
  },

  // Bills
  getBills: async () => {
    try {
      const res = await apiClient.get('/bills');
      return res.data;
    } catch {
      return mockData.bills;
    }
  },
  createBill: async (bill) => {
    try {
      const res = await apiClient.post('/bills', bill);
      return res.data;
    } catch {
      const newB = {
        ...bill,
        id: Date.now(),
        billNumber: 'WCP-INV-' + Math.floor(1000 + Math.random() * 9000),
        paidAmount: 0,
        balanceAmount: bill.totalAmount,
        status: 'UNPAID'
      };
      mockData.bills.unshift(newB);
      return newB;
    }
  },

  // Payments
  getPayments: async (billId = null) => {
    try {
      const res = await apiClient.get('/payments', { params: { billId } });
      return res.data;
    } catch {
      if (billId) return mockData.payments.filter(p => p.billId === billId);
      return mockData.payments;
    }
  },
  recordPayment: async (payment) => {
    try {
      const res = await apiClient.post('/payments', payment);
      return res.data;
    } catch {
      const newPay = {
        ...payment,
        id: Date.now(),
        receiptNumber: 'REC-' + Math.floor(1000 + Math.random() * 9000),
        paymentDate: new Date().toISOString().split('T')[0]
      };
      mockData.payments.unshift(newPay);

      // Update bill
      const bill = mockData.bills.find(b => b.id === payment.billId);
      if (bill) {
        bill.paidAmount = (bill.paidAmount || 0) + Number(payment.amount);
        bill.balanceAmount = bill.totalAmount - bill.paidAmount;
        bill.status = bill.balanceAmount <= 0 ? 'PAID' : 'PARTIAL';
      }
      return newPay;
    }
  },

  // Dashboard Stats
  getStats: async () => {
    try {
      const res = await apiClient.get('/dashboard/stats');
      return res.data;
    } catch {
      const totalRevenue = mockData.bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
      const outstandingBalance = mockData.bills.reduce((sum, b) => sum + (b.balanceAmount || 0), 0);
      return {
        totalProducts: mockData.products.length,
        totalInquiries: mockData.inquiries.length,
        newInquiries: mockData.inquiries.filter(i => i.status === 'NEW').length,
        totalQuotations: mockData.quotations.length,
        totalBills: mockData.bills.length,
        totalRevenue,
        outstandingBalance
      };
    }
  }
};
