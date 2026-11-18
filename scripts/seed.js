const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sarthak3307_db_user:yCZ3vr7AM8VikLJZ@cluster0.jshikzj.mongodb.net/revenuedesk?retryWrites=true&w=majority';

// Define schemas inline to run directly with Node
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: ['Monthly', 'Yearly', 'One-time'], required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const subscriptionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    status: { type: String, enum: ['Active', 'Paused', 'Cancelled', 'Past Due'], default: 'Active' },
    startDate: { type: Date, required: true },
    nextBillingDate: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: ['Monthly', 'Yearly', 'One-time'], required: true },
  },
  { timestamps: true }
);

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    lineItems: { type: [lineItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Draft', 'Pending', 'Paid', 'Overdue'], default: 'Draft' },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const paymentSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Card (Simulated)'], required: true },
    status: { type: String, enum: ['Successful', 'Failed', 'Pending'], default: 'Pending' },
    reference: { type: String, default: '' },
    notes: { type: String, default: '' },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing collections
    console.log('Clearing existing records...');
    await Promise.all([
      Customer.deleteMany({}),
      Product.deleteMany({}),
      Subscription.deleteMany({}),
      Invoice.deleteMany({}),
      Payment.deleteMany({}),
    ]);

    // 1. Seed Products
    console.log('Seeding products...');
    const products = await Product.create([
      {
        name: 'Starter Plan',
        description: 'Perfect for small teams and early-stage startups needing core billing tools.',
        price: 29,
        billingCycle: 'Monthly',
        status: 'Active',
      },
      {
        name: 'Growth Pro Plan',
        description: 'Advanced subscription lifecycle management with multi-item invoicing and metrics.',
        price: 99,
        billingCycle: 'Monthly',
        status: 'Active',
      },
      {
        name: 'Enterprise Suite',
        description: 'Dedicated account manager, customized billing SLA, and unlimited customer records.',
        price: 999,
        billingCycle: 'Yearly',
        status: 'Active',
      },
      {
        name: 'Business Scale',
        description: 'Comprehensive subscription automation for scaling SaaS businesses.',
        price: 199,
        billingCycle: 'Monthly',
        status: 'Active',
      },
      {
        name: 'Custom White-Glove Onboarding',
        description: 'One-time assisted migration of legacy billing data and customer setup.',
        price: 499,
        billingCycle: 'One-time',
        status: 'Active',
      },
    ]);

    // 2. Seed Customers
    console.log('Seeding customers...');
    const customers = await Customer.create([
      {
        name: 'Acme Corporation',
        email: 'billing@acmecorp.com',
        phone: '+91 98765 43210',
        address: '402 Silicon Heights, MG Road, Bengaluru, KA 560001',
        status: 'Active',
      },
      {
        name: 'Apex Global Logistics',
        email: 'accounts@apexglobal.in',
        phone: '+91 98123 45678',
        address: '78 Connaught Place, New Delhi, DL 110001',
        status: 'Active',
      },
      {
        name: 'Starlight Digital Media',
        email: 'finance@starlightmedia.co',
        phone: '+91 97654 32109',
        address: '12 Nariman Point, Mumbai, MH 400021',
        status: 'Active',
      },
      {
        name: 'Nexus Health Systems',
        email: 'admin@nexushealth.org',
        phone: '+91 99554 11223',
        address: '23 Park Street, Kolkata, WB 700016',
        status: 'Active',
      },
      {
        name: 'Vanguard Analytics',
        email: 'invoicing@vanguard.ai',
        phone: '+91 94432 11998',
        address: '501 HITEC City, Hyderabad, TG 500081',
        status: 'Active',
      },
      {
        name: 'CloudPeak Solutions',
        email: 'contact@cloudpeak.io',
        phone: '+91 91234 56789',
        address: '15 Brigade Road, Bengaluru, KA 560025',
        status: 'Inactive',
      },
    ]);

    // Helper dates
    const now = new Date();
    const daysAgo = (d) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
    const daysAhead = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

    // 3. Seed Subscriptions
    console.log('Seeding subscriptions...');
    await Subscription.create([
      {
        customer: customers[0]._id, // Acme
        product: products[1]._id,  // Growth Pro ($99/mo)
        status: 'Active',
        startDate: daysAgo(60),
        nextBillingDate: daysAhead(12), // upcoming within 30 days
        price: products[1].price,
        billingCycle: products[1].billingCycle,
      },
      {
        customer: customers[1]._id, // Apex Global
        product: products[2]._id,  // Enterprise Suite ($999/yr)
        status: 'Active',
        startDate: daysAgo(120),
        nextBillingDate: daysAhead(245),
        price: products[2].price,
        billingCycle: products[2].billingCycle,
      },
      {
        customer: customers[2]._id, // Starlight Media
        product: products[0]._id,  // Starter Plan ($29/mo)
        status: 'Active',
        startDate: daysAgo(45),
        nextBillingDate: daysAhead(8), // upcoming within 30 days
        price: products[0].price,
        billingCycle: products[0].billingCycle,
      },
      {
        customer: customers[3]._id, // Nexus Health
        product: products[3]._id,  // Business Scale ($199/mo)
        status: 'Paused',
        startDate: daysAgo(90),
        nextBillingDate: daysAhead(20),
        price: products[3].price,
        billingCycle: products[3].billingCycle,
      },
      {
        customer: customers[4]._id, // Vanguard Analytics
        product: products[1]._id,  // Growth Pro ($99/mo)
        status: 'Active',
        startDate: daysAgo(30),
        nextBillingDate: daysAhead(5), // upcoming within 30 days
        price: products[1].price,
        billingCycle: products[1].billingCycle,
      },
    ]);

    // 4. Seed Invoices & Payments across multiple months for chart trends
    console.log('Seeding invoices & payments...');

    const invoiceConfigs = [
      {
        num: 'INV-0001',
        customer: customers[0],
        item: 'Growth Pro Plan - Monthly Subscription',
        qty: 1,
        price: 99,
        discount: 0,
        tax: 18,
        status: 'Paid',
        invDate: daysAgo(150),
        dueDate: daysAgo(135),
        method: 'Bank Transfer',
        ref: 'TXN-902143',
        paidAt: daysAgo(136),
      },
      {
        num: 'INV-0002',
        customer: customers[1],
        item: 'Enterprise Suite - Annual Subscription',
        qty: 1,
        price: 999,
        discount: 10,
        tax: 18,
        status: 'Paid',
        invDate: daysAgo(120),
        dueDate: daysAgo(105),
        method: 'Bank Transfer',
        ref: 'NEFT-883011',
        paidAt: daysAgo(108),
      },
      {
        num: 'INV-0003',
        customer: customers[2],
        item: 'Starter Plan - Monthly Subscription',
        qty: 1,
        price: 29,
        discount: 0,
        tax: 0,
        status: 'Paid',
        invDate: daysAgo(90),
        dueDate: daysAgo(75),
        method: 'UPI',
        ref: 'UPI-771203@okaxis',
        paidAt: daysAgo(76),
      },
      {
        num: 'INV-0004',
        customer: customers[0],
        item: 'Growth Pro Plan - Monthly Subscription',
        qty: 1,
        price: 99,
        discount: 0,
        tax: 18,
        status: 'Paid',
        invDate: daysAgo(60),
        dueDate: daysAgo(45),
        method: 'Card (Simulated)',
        ref: 'CARD-SIM-4421',
        paidAt: daysAgo(46),
      },
      {
        num: 'INV-0005',
        customer: customers[4],
        item: 'Growth Pro Plan - Monthly Subscription',
        qty: 1,
        price: 99,
        discount: 0,
        tax: 18,
        status: 'Paid',
        invDate: daysAgo(30),
        dueDate: daysAgo(15),
        method: 'UPI',
        ref: 'UPI-994321@icici',
        paidAt: daysAgo(16),
      },
      {
        num: 'INV-0006',
        customer: customers[2],
        item: 'Starter Plan - Monthly Subscription',
        qty: 1,
        price: 29,
        discount: 0,
        tax: 0,
        status: 'Paid',
        invDate: daysAgo(14),
        dueDate: daysAgo(1),
        method: 'Bank Transfer',
        ref: 'IMPS-220091',
        paidAt: daysAgo(2),
      },
      {
        num: 'INV-0007',
        customer: customers[3],
        item: 'Business Scale - Monthly Subscription',
        qty: 1,
        price: 199,
        discount: 5,
        tax: 18,
        status: 'Overdue',
        invDate: daysAgo(25),
        dueDate: daysAgo(5),
      },
      {
        num: 'INV-0008',
        customer: customers[0],
        item: 'Growth Pro Plan - Upcoming Renewal',
        qty: 1,
        price: 99,
        discount: 0,
        tax: 18,
        status: 'Pending',
        invDate: daysAgo(2),
        dueDate: daysAhead(12),
      },
      {
        num: 'INV-0009',
        customer: customers[1],
        item: 'Custom White-Glove Onboarding Assistance',
        qty: 1,
        price: 499,
        discount: 0,
        tax: 18,
        status: 'Pending',
        invDate: daysAgo(1),
        dueDate: daysAhead(14),
      },
    ];

    for (const c of invoiceConfigs) {
      const subtotal = c.qty * c.price;
      const discountAmount = (subtotal * c.discount) / 100;
      const taxable = subtotal - discountAmount;
      const taxAmount = (taxable * c.tax) / 100;
      const total = taxable + taxAmount;

      const invoice = await Invoice.create({
        invoiceNumber: c.num,
        customer: c.customer._id,
        lineItems: [
          {
            description: c.item,
            quantity: c.qty,
            unitPrice: c.price,
            total: subtotal,
          },
        ],
        subtotal,
        discountPercent: c.discount,
        discountAmount,
        taxPercent: c.tax,
        taxAmount,
        total: Math.round(total * 100) / 100,
        status: c.status,
        invoiceDate: c.invDate,
        dueDate: c.dueDate,
        notes: `Generated by RevenueDesk billing engine for ${c.customer.name}`,
        createdAt: c.invDate,
      });

      if (c.status === 'Paid') {
        await Payment.create({
          customer: c.customer._id,
          invoice: invoice._id,
          amount: Math.round(total * 100) / 100,
          paymentMethod: c.method,
          status: 'Successful',
          reference: c.ref,
          notes: `Payment verified for invoice ${c.num}`,
          paidAt: c.paidAt,
          createdAt: c.paidAt,
        });
      }
    }

    console.log('SUCCESS! Mock data seeded successfully into RevenueDesk database.');
    console.log(`- ${customers.length} Customers`);
    console.log(`- ${products.length} Products`);
    console.log(`- 5 Subscriptions`);
    console.log(`- ${invoiceConfigs.length} Invoices`);
    console.log(`- 6 Payments`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

