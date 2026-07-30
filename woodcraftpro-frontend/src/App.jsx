import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InquiryModal from './components/InquiryModal';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import CustomOrderPage from './pages/CustomOrderPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
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
    setIsInquiryOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900">
        
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
          {activeTab === 'contact' && (
            <ContactPage onOpenInquiry={() => handleOpenInquiryWithProduct(null)} />
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

        {/* Footer (Hidden on home page so home matches mockup bottom contact bar) */}
        {activeTab !== 'home' && (
          <Footer
            setActiveTab={setActiveTab}
            onOpenInquiry={() => handleOpenInquiryWithProduct(null)}
          />
        )}

        {/* Customer Inquiry Modal */}
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => {
            setIsInquiryOpen(false);
            setSelectedProductForQuote(null);
          }}
          selectedProduct={selectedProductForQuote}
        />

      </div>
    </LanguageProvider>
  );
}
