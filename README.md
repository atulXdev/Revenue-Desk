# RevenueDesk – Billing & Subscription Management SaaS

**Author:** Atul Singh  
**Application:** RevenueDesk

RevenueDesk is a full-stack Billing and Subscription Management SaaS application built for businesses to manage customers, product catalogs, recurring subscriptions, invoices with PDF generation, and payment tracking with real-time financial metrics from a centralized dashboard.

---

## 🚀 Key Features

### 1. Centralized Executive Dashboard
- **Real-Time Financial Metrics**: Total Revenue, Monthly Recurring Revenue (MRR), Active Subscriptions, Total Customers, Pending Invoices, and Upcoming Renewals within 30 days.
- **MRR Calculation Logic**: Monthly subscriptions contribute their full amount; yearly subscriptions contribute amount / 12; paused/cancelled subscriptions are excluded.
- **Interactive Revenue Chart**: Monthly revenue trends visualized using Recharts Area Charts.
- **Recent Activity Streams**: Live tables showing the latest invoices and recorded payments.

### 2. Customer Management
- Complete CRUD operations (Create, Read, Update, Delete) with MongoDB persistence.
- Live client-side search by name, email, or phone number.
- Zod schema validation for names, valid emails, phone numbers, and addresses.
- Prevention of duplicate email registrations.
- Modal dialogs for adding and editing customers, with AlertDialog confirmations for deletion.

### 3. Product Catalog
- Manage products and services across **Monthly**, **Yearly**, and **One-time** billing cycles.
- Dynamic pricing, product status toggling (Active / Inactive), and description management.
- Live search by product name and description.

### 4. Subscription Management
- Create customer subscriptions linked to active products.
- Automated price lookup and next billing date computation (1 month for Monthly, 1 year for Yearly).
- Subscription status lifecycle: **Active**, **Paused**, **Cancelled**, **Past Due**.
- State transitions: Pause, Resume, and Cancel with business rule protections (cancelled subscriptions cannot be resumed).

### 5. Invoice Management & PDF Generation
- Dynamic multi-item invoice creation with description, quantity, and unit price.
- **Backend-calculated financial integrity**: Subtotal, percentage discounts, percentage tax, and final total calculated server-side.
- Sequential unique invoice numbering (`INV-0001`, `INV-0002`, ...).
- Status tracking: **Draft**, **Pending**, **Paid**, **Overdue**.
- Strict modification rules: Only **Draft** invoices can be edited or deleted.
- **PDF Generation**: Download branded, formatted PDF invoices generated on-the-fly via `pdf-lib`.

### 6. Payment Processing (Simulated)
- Record payments with invoice and customer association.
- Automatic population of due invoice balances.
- Supports payment methods: Bank Transfer, UPI, Cash, Cheque, and Card (Simulated).
- Automated invoice lifecycle: Recording a successful payment automatically updates the associated invoice to **Paid**.
- Duplicate payment protection preventing multiple successful payments for the same invoice.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Shadcn UI (Vega theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms & Validation**: React Hook Form & Zod
- **Database & ODM**: MongoDB & Mongoose
- **PDF Generation**: pdf-lib
- **Notifications**: Sonner

---

## 📁 Folder Structure

```
billing-saas/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Pages & API routes)
│   │   ├── api/
│   │   │   ├── customers/  # Customer GET, POST, PUT, DELETE
│   │   │   ├── dashboard/  # Dashboard aggregates & MRR calculations
│   │   │   ├── invoices/   # Invoice CRUD & /pdf download endpoint
│   │   │   ├── payments/   # Payment recording & listing
│   │   │   ├── products/   # Product CRUD
│   │   │   └── subscriptions/# Subscription creation & status transitions
│   │   ├── customers/      # Customer management page
│   │   ├── dashboard/      # Executive metrics & charts page
│   │   ├── invoices/       # Invoice management page
│   │   ├── payments/       # Payment records page
│   │   ├── products/       # Products catalog page
│   │   ├── subscriptions/  # Subscriptions page
│   │   ├── globals.css     # Global styles & Tailwind theme
│   │   ├── layout.tsx      # Root layout with font optimization & Toaster
│   │   └── page.tsx        # Root entry redirecting to /dashboard
│   ├── components/         # Reusable UI & module components
│   │   ├── customers/      # Customer forms, table, edit dialog, search
│   │   ├── dashboard/      # Stat cards, revenue chart, recent tables
│   │   ├── invoice/        # Invoice creator with line items & table
│   │   ├── layout/         # Header, sidebar with active link detection
│   │   ├── payments/       # Payment recorder modal & payments table
│   │   ├── products/       # Product form, table, edit modal
│   │   ├── subscriptions/  # Subscription form with price preview & table
│   │   └── ui/             # Shadcn Vega UI primitives
│   ├── lib/
│   │   ├── mongodb.ts      # Cached Mongoose database connection
│   │   └── utils.ts        # Styling and class name utilities
│   └── models/             # Mongoose Schemas & Models
│       ├── Customer.ts
│       ├── Invoice.ts
│       ├── Payment.ts
│       ├── Product.ts
│       └── Subscription.ts
├── .env.local              # Local environment variables
├── components.json         # Shadcn configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.jshikzj.mongodb.net/revenuedesk?retryWrites=true&w=majority
```

> **Note**: Do not commit `.env.local` to version control. The MongoDB connection string must be configured as an environment variable in your deployment platform (e.g. Vercel).

---

## 💻 Running Locally

### 1. Clone the repository and navigate to the project:
```bash
cd billing-saas
```

### 2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

### 3. Configure environment:
Ensure `.env.local` has your valid `MONGODB_URI`.

### 4. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically direct you to `/dashboard`.

---

## 🧪 Testing & Validation

Run the TypeScript type checker:
```bash
npx tsc --noEmit
```

Run ESLint:
```bash
npm run lint
```

Build the production application:
```bash
npm run build
```

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your RevenueDesk repository.
4. In the **Environment Variables** section, add:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string (e.g., from MongoDB Atlas)
5. Ensure your MongoDB Atlas Network Access allows connections from anywhere (`0.0.0.0/0`) or Vercel's IP ranges.
6. Click **Deploy**. Vercel will build the application using `npm run build` and provision serverless route handlers for the API.
