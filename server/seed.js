const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./src/models/Lead');
const Opportunity = require('./src/models/Opportunity');
const Product = require('./src/models/Product');
const Case = require('./src/models/Case');
const Article = require('./src/models/Article');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

dotenv.config();

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await Lead.deleteMany({});
    await Opportunity.deleteMany({});
    await Product.deleteMany({});
    await Case.deleteMany({});
    await Article.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding Leads...');
    // Sample Leads
    const leads = await Lead.create([
        { name: 'John Doe', company: 'Acme Corp', email: 'john@acme.com', phone: '555-1234', status: 'New', value: 15000, source: 'Website' },
        { name: 'Jane Smith', company: 'TechStart Inc', email: 'jane@techstart.com', phone: '555-5678', status: 'Qualified', value: 25000, source: 'Referral' },
        { name: 'Robert Johnson', company: 'Global Systems', email: 'robert@globalsys.com', phone: '555-9012', status: 'Contacted', value: 8000, source: 'Cold Call' },
        { name: 'Emily Davis', company: 'InnovateTech', email: 'emily@innovate.com', phone: '555-3456', status: 'Qualified', value: 35000, source: 'Website' },
        { name: 'Michael Wilson', company: 'StartupHub', email: 'michael@startuphub.com', phone: '555-7890', status: 'New', value: 12000, source: 'Other' },
        { name: 'Sarah Thompson', company: 'Enterprise Solutions', email: 'sarah@enterprise.com', phone: '555-2468', status: 'Qualified', value: 50000, source: 'Event' },
        { name: 'David Martinez', company: 'CloudFirst Inc', email: 'david@cloudfirst.com', phone: '555-1357', status: 'Contacted', value: 18000, source: 'Other' },
        { name: 'Lisa Anderson', company: 'DataDrive Corp', email: 'lisa@datadrive.com', phone: '555-8642', status: 'New', value: 22000, source: 'Website' },
        { name: 'James Taylor', company: 'AI Innovators', email: 'james@aiinnovators.com', phone: '555-9753', status: 'Qualified', value: 45000, source: 'Referral' },
        { name: 'Jennifer Brown', company: 'FinTech Solutions', email: 'jennifer@fintech.com', phone: '555-1593', status: 'Contacted', value: 30000, source: 'Event' },
        { name: 'Christopher Lee', company: 'SaaS Ventures', email: 'chris@saasventures.com', phone: '555-7531', status: 'New', value: 16000, source: 'Other' },
        { name: 'Amanda White', company: 'Marketing Pro', email: 'amanda@marketingpro.com', phone: '555-9514', status: 'Qualified', value: 28000, source: 'Referral' },
        { name: 'Daniel Harris', company: 'Tech Consulting', email: 'daniel@techconsult.com', phone: '555-7532', status: 'Contacted', value: 20000, source: 'Cold Call' },
        { name: 'Michelle Garcia', company: 'Digital First', email: 'michelle@digitalfirst.com', phone: '555-1598', status: 'New', value: 14000, source: 'Other' },
        { name: 'Kevin Rodriguez', company: 'Growth Partners', email: 'kevin@growthpartners.com', phone: '555-3579', status: 'Qualified', value: 38000, source: 'Event' },
    ]);

    console.log('Seeding Opportunities...');
    await Opportunity.create([
        { title: 'Acme Corp Deal', stage: 'Prospecting', value: 15000, closeDate: '2023-12-01', probability: 10 },
        { title: 'Globex Renewal', stage: 'Negotiation', value: 25000, closeDate: '2023-11-15', probability: 80 },
        { title: 'Soylent Upgrade', stage: 'Closed Won', value: 8000, closeDate: '2023-10-30', probability: 100 }
    ]);

    console.log('Seeding Products...');
    await Product.create([
        { name: 'Standard License', code: 'SL-001', price: 1000 },
        { name: 'Enterprise License', code: 'EL-001', price: 5000 },
        { name: 'Support Package', code: 'SP-001', price: 500 }
    ]);


    console.log('Seeding Cases...');
    await Case.create([
        { subject: 'Login Trouble', description: 'User cannot access account', status: 'New', priority: 'High' },
        { subject: 'Billing Question', description: 'Invoice discrepancy', status: 'Working', priority: 'Medium' }
    ]);

    console.log('Seeding Articles...');
    await Article.create([
        { title: 'How to Reset Password', content: 'Go to settings and click reset.', category: 'General' },
        { title: 'API Documentation', content: 'Full reference for our REST API endpoints.', category: 'Technical' },
        { title: 'Billing Cycles', content: 'We bill on the 1st of every month.', category: 'Billing' },
        { title: 'Product Setup Guide', content: 'Step by step guide to install the software.', category: 'Product' }
    ]);


    console.log('Seeding Articles...');
    await Article.create([
        { title: 'How to Reset Password', content: 'Go to settings and click reset.', category: 'General' },
        { title: 'API Documentation', content: 'Full reference for our REST API endpoints.', category: 'Technical' },
        { title: 'Billing Cycles', content: 'We bill on the 1st of every month.', category: 'Billing' },
        { title: 'Product Setup Guide', content: 'Step by step guide to install the software.', category: 'Product' }
    ]);

    console.log('Seeding Users...');
    await User.create({
        name: 'Demo Admin',
        email: 'admin@salescloud.com',
        role: 'Admin',
        title: 'System Administrator',
        phone: '555-0123'
    });

    await User.create({
        name: 'Sarah Manager',
        email: 'sarah@salescloud.com',
        role: 'Manager',
        title: 'Sales Director',
        phone: '555-0124'
    });

    await User.create([
        { name: 'Mike Sales', email: 'mike@salescloud.com', role: 'User', title: 'Account Executive', phone: '555-0125' },
        { name: 'Jessica Rep', email: 'jessica@salescloud.com', role: 'User', title: 'SDR', phone: '555-0126' },
        { name: 'Tom Agent', email: 'tom@salescloud.com', role: 'User', title: 'Support Agent', phone: '555-0127' }
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
};

seedData();
