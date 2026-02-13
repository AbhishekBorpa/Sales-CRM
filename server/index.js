require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all for dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/leads', require('./src/routes/leads'));
app.use('/api/accounts', require('./src/routes/accounts'));
app.use('/api/opportunities', require('./src/routes/opportunities'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/notes', require('./src/routes/notes'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/quotes', require('./src/routes/quotes'));
app.use('/api/stats', require('./src/routes/stats'));
app.use('/api/activities', require('./src/routes/activities'));
app.use('/api/reports', require('./src/routes/reports'));
app.use('/api/cases', require('./src/routes/cases'));
app.use('/api/feed', require('./src/routes/feed'));
app.use('/api/articles', require('./src/routes/articles'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/audit', require('./src/routes/audit'));
app.use('/api/recycle-bin', require('./src/routes/recycleBin'));
app.use('/api/email-templates', require('./src/routes/emailTemplates'));
app.use('/api/workflows', require('./src/routes/workflows'));
app.use('/api/duplicates', require('./src/routes/duplicates'));
app.use('/api/assignment-rules', require('./src/routes/assignmentRules'));

// Map legacy/flat routes to specific controller methods to maintain frontend compatibility
const { getContactRoles, addContactRole, getLineItems, addLineItem } = require('./src/controllers/opportunityController');

const contactRoleRouter = express.Router();
contactRoleRouter.get('/', getContactRoles);
contactRoleRouter.post('/', addContactRole);
app.use('/api/contact-roles', contactRoleRouter);

const oppProductRouter = express.Router();
oppProductRouter.get('/', getLineItems);
oppProductRouter.post('/', addLineItem);
app.use('/api/opportunity-products', oppProductRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
