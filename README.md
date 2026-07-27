# 🪵 වඩු මඩුව (Vadu Maduwa) - Carpentry Workshop Management System

[![React](https://img.shields.io/badge/Frontend-React.js-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Java%20Spring%20Boot-green.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)
[![Trilingual](https://img.shields.io/badge/Languages-EN%20%7C%20SI%20%7C%20TA-purple.svg)](#)

**Vadu Maduwa (වඩු මඩුව)** is a web-based Carpentry Workshop Management System developed to automate traditional woodworking shop operations, showcase luxury timber furniture products, handle trilingual customer inquiries, generate detailed material/labor quotations, and track digital bills and payment receipts.

---

## 🌟 Key Features

### 🛒 Customer Web Portal
- **Trilingual Support**: Switch seamlessly between **English (EN)**, **සිංහල (SI)**, and **தமிழ் (TA)**.
- **Furniture Catalog**: Filterable collections (Beds, Dining, Living Room, Wardrobes, Doors & Windows) with real-time search.
- **Carpentry Services**: Custom woodworking, modular kitchen fitting, timber polishing & repair showcases.
- **Project Gallery**: Portfolio showcase of completed custom client projects.
- **Online Quote Request**: Interactive modal inquiry system.

### 🛡️ Admin Management Dashboard
- **Executive Command Center**: Real-time KPI summary cards (Total Revenue, Pending Balance, New Inquiries, Catalog Count).
- **Product Catalog CRUD**: Manage ready-made timber furniture items, base prices, and stock status.
- **Inquiry Management Desk**: Filter customer requests and update status (`NEW` -> `CONTACTED` -> `COMPLETED`).
- **Automated Quotation Builder**: Itemized cost calculator for material, labor, and extra charges with instant PDF/Invoice conversion.
- **Billing & Payment Tracker**: Invoice ledger with payment receipt recording (Cash, Bank Transfer, Cheque, Card).

---

## 🏗️ Technology Stack

- **Frontend**: React.js (Vite), TailwindCSS, Lucide Icons, Axios.
- **Backend**: Java 17/21 Spring Boot REST API, Spring Security, Spring Data JPA, JWT Authentication.
- **Database**: MySQL 8.x.

---

## 🚀 Quick Start Guide

### 1. Frontend Development Setup
```bash
cd woodcraftpro-frontend
npm install
npm run dev
```
Open `http://localhost:5174` in your browser.

### 2. Backend Setup
1. Execute `database/schema.sql` and `database/data.sql` in MySQL Workbench.
2. Run Spring Boot application:
```bash
cd woodcraftpro-backend
mvnw spring-boot:run
```

---

## 👤 Author
Developed by **Dishmi Dahara**
