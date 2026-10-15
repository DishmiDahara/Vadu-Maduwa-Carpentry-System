import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:8080/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Helper for persistent local storage fallbacks with auto-migration
const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    const parsed = JSON.parse(val);
    const raw = JSON.stringify(parsed);
    // If stored cache has old dummy items (unsplash, Beds & Bedroom, or banner_crafts), wipe and use authentic fallback
    if (raw.includes('unsplash.com') || raw.includes('Beds & Bedroom') || raw.includes('banner_crafts') || raw.includes('Dining & Kitchen') || raw.includes('Doors & Windows')) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch (e) {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage save error", e);
  }
};

// Initial Seed Data Store - ONLY AUTHENTIC WORKSHOP CATEGORIES
const defaultCategories = [
  { id: 1, name: 'Wooden Doors', description: 'Carved solid entrance doors, room doors and timber frames', imageUrl: '/images/doors/IMG_6930.PNG' },
  { id: 2, name: 'Pantry Cupboards', description: 'Custom fitted modular kitchen pantry cupboards and counter units', imageUrl: '/images/cupboards/IMG_7175.PNG' },
  { id: 3, name: 'Staircases & Railings', description: 'Architectural solid timber staircases, handrails and balusters', imageUrl: '/images/stairs/IMG_7160.PNG' }
];

const defaultProducts = [
  // 1. Wooden Doors (categoryId: 1)
  { id: 1, categoryId: 1, productName: 'Carved Solid Teak Main Entrance Door', description: '100% genuine Sri Lankan Teak wood with traditional lotus carving & heavy frame', basePrice: 125000, imageUrl: '/images/doors/IMG_6930.PNG', available: true },
  { id: 2, categoryId: 1, productName: 'Seasoned Mahogany Bedroom Door', description: 'Smooth fluted panel room door with natural polyurethane polish', basePrice: 32000, imageUrl: '/images/doors/IMG_7104.PNG', available: true },
  { id: 3, categoryId: 1, productName: 'Solid Heavy Timber Double Door Suite', description: 'Double sash entrance door with architectural detailing and brass lock fittings', basePrice: 68000, imageUrl: '/images/doors/IMG_6936.PNG', available: true },
  { id: 4, categoryId: 1, productName: 'Modern Vertical Slat Villa Entrance Door', description: 'Contemporary minimalist teak door with durable weather seal', basePrice: 42000, imageUrl: '/images/doors/IMG_6942.PNG', available: true },

  // 2. Pantry Cupboards (categoryId: 2)
  { id: 5, categoryId: 2, productName: 'Modular Kitchen Pantry Cabinet Set', description: 'Custom fitted counters with soft-close drawers & granite top support', basePrice: 350000, imageUrl: '/images/cupboards/IMG_7175.PNG', available: true },
  { id: 6, categoryId: 2, productName: 'Luxury Teak Modular Pantry Suite', description: 'Complete custom-fitted L-shape kitchen pantry units with quartz tops', basePrice: 420000, imageUrl: '/images/cupboards/IMG_7176.PNG', available: true },
  { id: 7, categoryId: 2, productName: 'Wall-Mounted Glass-Door Kitchen Cabinet', description: 'Overhead wall-mounted solid wood cabinet with tempered glass inserts', basePrice: 75000, imageUrl: '/images/cupboards/IMG_7180.PNG', available: true },
  { id: 8, categoryId: 2, productName: 'Bespoke Central Cooking Island Countertop', description: 'Freestanding solid wood kitchen island with integrated breakfast bar', basePrice: 175000, imageUrl: '/images/cupboards/IMG_7182.PNG', available: true },

  // 3. Staircases & Railings (categoryId: 3)
  { id: 9, categoryId: 3, productName: 'Crafted Hardwood Interior Staircase & Railing', description: 'Precision engineered solid wood steps with turned balusters & polished handrail', basePrice: 120000, imageUrl: '/images/stairs/IMG_7203.PNG', available: true },
  { id: 10, categoryId: 3, productName: 'Solid Teak Floating Tread Staircase', description: 'Modern open-riser cantilever floating steps with natural wood grain', basePrice: 145000, imageUrl: '/images/stairs/IMG_7160.PNG', available: true },
  { id: 11, categoryId: 3, productName: 'Grand Curved Mahogany Staircase Suite', description: 'Architectural curved staircase with continuous smooth handrail system', basePrice: 195000, imageUrl: '/images/stairs/IMG_7161.PNG', available: true },
  { id: 12, categoryId: 3, productName: 'Classic Turned Baluster Timber Railing', description: 'Handcrafted hardwood balustrade and durable heavy newel post set', basePrice: 65000, imageUrl: '/images/stairs/IMG_7162.PNG', available: true }
];

