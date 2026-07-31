import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CatalogPage from './pages/CatalogPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import FeedbackPage from './pages/FeedbackPage';
import ContactPage from './pages/ContactPage';
import CustomOrderPage from './pages/CustomOrderPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProductForQuote, setSelectedProductForQuote] = useState(null);
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('woodcraft_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    setAdminUser(userData);
    localStorage.setItem('woodcraft_admin', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('woodcraft_admin');
    setActiveTab('home');
  };

  const handleOpenInquiryWithProduct = (product = null) => {
    setSelectedProductForQuote(product);
    setActiveTab('contact');
  };

  const isCustomerPage = ['home', 'about', 'catalog', 'services', 'gallery', 'feedback', 'contact', 'custom-order'].includes(activeTab);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-[#2B190E]">
        
        {/* Header Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenInquiry={() => handleOpenInquiryWithProduct(null)}
          adminUser={adminUser}
          onLogout={handleLogout}
        />

        {/* Main View Area */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomePage
              setActiveTab={setActiveTab}
              onSelectProductForQuote={handleOpenInquiryWithProduct}
              onOpenInquiry={() => handleOpenInquiryWithProduct(null)}
            />
          )}
          {activeTab === 'about' && (
            <AboutPage
              setActiveTab={setActiveTab}
              onOpenInquiry={() => handleOpenInquiryWithProduct(null)}
            />
          )}
          {activeTab === 'custom-order' && (
            <CustomOrderPage setActiveTab={setActiveTab} />
          )}
          {activeTab === 'catalog' && (
            <CatalogPage
              onSelectProductForQuote={handleOpenInquiryWithProduct}
              onOpenInquiry={() => handleOpenInquiryWithProduct(null)}
            />
          )}
          {activeTab === 'services' && (
            <ServicesPage onOpenInquiry={() => handleOpenInquiryWithProduct(null)} />
          )}
          {activeTab === 'gallery' && <GalleryPage />}
          {activeTab === 'feedback' && <FeedbackPage />}
          {activeTab === 'contact' && (
            <ContactPage 
              selectedProduct={selectedProductForQuote}
              onOpenInquiry={() => handleOpenInquiryWithProduct(null)} 
            />
          )}
          {activeTab === 'admin-login' && (
            <AdminLoginPage
              onLoginSuccess={handleLoginSuccess}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'admin-dashboard' && (
            <AdminDashboard adminUser={adminUser} />
          )}
        </main>

        {/* Footer (Rendered on customer-facing pages) */}
        {isCustomerPage && (
          <Footer
            setActiveTab={setActiveTab}
            onOpenInquiry={() => handleOpenInquiryWithProduct(null)}
          />
        )}

      </div>
    </LanguageProvider>
  );
}
