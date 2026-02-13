import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Contacts from './pages/Contacts';
import Products from './pages/Products';
import Quotes from './pages/Quotes';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Cases from './pages/Cases';
import KnowledgeBase from './pages/KnowledgeBase';
import Profile from './pages/Profile';
import AuditLogs from './pages/AuditLogs';
import OrgChart from './pages/OrgChart';
import RecycleBin from './pages/RecycleBin';
import WebToLead from './pages/WebToLead';
import WebToLeadSettings from './pages/WebToLeadSettings';
import EmailTemplates from './pages/EmailTemplates';
import Workflows from './pages/Workflows';
import DuplicateDetection from './pages/DuplicateDetection';
import AssignmentRules from './pages/AssignmentRules';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/web-to-lead" element={<WebToLead />} />
          <Route path="/" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                  <Navbar />
                  <div className="flex-1 overflow-auto">
                    <div className="p-8 page-transition">
                      <Outlet />
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="leads/:id" element={<LeadDetail />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetail />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/:id" element={<AccountDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="reports" element={<Reports />} />
            <Route path="cases" element={<Cases />} />
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="profile" element={<Profile />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="org-chart" element={<OrgChart />} />
            <Route path="recycle-bin" element={<RecycleBin />} />
            <Route path="web-to-lead-settings" element={<WebToLeadSettings />} />
            <Route path="email-templates" element={<EmailTemplates />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="duplicates" element={<DuplicateDetection />} />
            <Route path="assignment-rules" element={<AssignmentRules />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
