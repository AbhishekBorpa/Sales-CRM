# Sal - Advanced Sales CRM

Sal is a high-performance, full-stack Customer Relationship Management (CRM) system designed for streamlined sales operations, customer relationship management, and data-driven decision making.

![Dashboard Preview](https://img.shields.io/badge/Status-Complete-green)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)

## 🚀 Key Features

### 🔐 Secure Authentication
- **JWT Implementation:** Full JSON Web Token based authentication flow.
- **Secure Registration & Login:** Password hashing with `bcryptjs`.
- **Protected Routes:** Frontend route guards using `AuthContext` to ensure data security.

### 📊 Real-time Dashboard & Analytics
- **Dynamic Charts:** Visual representation of Sales Pipeline and Lead Sources using `Recharts`.
- **KPI Tracking:** Real-time metrics for Total Leads, Opportunity Value, and Active Deals.
- **Recent Activity:** Automated tracking of latest record updates across the CRM.

### 💼 Comprehensive CRM Modules (Full CRUD)
Sal provides a consistent and powerful interface for all core business entities:
- **Leads & Accounts:** Track potential customers and business organizations.
- **Contacts (New):** Manage individual relationships and link them to accounts.
- **Opportunities:** Kanban board and list views to manage the sales funnel.
- **Tasks:** Stay organized with task assignment and status tracking.
- **Product Catalog:** Manage inventory and generate **Quotes** (PDF view support).
- **Service Management:** Track customer **Cases** and internal **Knowledge Base** articles.

### ⚙️ advanced Data Handling
- **Server-side Pagination:** Efficient handling of large datasets in Leads and Opportunities.
- **Global Search:** Search across multiple fields with debounced input for performance.
- **Data Validation:** Backend request validation using **Joi** to ensure data integrity.
- **Recycle Bin:** Safeguard data with soft-delete and restore capabilities.

## 🛠 Tech Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, Recharts, Lucide Icons, Sonner (Toasts)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Security:** JWT, BcryptJS

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running instance)

### Local Development Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/AbhishekBorpa/Sales-CRM.git
    cd Sales-CRM
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Set your JWT_SECRET in .env
    npm run seed # Optional: Seed initial data
    npm run dev
    ```

3.  **Client Setup**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    - Access the app at `http://localhost:5173`

## 📡 API Layer

Sal uses a centralized API service located at `client/src/services/api.js`. This service handles:
- Consistent error handling using `sonner` toasts.
- Automatic injection of Authorization headers.
- RESTful interactions with all backend endpoints.

## 📄 License

This project is licensed under the ISC License.