const defaultCustomOrders = [
  {
    id: 1,
    orderNumber: 'WM-ORD-8921',
    customerName: 'Dinesh Perera',
    customerPhone: '077 123 4567',
    customerDistrict: 'Colombo',
    customerAddress: 'No. 45, Flower Road, Colombo 07',
    furnitureType: 'Wooden Door (Main / Room Door)',
    designTitle: 'Traditional Lotus Carved Entrance Door',
    designImage: '/images/doors/IMG_6930.PNG',
    isUploadedDesign: false,
    woodType: 'Teak Wood (තේක්ක)',
    finish: 'Natural PU Polish',
    dimensions: '210 x 105 x 4.5 cm',
    estimatedPrice: 72000,
    status: 'In Progress',
    createdAt: '2026-06-01 10:30',
    orderDescription: 'Carve lotus petal border with traditional Kalutara brass handles.'
  },
  {
    id: 2,
    orderNumber: 'WM-ORD-8922',
    customerName: 'Nimal Fernando',
    customerPhone: '071 987 6543',
    customerDistrict: 'Kalutara',
    customerAddress: 'No. 12, Station Road, Wadduwa',
    furnitureType: 'Pantry Cupboards / Kitchen Unit',
    designTitle: 'Modular Solid Teak Pantry Suite',
    designImage: '/images/cupboards/IMG_7175.PNG',
    isUploadedDesign: true,
    woodType: 'Teak Wood (තේක්ක)',
    finish: 'Matte Polyurethane Finish',
    dimensions: '240 x 320 x 60 cm',
    estimatedPrice: 385000,
    status: 'Pending Review',
    createdAt: '2026-06-02 14:15',
    orderDescription: 'L-shape layout with granite counter top support and soft close hinges.'
  },
  {
    id: 3,
    orderNumber: 'WM-ORD-8923',
    customerName: 'Kumari Jayawardena',
    customerPhone: '075 555 4321',
    customerDistrict: 'Galle',
    customerAddress: 'No. 88, Lighthouse Street, Fort, Galle',
    furnitureType: 'Staircase & Handrail Work',
    designTitle: 'Mahogany Architectural Handrail & Steps',
    designImage: '/images/stairs/IMG_7160.PNG',
    isUploadedDesign: false,
    woodType: 'Mahogany (මහෝගනි)',
    finish: 'High Gloss Finish',
    dimensions: '16 Steps + 18ft Handrail',
    estimatedPrice: 195000,
    status: 'Completed',
    createdAt: '2026-05-31 09:00',
    orderDescription: 'Turned balusters and bullnose starting step.'
  }
];

const defaultInquiries = [
  { id: 1, customerName: 'Kamal Perera', customerPhone: '0771234567', customerEmail: 'kamal@gmail.com', message: 'I need a quotation for a custom 4-door teak wardrobe for my master bedroom in Nawala.', status: 'NEW', createdAt: '2026-07-25 10:30' },
  { id: 2, customerName: 'Nimali Silva', customerPhone: '0719876543', customerEmail: 'nimali.s@hotmail.com', message: 'Looking for pantry cabinet installation services. Can you visit site for measurement?', status: 'CONTACTED', createdAt: '2026-07-26 14:15' },
  { id: 3, customerName: 'Sarath Gunawardena', customerPhone: '0773344556', customerEmail: 'sarath@yahoo.com', message: 'Do you make custom temple doors with brass bell inlays?', status: 'RESOLVED', createdAt: '2026-07-28 11:20' }
];

