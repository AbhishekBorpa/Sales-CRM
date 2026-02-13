# Sal - Sales CRM

A comprehensive Customer Relationship Management (CRM) system for managing sales pipelines, customer support, and business operations.

## Features

- **Sales Pipeline:** Manage Leads, Opportunities, Accounts, and Contacts.
- **Support:** Track and resolve Cases (tickets) with priority levels.
- **Knowledge Base:** Internal articles for documentation and support.
- **Product Catalog:** Manage Products and Quotes.
- **Dashboard:** Visual analytics for sales performance and activity tracking.
- **Automation:** Workflows, Assignment Rules, and Duplicate Detection.
- **Admin Tools:** User management, Audit Logs, and Recycle Bin.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose)

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (running locally or a cloud instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sal
    ```

2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    # Create a .env file (optional, defaults provided):
    # PORT=5001
    # MONGO_URI=mongodb://localhost:27017/sales-cloud
    npm run seed
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    - The application will be available at `http://localhost:5173`.

## API Configuration

The frontend interacts with the backend at `http://localhost:5001/api`.
If you change the backend port, ensure you update `client/src/services/api.js`.

## License

ISC
