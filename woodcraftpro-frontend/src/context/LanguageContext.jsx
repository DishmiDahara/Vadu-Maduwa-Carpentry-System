import React, { createContext, useContext, useState } from 'react';

const translations = {
  EN: {
    brandName: 'වඩු මඩුව',
    brandTag: 'Carpentry Workshop',
    home: 'Home',
    catalog: 'Furniture Catalog',
    services: 'Services',
    gallery: 'Gallery',
    contact: 'Contact Us',
    requestQuote: 'Request Quote',
    adminDesk: 'Admin Desk',
    adminPortal: 'Admin Portal',
    
    // Hero
    heroBadge: 'Master Carpentry & Custom Furniture',
    heroTitle1: 'Handcrafted Wooden',
    heroTitle2: 'Masterpieces For Life',
    heroDesc: 'From bespoke teak beds and dining sets to fitted modular kitchens and custom entrance doors. We combine traditional craftsmanship with precision digital management.',
    browseCatalog: 'Browse Furniture Catalog',
    requestCustomQuote: 'Request Custom Quotation',
    statYears: '15+ Years',
    statYearsSub: 'Crafting Excellence',
    statProjects: '1,200+',
    statProjectsSub: 'Completed Projects',
    statTimber: '100% Teak',
    statTimberSub: 'Genuine Timber',
    featuredCraft: 'Featured Craft',

    // Catalog
    exploreCategories: 'Explore Categories',
    workshopCollections: 'Our Workshop Collections',
    viewAll: 'View All Categories',
    popularChoices: 'Popular Choices',
    featuredProducts: 'Featured Furniture Products',
    browseFullCatalog: 'Browse Full Catalog',
    searchPlaceholder: 'Search bed, table, wardrobe...',
    allFurniture: 'All Furniture',
    inquireQuote: 'Inquire / Quote',
    estimatedPrice: 'Estimated Price',
    inStock: 'In Stock / Custom Made',

    // Services
    ourExpertise: 'Our Expertise',
    customServicesTitle: 'Custom Carpentry & Woodworking Services',
    servicesDesc: 'From architectural woodworking for residential luxury homes to custom furniture design and hotel fit-outs.',
    bookConsultation: 'Book Service Consultation',
    freeMeasurement: 'Free site measurement & consultation',
    teakGuarantee: 'Seasoned Teak / Mahogany guarantee',

    // Gallery
    craftShowcase: 'Craft Showcase',
    galleryTitle: 'Completed Projects Gallery',
    galleryDesc: 'Explore real client projects custom designed, manufactured, and installed by master carpenters.',
    allProjects: 'All Completed Projects',
    completedDate: 'Completed Date',

    // Contact
    connectWithUs: 'Connect With Us',
    contactTitle: 'Visit Our Workshop or Request Call',
    workshopAddress: 'Workshop Address',
    directPhone: 'Direct Phone Lines',
    emailInquiry: 'Email Inquiry',
    workingHours: 'Working Hours',

    // Modal
    submitInquiry: 'Submit Project Inquiry',
    yourName: 'Your Full Name',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address',
    projectDetails: 'Project Details / Requirements',
    submitting: 'Submitting Inquiry...',
    submitBtn: 'Submit Inquiry',

    // Admin
    adminLoginTitle: 'Admin Portal Login',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In To Dashboard',
    totalRevenue: 'Total Revenue',
    pendingBalance: 'Pending Balance',
    newInquiries: 'New Inquiries',
    catalogItems: 'Catalog Items',
    convertInvoice: 'Convert to Invoice',
    recordPayment: 'Record Payment'
  },

  SI: {
    brandName: 'වඩු මඩුව',
    brandTag: 'වඩු කාර්මික ශිල්පාගාරය',
    home: 'මුල් පිටුව',
    catalog: 'ගෘහ භාණ්ඩ',
    services: 'සේවාවන්',
    gallery: 'ගැලරිය',
    contact: 'සම්බන්ධ වන්න',
    requestQuote: 'මිල ගණන් ලබාගන්න',
    adminDesk: 'ඇඩ්මින් පාලකය',
    adminPortal: 'ඇඩ්මින් පිවිසුම',

    // Hero
    heroBadge: 'විශිෂ්ට ලී වඩු ශිල්පය සහ ගෘහ භාණ්ඩ',
    heroTitle1: 'අතින් නිර්මාණය කළ',
    heroTitle2: 'උසස්ම ලී නිර්මාණ',
    heroDesc: 'තේක්ක ඇඳන්, කෑම මේස, පැන්ට්‍රි කබඩ් සහ ප්‍රධාන දොර ජනෙල් දක්වා උසස්ම ප්‍රමිතියෙන් යුතු වඩු කාර්මික සේවාවන්.',
    browseCatalog: 'ගෘහ භාණ්ඩ නරඹන්න',
    requestCustomQuote: 'මිල ගණන් කැඳවන්න',
    statYears: 'අවුරුදු 15+',
    statYearsSub: 'විශ්වසනීය සේවය',
    statProjects: '1,200+',
    statProjectsSub: 'නිමකළ ව්‍යාපෘති',
    statTimber: '100% තේක්ක',
    statTimberSub: 'පිරිසිදු ලී',
    featuredCraft: 'විශේෂ නිර්මාණය',

    // Catalog
    exploreCategories: 'වර්ගීකරණයන්',
    workshopCollections: 'අපගේ නිර්මාණ එකතුව',
    viewAll: 'සියලුම වර්ග බලන්න',
    popularChoices: 'ජනප්‍රිය තේරීම්',
    featuredProducts: 'විශේෂ ගෘහ භාණ්ඩ',
    browseFullCatalog: 'සම්පූර්ණ ලැයිස්තුව',
    searchPlaceholder: 'ඇඳ, මේසය, අල්මාරිය සොයන්න...',
    allFurniture: 'සියලුම භාණ්ඩ',
    inquireQuote: 'විමසන්න / Quote',
    estimatedPrice: 'අනුමාන මිල',
    inStock: 'ඇණවුම් කළ හැක',

    // Services
    ourExpertise: 'අපගේ සේවාවන්',
    customServicesTitle: 'ලී වඩු ශිල්ප සේවාවන්',
    servicesDesc: 'නිවසේ හෝ ආයතනයේ ඕනෑම වඩු කාර්මික අවශ්‍යතාවයක් සඳහා වෘත්තීය නිමාව.',
    bookConsultation: 'සේවා විමසීම',
    freeMeasurement: 'නොමිලේ ස්ථානීය මැනීම් ලබාදීම',
    teakGuarantee: '100% පදම් කළ තේක්ක / මහෝගනි',

    // Gallery
    craftShowcase: 'නිර්මාණ ගැලරිය',
    galleryTitle: 'නිමකළ ව්‍යාපෘති ගැලරිය',
    galleryDesc: 'අපගේ පාරිභෝගිකයින් සඳහා නිමකර දෙන ලද සත්‍ය ව්‍යාපෘති ඡායාරූප.',
    allProjects: 'සියලුම ව්‍යාපෘති',
    completedDate: 'නිමකළ දිනය',

    // Contact
    connectWithUs: 'අප හා සම්බන්ධ වන්න',
    contactTitle: 'අපගේ වඩු මඩුවට පැමිණෙන්න',
    workshopAddress: 'ලිපිනය',
    directPhone: 'දුරකථන අංක',
    emailInquiry: 'විද්‍යුත් තැපෑල',
    workingHours: 'වැඩකරන වේලාවන්',

    // Modal
    submitInquiry: 'ව්‍යාපෘති විමසීම යොමු කරන්න',
    yourName: 'ඔබගේ සම්පූර්ණ නම',
    phoneNumber: 'දුරකථන අංකය',
    emailAddress: 'විද්‍යුත් තැපෑල',
    projectDetails: 'අවශ්‍යතාවය / විස්තරය',
    submitting: 'යොමු වෙමින් පවතී...',
    submitBtn: 'විමසීම යොමු කරන්න',

    // Admin
    adminLoginTitle: 'ඇඩ්මින් පිවිසුම',
    username: 'පරිශීලක නාමය',
    password: 'මුරපදය',
    signIn: 'ඇතුළු වන්න',
    totalRevenue: 'මුළු ආදායම',
    pendingBalance: 'ලැබීමට ඇති මුදල්',
    newInquiries: 'නව විමසීම්',
    catalogItems: 'භාණ්ඩ ප්‍රමාණය',
    convertInvoice: 'ඉන්වොයිසියක් කරන්න',
    recordPayment: 'ගෙවීම සටහන් කරන්න'
  },

  TA: {
    brandName: 'வடு மடுவ',
    brandTag: 'தச்சு பட்டறை',
    home: 'முகப்பு',
    catalog: 'தளபாடங்கள்',
    services: 'சேவைகள்',
    gallery: 'கேலரி',
    contact: 'தொடர்புகொள்ள',
    requestQuote: 'விலை கேட்க',
    adminDesk: 'நிர்வாகி பகுதி',
    adminPortal: 'நிர்வாகி உள்நுழைவு',

    // Hero
    heroBadge: 'சிறந்த தச்சு வேலைப்பாடு & தளபாடங்கள்',
    heroTitle1: 'கைகளால் செய்யப்பட்ட',
    heroTitle2: 'சிறந்த மர தளபாடங்கள்',
    heroDesc: 'தேக்கு கட்டில்கள், சாப்பாட்டு மேசைகள், சமையலறை அலமாரிகள் மற்றும் கதவுகள் சிறந்த தரத்தில்.',
    browseCatalog: 'தளபாடங்களை பார்க்க',
    requestCustomQuote: 'விலைப்புள்ளி கேட்க',
    statYears: '15+ ஆண்டுகள்',
    statYearsSub: 'நம்பகமான சேவை',
    statProjects: '1,200+',
    statProjectsSub: 'முடிக்கப்பட்ட திட்டங்கள்',
    statTimber: '100% தேக்கு',
    statTimberSub: 'உண்மையான மரம்',
    featuredCraft: 'சிறப்பு படைப்பு',

    // Catalog
    exploreCategories: 'வகைகள்',
    workshopCollections: 'எங்கள் தயாரிப்புகள்',
    viewAll: 'அனைத்தையும் பார்க்க',
    popularChoices: 'பிரபலமானவை',
    featuredProducts: 'சிறப்பு தளபாடங்கள்',
    browseFullCatalog: 'முழு பட்டியல்',
    searchPlaceholder: 'கட்டில், மேஜை, அலமாரி தேடுங்கள்...',
    allFurniture: 'அனைத்து தளபாடங்களும்',
    inquireQuote: 'விசாரிக்க / Quote',
    estimatedPrice: 'மதிப்பிடப்பட்ட விலை',
    inStock: 'கிடைக்கிறது',

    // Services
    ourExpertise: 'எங்கள் சேவைகள்',
    customServicesTitle: 'தச்சு மற்றும் மரவேலை சேவைகள்',
    servicesDesc: 'வீடு மற்றும் அலுவலகத்திற்கான சிறந்த தச்சு சேவைகள்.',
    bookConsultation: 'சேவை கோர',
    freeMeasurement: 'இலவச அளவீட்டு சேவை',
    teakGuarantee: 'உத்தரவாதம் அளிக்கப்பட்ட தேக்கு',

    // Gallery
    craftShowcase: 'படைப்புகள்',
    galleryTitle: 'முடிந்த திட்டங்கள்',
    galleryDesc: 'எங்கள் வாடிக்கையாளர்களுக்காக செய்யப்பட்ட மரவேலை புகைப்படங்கள்.',
    allProjects: 'அனைத்து திட்டங்களும்',
    completedDate: 'முடிந்த தேதி',

    // Contact
    connectWithUs: 'தொடர்பு கொள்ள',
    contactTitle: 'எங்கள் பட்டறைக்கு வாருங்கள்',
    workshopAddress: 'முகவரி',
    directPhone: 'தொலைபேசி எண்கள்',
    emailInquiry: 'மின்னஞ்சல்',
    workingHours: 'வேலை நேரம்',

    // Modal
    submitInquiry: 'விசாரணையை அனுப்பவும்',
    yourName: 'உங்கள் பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    emailAddress: 'மின்னஞ்சல்',
    projectDetails: 'தேவைகள் / விவரங்கள்',
    submitting: 'அனுப்பப்படுகிறது...',
    submitBtn: 'அனுப்பவும்',

    // Admin
    adminLoginTitle: 'நிர்வாகி உள்நுழைவு',
    username: 'பயனர் பெயர்',
    password: 'கடவுச்சொல்',
    signIn: 'உள்நுழைக',
    totalRevenue: 'மொத்த வருமானம்',
    pendingBalance: 'நிலுவை தொகை',
    newInquiries: 'புதிய விசாரணைகள்',
    catalogItems: 'பொருட்கள் எண்ணிக்கை',
    convertInvoice: 'ரசீது ஆக்கு',
    recordPayment: 'செலுத்தலை பதிவுசெய்'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('EN');

  const t = (key) => {
    return translations[lang]?.[key] || translations['EN']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