const defaultGallery = [
  { id: 1, title: 'Carved Teak Traditional Main Entrance Door', description: 'Hand-carved double entrance door installed in Kalutara.', category: 'Wooden Doors', imageUrl: '/images/doors/IMG_6930.PNG', completedDate: '2026-07-18' },
  { id: 2, title: 'Modular L-Shape Teak Pantry Suite - Colombo 07', description: 'High-end mahogany pantry cabinets with quartz tops.', category: 'Pantry Cupboards', imageUrl: '/images/cupboards/IMG_7175.PNG', completedDate: '2026-06-02' },
  { id: 3, title: 'Solid Teak Floating Tread Staircase - Nawala Villa', description: 'Custom open-riser teak staircase installation.', category: 'Staircases', imageUrl: '/images/stairs/IMG_7160.PNG', completedDate: '2026-05-15' },
  { id: 4, title: 'Fitted Teak Kitchen Pantry - Kandy Villa', description: 'Custom wall-to-wall solid teak kitchen cupboards with quartz worktops.', category: 'Pantry Cupboards', imageUrl: '/images/cupboards/IMG_7176.PNG', completedDate: '2026-07-10' },
  { id: 5, title: 'Solid Mahogany Fluted Arch Room Door', description: 'Custom fluted interior arch door with satin PU polish.', category: 'Wooden Doors', imageUrl: '/images/doors/IMG_6931.PNG', completedDate: '2026-07-22' },
  { id: 6, title: 'Crafted Hardwood Interior Staircase & Railing', description: 'Completed hardwood staircase and handrail in Kalutara North.', category: 'Staircases', imageUrl: '/images/stairs/IMG_7203.PNG', completedDate: '2026-06-25' }
];

const defaultQuotations = [
  { id: 1, quotationNumber: 'WCP-QT-2026-001', customerName: 'Kamal Perera', customerPhone: '0771234567', customerEmail: 'kamal@gmail.com', customerAddress: 'No. 45, Galle Road, Colombo 03', materialCost: 180000, labourCost: 60000, additionalCharges: 10000, totalAmount: 250000, status: 'ACCEPTED', validUntil: '2026-08-30' },
  { id: 2, quotationNumber: 'WCP-QT-2026-002', customerName: 'Nimali Silva', customerPhone: '0719876543', customerEmail: 'nimali.s@hotmail.com', customerAddress: 'No. 12, Kandy Road, Kiribathgoda', materialCost: 220000, labourCost: 80000, additionalCharges: 15000, totalAmount: 315000, status: 'SENT', validUntil: '2026-08-15' }
];

const defaultSettings = {
  workshopName: 'වඩු මඩුව (Wadu Maduwa Carpentry Workshop)',
  tagline: 'Master Carpentry & Architectural Woodwork Since 1996',
  hotline: '077 376 9849',
  officePhone: '034 228 5162',
  whatsappNumber: '94779743901',
  email: 'info@wadumaduwa.lk',
  address: 'No. 45, Temple Road, Kalutara North, Sri Lanka',
  operatingHours: 'Monday - Saturday: 8:00 AM - 6:00 PM (Sunday Closed)',
  currency: 'LKR'
};

// Generic API Service wrapper with full local persistence
export const api = {
  // Auth
  login: async (username, password) => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      return res.data;
    } catch (err) {
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        return { token: 'mock-jwt-token-12345', username: 'admin', fullName: 'Dhara Gajanayaka (Master Carpenter)', role: 'ROLE_ADMIN' };
      }
      throw new Error('Invalid username or password. Use demo: admin / admin123');
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories');
      return res.data;
    } catch {
      return getStored('woodcraft_categories', defaultCategories);
    }
  },

  // Products CRUD
  getProducts: async (params = {}) => {
    try {
      const res = await apiClient.get('/products', { params });
      return res.data;
    } catch {
      let products = getStored('woodcraft_products', defaultProducts);
      if (params.categoryId) {
        products = products.filter(p => p.categoryId === Number(params.categoryId));
      }
      if (params.search) {
        products = products.filter(p => p.productName.toLowerCase().includes(params.search.toLowerCase()));
      }
      return products;
    }
  },

  createProduct: async (product) => {
    try {
      const res = await apiClient.post('/products', product);
      return res.data;
    } catch {
      const current = getStored('woodcraft_products', defaultProducts);
      const newP = {
        ...product,
        id: Date.now(),
        available: product.available !== false
      };
      const updated = [newP, ...current];
      setStored('woodcraft_products', updated);
      return newP;
    }
  },

  updateProduct: async (id, updatedFields) => {
    try {
      const res = await apiClient.put(`/products/${id}`, updatedFields);
      return res.data;
    } catch {
      const current = getStored('woodcraft_products', defaultProducts);
      const updated = current.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      setStored('woodcraft_products', updated);
      return updated.find(p => p.id === id);
    }
  },

  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch {
      const current = getStored('woodcraft_products', defaultProducts);
      const updated = current.filter(p => p.id !== id);
      setStored('woodcraft_products', updated);
    }
  },

  // CUSTOM ORDERS (Core 3D Carpentry Orders Workflow)
  getCustomOrders: async () => {
    return getStored('woodcraft_custom_orders', defaultCustomOrders);
  },

  createCustomOrder: async (orderData) => {
    const current = getStored('woodcraft_custom_orders', defaultCustomOrders);
    const newOrder = {
      id: Date.now(),
      orderNumber: orderData.orderNumber || ('WM-ORD-' + Math.floor(1000 + Math.random() * 9000)),
      status: 'Pending Review',
      createdAt: new Date().toLocaleString(),
      ...orderData
    };
    const updated = [newOrder, ...current];
    setStored('woodcraft_custom_orders', updated);
    return newOrder;
  },

  updateCustomOrderStatus: async (id, newStatus) => {
    const current = getStored('woodcraft_custom_orders', defaultCustomOrders);
    const updated = current.map(o => o.id === id ? { ...o, status: newStatus } : o);
    setStored('woodcraft_custom_orders', updated);
    return updated.find(o => o.id === id);
  },

  deleteCustomOrder: async (id) => {
    const current = getStored('woodcraft_custom_orders', defaultCustomOrders);
    const updated = current.filter(o => o.id !== id);
    setStored('woodcraft_custom_orders', updated);
  },

  // Inquiries CRUD
  getInquiries: async () => {
    try {
      const res = await apiClient.get('/inquiries');
      return res.data;
    } catch {
      return getStored('woodcraft_inquiries', defaultInquiries);
    }
  },

  createInquiry: async (inquiry) => {
    try {
      const res = await apiClient.post('/inquiries', inquiry);
      return res.data;
    } catch {
      const current = getStored('woodcraft_inquiries', defaultInquiries);
      const newInq = {
        ...inquiry,
        id: Date.now(),
        status: 'NEW',
        createdAt: new Date().toLocaleString()
      };
      const updated = [newInq, ...current];
      setStored('woodcraft_inquiries', updated);
      return newInq;
    }
  },

  updateInquiryStatus: async (id, status) => {
    try {
      const res = await apiClient.patch(`/inquiries/${id}/status`, { status });
      return res.data;
    } catch {
      const current = getStored('woodcraft_inquiries', defaultInquiries);
      const updated = current.map(i => i.id === id ? { ...i, status } : i);
      setStored('woodcraft_inquiries', updated);
      return updated.find(i => i.id === id);
    }
  },

  deleteInquiry: async (id) => {
    try {
      await apiClient.delete(`/inquiries/${id}`);
    } catch {
      const current = getStored('woodcraft_inquiries', defaultInquiries);
      const updated = current.filter(i => i.id !== id);
      setStored('woodcraft_inquiries', updated);
    }
  },

  // Gallery Showcase CRUD
  getGallery: async (category = '') => {
    try {
      const res = await apiClient.get('/gallery', { params: { category } });
      return res.data;
    } catch {
      let items = getStored('woodcraft_gallery', defaultGallery);
      if (category && category !== 'ALL') {
        items = items.filter(g => g.category.toLowerCase() === category.toLowerCase());
      }
      return items;
    }
  },

  createGalleryItem: async (item) => {
    try {
      const res = await apiClient.post('/gallery', item);
      return res.data;
    } catch {
      const current = getStored('woodcraft_gallery', defaultGallery);
      const newItem = {
        ...item,
        id: Date.now(),
        completedDate: item.completedDate || new Date().toISOString().split('T')[0]
      };
      const updated = [newItem, ...current];
      setStored('woodcraft_gallery', updated);
      return newItem;
    }
  },

  deleteGalleryItem: async (id) => {
    try {
      await apiClient.delete(`/gallery/${id}`);
    } catch {
      const current = getStored('woodcraft_gallery', defaultGallery);
      const updated = current.filter(g => g.id !== id);
      setStored('woodcraft_gallery', updated);
    }
  },

  // Quotations
  getQuotations: async () => {
    try {
      const res = await apiClient.get('/quotations');
      return res.data;
    } catch {
      return getStored('woodcraft_quotations', defaultQuotations);
    }
  },

  createQuotation: async (quotation) => {
    try {
      const res = await apiClient.post('/quotations', quotation);
      return res.data;
    } catch {
      const current = getStored('woodcraft_quotations', defaultQuotations);
      const newQ = {
        ...quotation,
        id: Date.now(),
        quotationNumber: 'WCP-QT-' + Math.floor(1000 + Math.random() * 9000),
        status: quotation.status || 'DRAFT'
      };
      const updated = [newQ, ...current];
      setStored('woodcraft_quotations', updated);
      return newQ;
    }
  },

  updateQuotationStatus: async (id, status) => {
    try {
      const res = await apiClient.patch(`/quotations/${id}/status`, { status });
      return res.data;
    } catch {
      const current = getStored('woodcraft_quotations', defaultQuotations);
      const updated = current.map(q => q.id === id ? { ...q, status } : q);
      setStored('woodcraft_quotations', updated);
      return updated.find(q => q.id === id);
    }
  },

  deleteQuotation: async (id) => {
    try {
      await apiClient.delete(`/quotations/${id}`);
    } catch {
      const current = getStored('woodcraft_quotations', defaultQuotations);
      const updated = current.filter(q => q.id !== id);
      setStored('woodcraft_quotations', updated);
    }
  },

  // Settings
  getSettings: async () => {
    return getStored('woodcraft_settings', defaultSettings);
  },

  saveSettings: async (settings) => {
    setStored('woodcraft_settings', settings);
    return settings;
  },

  // Reset to default demo data
  resetDemoData: () => {
    setStored('woodcraft_custom_orders', defaultCustomOrders);
    setStored('woodcraft_products', defaultProducts);
    setStored('woodcraft_inquiries', defaultInquiries);
    setStored('woodcraft_gallery', defaultGallery);
    setStored('woodcraft_quotations', defaultQuotations);
    setStored('woodcraft_settings', defaultSettings);
  },

  // Dashboard Live Stats
  getStats: async () => {
    const orders = getStored('woodcraft_custom_orders', defaultCustomOrders);
    const inquiries = getStored('woodcraft_inquiries', defaultInquiries);
    const products = getStored('woodcraft_products', defaultProducts);
    const quotations = getStored('woodcraft_quotations', defaultQuotations);

    const totalOrderVolume = orders.reduce((sum, o) => sum + (Number(o.estimatedPrice) || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending Review').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const newInquiries = inquiries.filter(i => i.status === 'NEW').length;

    return {
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalInquiries: inquiries.length,
      newInquiries,
      totalProducts: products.length,
      totalQuotations: quotations.length,
      totalRevenue: totalOrderVolume
    };
  }
};
